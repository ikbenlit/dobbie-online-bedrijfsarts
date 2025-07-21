# Technisch Implementatieplan: Mollie Betalingsintegratie DoBbie

**Doel:** Implementeer een complete Mollie betalingsintegratie in de DoBbie SvelteKit applicatie om gebruikers na hun 30-dagen trial automatisch te kunnen laten betalen voor hun abonnement (€11/maand). Het systeem moet webhooks ondersteunen, betalingsstatussen bijhouden, en een naadloze gebruikerservaring bieden. Dit document dient als leidraad voor de development sprints.

---

## 1. Projectoverzicht & Status

| Fase | Sub-fase / Deliverable | Status | Verantwoordelijke(n) | Notities |
| :--- | :--- | :--- | :--- | :--- |
| **Fase 1** | 1.1 Mollie Account Setup & API Configuratie | ⏳ Gepland | Developer | Verificatieproces 10 werkdagen |
| | 1.2 Database Schema Uitbreiding | ✅ Voltooid | Developer | Migration 20250721 succesvol uitgevoerd |
| | 1.3 Mollie SDK Installatie & Setup | ✅ Voltooid | Developer | @mollie/api-client v4.3.3 geïnstalleerd, client setup compleet |
| **Fase 2** | 2.1 Backend API Development | ✅ Voltooid | Developer | Alle API endpoints geïmplementeerd en getest |
| | 2.2 Frontend Payment Components | ⏳ Gepland | Developer | Betaalschermen, status displays |
| **Fase 3** | 3.1 Webhook Implementatie | ⏳ Gepland | Developer | Status updates, failure handling |
| | 3.2 Subscription Management | ⏳ Gepland | Developer | Recurring billing, cancellation |
| **Fase 4** | 4.1 Testing & Security Hardening | ⏳ Gepland | Developer | End-to-end tests, webhook security |
| | 4.2 Error Handling & Monitoring | ⏳ Gepland | Developer | Failed payments, retry logic |

---

## 2. Architecturale Principes

Alle ontwikkeling volgt deze kernprincipes:
*   **DRY (Don't Repeat Yourself):** Hergebruik bestaande Supabase services en email configuratie. Integreer met huidige userStore en trial management.
*   **SOC (Separation of Concerns):** Isoleer betaalfunctionaliteit in eigen services (`/lib/services/mollie.ts`, `/lib/server/mollie/`). 
*   **Strategy & Factory Patterns:** Gebruik Factory pattern voor Mollie client instantiatie per environment (test/live).
*   **Clean Architecture:** Houd betalingslogica gescheiden van UI. Business rules in service layer, niet in Svelte componenten.

---

## 3. Development Standaarden

*   **Test Locatie:** Mollie webhook tests in `__tests__/mollie/` subdirectory. API endpoint tests in `tests/api/` op root niveau.
*   **Project-libs:** Hergebruik bestaande Supabase client configuration, userStore patterns, en email service setup.
*   **Environment Variables:** Gebruik bestaande `.env` structuur voor Mollie API keys (TEST_KEY, LIVE_KEY).

---

## 4. Teststrategie

*   **Pragmatische Aanpak:** Focus op happy path voor subscription flow en kritieke foutscenario's.
*   **Handmatige verificatie (MVP):** Test volledige betaalflow: trial → payment request → successful payment → activated subscription.
*   **Unit Tests (Basis):** Test Mollie client helpers, webhook validation, subscription state transitions.
*   **Webhook Tests:** Gebruik Mollie's test webhooks om payment status changes te valideren zonder echte betalingen.

---

## Fase 1: Mollie Foundation & Database Setup

**Doel:** Leg de technische basis voor Mollie integratie door account, database en SDK setup te voltooien.

### **Sub-fase 1.1: Mollie Account Setup & API Configuratie**

*   **Doel:** Voltooi Mollie account verificatie en verkrijg API credentials.
*   **Developer Taken:**
    1.  **Mollie Account Aanmaken:** Registreer op Mollie dashboard, submit business details, bankgegevens en identificatiedocumenten.
    2.  **API Keys Configureren:** Verkrijg Test en Live API keys, voeg toe aan environment variabelen.
    3.  **Webhook URL Configuratie:** Stel webhook endpoint in Mollie dashboard in (voorlopig placeholder).
    4.  **Payment Methods Setup:** Configureer ondersteunde betaalmethoden (iDEAL, creditcard, Bancontact).

### **Sub-fase 1.2: Database Schema Uitbreiding**

*   **Doel:** Breid Supabase database uit met tabellen voor Mollie payment management.
*   **Developer Taken:**
    1.  **Customers Table:** Maak `mollie_customers` tabel met `user_id` foreign key naar `profiles`, `mollie_customer_id` mapping.
    2.  **Subscriptions Table:** Maak `subscriptions` tabel: `id`, `user_id`, `mollie_subscription_id`, `status`, `start_date`, `next_billing_date`, `amount`.
    3.  **Payments Table:** Maak `payments` tabel voor payment history: `id`, `user_id`, `mollie_payment_id`, `amount`, `status`, `created_at`.
    4.  **Profile Updates:** Voeg `mollie_customer_id` veld toe aan bestaande `profiles` tabel.
    5.  **Migration Script:** Schrijf Supabase migratie voor alle nieuwe tabellen en indexen.

### **Sub-fase 1.3: Mollie SDK Installatie & Setup**

*   **Doel:** Installeer en configureer Mollie Node.js SDK in SvelteKit project.
*   **Developer Taken:**
    1.  **Package Installatie:** `npm install @mollie/api-client` toevoegen aan dependencies.
    2.  **Environment Variables:** Voeg `MOLLIE_API_KEY_TEST`, `MOLLIE_API_KEY_LIVE` toe aan `app.d.ts` interface.
    3.  **Mollie Client Setup:** Maak `/lib/server/mollie/client.ts` met environment-aware client instantiatie.
    4.  **Type Definitions:** Maak `/lib/types/mollie.ts` voor TypeScript interfaces (Customer, Subscription, Payment).

### **Definition of Done voor Fase 1:**
*   Mollie account is geverifieerd en live-ready (of in testfase)
*   Database heeft alle benodigde tabellen met juiste foreign key constraints
*   Mollie SDK is geïnstalleerd en client kan successfully verbinden met Mollie API
*   Environment variabelen zijn geconfigureerd in alle environments (development, staging, production)

---

## Fase 2: Core Payment API Development

**Doel:** Bouw de kernfunctionaliteit voor payment processing en subscription management.

### **Sub-fase 2.1: Backend API Development**

*   **Doel:** Implementeer SvelteKit API routes voor Mollie payment operations.
*   **Developer Taken:**
    1.  **Create Customer API:** `/api/mollie/customers/+server.ts` - POST endpoint om Mollie customer aan te maken voor user.
    2.  **Create Subscription API:** `/api/mollie/subscriptions/+server.ts` - POST endpoint voor nieuwe subscriptions na trial.
    3.  **Payment Status API:** `/api/mollie/payments/[id]/+server.ts` - GET endpoint voor payment status checks.
    4.  **Subscription Management API:** PATCH/DELETE endpoints voor subscription updates en cancellation.
    5.  **Error Handling:** Implementeer consistent error handling met proper HTTP status codes.

### **Sub-fase 2.2: Frontend Payment Components**

*   **Doel:** Bouw Svelte componenten voor payment user interface.
*   **Developer Taken:**
    1.  **SubscriptionUpgrade Component:** Vervang contact form met direct payment flow na trial expiry.
    2.  **PaymentMethod Component:** UI voor betaalmethode selectie (iDEAL, creditcard, etc.).
    3.  **PaymentStatus Component:** Real-time payment status display met loading states.
    4.  **BillingHistory Component:** Overzicht van vorige betalingen en subscription details.
    5.  **Integration met userStore:** Update subscription status in bestaande store na successful payment.

### **Definition of Done voor Fase 2:**
*   API endpoints zijn geïmplementeerd en testen successful met Mollie test data
*   Frontend componenten tonen correctly payment options en status updates
*   User kan van trial naar betaalde subscription zonder manual admin intervention
*   Payment flow integreert naadloos met bestaande user experience

---

## Fase 3: Webhooks & Subscription Management

**Doel:** Implementeer real-time payment updates en recurring billing management.

### **Sub-fase 3.1: Webhook Implementatie**

*   **Doel:** Verwerk Mollie webhooks voor automatic payment status updates.
*   **Developer Taken:**
    1.  **Webhook Endpoint:** `/api/webhooks/mollie/+server.ts` voor alle Mollie event notifications.
    2.  **Webhook Verificatie:** Implementeer signature validation voor webhook security.
    3.  **Event Processing:** Handle `payment.paid`, `payment.failed`, `subscription.activated` events.
    4.  **Database Updates:** Update local subscription en payment status based on webhook data.
    5.  **Email Notifications:** Trigger email alerts voor payment failures via existing email service.

### **Sub-fase 3.2: Subscription Management**

*   **Doel:** Volledig automated subscription lifecycle management.
*   **Developer Taken:**
    1.  **Auto-Renewal Logic:** Automatische maandelijkse subscription renewals via Mollie.
    2.  **Failed Payment Handling:** Retry logic, grace periods, account deactivation flow.
    3.  **Cancellation Flow:** User-initiated subscription cancellation met immediate/end-of-period options.
    4.  **Pro-rating Logic:** Handle mid-month upgrades/downgrades (future enhancement).
    5.  **Subscription Status Sync:** Periodic sync tussen Mollie en local database voor data consistency.

### **Definition of Done voor Fase 3:**
*   Webhooks zijn fully functional en verwerken alle relevante Mollie events correctly
*   Subscription renewals gebeuren automatisch zonder manual intervention
*   Failed payments triggeren appropriate user notifications en grace period flow
*   Users kunnen hun subscription zelf beheren via frontend interface

---

## Fase 4: Production Hardening & Monitoring

**Doel:** Maak het systeem production-ready met proper error handling, security en monitoring.

### **Sub-fase 4.1: Testing & Security Hardening**

*   **Doel:** Comprehensive testing en security measures voor production deployment.
*   **Developer Taken:**
    1.  **End-to-End Tests:** Volledige payment flows van trial naar active subscription.
    2.  **Webhook Security Tests:** Valideer signature verification en replay attack protection.
    3.  **API Rate Limiting:** Implementeer rate limiting op payment endpoints.
    4.  **HTTPS Enforcement:** Ensure alle payment-gerelateerde endpoints zijn HTTPS-only.
    5.  **Data Encryption:** Sensitive payment data encryption in database waar nodig.

### **Sub-fase 4.2: Error Handling & Monitoring**

*   **Doel:** Robust error handling en monitoring voor operational excellence.
*   **Developer Taken:**
    1.  **Payment Failure Recovery:** Automated retry mechanisms voor transient failures.
    2.  **Alert System:** Email/Slack notifications voor critical payment system failures.
    3.  **Audit Logging:** Comprehensive logging van alle payment-related actions.
    4.  **Dashboard Integration:** Admin dashboard updates voor subscription en payment monitoring.
    5.  **Performance Monitoring:** Response time monitoring voor payment API endpoints.

### **Definition of Done voor Fase 4:**
*   System handelt gracefully alle error scenarios zonder data loss
*   Monitoring en alerting systeem is operational voor production use
*   Security audit is completed met alle findings addressed
*   Documentation is complete voor troubleshooting en maintenance

---

## Bijlagen & Referenties

*   [Mollie Getting Started Guide](https://docs.mollie.com/docs/getting-started)
*   [Mollie API Reference](https://docs.mollie.com/reference/overview)
*   [SvelteKit API Routes Documentation](https://kit.svelte.dev/docs/routing#server)
*   [Existing Trial Implementation Documentation](./features/11-dobbie-trial-implementation.md)
*   [Current Database Schema](../src/lib/supabase/migrations/)

## Implementation Notes

### Bestaande Integratie Punten:
- **UserStore**: Huidige subscription status tracking via `subscription_status` enum
- **Trial System**: 30-dagen trial management is already implemented
- **Email Service**: Resend integration voor payment notifications
- **Admin Dashboard**: Extend existing admin tools voor payment monitoring

### Mollie Specifieke Overwegingen:
- **Test Environment**: Gebruik Mollie test API keys voor development
- **Webhook Security**: Implement signature verification tegen webhook manipulation
- **Payment Methods**: Focus initially op iDEAL en creditcard voor Nederlandse markt
- **Subscription Timing**: Align met bestaande trial expiry logic voor seamless transition