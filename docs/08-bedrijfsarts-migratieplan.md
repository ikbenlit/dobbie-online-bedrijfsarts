# Migratieplan: van Shirley Chatbot naar DoBbie - De Online Bedrijfsarts

Dit document beschrijft de gefaseerde aanpak om het bestaande Shirley-chatbot-project om te bouwen naar de chatbot voor DoBbie, de online bedrijfsarts. Dit plan is gebaseerd op de projectdocumentatie in de `docs/` map.

## Fase 0: Codebase Cleanup & Structuur

- ⚪ **Opschonen van de projectstructuur**
  - ⚪ Verwijder Shirley-specifieke directories, componenten, stores en helpers.
  - ⚪ Hernoem mappen en bestanden waar nodig naar DoBbie-conventies.
- ⚪ **TypeScript & Linting**
  - ⚪ Controleer en update `tsconfig.json` en aliassen.
  - ⚪ Draai `npm run lint` en `npm run check` om legacy code op te sporen en te corrigeren.
  - ⚪ Controleer of alle componentprops, events en stores correct getypeerd zijn.
- ⚪ **SvelteKit Routing & API**
  - ⚪ Controleer en update alle routes (`src/routes/`) en API-endpoints (`src/routes/api/`).
  - ⚪ Verwijder ongebruikte of verouderde endpoints.
- ⚪ **State Management**
  - ⚪ Herstructureer en documenteer Svelte stores in `src/lib/stores/`.
  - ⚪ Verwijder niet-relevante state en stores.
- ⚪ **Tailwind & Styling**
  - ⚪ Update Tailwind-configuratie (`tailwind.config.js`) en verwijder oude branding of custom utilities.
  - ⚪ Test dark mode (indien van toepassing) en responsiviteit.
- ⚪ **Assets**
  - ⚪ Verwijder ongebruikte iconen, fonts en afbeeldingen uit `src/assets/`, `public/` en `static/`.

## Fase 1: Projectvoorbereiding & Basisconfiguratie

- ⚪ **Projectnaam en metadata aanpassen**
  - ⚪ Hernoem de projectmap en pas `package.json` aan (`name`, `keywords`, etc.) naar DoBbie.
  - ⚪ Werk de `README.md` bij met DoBbie-specifieke informatie.
- ⚪ **Verwijder of archiveer Shirley-specifieke code**
  - ⚪ Verwijder componenten, assets en logica die niet relevant zijn voor DoBbie.
- ⚪ **Controleer en update omgevingsvariabelen**
  - ⚪ Pas `.env` aan voor de juiste API keys en endpoints (zie technische eisen voor DoBbie).
- ⚪ **Vervang visuele assets**
  - ⚪ Vervang favicon, logo's en andere branding in `static/` en `public/` door DoBbie-branding.

## Fase 2: DoBbie-specifieke Functionele Aanpassingen

- ⚪ **Chatbot prompt en tone-of-voice**
  - ⚪ Implementeer DoBbie's professionele, toegankelijke en betrouwbare stijl (zie `03-dobbie-bot-styleguide.md`).
  - ⚪ Pas de system prompt(s) aan voor OpenAI zodat antwoorden altijd in DoBbie's stem zijn.
- ⚪ **Ondersteunde onderwerpen en contentkoppelingen**
  - ⚪ Implementeer verwijzingen naar bedrijfsartsmodules, informatieve pagina's, werkboeken en relevante tools (zie `00-dobbie-prd.md`).
  - ⚪ Voeg relevante links toe aan de trainingsdata.
- ✅ **Privacy en sessiebeheer**
  - ✅ Zorg dat er geen persoonlijke data wordt opgeslagen, alleen sessie-informatie. _(Gesprekken worden niet opgeslagen)_

## Fase 3: UI & Gebruikerservaring

- ⚪ **Aanpassen van de chatinterface**
  - ⚪ Pas componenten aan voor de doelgroep van DoBbie en de nieuwe huisstijl.
    - ⚪ Vervang oude Shirley-componenten door DoBbie-varianten waar nodig.
    - ⚪ Implementeer duidelijke call-to-actions en doorverwijzingen gericht op bedrijfsgezondheidszorg.
- ⚪ **Mobielvriendelijk maken**
  - ⚪ Optimaliseer voor mobiel gebruik (zie technische eisen).
- ⚪ **Toegankelijkheid**
  - ⚪ Controleer op voldoende contrast, focus states en toetsenbordnavigatie.
  - ⚪ Voorzie alle interactieve elementen van aria-labels en duidelijke focus states.

## Fase 4: Testen & Validatie

- ⚪ **Functioneel testen**
  - ⚪ Test alle flows: inloggen, chatten, doorverwijzen, foutafhandeling.
- ⚪ **Gebruikerstesten**
  - ⚪ Laat een aantal gebruikers uit de doelgroep testen en verzamel feedback.
- ⚪ **Performance & Web Vitals**
  - ⚪ Optimaliseer voor laadtijd, responsiveness en toegankelijkheid.
  - ⚪ Voer een Lighthouse-audit uit voor Web Vitals en toegankelijkheid.

## Fase 5: Lancering & Doorontwikkeling

- ⚪ **Documentatie bijwerken**
  - ⚪ Werk alle relevante documentatie bij in de `docs/` map.
  - ⚪ Actualiseer inline code comments en JSDoc/TypeDoc waar nodig.
  - ⚪ Vervang alle verwijzingen naar Shirley door DoBbie.
- ⚪ **Deployment & CI/CD**
  - ⚪ Controleer of de deployment pipeline geen Shirley-specifieke scripts bevat.
  - ⚪ Update deployment-instructies in de README.
- ⚪ **Vervolgstappen voorbereiden**
  - ⚪ Zie de roadmap in `00-dobbie-prd.md` voor toekomstige features (contextbewustzijn, profiel, notificaties, dashboard).

---

> Raadpleeg altijd de meest recente projectdocumentatie in de `docs/` map voor details over requirements, stijl en technische eisen van DoBbie. 