# DoBbie – De Online Bedrijfsarts

DoBbie is een digitale bedrijfsarts die 24/7 praktische, juridisch onderbouwde antwoorden geeft op vragen over verzuim, communicatie en wetgeving. De chatbot is speciaal ontwikkeld voor HR-medewerkers, casemanagers, leidinggevenden en ondernemers die snel en betrouwbaar advies willen, zonder medische adviezen. DoBbie verwijst door naar relevante wet- en regelgeving en schakelt bij twijfel altijd een echte bedrijfsarts in.

## Belangrijkste Features

* **Chatbot:** Direct chatten met DoBbie, de digitale bedrijfsarts.
* **Juridisch onderbouwde antwoorden:** Altijd gebaseerd op WVP, Arbowet en Nederlandse richtlijnen.
* **Doorverwijzingen:** Automatische verwijzing naar bedrijfsarts bij medische vragen.
* **Voorbeeldvragen:** Inspiratie per categorie (verzuim, communicatie, wetgeving, re-integratie).
* **Privacy by design:** Geen opslag van persoonlijke data, alleen sessie-informatie.
* **Authenticatie:** Veilige login voor gebruikers (via Firebase).
* **Beheerdersdashboard:** Inzicht in gebruikers, populaire vragen en contentbeheer (voor Talar).

## Doelgroep

- HR-medewerkers
- Casemanagers
- Leidinggevenden
- Ondernemers met personeel
- Junior bedrijfsartsen, UWV-medewerkers, loopbaanbegeleiders

## Technologie Stack

* **Frontend:** SvelteKit, TypeScript
* **Styling:** Tailwind CSS
* **AI:** OpenAI API (GPT-4 Turbo)
* **Authenticatie:** Firebase Authentication
* **Deployment:** Vercel (met `@sveltejs/adapter-vercel`)
* **Linting/Formatting:** ESLint, Prettier
* **Testing:** Vitest

## Getting Started

### Vereisten

* Node.js (laatste LTS aanbevolen)
* npm, yarn of pnpm

### Installatie

1. **Clone de repository:**
    ```powershell
    git clone <repository-url>
    cd <project-directory>
    ```

2. **Installeer dependencies:**
    ```powershell
    npm install
    # of yarn install / pnpm install
    ```

### Omgevingsvariabelen (Environment Variables)

Maak een `.env` bestand aan in de root van het project. Zie `docs/01-prd-dobbie.md` voor de benodigde variabelen. Voorbeeld:

```env
# Firebase Configuratie (gebruik VITE_ prefix voor client-side variabelen)
VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_AUTH_DOMAIN="..."
VITE_FIREBASE_PROJECT_ID="..."
VITE_FIREBASE_STORAGE_BUCKET="..."
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."

# OpenAI API Key (server-side only, geen VITE_ prefix)
OPENAI_API_KEY="..."
```

**Let op:** Voeg nooit je `.env` bestand toe aan Git.

## Applicatie Draaien

Start de development server:

```powershell
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in je browser.

## Beschikbare Scripts

* `npm run dev`: Start de development server.
* `npm run build`: Bouwt de applicatie voor productie.
* `npm run preview`: Draait een lokale preview van de productie build.
* `npm run check`: Voert Svelte Check uit om types te valideren.
* `npm run lint`: Lint de code met ESLint en Prettier.
* `npm run format`: Formatteert de code met Prettier.
* `npm run test:unit`: Voert unit tests uit met Vitest.
* `npm run test`: Voert alle tests uit.

## Documentatie

Zie de map [`docs/`](./docs) voor:
- Projectbeschrijving en requirements (`01-prd-dobbie.md`)
- Functioneel ontwerp (`02-functioneel-ontwerp-bedrijfsarts.md`)
- Technische eisen en architectuur
- Stijl en tone-of-voice (`03-dobbie-bot-styleguide.md`)
- Migratieplan (`08-bedrijfsarts-migratieplan.md`)

## Roadmap

Zie het migratieplan en de PRD voor toekomstige uitbreidingen zoals:
- Teams & organisaties, staffelkortingen
- Uitgebreide juridische verdieping en bronverwijzingen
- Beheerdersdashboard en analytics
- Geautomatiseerd betaalsysteem
- Mobile PWA en widget-integratie
- Contextbewustzijn, gebruikersprofielen, notificaties

---

> DoBbie is ontwikkeld voor en door professionals. Raadpleeg altijd de meest recente projectdocumentatie in de `docs/` map voor details over requirements, stijl en technische eisen.
