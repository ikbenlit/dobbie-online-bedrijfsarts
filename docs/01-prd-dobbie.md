# 📄 Concept & PRD – DoBie - De Online Bedrijfsarts

**Doel:** Richting geven – wat gaan we bouwen, voor wie, en waarom?

## Probleemstelling

Bedrijfsartsen zitten 8 weken vol en er is een enorme drempel om hen te benaderen. HR-medewerkers, casemanagers en leidinggevenden wachten weken op antwoorden op communicatieve en procedurele vragen over verzuim, terwijl bedrijfsartsen juist preventief willen werken in plaats van constant in de spreekkamer te zitten. Veel vragen zijn eigenlijk "afvinklijstjes" die niet per se medische expertise vereisen.

## Doelgroep

**Primair:** HR-medewerkers, casemanagers, leidinggevenden en ondernemers met medewerkers die direct ondersteuning nodig hebben bij verzuimprocedures en communicatie.

**Secundair:** Junior bedrijfsartsen, UWV-medewerkers, loopbaanbegeleiders en ZZP-casemanagers die nog zoekende zijn naar de juiste aanpak.

## Doel

Een 24/7 beschikbare digitale bedrijfsarts bouwen die to-the-point, juridisch onderbouwde antwoorden geeft op communicatieve en procedurele verzuimvragen, zodat Talar minder tijd kwijt is aan repetitieve vragen en professionals sneller zelfverzekerd handelen binnen de Nederlandse wet- en regelgeving.

## Belofte

Een ervaren bedrijfsarts in je broekzak die direct praktische antwoorden geeft op verzuimvragen zonder medische adviezen, maar wel met juridische onderbouwing volgens Nederlandse richtlijnen. Geen fluf, wel resultaat.

## User Journey (kort)

1. Professional logt in op deonlinebedrijfsarts.nl (na 7-dagen trial of betaalde toegang)
2. Stelt vraag over verzuimprocedure, communicatie of wettelijke verplichting
3. DoBie geeft direct, to-the-point antwoord gebaseerd op WVP, Arbowet en Nederlandse richtlijnen
4. Bij medische component: automatische doorverwijzing naar echte bedrijfsarts
5. Professional voert advies uit en komt terug met vervolgvragen

## Kernfunctionaliteiten

### 🛠️ Fase 1 – Startversie (2 weken, €795)

* **Chatbot** getraind als integratieve bedrijfsarts, gebaseerd op OpenAI/Claude
* **Landingspagina** op deonlinebedrijfsarts.nl met uitleg, prijzen en FAQ
* **Basis inlogsysteem** (e-mail + wachtwoord, handmatige activatie)
* **Kernkennis**:
  * Wet Verbetering Poortwachter (WVP)
  * Arbowet basisprincipes
  * AVG-compliance voor HR-processen
* **Tone of voice**: Talar's stijl - zakelijk, to-the-point, geen fluf, wel menselijk
* **Gedrag**:
  * Geen medische adviezen - bij twijfel doorverwijzen
  * Praktische, uitvoerbare antwoorden
  * Voorbeeldvragen per categorie voor inspiratie
* **Privacy by design**: geen gespreksopslag

### 🛠️ Fase 2 – Teams & Organisaties (2 weken, €1.500)

* **7-dagen gratis trial** voor nieuwe gebruikers
* **Gebruikersbeheer**: overzicht, activatie/deactivatie accounts
* **Staffelstructuur**: individueel vs. organisatie-accounts
* **Kortingscodes** voor organisaties (10+, 50+, 200+ gebruikers)
* **Wachtwoord vergeten**-functionaliteit
* **Welkomst- en trial-verloop emails**
* **Beheersdashboard** voor Talar (gebruikersoverzicht, status)

### 🛠️ Fase 3 – Juridische Verdieping (3 weken, €2.500)

* **Uitgebreide juridische training**:
  * Complete WVP-implementatie
  * Arbowet en AVG-integratie
  * NVAB-richtlijnen
* **Bronverwijzingen** bij antwoorden ("volgens artikel X...")
* **Validatiemechanisme** voor juridisch gevoelige vragen
* **Fallback-flows** bij onduidelijke casussen
* **Update-workflow** voor wetswijzigingen
* **Juridische documentatie** t.b.v. aansprakelijkheid

### 🔮 Optionele uitbreidingen

* **Geautomatiseerd betaalsysteem** (Mollie/Stripe integration) - €750-1.250
* **Email marketing flows** (trial reminders, conversie, support) - €500-950
* **Widget implementatie** voor bestaande websites
* **Mobile PWA** voor broekzak-toegang
* **Analytics dashboard** voor Talar (meest gestelde vragen, gebruikspatronen)

## Zakelijk Model

* **Pricing**: €11/maand per gebruiker (onder ChatGPT-niveau)
* **Trial**: 7 dagen gratis
* **Doelgroep**: individuele professionals én organisaties
* **Staffels**: kortingen bij 10+, 50+, 200+ gebruikers
* **Onderhoud**: €195/maand (hosting, updates, juridische actualiteit)

## Success Metrics

* **Adoptie**: 50+ actieve gebruikers binnen 3 maanden
* **Conversie**: 30%+ trial-naar-betaald conversie
* **Tevredenheid**: Minder dan 10% van vragen vereist doorverwijzing naar Talar
* **Schaalbaarheid**: Talar bespaart 8+ uur per week aan repetitieve vragen

## Technische Architectuur

### Stack
* **Frontend**: SvelteKit + TailwindCSS (responsive, desktop + mobiel)
* **Hosting**: Vercel (snelle deployment, schaalbaar)
* **Database**: Supabase (gebruikersbeheer, organisatie-koppelingen)
* **AI**: Google Cloud Platform (privacy-vriendelijk, EU-servers)
* **Betaling**: Mollie (Nederlandse standaard, iDEAL support)
* **Email**: Resend/Mailgun (trial reminders, welkomstmails)

### Security & Privacy
* **AVG-compliant**: geen gespreksopslag in Fase 1
* **Data soevereiniteit**: EU-servers, geen model training met user data
* **Authentication**: Secure login + password reset
* **Role-based access**: individueel vs. organisatie-accounts

## Go-to-Market Strategie

### Launch Plan
1. **Week 1-2**: Fase 1 development + Talar's LinkedIn teaser posts
2. **Week 3**: Soft launch met 5-10 beta users uit Talar's netwerk
3. **Week 4**: Officiële LinkedIn campagne + eerste betalende klanten
4. **Maand 2**: Organisatie-outreach (HR-afdelingen, bedrijfsartspraktijken)

### Marketing Kanalen
* **LinkedIn** (Talar's netwerk + content marketing)
* **Bedrijfsartsen-community** (mond-tot-mond marketing)
* **HR-vakbladen** en events
* **Partner-netwerk** (arbodiensten, HR-consultants)

## Risico's & Mitigatie

### Technische Risico's
* **AI-betrouwbaarheid**: Uitgebreide testing + fallback naar menselijke expertise
* **Schaalbaarheidsproblemen**: Modulaire architectuur + monitoring

### Business Risico's
* **Langzame adoptie**: Sterke focus op MVP + snelle iteratie op feedback
* **Juridische aansprakelijkheid**: Duidelijke disclaimers + juridische review
* **Concurrentie**: First-mover advantage + nauwe samenwerking met Talar's expertise

Deze PRD vormt de basis voor een stapsgewijze ontwikkeling waarbij elke fase waardevol is op zichzelf, maar samen een compleet ecosysteem vormen voor professionele verzuimbegeleiding.