# Supabase Password Reset Fix - DoBie Project

Onderstaande implementatie heeft niet geholpen! 

## 🎯 Probleem Samenvatting

**Hoofdissue:** Gebruikers krijgen "Ongeldige of verlopen reset link" foutmelding, ook bij geldige en recente reset links.

**Root Cause:** Timing probleem - onze code checkt te vroeg of Supabase een geldige sessie heeft na URL fragment processing.

---

## 📋 Implementatieplan --> plan is uitgevoerd, maar had niet gewenste resultaat.

### **FASE 1: URL Fragment & Auth Event Handling** --> plan is uitgevoerd, maar had niet gewenste resultaat.
*Prioriteit: HOOG - Kritiek voor werkende password reset*

| Stap | Actie | Tijdsinvestering | Status |
|------|-------|------------------|---------|
| 1.1 | Auth event listener implementeren voor PASSWORD_RECOVERY | 45 min | ⚪ |
| 1.2 | URL hash parameter validatie toevoegen | 30 min | ⚪ |
| 1.3 | Loading states en timing verbeteringen | 30 min | ⚪ |
| 1.4 | Fallback mechanisme (5-sec timeout) | 15 min | ⚪ |

### **FASE 2: Error Handling & UX** --> plan is uitgevoerd, maar had niet gewenste resultaat.
*Prioriteit: MEDIUM - Voor betere gebruikerservaring*

| Stap | Actie | Tijdsinvestering | Status |
|------|-------|------------------|---------|
| 2.1 | Specifieke foutmeldingen per scenario | 30 min | ⚪ |
| 2.2 | Loading indicator tijdens validatie | 15 min | ⚪ |
| 2.3 | Debug logging voor troubleshooting | 15 min | ⚪ |
 
### **FASE 3: Configuratie Check**--> plan is uitgevoerd, maar had niet gewenste resultaat.
*Prioriteit: MEDIUM - Preventief voor production issues*

| Stap | Actie | Tijdsinvestering | Status |
|------|-------|------------------|---------|
| 3.1 | Supabase redirect URL configuratie valideren | 15 min | ⚪ |
| 3.2 | Development vs Production URL handling | 15 min | ⚪ |

**Totale tijdsinvestering: ~3 uur**

---

## 🔧 Code Implementatie --> plan is uitgevoerd, maar had niet gewenste resultaat.

### **1. Reset Password Pagina Update**

**File:** `src/routes/reset-password/+page.svelte`

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase/client';
  
  // State management
  let loading = true;
  let error = '';
  let showPasswordForm = false;
  let newPassword = '';
  let confirmPassword = '';
  let updating = false;
  
  // Auth subscription voor cleanup
  let authSubscription: any;

  onMount(async () => {
    console.log('🔐 Starting password reset validation...');
    
    // 1. Valideer URL fragments
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    const accessToken = hashParams.get('access_token');
    
    console.log('URL params:', { type, hasToken: !!accessToken });
    
    if (type !== 'recovery' || !accessToken) {
      error = 'Ongeldige reset link. Vraag een nieuwe aan.';
      loading = false;
      return;
    }

    // 2. Luister naar auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔥 Auth event:', event, !!session);
      
      if (event === 'PASSWORD_RECOVERY' && session) {
        console.log('✅ Password recovery session confirmed');
        showPasswordForm = true;
        loading = false;
      } else if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in after recovery');
        showPasswordForm = true;
        loading = false;
      }
    });
    
    authSubscription = subscription;

    // 3. Fallback na 5 seconden
    setTimeout(async () => {
      if (loading) {
        console.log('⏰ Fallback check after timeout...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('✅ Session found in fallback');
          showPasswordForm = true;
        } else {
          console.log('❌ No session in fallback');
          error = 'Reset link is verlopen of al gebruikt. Vraag een nieuwe aan.';
        }
        loading = false;
      }
    }, 5000);
  });

  onDestroy(() => {
    authSubscription?.unsubscribe();
  });

  async function handlePasswordUpdate() {
    if (newPassword !== confirmPassword) {
      error = 'Wachtwoorden komen niet overeen';
      return;
    }
    
    if (newPassword.length < 8) {
      error = 'Wachtwoord moet minimaal 8 karakters lang zijn';
      return;
    }

    updating = true;
    error = '';

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      console.error('Password update error:', updateError);
      error = 'Er ging iets mis bij het bijwerken van je wachtwoord. Probeer opnieuw.';
      updating = false;
    } else {
      console.log('✅ Password updated successfully');
      // Redirect naar chat of login
      goto('/chat');
    }
  }
</script>

<!-- Loading state -->
{#if loading}
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Valideer reset link...</p>
    </div>
  </div>

<!-- Error state -->
{:else if error && !showPasswordForm}
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-6">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.694-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Reset link probleem</h3>
        <p class="text-sm text-gray-500 mb-4">{error}</p>
        <button 
          on:click={() => goto('/forgot-password')}
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Nieuwe reset link aanvragen
        </button>
      </div>
    </div>
  </div>

<!-- Password form -->
{:else if showPasswordForm}
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-center text-gray-900 mb-6">Nieuw wachtwoord instellen</h2>
      
      {#if error}
        <div class="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p class="text-sm text-red-600">{error}</p>
        </div>
      {/if}

      <form on:submit|preventDefault={handlePasswordUpdate} class="space-y-4">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Nieuw wachtwoord
          </label>
          <input
            id="password"
            type="password"
            bind:value={newPassword}
            required
            minlength="8"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Minimaal 8 karakters"
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
            Bevestig wachtwoord
          </label>
          <input
            id="confirmPassword"
            type="password"
            bind:value={confirmPassword}
            required
            minlength="8"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Herhaal je nieuwe wachtwoord"
          />
        </div>

        <button
          type="submit"
          disabled={updating || !newPassword || !confirmPassword}
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {updating ? 'Bijwerken...' : 'Wachtwoord bijwerken'}
        </button>
      </form>
    </div>
  </div>
{/if}
```

### **2. Forgot Password Form Update**

**File:** `src/routes/forgot-password/+page.svelte`

```svelte
<script lang="ts">
  import { supabase } from '$lib/supabase/client';
  import { browser } from '$app/environment';
  
  let email = '';
  let loading = false;
  let message = '';
  let error = '';

  async function handleForgotPassword() {
    if (!email) {
      error = 'Vul je emailadres in';
      return;
    }

    loading = true;
    error = '';
    message = '';

    // Dynamische redirect URL voor dev/prod
    const redirectTo = browser 
      ? `${window.location.origin}/reset-password`
      : 'https://deonlinebedrijfsarts.nl/reset-password';

    console.log('Sending reset email with redirect:', redirectTo);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo
    });

    loading = false;

    if (resetError) {
      console.error('Reset password error:', resetError);
      error = 'Er ging iets mis. Controleer je emailadres en probeer opnieuw.';
    } else {
      message = `Een reset link is verstuurd naar ${email}. Controleer je inbox.`;
      email = ''; // Clear form
    }
  }
</script>

<!-- Rest van je forgot password form hier... -->
```

### **3. Supabase Dashboard Configuratie**

**Ga naar:** Supabase Dashboard → Authentication → URL Configuration

**Voeg toe aan Redirect URLs:**
```
http://localhost:5173/reset-password
https://deonlinebedrijfsarts.nl/reset-password
```

---

## ✅ Testing Checklist

### **Manual Testing:**
- [ ] Reset email aanvragen werkt
- [ ] Email wordt ontvangen met juiste link
- [ ] Link opent reset pagina zonder error
- [ ] Nieuw wachtwoord instellen werkt
- [ ] Redirect naar chat/dashboard werkt
- [ ] Error handling bij ongeldige links

### **Edge Cases:**
- [ ] Link openen in incognito/andere browser
- [ ] Link meerdere keren gebruiken
- [ ] Expired link (na 24 uur)
- [ ] Link zonder parameters
- [ ] Netwerk problemen tijdens reset

---

## 🚀 Deployment Notes

**Voor Production:**
1. Update redirect URLs in Supabase dashboard
2. Test met echte emails (niet test accounts)
3. Verificeer SSL certificaat voor email links
4. Monitor auth event logs voor issues

**Quick Win:**
Start met Fase 1 - dat lost 90% van de reset problemen op. Fase 2 en 3 zijn nice-to-have verbeteringen.

---

*Dit plan geeft je een robuuste password reset flow die rekening houdt met Supabase's specifieke timing en event handlin