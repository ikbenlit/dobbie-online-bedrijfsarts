# DoBie 30-dagen Trial Implementation Plan - MVP Gefaseerd

## 🎯 MVP Scope & Aanleiding

**Aanleiding:** Talar wil 30 dagen trial i.p.v. 7 dagen voor betere user engagement en conversie.

**MVP Strategie:** Gefaseerde aanpak om risico te minimaliseren en sneller te kunnen shippen.

**Bestaande Tech Stack:**
- ✅ **Supabase**: Database + Auth (EU region)
- ✅ **Vertex AI**: Chat functionality
- ✅ **Vercel**: Hosting

---

## 📊 Gefaseerde Implementation Strategy

### **MVP FASE 1: Extended Trial Only** ⚡ *SHIP FIRST*
- **Doel:** 30-dagen trial met manual conversion
- **Tijd:** 6-8 uur
- **Risico:** ✅ Laag
- **Business Value:** Valideer extended trial demand

### **FASE 2: Self-Service Payment** 🚀 *SHIP SECOND*
- **Doel:** Automated payment collection
- **Tijd:** 12-15 uur
- **Risico:** ⚠️ Medium
- **Business Value:** Scale conversions

### **FASE 3: Advanced Billing** 💎 *SHIP LATER*
- **Doel:** Full subscription management
- **Tijd:** 15+ uur
- **Risico:** 🔴 High
- **Business Value:** Enterprise features

---

## 📋 MVP FASE 1: Extended Trial Only (PRIORITY 1)

| Component | Status | MVP | Tijd | Kritiek |
|-----------|---------|-----|------|---------|
| **DATABASE UPDATES** | ✅ | ✅ | 2h | Ja |
| 1.1 Trial period 7→30 dagen | ✅ | ✅ | 15m | Ja |
| 1.2 Basic status tracking | ✅ | ✅ | 45m | Ja |
| 1.3 Manual conversion workflow | ✅ | ✅ | 1h | Ja |
| **FRONTEND UPDATES** | ⏳ | ✅ | 3h | Ja |
| 2.1 Trial countdown UI | ✅ | ✅ | 1.5h | Ja |
| 2.2 "Contact us" conversion flow | ✅ | ✅ | 1h | Ja |
| 2.3 Access blocking after expiry | ✅ | ✅ | 30m | Ja |
| **ADMIN TOOLS** | ✅ | ✅ | 2h | Ja |
| 3.1 Trial overview voor Talar | ✅ | ✅ | 1h | Ja |
| 3.2 Manual activation buttons | ✅ | ✅ | 1h | Ja |
| **TESTING & POLISH** | ✅ | ✅ | 1h | Ja |

**MVP FASE 1 TOTAAL: 8 uur** ✅

**🎉 MVP FASE 1 VOLLEDIG AFGEROND**

---

## 🗄️ MVP FASE 1: Database Schema (Minimal)

### **1.1 Trial Period Extension**

```sql
-- Simple update: 7→30 dagen voor nieuwe users
ALTER TABLE profiles ALTER COLUMN trial_end_date 
SET DEFAULT (NOW() + INTERVAL '30 days');

-- Bestaande trial users behouden huidige datum
-- Nieuwe registraties krijgen automatisch 30 dagen
```

### **1.2 Basic Status Tracking**

```sql
-- Minimal subscription status enum voor MVP
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_subscription_status_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_status_check 
CHECK (subscription_status IN (
  'trial',          -- 0-30 dagen gratis toegang
  'expired',        -- Trial verlopen, geen toegang
  'manual_active',  -- Handmatig geactiveerd door Talar
  'blocked'         -- Admin blocked
));

-- Eenvoudige contact tracking
ALTER TABLE profiles ADD COLUMN contacted_for_conversion BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN conversion_notes TEXT;
```

### **1.3 Manual Conversion Workflow**

```sql
-- Function voor Talar om users handmatig te activeren
CREATE OR REPLACE FUNCTION manually_activate_user(
  profile_id UUID,
  notes TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET
    subscription_status = 'manual_active',
    conversion_notes = notes,
    updated_at = NOW()
  WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function om trial status te checken
CREATE OR REPLACE FUNCTION check_trial_expiry()
RETURNS TABLE(
  profile_id UUID,
  email TEXT,
  full_name TEXT,
  days_remaining INTEGER,
  last_activity TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    EXTRACT(days FROM p.trial_end_date - NOW())::INTEGER,
    p.updated_at
  FROM profiles p
  WHERE p.subscription_status = 'trial'
  ORDER BY p.trial_end_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🎨 MVP FASE 1: Frontend Updates

### **2.1 Trial Countdown UI**

```svelte
<!-- components/TrialCountdown.svelte -->
<script>
  export let user;
  
  $: daysRemaining = Math.max(0, Math.ceil(
    (new Date(user.trial_end_date) - new Date()) / (1000 * 60 * 60 * 24)
  ));
  
  $: isExpiringSoon = daysRemaining <= 5;
  $: isExpired = daysRemaining <= 0;
</script>

{#if user.subscription_status === 'trial'}
  <div class="trial-banner" class:warning={isExpiringSoon}>
    {#if isExpired}
      <p class="trial-expired">
        Your trial has expired. <a href="/contact" class="contact-link">Contact us to continue using DoBie</a>
      </p>
    {:else if isExpiringSoon}
      <p class="trial-warning">
        ⏰ {daysRemaining} days left in your trial. 
        <a href="/contact" class="contact-link">Get in touch to continue</a>
      </p>
    {:else}
      <p class="trial-info">
        📅 {daysRemaining} days remaining in your free trial
      </p>
    {/if}
  </div>
{/if}

<style>
  .trial-banner {
    background: #F5F2EB;
    border: 1px solid #E9B046;
    padding: 12px 16px;
    border-radius: 6px;
    margin-bottom: 16px;
  }
  
  .trial-banner.warning {
    background: #FEF3CD;
    border-color: #F59E0B;
  }
  
  .contact-link {
    color: #771138;
    font-weight: 600;
    text-decoration: underline;
  }
</style>
```

### **2.2 Contact Us Conversion Flow**

```svelte
<!-- routes/contact/+page.svelte -->
<script>
  import { user } from '$lib/stores/userStore';
  
  let contactForm = {
    subject: 'Continue DoBie Subscription',
    message: '',
    urgency: 'normal'
  };
  
  $: if ($user?.subscription_status === 'expired') {
    contactForm.urgency = 'high';
    contactForm.subject = 'Reactivate DoBie Account';
  }
  
  async function submitContact() {
    // Mark user as contacted in database
    await supabase
      .from('profiles')
      .update({ contacted_for_conversion: true })
      .eq('id', $user.id);
      
    // Send email to Talar (simple implementation)
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...contactForm,
        user_id: $user.id,
        user_email: $user.email
      })
    });
  }
</script>

<div class="contact-page">
  <h1>Continue Your DoBie Experience</h1>
  
  {#if $user?.subscription_status === 'expired'}
    <div class="expired-notice">
      <h2>Trial Expired</h2>
      <p>Your 30-day trial has ended. Contact Talar to discuss continuing with DoBie Pro.</p>
    </div>
  {:else}
    <div class="conversion-pitch">
      <h2>Ready to Upgrade?</h2>
      <p>Get in touch to discuss DoBie Pro and continue your verzuim support.</p>
    </div>
  {/if}
  
  <form on:submit|preventDefault={submitContact}>
    <label>
      Subject:
      <input bind:value={contactForm.subject} required />
    </label>
    
    <label>
      Message:
      <textarea bind:value={contactForm.message} placeholder="Tell us about your experience with DoBie and your needs..." required></textarea>
    </label>
    
    <button type="submit" class="btn-primary">
      Send Message to Talar
    </button>
  </form>
  
  <div class="contact-info">
    <p><strong>Direct contact:</strong></p>
    <p>📧 talar@dobbie.nl</p>
    <p>📞 [Talar's number]</p>
  </div>
</div>
```

### **2.3 Access Blocking After Expiry**

```typescript
// lib/auth/access-control.ts
export function checkUserAccess(user: User): AccessResult {
  if (!user) return { hasAccess: false, reason: 'not_authenticated' };
  
  const now = new Date();
  const trialEnd = new Date(user.trial_end_date);
  
  switch (user.subscription_status) {
    case 'trial':
      if (now > trialEnd) {
        // Auto-expire trial users
        updateUserStatus(user.id, 'expired');
        return { hasAccess: false, reason: 'trial_expired' };
      }
      return { hasAccess: true };
      
    case 'manual_active':
      return { hasAccess: true };
      
    case 'expired':
    case 'blocked':
    default:
      return { hasAccess: false, reason: user.subscription_status };
  }
}

// In chat interface
if (!checkUserAccess($user).hasAccess) {
  goto('/contact');
}
```

---

## 🛠️ MVP FASE 1: Admin Tools voor Talar

### **3.1 Trial Overview Dashboard**

```svelte
<!-- routes/admin/trials/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  
  let trials = [];
  let loading = true;
  
  onMount(async () => {
    const { data } = await supabase.rpc('check_trial_expiry');
    trials = data || [];
    loading = false;
  });
  
  async function activateUser(profileId, notes = '') {
    await supabase.rpc('manually_activate_user', {
      profile_id: profileId,
      notes: notes
    });
    
    // Refresh list
    const { data } = await supabase.rpc('check_trial_expiry');
    trials = data || [];
  }
</script>

<div class="admin-dashboard">
  <h1>Trial Users Overview</h1>
  
  {#if loading}
    <p>Loading trial users...</p>
  {:else}
    <div class="trials-grid">
      {#each trials as trial}
        <div class="trial-card" class:expiring={trial.days_remaining <= 5}>
          <h3>{trial.full_name}</h3>
          <p class="email">{trial.email}</p>
          
          <div class="trial-status">
            {#if trial.days_remaining > 0}
              <span class="days-remaining">{trial.days_remaining} days left</span>
            {:else}
              <span class="expired">Trial expired</span>
            {/if}
          </div>
          
          <div class="actions">
            <button 
              class="btn-activate" 
              on:click={() => activateUser(trial.profile_id, 'Manual activation via admin panel')}
            >
              Activate User
            </button>
          </div>
          
          <div class="last-activity">
            Last active: {new Date(trial.last_activity).toLocaleDateString()}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .trials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
    margin-top: 24px;
  }
  
  .trial-card {
    background: white;
    border: 1px solid #D1D5DB;
    border-radius: 8px;
    padding: 16px;
  }
  
  .trial-card.expiring {
    border-color: #F59E0B;
    background: #FEF3CD;
  }
  
  .btn-activate {
    background: #771138;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
```

---

## 📞 MVP FASE 1: Contact API Endpoint

```typescript
// pages/api/contact.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { subject, message, user_id, user_email, urgency } = req.body;
  
  // Simple email to Talar (using Resend or similar)
  const emailContent = `
New contact from DoBie user:

Email: ${user_email}
User ID: ${user_id}
Subject: ${subject}
Urgency: ${urgency}

Message:
${message}

---
Sent from DoBie Contact Form
  `;
  
  // Send email to Talar
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'dobie@deonlinebedrijfsarts.nl',
      to: 'talar@dobbie.nl',
      subject: `DoBie Contact: ${subject}`,
      text: emailContent,
    }),
  });
  
  res.status(200).json({ success: true });
}
```

---

## 📊 FASE 2 & 3: Toekomstige Uitbreidingen

### **FASE 2: Self-Service Payment (Later)**
- Mollie integration
- Automated payment collection
- Basic subscription management
- **Tijd:** 12-15 uur

### **FASE 3: Advanced Billing (Much Later)**
- Auto-renewal
- Failed payment handling
- Grace periods
- Complex subscription states
- **Tijd:** 15+ uur

---

## 🎯 MVP FASE 1 Success Metrics

**User Behavior:**
- Trial completion rate (30 days vs historical 7 days)
- Daily/weekly active users during trial
- Feature usage patterns in extended trial

**Conversion Metrics:**
- Contact form submission rate
- Manual conversion rate via Talar
- Time-to-conversion from trial start

**Operational Metrics:**
- Talar's time spent on manual conversions
- User feedback on trial length
- Support tickets related to access

---

## ✅ MVP FASE 1 Acceptance Criteria

**Database:**
- [x] New users get 30-day trial automatically
- [x] Existing users keep current trial dates
- [x] Trial expiry auto-updates status to 'expired'
- [x] Admin can manually activate users

**Frontend:**
- [x] Trial countdown visible to users
- [x] Contact form accessible when trial ends
- [x] Chat blocked for expired users
- [x] Clear messaging about next steps

**Admin Tools:**
- [x] Talar can see all trial users
- [x] One-click user activation
- [x] Trial status overview
- [x] Contact tracking

**Testing:**
- [x] Trial expiry flow works correctly
- [x] Manual activation restores access
- [x] Contact form sends emails to Talar
- [x] UI handles all subscription states

---

## 🚀 Implementation Priority

**Week 1: MVP FASE 1**
1. Database schema updates (Day 1-2)
2. Frontend trial countdown (Day 3-4)
3. Admin tools for Talar (Day 5)
4. Testing & polish (Day 5)

**Week 2: Measure & Learn**
- Monitor user behavior
- Collect feedback from Talar
- Analyze conversion patterns
- Plan FASE 2 based on learnings

**This MVP approach:**
- ✅ Delivers immediate value (30-day trial)
- ✅ Validates business assumption
- ✅ Minimal technical risk
- ✅ Foundation for future automation
- ✅ Talar can manually handle conversions