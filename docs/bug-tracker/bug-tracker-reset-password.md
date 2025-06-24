# Bug Tracker: Supabase Wachtwoord Reset Probleem

## Sessie Log: Analyse en Oplossingsstrategie

**Datum:** 2025-06-20

### 1. Probleemanalyse

**Huidige status:** Een gebruiker die op de wachtwoord-reset link in de e-mail klikt, wordt naar de applicatie geleid maar krijgt een **HTTP 500 Interne Server Fout**.

**Observaties:**
-   De `reset-password/+page.svelte` pagina bevat client-side logica (`onMount`) om een `access_token` uit de URL-hash (`#`) te lezen en een `PASSWORD_RECOVERY` event af te wachten.
-   Een 500-fout is een **server-side** fout. Dit duidt erop dat er iets misgaat op de server *voordat* de client-side code op de reset-pagina kan worden uitgevoerd.
-   De `git status` toont nieuwe bestanden zoals `src/hooks.server.ts` en `src/routes/+layout.server.ts`. Deze bestanden zijn de meest waarschijnlijke oorzaak van een serverfout, omdat ze bij elke request (of voor elke pagina in een layout) worden uitgevoerd.
-   Het bestand `src/routes/reset-password/+page.svelte` is inconsistent en bevat twee compleet verschillende HTML-structuren en bijbehorende (deels conflicterende) script-logica. Dit duidt op onvoltooide refactoring en is een bron van fouten.

---

### 2. Hypotheses en Oplossingsrichtingen

**Update na diepere analyse (26-07-2024):** De initiële analyse van `hooks.server.ts` en `+layout.server.ts` was correct (deze bestanden zijn in orde), maar we hebben een cruciale vinding gedaan: de aanwezigheid van een API-route op `src/routes/api/auth/reset-password/+server.ts`. Dit leidt tot een nieuwe, veel nauwkeurigere hypothese.

---

#### **Hypothese 1 (Herzien): Twee Concurrerende Reset-Architecturen**

-   **Probleem:** De codebase bevat **twee** verschillende, en met elkaar conflicterende, implementaties voor de wachtwoord-reset-flow. Dit is de kern van het probleem en veroorzaakt onvoorspelbaar gedrag.

    1.  **Architectuur A (Event-Driven - De SvelteKit/Supabase Standaard):**
        -   **Hoe het werkt:** De SvelteKit Auth Helpers (`createSupabaseServerClient`) zijn geïnstalleerd. De `reset-password/+page.svelte` luistert (of zou moeten luisteren) naar het `onAuthStateChange` event. Wanneer de gebruiker de pagina bezoekt met een geldige `#access_token`, detecteert de Supabase client dit, valideert het, en zendt een `PASSWORD_RECOVERY` event uit. De frontend vangt dit op, toont het formulier, en roept `supabase.auth.updateUser()` direct vanuit de client-side code aan.
        -   **Status:** Dit is de moderne, aanbevolen aanpak die goed integreert met SvelteKit's lifecycle. Delen hiervan zijn aanwezig in `reset-password/+page.svelte`, maar de implementatie is rommelig.

    2.  **Architectuur B (API-Driven - Handmatig):**
        -   **Hoe het werkt:** De `reset-password/+page.svelte` pagina leest de `access_token` uit de URL-hash. Vervolgens stuurt het een `POST` request met dit token en het nieuwe wachtwoord naar het custom API endpoint `api/auth/reset-password`. Dit endpoint probeert dan *handmatig* de sessie in te stellen (`supabase.auth.setSession`) en het wachtwoord bij te werken.
        -   **Status:** Deze architectuur is onnodig complex en conflicteert met de Auth Helpers, die sessiebeheer via cookies automatiseren. Het handmatig instellen van de sessie in een API-route terwijl de Auth Helpers hetzelfde proberen te doen via de `onAuthStateChange` listener is een recept voor mislukking.

-   **Oorzaak van de 500-fout (Waarschijnlijk):** Hoewel de directe oorzaak van de 500-fout bij een `GET`-request nog steeds niet 100% is vastgesteld (omdat de API-route een `POST` verwacht), is de meest logische verklaring dat de verwarde code in `reset-password/+page.svelte` op een onverwacht moment (bijv. tijdens server-side rendering of direct in `onMount`) een `fetch` probeert uit te voeren naar de API-route, die vervolgens faalt. **De fundamentele architecturale chaos is het werkelijke probleem dat opgelost moet worden.**

-   **Oplossingsrichting:**
    -   **Kies één architectuur.** De duidelijke keuze is **Architectuur A (Event-Driven)**, omdat deze aansluit bij de geïnstalleerde SvelteKit Auth Helpers en de best practice is.
    -   **Verwijder de overbodige architectuur.** Dit betekent het volledig verwijderen van de `src/routes/api/auth/reset-password` map en het opschonen van alle `fetch` calls naar dit endpoint vanuit de Svelte componenten.

---

### 3. Gedetailleerd Actieplan

#### Statusoverzicht

| Taak                                       | Prioriteit | Status    |
| ------------------------------------------ | ---------- | --------- |
| Verwijder de API-gebaseerde flow           | 1 (Hoog)   | ✅ Done   |
| Refactor `reset-password/+page.svelte`     | 2 (Medium) | ✅ Done   |
| Centraliseer de Auth State                 | 3 (Laag)   | ✅ Done   |

---

Hieronder volgt een gedetailleerde evaluatie en een concreet actieplan voor de drie voorgestelde stappen.

#### **Prioriteit 1: Verwijder de API-gebaseerde flow**

-   **Doel:** De conflicterende en overbodige API-route (`/api/auth/reset-password`) volledig uit het project verwijderen.

-   **Evaluatie & Belang:**
    -   **Waarom is dit stap 1?** Dit is de belangrijkste en meest dringende stap. De aanwezigheid van deze API-route creëert een architectonisch conflict. Je hebt twee systemen die hetzelfde proberen te doen (het wachtwoord resetten) op verschillende manieren, wat leidt tot onvoorspelbaar gedrag en fouten zoals de 500-error.
    -   **Wat lost het op?** Door deze route te verwijderen, elimineer je de "handmatige" architectuur volledig. Dit ruimt de codebase drastisch op en zorgt ervoor dat er nog maar één, duidelijke en voorspelbare manier is waarop de applicatie met een wachtwoord-reset omgaat. Het is als het verwijderen van een overbodige, roestige motor uit een auto voordat je de juiste motor probeert te repareren.

-   **Concrete Stappen:**
    1.  **Verwijder de map:** Zoek en verwijder de volledige map `src/routes/api/auth/reset-password`.
    2.  **Controleer op `fetch` calls:** Zoek in het project (vooral in `src/routes/reset-password/+page.svelte`) naar code die `fetch` gebruikt om naar `/api/auth/reset-password` te posten. Deze regels code zijn nu overbodig en moeten ook worden verwijderd.

---

#### **Prioriteit 2: Refactor `reset-password/+page.svelte`**

-   **Doel:** De `reset-password` pagina ombouwen tot een schone, client-side component die alleen reageert op de standaard Supabase `onAuthStateChange` events.

-   **Evaluatie & Belang:**
    -   **Waarom is dit stap 2?** Nadat je de conflicterende backend-logica hebt verwijderd, is het tijd om de frontend te repareren. Dit is de kern van de functionele oplossing.
    -   **Wat lost het op?** De huidige pagina is een rommeltje van twee verschillende implementaties. Deze stap vervangt die chaos door een enkele, coherente flow die stabiel en betrouwbaar is. Het lost de race-condities op (waar de `setTimeout` een pleister op was) door te wachten op het officiële signaal van Supabase (`PASSWORD_RECOVERY`).

-   **Concrete Stappen:**
    1.  **Schoonmaak:** Open `src/routes/reset-password/+page.svelte`. Verwijder de *gehele* inhoud van het `<script>`-blok en alle dubbele HTML. Begin met een schone lei.
    2.  **Nieuwe Script Logica:** Implementeer `onMount` om te luisteren naar het `onAuthStateChange` event.
        ```svelte
        <script lang="ts">
          // ... imports
          let authSubscription: any;

          onMount(() => {
            // De Supabase client handelt de URL-hash zelf af. We hoeven alleen te luisteren.
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
              if (event === 'PASSWORD_RECOVERY') {
                console.log('✅ Supabase heeft de link gevalideerd en de recovery-modus geactiveerd.');
                showPasswordForm = true;
                loading = false;
              }
            });
            
            authSubscription = subscription;

            // Een fallback voor het geval de link ongeldig is en er nooit een event komt.
            setTimeout(() => {
              if (loading) {
                error = 'De reset-link is ongeldig of verlopen. Vraag een nieuwe aan.';
                loading = false;
              }
            }, 5000);
          });

          onDestroy(() => {
            // Ruim de listener op als de gebruiker de pagina verlaat
            authSubscription?.unsubscribe();
          });
        </script>
        ```
    3.  **Wachtwoord Updaten Functie:** Maak een `async function handlePasswordUpdate()` die direct `supabase.auth.updateUser({ password: newPassword });` aanroept.
    4.  **HTML Structuur:** Bouw de HTML opnieuw op met een enkele, consistente layout en gebruik `{#if loading}`... `{:else if error}`... `{:else if showPasswordForm}` om de verschillende staten te tonen.

---

#### **Prioriteit 3: Centraliseer de Auth State**

-   **Doel:** De `onAuthStateChange` listener verplaatsen naar de root layout (`+layout.svelte`) om een enkele, betrouwbare bron van waarheid te creëren voor de inlogstatus van de gebruiker.

-   **Evaluatie & Belang:**
    -   **Waarom is dit stap 3?** Dit is geen directe fix voor de bug, maar een cruciale *verbetering* voor de robuustheid van de hele applicatie. Het is een best practice.
    -   **Wat lost het op?** Het voorkomt dat je op meerdere plekken listeners moet implementeren. Het zorgt ervoor dat de hele applicatie onmiddellijk reageert wanneer een gebruiker inlogt of uitlogt, wat de gebruikerservaring consistenter maakt.

-   **Concrete Stappen:**
    1.  **Open `src/routes/+layout.svelte`**.
    2.  **Voeg de listener toe:**
        ```svelte
        <script lang="ts">
          import { onMount } from 'svelte';
          import { supabase } from '$lib/supabase/client';
          import { invalidateAll } from '$app/navigation';
          import { userStore } from '$lib/stores/userStore'; // Aangenomen dat je een user store hebt

          onMount(() => {
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
              if (session?.expires_at !== data.session?.expires_at) {
                // Dwing SvelteKit om server-data opnieuw te halen als de sessie verandert.
                invalidateAll();
              }
              // Update een centrale store zodat alle componenten de nieuwe status weten.
              userStore.set(session?.user ?? null); 
            });

            return () => subscription.unsubscribe();
          });
        </script>

        <slot />
        ```
    3.  **`invalidateAll()` is cruciaal:** Deze functie zorgt ervoor dat SvelteKit de `load`-functie in `+layout.server.ts` opnieuw uitvoert na een login/logout, waardoor de sessie overal in de app correct wordt bijgewerkt.

---

### 4. Definitieve Oplossing en Resultaat

Na het uitvoeren van het actieplan werd de initiële 500-fout opgelost. Dit onthulde echter een dieperliggend probleem met de e-mail-link-methode. Hieronder volgt een samenvatting van de volledige oplossing.

#### Fase 1: Oplossen van het Architecturale Conflict

-   **Actie:** Zoals beschreven in het actieplan, is de conflicterende API-route (`/api/auth/reset-password`) verwijderd en is de `reset-password/+page.svelte` pagina volledig omgebouwd om te werken met de standaard Supabase `onAuthStateChange` event listener.
-   **Resultaat:** De 500 Internal Server Error was hiermee verholpen. De applicatie crashte niet meer bij het bezoeken van de reset-link.

#### Fase 2: Identificatie en Oplossing van "Invalid Link" Fout

-   **Nieuw Probleem:** Na de fix kregen gebruikers een `Email link is invalid or has expired` foutmelding.
-   **Analyse:** Dit is een bekend probleem in de industrie. Agressieve e-mail security scanners (zoals die van Microsoft 365) "klikken" preventief op links in e-mails om te controleren op malware. Hierdoor wordt de eenmalig te gebruiken reset-token verbruikt voordat de gebruiker de kans krijgt om erop te klikken.
-   **Strategische Keuze:** De meest robuuste oplossing is om af te stappen van de "magic link" en over te stappen op een **One-Time Password (OTP)** flow.

#### Fase 3: Implementatie van de OTP Flow

1.  **Backend Aanpassing (Supabase Template):** De Supabase e-mailtemplate voor wachtwoordherstel werd aangepast om een 6-cijferige code (`{{ .Token }}`) te tonen in plaats van een link.
2.  **Frontend Aanpassing (`forgot-password`):** De pagina werd aangepast om de gebruiker te informeren dat ze een code per e-mail zullen ontvangen.
3.  **Frontend Aanpassing (`reset-password`):** Deze pagina werd volledig herbouwd om een twee-staps proces te ondersteunen:
    -   **Stap 1: Verificatie:** De gebruiker voert zijn e-mailadres en de ontvangen OTP-code in. De code wordt geverifieerd met `supabase.auth.verifyOtp()`.
    -   **Stap 2: Nieuw Wachtwoord:** Na succesvolle verificatie wordt de gebruiker doorgestuurd (of de UI wordt bijgewerkt) om een nieuw wachtwoord in te stellen met `supabase.auth.updateUser()`.

#### Fase 4: Stabilisatie en UI Bugfixes

-   **Probleem:** Tijdens de implementatie crashte de applicatie-layout en bleven knoppen in een "loading" state hangen.
-   **Oplossing:**
    -   De `onAuthStateChange` listener in `src/routes/+layout.svelte` werd gecorrigeerd en gestabiliseerd om de auth-state betrouwbaar te beheren.
    -   De `isLoading` vlaggen in de `handlePasswordUpdate` en `handleLogin` functies werden correct teruggezet naar `false` na een succesvolle operatie.

**Eindresultaat:** De wachtwoord-reset-flow is nu volledig functioneel, veilig en gebruiksvriendelijk. Het systeem is immuun voor het "verbruikte link" probleem en biedt een soepele ervaring die consistent is met de rest van de applicatie.
