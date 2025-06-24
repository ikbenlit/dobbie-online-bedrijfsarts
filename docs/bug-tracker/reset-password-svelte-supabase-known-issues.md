Hier is een samenvatting van de tips en oplossingen voor het probleem met de verlopen wachtwoordresetlink in een Svelte-project met Supabase, geschreven in Markdown-formaat:
markdown

# Problemen met verlopen wachtwoordresetlink in Svelte met Supabase

Dit document beschrijft veelvoorkomende oorzaken en oplossingen voor het probleem waarbij de wachtwoordresetlink van Supabase direct als "expired" wordt gemarkeerd in een Svelte- of SvelteKit-project.

## Mogelijke oorzaken en oplossingen

### 1. E-mailclients openen links automatisch
Sommige e-mailclients (zoals Outlook of Gmail) openen links automatisch voor beveiligingsscans, waardoor eenmalige Supabase-links ongeldig worden.

**Oplossingen**:
- **Gebruik OTP**: Stel een One-Time Password (OTP) in plaats van een link in via Supabase Dashboard > Authentication > Email Templates. Zie [Supabase Docs - Passwordless Auth](https://supabase.com/docs/guides/auth/auth-email-passwordless).
- **Pas e-mailtemplate aan**: Voeg een knop toe die naar een door jou gecontroleerde redirect-pagina leidt, in plaats van een directe resetlink.
- **Schakel linktracking uit**: Als je een externe SMTP-service gebruikt (bijv. SendGrid), schakel linktracking uit om wijzigingen aan de link te voorkomen.

### 2. Onjuiste redirect-URL-configuratie
De `redirectTo`-URL in `supabase.auth.resetPasswordForEmail` komt niet overeen met de URLs in Supabase Dashboard > Authentication > Redirect Configuration.

**Oplossingen**:
- Controleer of de `redirectTo`-URL (bijv. `http://localhost:5173/reset-password`) exact overeenkomt met de ingestelde URLs in Supabase.
- Voorbeeldcode:
  ```javascript
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://jouw-app.com/reset-password',
  });

Test de link handmatig om te controleren of deze #access_token en type=recovery bevat.

3. Problemen met PASSWORD_RECOVERY-gebeurtenis
De PASSWORD_RECOVERY-gebeurtenis wordt niet correct afgehandeld, waardoor de resetflow mislukt.
Oplossingen:
Implementeer een onAuthStateChange-listener in een centrale component (bijv. +layout.svelte):
svelte

<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';

  onMount(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        goto('/reset-password');
      }
    });
    return () => subscription.unsubscribe();
  });
</script>

Gebruik supabase.auth.updateUser({ password: newPassword }) om het nieuwe wachtwoord in te stellen.

4. SvelteKit en URL-fragmenten
Supabase-links bevatten URL-fragmenten zoals #access_token, die SvelteKit standaard niet goed verwerkt.
Oplossingen:
Lees URL-fragmenten client-side uit:
javascript

if (window.location.hash) {
  const params = new URLSearchParams(window.location.hash.substring(1));
  if (params.get('type') === 'recovery') {
    // Handel resetflow af
  }
}

Gebruik @supabase/auth-helpers-sveltekit voor automatische verwerking van fragmenten. Zie Supabase SvelteKit Docs.

5. Token-expiratie of serverconfiguratie
De link lijkt direct ongeldig door een te korte JWT-expiratie of een serverklok die niet synchroon is.
Oplossingen:
Controleer "JWT Expiry Limit" en "Mailer OTP Expiration" in Supabase Dashboard > Authentication > Settings. Stel in op bijv. 3600 seconden (1 uur).

Update naar de nieuwste versie van @supabase/supabase-js:
bash

npm update @supabase/supabase-js

Test lokaal met Supabase CLI en Inbucket om de link te inspecteren.

6. Enterprise e-mailsystemen
Enterprise-e-mails (bijv. @nhs.net) kunnen links ongeldig maken door beveiligingsscans.
Oplossingen:
Gebruik OTP’s in plaats van links (zie punt 1).

Werk met de IT-afdeling om Supabase-links op een whitelist te zetten.

Debuggen
Controleer e-mailinhoud: Inspecteer de URL in de reset-e-mail op #access_token en type=recovery. Test in een incognitovenster.

Log auth-gebeurtenissen: Voeg console.log toe aan onAuthStateChange om te zien of PASSWORD_RECOVERY wordt getriggerd.

Test met eenvoudige e-mailprovider: Gebruik Gmail of Hotmail om client-specifieke problemen uit te sluiten.

Controleer Supabase-logs: Bekijk Authentication > Logs in de Supabase-dashboard voor foutmeldingen.

Gebruik Supabase CLI: Start een lokale omgeving met supabase start en gebruik Inbucket om e-mails te testen.

Voorbeeldimplementatie in SvelteKit
1. Forgot Password-pagina (/forgot-password/+page.svelte)
svelte

<script lang="ts">
  import { enhance } from '$app/forms';
  let email = '';
  let message = '';
  let error = '';
</script>

<form method="POST" action="?/forgot_password" use:enhance>
  <label>Email: <input type="email" name="email" bind:value={email} required /></label>
  {#if error}<p class="error">{error}</p>{/if}
  {#if message}<p class="success">{message}</p>{/if}
  <button type="submit">Verstuur resetlink</button>
</form>

<style>
  .error { color: red; }
  .success { color: green; }
</style>

2. Actie voor Forgot Password (/forgot-password/+page.server.ts)
typescript

import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { supabase } from '$lib/supabaseClient';

export const actions: Actions = {
  forgot_password: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email')?.toString();
    if (!email) return fail(400, { error: 'E-mail is verplicht' });
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/reset-password',
    });
    if (error) return fail(500, { error: error.message });
    return { message: 'Controleer je e-mail voor de resetlink' };
  },
};

3. Reset Password-pagina (/reset-password/+page.svelte)
svelte

<script lang="ts">
  import { enhance } from '$app/forms';
  import { supabase } from '$lib/supabaseClient';
  let newPassword = '';
  let error = '';
  let success = '';

  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) error = 'Ongeldige of verlopen resetlink';
  }
  checkSession();
</script>

{#if error}
  <p class="error">{error}</p>
{:else}
  <form method="POST" action="?/reset_password" use:enhance>
    <label>Nieuw wachtwoord: <input type="password" name="password" bind:value={newPassword} required /></label>
    {#if success}<p class="success">{success}</p>{/if}
    <button type="submit">Wachtwoord wijzigen</button>
  </form>
{/if}

<style>
  .error { color: red; }
  .success { color: green; }
</style>

4. Actie voor Reset Password (/reset-password/+page.server.ts)
typescript

import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { supabase } from '$lib/supabaseClient';

export const actions: Actions = {
  reset_password: async ({ request }) => {
    const data = await request.formData();
    const password = data.get('password')?.toString();
    if (!password) return fail(400, { error: 'Wachtwoord is verplicht' });
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return fail(500, { error: error.message });
    throw redirect(303, '/login');
  },
};

5. Auth-listener (+layout.svelte)
svelte

<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';

  onMount(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, session);
      if (event === 'PASSWORD_RECOVERY' && session) {
        goto('/reset-password');
      }
    });
    return () => subscription.unsubscribe();
  });
</script>

<slot />

Extra tips
Test lokaal: Gebruik supabase start en Inbucket om e-mails te testen zonder externe SMTP.

Documentatie: Zie Supabase SvelteKit Docs.

Community: Stel vragen op Supabase GitHub Discussions of de Supabase Discord-server.

Verdere hulp
Als het probleem aanhoudt, deel de exacte foutmelding of relevante code. Controleer ook de Supabase-logs en test met verschillende e-mailproviders om client-specifieke problemen uit te sluiten.

