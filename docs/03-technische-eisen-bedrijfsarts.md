# Technische Eisen - DoBie: De Online Bedrijfsarts

## 🎯 FASE 1 - Startversie (2 weken, €795)

### ⚡ Performance (Startversie)
- [x] Laadtijd landingspagina + chatbot < 3 seconden
- [x] Reactietijd per prompt < 4 seconden gemiddeld
- [x] Session-based chat (geen permanente gespreksopslag)
- [x] **Google Vertex AI (EU-region)** - Europa-west4 (Nederland) of europa-west1 (België)

### 🔐 Authenticatie (Startversie)
- [x] Email + wachtwoord registratie
- [x] Handmatige account activatie door Talar
- [x] Basis session management (24u sessies)
- [x] Password hashing (bcrypt)
- [x] Basis brute-force bescherming

### 📱 Gebruikerservaring (Startversie)
- [x] Responsive design (desktop + mobiel optimized)
- [x] Touch-friendly chat interface
- [x] Voorbeeldvragen per categorie (Verzuim, Communicatie, Juridisch)
- [x] Cross-browser support (Chrome, Safari, Firefox, Edge)

### 🏗️ Architectuur (Startversie)
- [x] Landingspagina op deonlinebedrijfsarts.nl
- [x] Login/registratie flow
- [x] Chat interface met DoBie
- [x] Consistent styling volgens Talar's styleguide
- [x] Clear call-to-actions voor niet-ingelogde gebruikers

### 🛡️ Security & Privacy (Startversie)
- [x] HTTPS-only (SSL certificaat)
- [x] Geen chat-opslag (privacy by design)
- [x] API-keys veilig opgeslagen (environment variables)
- [x] Input sanitization tegen prompt injection
- [x] Rate limiting (max 20 vragen/uur per gebruiker)

### 🔧 Hosting & Infrastructure (Startversie)
- [x] Vercel frontend hosting (EU-edge locations)
- [x] **Supabase EU** (Frankfurt region) voor database
- [x] **Google Cloud Functions** (europa-west4) voor AI processing
- [x] Basis error handling + user-friendly foutmeldingen
- [x] Domain koppeling (deonlinebedrijfsarts.nl)
- [x] **GDPR-compliant data processing agreements** met alle providers

---

## 🚀 FASE 2 - Teams & Organisaties (2 weken, €1.500)

### 👥 Gebruikersbeheer
- [x] 7-dagen gratis trial systeem
- [x] Automatische trial-naar-betaald conversie flow
- [x] Gebruikersstatussen (trial, active, expired, blocked)
- [x] Organisatie-accounts met meerdere gebruikers
- [x] Kortingscodes voor staffels (10+, 50+, 200+)

### 🔐 Geavanceerde Authenticatie
- [x] "Wachtwoord vergeten" functionaliteit
- [x] Email verificatie bij registratie
- [x] Automatische uitlog na trial verloop
- [x] Account reactivatie na betaling

### 📧 Email & Communicatie
- [x] Welkomstmail bij activatie
- [x] Trial reminder (dag 6)
- [x] Trial verlopen notificatie
- [x] Email templates in Talar's stijl
- [x] **EU-SMTP provider** (Postmark EU of Resend EU)

### 🎛️ Beheersdashboard
- [x] Gebruikersoverzicht voor Talar
- [x] Account activatie/deactivatie
- [x] Organisatie-beheer
- [x] Basis statistieken (aanmeldingen, conversies)
- [x] Kortingscode generatie

### ⚡ Performance Verbeteringen
- [x] Reactietijd < 3 seconden
- [x] Database query optimalisatie
- [x] Caching voor veelgestelde vragen

---

## 🌟 FASE 3 - Juridische Verdieping (3 weken, €2.500)

### 🏛️ Juridische Content Engine
- [x] Uitgebreide kennisbank (WVP, Arbowet, AVG, NVAB)
- [x] Bronverwijzingen bij antwoorden
- [x] Validatiemechanisme voor juridisch gevoelige vragen
- [x] Fallback-flows bij onduidelijke casussen
- [x] Content versioning voor wet-updates

### 🔍 Advanced AI Features
- [x] RAG (Retrieval Augmented Generation) met juridische documenten
- [x] **Supabase pgvector** (EU-hosted) voor document search
- [x] Confidence scoring voor antwoorden
- [x] Automatische doorverwijzing bij lage confidence
- [x] Structured output voor consistente antwoorden

### 📊 Monitoring & Analytics
- [x] Populaire vragen dashboard
- [x] Doorverwijzing-tracking (wanneer verwijst DoBie door?)
- [x] Error tracking en logging
- [x] Performance monitoring (response times)

### 🔧 Content Management
- [x] Admin interface voor content updates
- [x] Juridische document upload en verwerking
- [x] A/B testing voor antwoordkwaliteit
- [x] Update workflow voor wetswijzigingen

### ♿ Compliance & Toegankelijkheid
- [x] WCAG AA compliance
- [x] AVG compliance audit
- [x] Juridische disclaimer management
- [x] Audit logs voor aansprakelijkheid

---

## 🔧 OPTIONELE MODULES

### 💳 Betaalsysteem (€750-1.250)
- [x] **Mollie Payment** integratie (EU-based, Nederlandse standaard)
- [x] Automatische account activatie na betaling
- [x] Subscription management
- [x] Factuur generatie (Nederlandse BTW-compliance)
- [x] Staffelkorting implementatie
- [x] Failed payment handling

### 📧 Marketing Automation (€500-950)
- [x] Geautomatiseerde email flows
- [x] Drip campaigns voor trial conversie
- [x] Re-engagement flows voor expired users
- [x] Newsletter integratie voor updates
- [x] Segmentatie (individueel vs. organisatie)

### 📱 Mobile PWA Features
- [ ] Progressive Web App capabilities
- [ ] Offline mode (cached responses)
- [ ] Push notifications voor updates
- [ ] App-like installatie op telefoon

### 🔗 Integraties
- [ ] Widget voor andere websites
- [ ] API voor third-party integraties
- [ ] Webhook voor externe systemen
- [ ] White-label opties voor partners

---

## 🚦 Technische Constraints & Beslissingen

### AI Provider Keuze
**Primair:** Google Vertex AI (europa-west4 - Nederland region)
**Fallback:** Claude via EU API endpoint
**Uitgesloten:** OpenAI (US-based data processing)
**Reden:** AVG-compliance, Nederlandse datacenter, EU GDPR agreements

### Database Keuze
**Primair:** Supabase EU (Frankfurt region)
**Reden:** Built-in auth, real-time, pgvector, EU-hosted, GDPR-compliant

### Hosting Strategy
**Frontend:** Vercel (EU edge caching, GDPR DPA)
**Backend:** Google Cloud Functions (europa-west4)
**Files:** Supabase Storage EU of Google Cloud Storage (EU regions)
**CDN:** Vercel Edge Network (EU nodes prioriteit)

### Monitoring & Error Handling
**Error Tracking:** Sentry EU
**Analytics:** Posthog EU (privacy-friendly, EU-hosted)
**Uptime:** Supabase + Vercel built-in monitoring (EU dashboards)

---

## 📈 Schaalbaarheid Overwegingen

### Traffic Verwachtingen
- **Maand 1-3:** 50-200 actieve gebruikers
- **Maand 6:** 500+ gebruikers, 50+ organisaties
- **Jaar 1:** 1000+ gebruikers, meerdere grote organisaties

### Performance Targets
- **Response tijd:** < 2 sec voor 95% van requests
- **Uptime:** 99.5% beschikbaarheid
- **Concurrent users:** 100+ simultane chat sessies

### Cost Management
- **AI API calls:** Budgettering per gebruiker/maand
- **Database:** Monitoring van storage en queries
- **Email:** Volume-based pricing bewaking

Deze technische eisen vormen de basis voor een schaalbare, veilige en juridisch verantwoorde chatbot die kan groeien met Talar's business.