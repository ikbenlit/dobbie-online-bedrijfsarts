# Migratieplan: van Shirley Chatbot naar DoBbie - De Online Bedrijfsarts

Dit document beschrijft de gefaseerde aanpak om het bestaande Shirley-chatbot-project om te bouwen naar de chatbot voor DoBbie, de online bedrijfsarts. Dit plan is gebaseerd op de projectdocumentatie in de `docs/` map.

## 📊 Voortgangsoverzicht (bijgewerkt op 15 januari 2025)

| Status | Omschrijving |
|--------|-------------|
| ✅ | Voltooid |
| 🔶 | In uitvoering / Gedeeltelijk voltooid |
| 🔴 | Kritieke issues / Niet gestart |
| ⚪ | Nog niet gestart |

**Huidige status:** Fase 2 - 3 (gedeeltelijk voltooid)

**Kritieke issues die eerst opgelost moeten worden:**
- TypeScript configuratie conflicts (`tsconfig.json`)
- 15 TypeScript errors en 12 warnings
- Accessibility issues (ARIA labels, keyboard events)
- Resterende Shirley-verwijzingen (`avatar_shirley.webp`)

**Volgende prioriteiten:**
1. Los TypeScript configuratie op
2. Fix alle TypeScript errors en warnings
3. Vervang resterende Shirley assets
4. Verbeter accessibility compliance

## Fase 0: Codebase Cleanup & Structuur

- 🔶 **Opschonen van de projectstructuur**
  - ✅ Hernoem mappen en bestanden waar nodig naar DoBbie-conventies.
  - 🔶 Verwijder Shirley-specifieke directories, componenten, stores en helpers. _(avatar_shirley.webp nog aanwezig in AvatarBubble.svelte)_
- 🔴 **TypeScript & Linting**
  - 🔴 Controleer en update `tsconfig.json` en aliassen. _(baseUrl/paths conflict met SvelteKit)_
  - 🔴 Draai `npm run lint` en `npm run check` om legacy code op te sporen en te corrigeren. _(15 errors, 12 warnings)_
  - 🔴 Controleer of alle componentprops, events en stores correct getypeerd zijn. _(displayOrder property missing, Icon component issues)_
- ✅ **SvelteKit Routing & API**
  - ✅ Controleer en update alle routes (`src/routes/`) en API-endpoints (`src/routes/api/`).
  - ✅ Verwijder ongebruikte of verouderde endpoints.
- ✅ **State Management**
  - ✅ Herstructureer en documenteer Svelte stores in `src/lib/stores/`.
  - ✅ Verwijder niet-relevante state en stores.
- ⚪ **Tailwind & Styling**
  - ⚪ Update Tailwind-configuratie (`tailwind.config.js`) en verwijder oude branding of custom utilities.
  - ⚪ Test dark mode (indien van toepassing) en responsiviteit.
- 🔶 **Assets**
  - ✅ Verwijder ongebruikte iconen, fonts en afbeeldingen uit `src/assets/`, `public/` en `static/`.
  - 🔶 Vervang Shirley-specifieke assets. _(avatar_shirley.webp nog in gebruik)_

## Fase 1: Projectvoorbereiding & Basisconfiguratie

- ✅ **Projectnaam en metadata aanpassen**
  - ✅ Hernoem de projectmap en pas `package.json` aan (`name`, `keywords`, etc.) naar DoBbie.
  - ✅ Werk de `README.md` bij met DoBbie-specifieke informatie.
- 🔶 **Verwijder of archiveer Shirley-specifieke code**
  - 🔶 Verwijder componenten, assets en logica die niet relevant zijn voor DoBbie. _(AvatarBubble nog met Shirley avatar)_
- ⚪ **Controleer en update omgevingsvariabelen**
  - ⚪ Pas `.env` aan voor de juiste API keys en endpoints (zie technische eisen voor DoBbie).
- ⚪ **Vervang visuele assets**
  - ⚪ Vervang favicon, logo's en andere branding in `static/` en `public/` door DoBbie-branding.

## Fase 2: DoBbie-specifieke Functionele Aanpassingen

- ✅ **Chatbot prompt en tone-of-voice**
  - ✅ Implementeer DoBbie's professionele, toegankelijke en betrouwbare stijl (zie `04-styleguide-bedrijfsarts.md`).
  - ✅ Pas de system prompt(s) aan voor OpenAI zodat antwoorden altijd in DoBbie's stem zijn.
- 🔶 **Ondersteunde onderwerpen en contentkoppelingen**
  - ✅ Implementeer categorieën voor bedrijfsartsvragen via `chat_category.json`.
  - 🔶 Implementeer verwijzingen naar bedrijfsartsmodules, informatieve pagina's, werkboeken en relevante tools (zie `01-prd-dobbie.md`).
  - ⚪ Voeg relevante links toe aan de trainingsdata.
- ✅ **Privacy en sessiebeheer**
  - ✅ Zorg dat er geen persoonlijke data wordt opgeslagen, alleen sessie-informatie. _(Gesprekken worden niet opgeslagen)_

## Fase 3: UI & Gebruikerservaring

- 🔶 **Aanpassen van de chatinterface**
  - ✅ Implementeer chat componenten (ChatMessage, CategoryChip, QuestionChip).
  - ✅ Implementeer categoriekiezer met voorgedefinieerde vragen.
  - 🔶 Vervang oude Shirley-componenten door DoBbie-varianten waar nodig.
  - ✅ Implementeer duidelijke call-to-actions en doorverwijzingen gericht op bedrijfsgezondheidszorg.
- ✅ **Mobielvriendelijk maken**
  - ✅ Responsive design geïmplementeerd met Tailwind CSS.
  - ✅ Mobile-first approach toegepast.
- 🔴 **Toegankelijkheid**
  - 🔴 Controleer op voldoende contrast, focus states en toetsenbordnavigatie. _(Accessibility warnings in check)_
  - 🔴 Voorzie alle interactieve elementen van aria-labels en duidelijke focus states. _(Missing ARIA labels)_

## Fase 4: Testen & Validatie

- 🔴 **Functioneel testen**
  - 🔴 Test alle flows: inloggen, chatten, doorverwijzen, foutafhandeling. _(TypeScript errors hinderen testing)_
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