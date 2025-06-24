# DoBie 30-dagen Trial Implementation Plan

## 🎯 MVP Scope & Aanleiding

**Aanleiding:** Talar wil 30 dagen trial i.p.v. 7 dagen + automatische verlenging voor betere conversie.

**Doel:** Seamless trial-to-paid transition met Nederlandse compliance en minimale user friction.

**MVP Focus:** Core functionaliteit voor 30-dagen trial met auto-renewal. Geavanceerde features komen later.

**Bestaande Tech Stack:**
- ✅ **Supabase**: Database + Auth (EU region)
- ✅ **Vertex AI**: Chat functionality
- ✅ **Vercel**: Hosting
- ⚠️ **Mollie**: Nog niet geïntegreerd
- ⚠️ **Email**: Nog geen provider

---

## 📊 Implementation Status & Prioritering

| Fase | Component | Status | MVP | Tijd | Kritiek Pad |
|------|-----------|---------|-----|------|-------------|
| **FASE 1** | **Database Schema Updates** | ⚪ | ✅ | 2h | Ja - Fundament |
| 1.1 | Trial period 7→30 dagen | ⚪ | ✅ | 15m | Ja |
| 1.2 | Subscription tracking velden | ⚪ | ✅ | 45m | Ja |
| 1.3 | Payment method storage | ⚪ | ✅ | 1h | Ja |
| **FASE 2** | **Mollie Integration** | ⚪ | ✅ | 4h | Ja - Core feature |
| 2.1 | Mollie client setup | ⚪ | ✅ | 1h | Ja |
| 2.2 | Subscription API integration | ⚪ | ✅ | 2h | Ja |
| 2.3 | Webhook endpoints | ⚪ | ✅ | 1h | Ja |
| **FASE 3** | **Business Logic** | ⚪ | ✅ | 3h | Ja - Auto-renewal |
| 3.1 | Trial→Billing transition | ⚪ | ✅ | 1.5h | Ja |
| 3.2 | Auto-renewal cron job | ⚪ | ✅ | 1h | Ja |
| 3.3 | Failed payment handling | ⚪ | ✅ | 30m | Ja |
| **FASE 4** | **Frontend Updates** | ⚪ | ✅ | 3h | Ja - UX |
| 4.1 | Payment method collection | ⚪ | ✅ | 2h | Ja |
| 4.2 | Trial status UI | ⚪ | ✅ | 1h | Ja |
| **FASE 5** | **Basic Email** | ⚪ | ❌ | 2h | Nee - Later |
| 5.1 | Payment failure notifications | ⚪ | ❌ | 1h | Nee |
| 5.2 | Trial reminder emails | ⚪ | ❌ | 1h | Nee |

**MVP TOTAAL: 12 uur**  
**Post-MVP: 2+ uur**

---

## 🗄️ FASE 1: Database Schema Updates

### **1.1 Trial Period Extension (7→30 dagen)**

**Huidige situatie in Supabase:**
```sql
trial_end_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
```

**MVP Update:**
```sql
-- Update default voor nieuwe users
ALTER TABLE profiles ALTER COLUMN trial_end_date 
SET DEFAULT (NOW() + INTERVAL '30 days');

-- Existing trial users houden huidige datum
-- Nieuwe registraties krijgen automatisch 30 dagen
```

### **1.2 Subscription Tracking Velden**

**Toevoegen aan bestaande `profiles` table:**

```sql
-- Core subscription fields
ALTER TABLE profiles ADD COLUMN subscription_id TEXT; -- Mollie subscription ID
ALTER TABLE profiles ADD COLUMN auto_renewal_enabled BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN next_billing_date TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN grace_period_start TIMESTAMPTZ;

-- Update subscription_status enum
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_subscription_status_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_status_check 
CHECK (subscription_status IN (
  'trial',           -- 0-30 dagen gratis
  'payment_required', -- Dag 25-30, payment method popup
  'active',          -- Actieve betaling + auto-renewal
  'past_due',        -- Payment gefaald, grace period actief
  'suspended',       -- Grace period verlopen, geen toegang
  'cancelled',       -- User cancelled, toegang tot einde periode
  'blocked'          -- Admin blocked
));
```

**Business Logic per Status:**
- `trial`: Volledige toegang, geen betaling vereist
- `payment_required`: Volledige toegang + payment method popup
- `active`: Volledige toegang, auto-renewal actief
- `past_due`: Beperkte toegang + urgent payment prompts
- `suspended`: Geen chatbot toegang, alleen billing management
- `cancelled`: Toegang tot `next_billing_date`, daarna `suspended`

### **1.3 Payment Method Storage**

**Nieuwe table voor PCI-compliant payment method metadata:**

```sql
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mollie_customer_id TEXT NOT NULL, -- Mollie customer reference
  mollie_mandate_id TEXT, -- Voor SEPA mandaten
  method_type TEXT NOT NULL, -- 'ideal', 'bancontact', 'creditcard'
  method_details JSONB, -- {last_four: "1234", bank: "ING"} voor UI
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index voor snelle lookups
CREATE INDEX idx_payment_methods_profile_id ON payment_methods(profile_id);
CREATE INDEX idx_payment_methods_mollie_customer ON payment_methods(mollie_customer_id);
```

**Waarom deze opzet:**
- Geen gevoelige payment data in eigen database
- Mollie handles PCI compliance
- Voldoende metadata voor UI/UX
- Schaalbaar voor meerdere payment methods per user

---

## 💳 FASE 2: Mollie Integration

### **2.1 Mollie Client Setup**

**Environment Variables toevoegen:**
```env
# Add to .env
MOLLIE_API_KEY=test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM # Test key voor development
MOLLIE_WEBHOOK_SECRET=your_webhook_secret_here
```

**Mollie client instantiation:**
```typescript
// lib/mollie/client.ts
import { createMollieClient } from '@mollie/api-client';

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY!,
});

export { mollieClient };
```

**Waarom Mollie voor DoBie:**
- Nederlandse bank compliance out-of-the-box
- iDEAL ondersteuning (primaire betaalmethode NL)
- SEPA incasso voor auto-renewal
- Goede webhooks voor subscription management

### **2.2 Subscription API Integration**

**Core Mollie operations voor DoBie:**

```typescript
// lib/mollie/subscriptions.ts
interface CreateSubscriptionParams {
  customerId: string;
  amount: string; // "11.00"
  interval: string; // "1 month"
  description: string; // "DoBie Pro Subscription"
}

export async function createMollieSubscription(params: CreateSubscriptionParams) {
  const subscription = await mollieClient.customerSubscriptions.create({
    customerId: params.customerId,
    amount: { currency: 'EUR', value: params.amount },
    interval: params.interval,
    description: params.description,
    webhookUrl: `${process.env.APP_URL}/api/webhooks/mollie`,
  });
  
  return subscription;
}

export async function cancelMollieSubscription(customerId: string, subscriptionId: string) {
  return await mollieClient.customerSubscriptions.cancel(subscriptionId, {
    customerId
  });
}
```

**Customer Creation bij Trial Start:**
```typescript
// Tijdens registratie of eerste payment method setup
export async function createMollieCustomer(email: string, name: string) {
  const customer = await mollieClient.customers.create({
    email,
    name,
    metadata: {
      dobie_profile_id: profileId // Link naar Supabase profile
    }
  });
  
  return customer;
}
```

### **2.3 Webhook Endpoints**

**Webhook endpoint voor payment events:**

```typescript
// pages/api/webhooks/mollie.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const payment = await mollieClient.payments.get(req.body.id);
  
  switch (payment.status) {
    case 'paid':
      await handleSuccessfulPayment(payment);
      break;
    case 'failed':
      await handleFailedPayment(payment);
      break;
    case 'canceled':
      await handleCancelledPayment(payment);
      break;
  }
  
  res.status(200).json({ received: true });
}
```

**Critical webhook events voor auto-renewal:**
- `payment.paid` → Extend subscription, activate account
- `payment.failed` → Start grace period countdown
- `subscription.cancelled` → Update auto_renewal_enabled = false

---

## ⚙️ FASE 3: Business Logic Implementation

### **3.1 Trial→Billing Transition Logic**

**Day 25 Trigger (Payment Method Collection):**

```sql
-- Cron query voor dag 25 users
UPDATE profiles 
SET subscription_status = 'payment_required'
WHERE subscription_status = 'trial' 
  AND trial_end_date <= NOW() + INTERVAL '5 days'
  AND trial_end_date > NOW() + INTERVAL '4 days';
```

**Day 30 Transition (Auto-charge):**

```typescript
// business-logic/trial-transitions.ts
export async function processTrialExpiry(profileId: string) {
  const profile = await getProfile(profileId);
  const paymentMethod = await getActivePaymentMethod(profileId);
  
  if (!paymentMethod) {
    // No payment method → suspend account
    await updateProfile(profileId, { 
      subscription_status: 'suspended' 
    });
    return;
  }
  
  try {
    // Create first paid subscription
    const subscription = await createMollieSubscription({
      customerId: paymentMethod.mollie_customer_id,
      amount: "11.00",
      interval: "1 month",
      description: "DoBie Pro - Monthly"
    });
    
    await updateProfile(profileId, {
      subscription_status: 'active',
      subscription_id: subscription.id,
      next_billing_date: addMonths(new Date(), 1)
    });
    
  } catch (error) {
    // Payment failed → grace period
    await updateProfile(profileId, {
      subscription_status: 'past_due',
      grace_period_start: new Date()
    });
  }
}
```

### **3.2 Auto-Renewal Cron Job**

**Daily cron job voor subscription management:**

```typescript
// api/cron/subscription-management.ts (Vercel Cron Function)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Process different subscription states
  await processTrialExpirations();
  await processPaymentRequiredAccounts(); 
  await processGracePeriodExpiry();
  
  res.status(200).json({ success: true });
}

async function processTrialExpirations() {
  const expiringTrials = await supabase
    .from('profiles')
    .select('*')
    .eq('subscription_status', 'trial')
    .lte('trial_end_date', new Date().toISOString());
    
  for (const profile of expiringTrials.data || []) {
    await processTrialExpiry(profile.id);
  }
}
```

**Vercel cron configuration:**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/subscription-management",
    "schedule": "0 9 * * *"
  }]
}
```

### **3.3 Failed Payment Handling**

**Grace period logic met degraded access:**

```typescript
export async function handleFailedPayment(molliePayment: any) {
  const profileId = await getProfileIdFromMollieCustomer(molliePayment.customerId);
  
  await updateProfile(profileId, {
    subscription_status: 'past_due',
    grace_period_start: new Date()
  });
  
  // Schedule retry in 1 day (via webhook)
  // Send email notification (later fase)
}

export async function checkGracePeriodExpiry() {
  const expiredGraceUsers = await supabase
    .from('profiles')
    .select('*')
    .eq('subscription_status', 'past_due')
    .lte('grace_period_start', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString());
    
  for (const profile of expiredGraceUsers.data || []) {
    await updateProfile(profile.id, {
      subscription_status: 'suspended'
    });
  }
}
```

---

## 🎨 FASE 4: Frontend Updates

### **4.1 Payment Method Collection UI**

**Modal Component voor payment method setup:**

```typescript
// components/PaymentMethodModal.svelte
<script>
  import { mollieClient } from '$lib/mollie/client';
  
  export let showModal = false;
  export let profileId: string;
  
  async function setupPaymentMethod() {
    // Create Mollie customer if not exists
    const customer = await createMollieCustomer(user.email, user.full_name);
    
    // Redirect to Mollie payment method setup
    window.location.href = `https://www.mollie.com/checkout/select-method/${customer.id}`;
  }
</script>

{#if showModal}
  <div class="modal-overlay">
    <div class="modal-content">
      <h2>Continue Your DoBie Experience</h2>
      <p>Your 30-day trial ends in {daysRemaining} days.</p>
      <p>Add a payment method to continue seamlessly.</p>
      
      <button on:click={setupPaymentMethod} class="btn-primary">
        Add Payment Method
      </button>
      
      <p class="small-text">€11/month • Cancel anytime • No hidden fees</p>
    </div>
  </div>
{/if}
```

**Trigger Logic in Main App:**

```typescript
// In main chat interface, check subscription status
if (user.subscription_status === 'payment_required') {
  showPaymentMethodModal = true;
}
```

### **4.2 Trial Status UI Components**

**Header Progress Bar voor trial users:**

```svelte
<!-- components/TrialProgress.svelte -->
<script>
  $: daysRemaining = Math.ceil((new Date(user.trial_end_date) - new Date()) / (1000 * 60 * 60 * 24));
  $: progressPercent = Math.max(0, ((30 - daysRemaining) / 30) * 100);
</script>

{#if user.subscription_status === 'trial'}
  <div class="trial-progress">
    <div class="progress-bar">
      <div class="progress-fill" style="width: {progressPercent}%"></div>
    </div>
    <span class="trial-text">
      {daysRemaining} days remaining in your free trial
    </span>
  </div>
{/if}
```

**Subscription Status Dashboard Component:**

```svelte
<!-- components/BillingDashboard.svelte -->
<script>
  export let user;
  export let paymentMethods;
  
  function getStatusMessage(status) {
    switch(status) {
      case 'trial': return `${daysRemaining} days left in trial`;
      case 'active': return `Next billing: ${formatDate(user.next_billing_date)}`;
      case 'past_due': return 'Payment failed - Update payment method';
      case 'suspended': return 'Account suspended - Add payment method to reactivate';
      default: return 'Unknown status';
    }
  }
</script>

<div class="billing-dashboard">
  <h3>Subscription Status</h3>
  <div class="status-card status-{user.subscription_status}">
    <p>{getStatusMessage(user.subscription_status)}</p>
  </div>
  
  {#if paymentMethods.length > 0}
    <h4>Payment Methods</h4>
    {#each paymentMethods as method}
      <div class="payment-method-card">
        {method.method_type} •••• {method.method_details.last_four}
      </div>
    {/each}
  {/if}
</div>
```

---

## 🔧 Technical Implementation Details

### **Database Functions voor Business Logic**

```sql
-- Function om subscription status te updaten
CREATE OR REPLACE FUNCTION update_subscription_status(
  profile_id UUID,
  new_status TEXT,
  billing_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET
    subscription_status = new_status,
    next_billing_date = COALESCE(billing_date, next_billing_date),
    updated_at = NOW()
  WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function voor trial expiry check
CREATE OR REPLACE FUNCTION get_expiring_trials(days_ahead INTEGER DEFAULT 0)
RETURNS TABLE(
  profile_id UUID,
  email TEXT,
  trial_end_date TIMESTAMPTZ,
  days_remaining INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.trial_end_date,
    EXTRACT(days FROM p.trial_end_date - NOW())::INTEGER
  FROM profiles p
  WHERE p.subscription_status = 'trial'
    AND p.trial_end_date <= NOW() + (days_ahead || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### **Environment Variables Checklist**

```env
# Existing
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VERTEX_PROJECT_ID=dobbie-online-bedrijfsarts

# New for payment processing
MOLLIE_API_KEY=test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM
MOLLIE_WEBHOOK_SECRET=whsec_...
CRON_SECRET=cron_secret_for_vercel_functions
APP_URL=https://deonlinebedrijfsarts.nl

# Future (Phase 5)
RESEND_API_KEY=re_...
```

### **Security Considerations**

**PCI Compliance:**
- Geen creditcard data in eigen database
- Mollie handles PCI-DSS compliance
- Payment method IDs als referenties, geen gevoelige data

**Webhook Security:**
- Signature verification voor Mollie webhooks
- Rate limiting op webhook endpoints
- Idempotency keys voor duplicate protection

**Database Security:**
- RLS policies voor payment_methods table
- Encryption voor mollie_customer_id velden
- Audit logging voor billing changes

---

## 📈 Success Metrics & KPIs

**Conversion Metrics:**
- Trial-to-paid conversion rate (target: >20%)
- Payment method addition rate op dag 25 (target: >60%)
- Auto-renewal success rate (target: >95%)

**Operational Metrics:**
- Payment failure rate (target: <5%)
- Grace period recovery rate (target: >70%)
- Customer support tickets related to billing (target: <10/month)

**Technical Metrics:**
- Webhook processing success rate (target: >99%)
- Cron job execution reliability (target: 100%)
- Database query performance voor billing operations