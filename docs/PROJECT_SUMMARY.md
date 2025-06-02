# Project Samenvatting

Dit document biedt een overzicht van de SvelteKit applicatie, bedoeld als startpunt voor nieuwe projecten.

## Project Structuur

-   `.svelte-kit/`: Gegenereerde bestanden door SvelteKit (niet direct bewerken).
-   `docs/`: Documentatie van het project.
-   `public/`: Statische assets die direct toegankelijk zijn (bijv. `favicon.png`).
-   `src/`: Broncode van de applicatie.
    -   `assets/`: Globale assets zoals afbeeldingen of lettertypen die via Vite worden verwerkt.
    -   `lib/`: Herbruikbare Svelte componenten, utility functies, stores, server-side logica, en type definities.
        -   `components/`: Svelte componenten, vaak verder onderverdeeld (bijv. `Auth`, `chat`, `layout`, `ui`).
        -   `data/`: Mogelijk mock data of data-gerelateerde utilities.
        -   `firebase/`: Firebase configuratie en interactie logica.
        -   `images/`: Afbeeldingen die specifiek in de `lib` gebruikt worden.
        -   `server/`: Server-side logica, zoals API endpoints of hooks (bijv. `prompts`).
        -   `stores/`: Svelte stores voor state management.
        -   `templates/`: Mogelijk Svelte component templates.
        -   `types/`: TypeScript type definities.
    -   `routes/`: Definieert de paginaroutes en API endpoints van de applicatie. De mappenstructuur hier bepaalt de URL structuur.
        -   `api/`: Bevat server-side API endpoints (bijv. `chat`).
-   `static/`: Andere statische assets die direct naar de build output gekopieerd worden.
    -   `fonts/`: Lettertype bestanden.
    -   `icons/`: Icoontjes.

## Technologieën

-   **Framework**: SvelteKit
-   **UI Styling**: Tailwind CSS
-   **Componenten**: Svelte
-   **Backend/Database**: Firebase (gezien `src/lib/firebase/` en `firebase` dependency)
-   **API interactie**: `openai` dependency suggereert integratie met OpenAI.
-   **Build tool**: Vite
-   **Taal**: TypeScript

## Configuratie

### `package.json`

-   **Naam**: `legalboost-poc` (kan aangepast worden voor nieuwe projecten)
-   **Versie**: `0.0.1`
-   **Type**: `module` (ES Module syntax)
-   **Belangrijke Scripts**:
    -   `dev`: `vite dev` (start de ontwikkelserver)
    -   `build`: `vite build && npm run prepack` (bouwt de applicatie voor productie)
    -   `preview`: `vite preview` (start een lokale server om de productie build te bekijken)
    -   `check`: `svelte-kit sync && svelte-check --tsconfig ./tsconfig.json` (type checking)
    -   `format`: `prettier --write .` (code formatting)
    -   `lint`: `prettier --check . && eslint .` (code linting)
    -   `test`: `npm run test:unit -- --run` (unit tests)
-   **Dependencies**:
    -   `@heroicons/react`
    -   `clsx`
    -   `firebase`
    -   `openai`
    -   `tailwind-merge`
-   **DevDependencies**:
    -   SvelteKit gerelateerde packages (`@sveltejs/adapter-auto`, `@sveltejs/adapter-vercel`, `@sveltejs/kit`, `@sveltejs/package`, `@sveltejs/vite-plugin-svelte`)
    -   Tailwind CSS (`@tailwindcss/forms`, `@tailwindcss/typography`, `@tailwindcss/vite`, `autoprefixer`, `tailwindcss`)
    -   Testing (`@testing-library/jest-dom`, `@testing-library/svelte`, `jsdom`, `vitest`)
    -   Linting & Formatting (`eslint`, `eslint-config-prettier`, `eslint-plugin-svelte`, `prettier`, `prettier-plugin-svelte`, `prettier-plugin-tailwindcss`)
    -   TypeScript (`typescript`, `typescript-eslint`)

### `svelte.config.js`

-   **Preprocessor**: `vitePreprocess()` (maakt het mogelijk om bijv. TypeScript in Svelte `<script>` tags te gebruiken)
-   **Adapter**: `@sveltejs/adapter-vercel` met `runtime: 'nodejs20.x'`. Dit betekent dat de app is geconfigureerd voor deployment op Vercel. Voor andere platformen kan dit aangepast worden naar bijv. `@sveltejs/adapter-auto` (standaard) of een specifieke adapter zoals `@sveltejs/adapter-node`.
-   **Alias**: `$lib` is geconfigureerd als alias voor `./src/lib`.

### `vite.config.ts`

-   **Plugins**: `sveltekit()`
-   **Resolve Alias**: `$lib` en `$lib/*` zijn geconfigureerd voor module resolutie.
-   **Test Configuratie**: Vitest is geconfigureerd voor zowel client-side (`jsdom` environment) als server-side (`node` environment) tests.
    -   Client tests: `src/**/*.svelte.{test,spec}.{js,ts}`
    -   Server tests: `src/**/*.{test,spec}.{js,ts}` (exclusief Svelte component tests)

### `tsconfig.json`

-   Standaard TypeScript configuratie voor een SvelteKit project, met checks zoals `strict` ingeschakeld.

## Basis HTML (`src/app.html`)

-   **Taal**: `en` (Engels, kan aangepast worden)
-   **Favicon**: `%sveltekit.assets%/favicon.png`
-   **Theme Color**: `#00ffa7`
-   **Viewport**: `width=device-width, initial-scale=1`
-   **Lettertypen**: Google Fonts (`Montserrat`) wordt geladen.
-   **Dark Mode Initialisatie**: Een script is aanwezig om dark mode te initialiseren op basis van `localStorage` om flikkering te voorkomen. Het thema is standaard 'light' tenzij anders ingesteld.
-   **SvelteKit Placeholders**: `%sveltekit.head%` en `%sveltekit.body%` zijn aanwezig waar SvelteKit de gegenereerde head elementen en de body content injecteert.
-   **Preload Data**: `<body data-sveltekit-preload-data="hover">` is ingesteld, wat SvelteKit's data preloading optimaliseert.

## Starten en Bouwen

-   **Ontwikkelserver starten**:
    ```powershell
    npm run dev
    ```
-   **Applicatie bouwen voor productie**:
    ```powershell
    npm run build
    ```
-   **Productie build lokaal previewen**:
    ```powershell
    npm run preview
    ```

## Belangrijke Scripts (zie `package.json` voor meer)

-   **Code formatting**:
    ```powershell
    npm run format
    ```
-   **Code linting**:
    ```powershell
    npm run lint
    ```
-   **Type checking**:
    ```powershell
    npm run check
    ```
-   **Unit tests draaien**:
    ```powershell
    npm run test
    ```

## Aanbevelingen voor Nieuwe Projecten

1.  **Kopieer de basisstructuur**: De mappen `src`, `static`, en de configuratiebestanden (`svelte.config.js`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`, `.prettierrc`, `eslint.config.js`) kunnen een goed startpunt zijn.
2.  **Pas `package.json` aan**: Verander `name`, `version`, en review dependencies. Verwijder onnodige dependencies.
3.  **Review `svelte.config.js`**: Kies de juiste SvelteKit adapter voor je deployment target.
4.  **Pas `src/app.html` aan**: Update taal, meta tags, favicon, en eventueel lettertypen.
5.  **Verwijder specifieke componenten/routes**: Ruim de `src/lib/components` en `src/routes` op en verwijder alles wat specifiek is voor "legalboost-poc".
6.  **Firebase**: Als het nieuwe project geen Firebase gebruikt, verwijder dan `src/lib/firebase` en de `firebase` dependency.
7.  **OpenAI**: Als het nieuwe project geen OpenAI gebruikt, verwijder de `openai` dependency en gerelateerde logica.
8.  **Controleer `.env`**: Zorg voor een `.env.example` of duidelijke instructies voor environment variabelen. 

## Git Aanpassingen bij Hergebruik

Wanneer je dit project als basis voor een volledig nieuw project gebruikt, is het belangrijk om ook de Git configuratie aan te passen:

1.  **Verwijder de oude Git geschiedenis**:
    *   Het gekopieerde project bevat de `.git` map van het originele project. Voor een schone start van je nieuwe project, verwijder je deze map.
    *   **BELANGRIJK**: Voer dit commando alleen uit in de hoofdmap van je **nieuw gekopieerde project** om te voorkomen dat je de geschiedenis van het originele project per ongeluk verwijdert.
    *   Open PowerShell in de hoofdmap van je nieuwe project en voer uit:
        ```powershell
        Remove-Item .git -Recurse -Force
        ```

2.  **Initialiseer een nieuw Git repository**:
    *   Nadat de oude `.git` map verwijderd is, initialiseer je een nieuw, leeg Git repository:
        ```powershell
        git init
        ```

3.  **Maak een initiële commit**:
    *   Voeg alle projectbestanden toe aan de staging area en maak je eerste commit:
        ```powershell
        git add .
        git commit -m "Initial commit van nieuw project gebaseerd op template"
        ```

4.  **Koppel aan een nieuwe remote repository**:
    *   Maak een nieuw (leeg) repository aan op je Git hosting platform (zoals GitHub, GitLab, Bitbucket).
    *   Koppel je lokale repository aan deze nieuwe remote. Vervang `<URL_NAAR_NIEUWE_REMOTE_REPOSITORY>` met de daadwerkelijke URL:
        ```powershell
        git remote add origin <URL_NAAR_NIEUWE_REMOTE_REPOSITORY>
        git push -u origin main  # Of 'master' afhankelijk van je standaard branch naam
        ```

## Overige Project-Specifieke Aanpassingen

Naast de configuratiebestanden en Git-instellingen, zijn hier nog enkele belangrijke "project-unieke" zaken om rekening mee te houden bij het hergebruiken van deze codebase voor een nieuw project:

1.  **Hardgecodeerde Namen en Teksten**:
    *   **Projectnaam/Branding**: Zoek in de codebase (UI componenten, `app.html` voor `<title>`, configuratieobjecten) naar hardgecodeerde vermeldingen van de oude projectnaam of gerelateerde termen (bijv. "legalboost-poc"). Vervang deze door de naam en branding van je nieuwe project.
    *   **Voorbeeldcontent**: Pas voorbeeldteksten, titels of beschrijvingen in UI componenten aan of maak ze generieker.

2.  **Specifieke Logica en Data**:
    *   **Server-side Logica**: Bestanden zoals die in `src/lib/server/prompts/` bevatten waarschijnlijk logica die zeer specifiek is voor het originele project. Verwijder of herschrijf deze volledig voor je nieuwe project.
    *   **Data Objecten/Mocks**: Controleer `src/lib/data/` op specifieke datastructuren of mock data en pas aan indien nodig.
    *   **API Endpoints**: De logica binnen API-routes (bijv. in `src/routes/api/`) is waarschijnlijk toegespitst op het oude project. Pas deze aan of verwijder ze.

3.  **Omgevingsvariabelen (`.env`)**:
    *   Gebruik **altijd nieuwe, unieke API-sleutels en andere secrets** voor je nieuwe project. Kopieer nooit zomaar waarden uit het `.env` bestand van het oude project.

4.  **Documentatie**:
    *   **`README.md` (hoofdmap)**: Werk het `README.md` bestand volledig bij om je nieuwe project te beschrijven (naam, doel, installatie-instructies, etc.).
    *   **Overige `docs/` inhoud**: Controleer of andere documenten in de `docs/` map nog relevant zijn of aangepast moeten worden.

5.  **Testdata en -configuratie**:
    *   Controleer specifieke testdata of mock-objecten in unit- of integratietests op relevantie voor de (aangepaste) functionaliteit van je nieuwe project.

6.  **Statische Assets**:
    *   **Logo's en Afbeeldingen**: Vervang project-specifieke logo's en afbeeldingen in `public/images/`, `src/assets/` (inclusief `public/favicon.png`) door de assets voor je nieuwe project.
    *   **Lettertypen**: Pas eventueel de lettertypeconfiguratie in `src/app.html` en Tailwind CSS aan als je een ander lettertype wenst.

**Tip**: Voer na het kopiëren een globale zoekopdracht uit in je nieuwe project naar de oude projectnaam en andere specifieke termen om alle relevante plekken voor aanpassing te vinden. 