# Technisch Implementatieplan: Supabase SSR Migratie – Dobbie Chatbot

**Doel:** Migreren van de verouderde `@supabase/auth‑helpers‑sveltekit` & `@supabase/auth‑helpers‑shared` naar het nieuwe `@supabase/ssr` pakket, zodat authenticatie future‑proof, beter testbaar en volledig SSR‑compatible is vóór de eerste productie­release.

---

## 1. Projectoverzicht & Status

| Fase                       | Sub‑fase / Deliverable                         | Status    | Verantwoordelijke(n) | Notities                                        |
| :------------------------- | :--------------------------------------------- | :-------- | :------------------- | :---------------------------------------------- |
| **Fase 1 – Setup**         | 1.1 Packages opschonen & installeren           | ⏳ Gepland | Colin                | `npm uninstall …` / `npm install @supabase/ssr` |
|                            | 1.2 `hooks.server.ts` met `createServerClient` | ⏳ Gepland | Colin                | Basis werkt lokaal                              |
| **Fase 2 – Code‑refactor** | 2.1 Layout/session flow                        | ⏳ Gepland | Colin                | `+layout.server.ts`, route‑guards               |
|                            | 2.2 Client‑side auth (login/logout)            | ⏳ Gepland | Colin                | Nieuw helperbestand                             |
| **Fase 3 – Test & Deploy** | 3.1 Unit + e2e tests                           | ⏳ Gepland | Colin                | vitest + playwright                             |
|                            | 3.2 Staging deploy                             | ⏳ Gepland | Colin                | Vercel preview                                  |

---

## 2. Architecturale Principes

Alle ontwikkeling volgt deze kernprincipes:

* **DRY (Don't Repeat Yourself):** hergebruik auth‑helpers in één centrale lib (`src/lib/supabase.ts`).
* **SOC (Separation of Concerns):** scheid server‑side sessiehandling van client‑side UI‑logica.
* **Clean Architecture:** UI ↔ Service‑laag ↔ Supabase API duidelijk gescheiden.
* **Env‑config centraal:** alle Supabase‑keys in `env.*` + `supabaseConfig.ts`.

---

## 3. Development Standaarden

* **TypeScript everywhere** – strikte types voor Supabase responses.
* **Tests in `__tests__`** – nooit in `src/` root.
* **Project‑libs:** gebruik bestaande logging/util libraries (no custom console wrappers).

---

## 4. Teststrategie

* **Handmatige happy‑path verificatie** voor login, logout, protected route.
* **Unit tests** voor util‑functies (session store, cookie helpers).
* **Playwright e2e**: ‑ Succesvolle login flow ‑ 401 redirect wanneer sessie ontbreekt.

---

## Fase 1: SSR‑Setup

**Doel:** Werkende Supabase SSR‑auth in dev‑omgeving.

### **Sub‑fase 1.1: Packages opschonen**

* **Colin Taken:**

  1. **Uninstall legacy:** `npm uninstall @supabase/auth-helpers-*`
  2. **Install:** `npm install @supabase/ssr`
  3. **Bump types:** `@supabase/supabase-js@latest`

### **Sub‑fase 1.2: hooks & env**

* **Colin Taken:**

  1. Maak `src/hooks.server.ts` met `createServerClient()`.
  2. Sla client op in `event.locals.supabase`.
  3. Update `env`‑files (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`).

### **Definition of Done Fase 1**

* `npm run dev` start zonder errors.
* `console.log(session)` toont geldige sessie na login.
* Route `/protected` geeft 401 zonder sessie, 200 met sessie.

---

## Fase 2: Code‑Refactor

**Doel:** Alle pages/components gebruiken nieuwe auth‑flow.

### **Sub‑fase 2.1: Layout & Guards**

* **Taken:**

  1. Verplaats sessie‑fetch naar `+layout.server.ts`.
  2. Maak `src/routes/(auth)/+layout.ts` voor client‑side store.
  3. Update `handle` in `hooks.server.ts` met redirect logic.

### **Sub‑fase 2.2: Client Auth API**

* **Taken:**

  1. Nieuwe helper `src/lib/authClient.ts` met `createBrowserClient()`.
  2. Refactor login/logout components.

### **Definition of Done Fase 2**

* Geen referenties meer naar deprecated helpers in codebase.
* Cypress/Playwright flow slaagt voor login → protected page.
* Vite HMR blijft werken.

---

## Fase 3: Test & Deploy

**Doel:** Kwaliteitsborging en uitrol naar staging/production.

### **Sub‑fase 3.1: Testing**

* **Taken:**

  1. Vitest unit tests ≥ 80% cover voor utils.
  2. Playwright e2e in CI‑pipeline (GitHub Actions).

### **Sub‑fase 3.2: Deployment**

* **Taken:**

  1. Vercel env secrets instellen.
  2. Staging deploy, sanity check.
  3. Production deploy tag `v1.0.0`.

### **Definition of Done Fase 3**

* Alle tests groen in CI.
* Staging draait met geldige sessies.
* Production release zonder regressies binnen 24u.

---

## 5. Codebase Analyse & Concreet Stappenplan

### 5.1 Huidige Situatie (Analyse)
*   **Dependencies**: Het project gebruikt `@supabase/auth-helpers-sveltekit@0.13.0`. `@supabase/ssr` is nog niet geïnstalleerd.
*   **Server-side Client**: `src/hooks.server.ts` maakt de Supabase client aan met `createSupabaseServerClient` uit de verouderde library.
*   **Client-side Client**: `src/routes/+layout.ts` maakt de client-side Supabase instance aan met `createSupabaseLoadClient`.
*   **Data Flow**: `src/routes/+layout.server.ts` haalt de `user` en `session` op en geeft deze door aan de UI.
*   **Impact**: De analyse toont aan dat de bestanden `src/hooks.server.ts` en `src/routes/+layout.ts` direct de verouderde helpers importeren en de kern van de migratie vormen.

### 5.2 Concreet Implementatieplan

**Fase 1: Setup & Dependencies**
1.  **Packages vervangen:**
    ```bash
    npm uninstall @supabase/auth-helpers-sveltekit
    npm install @supabase/ssr @supabase/supabase-js@latest
    ```
2.  **Environment Variabelen:** Controleer of `PUBLIC_SUPABASE_URL` en `PUBLIC_SUPABASE_ANON_KEY` correct zijn ingesteld in de `.env` bestanden.

**Fase 2: Code Refactor**
3.  **`src/hooks.server.ts` aanpassen:**
    *   Vervang de import van `@supabase/auth-helpers-sveltekit` door `@supabase/ssr`.
    *   Implementeer `createServerClient` om de client aan te maken en op te slaan in `event.locals.supabase`.
    *   Voeg de `getSession` helper toe aan `event.locals`.
    *   Implementeer de redirect-logica voor beveiligde routes in de `handle` functie.
4.  **`src/routes/+layout.server.ts` aanpassen:**
    *   Vereenvoudig de `load` functie om enkel de `session` op te halen via `event.locals.getSession()` en deze door te geven.
5.  **`src/routes/+layout.ts` aanpassen:**
    *   Verwijder de `createSupabaseLoadClient` logica.
    *   Importeer `createBrowserClient` van `@supabase/ssr`.
    *   Maak een nieuwe browser-client aan en geef deze, samen met de `session` van de server, door via het `return` statement. De `supabase` instance wordt hierdoor reactief en herbruikbaar in de UI.
6.  **Componenten aanpassen (Login/Logout/etc.):**
    *   Pas alle UI-componenten aan die direct met Supabase communiceren. Deze componenten moeten de `supabase` client nu via de `$page.data` store ontvangen.

**Fase 3: Testen & Verificatie**
7.  **Testen:**
    *   Voer de handmatige en geautomatiseerde tests (Vitest, Playwright) uit zoals gedefinieerd in de teststrategie om de volledige auth-flow (login, logout, route-beveiliging) te valideren.

---

## Bijlagen & Referenties

* Supabase SSR guide (auth docs)
* Commit log migratie‐branch: `feature/supabase-ssr`
* Issue tracker tickets: #123, #124
