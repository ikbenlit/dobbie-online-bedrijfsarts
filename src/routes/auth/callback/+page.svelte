<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabase/client';
  import { updateAuthState } from '$lib/stores/userStore';
  import { toast } from 'svelte-sonner';

  let isLoading = true;
  let error = '';
  let success = false;

  onMount(async () => {
    try {
      // Get the code, token and type from URL parameters
      const code = $page.url.searchParams.get('code');
      const token = $page.url.searchParams.get('token');
      const type = $page.url.searchParams.get('type');
      
      if (!code && !token) {
        throw new Error('Geen bevestigingscode of token gevonden in de URL.');
      }

      let data, error;

      if (token && type) {
        // Handle token-based verification (email confirmation)
        console.log('Processing token-based verification:', { token: token.substring(0, 10) + '...', type });
        
        const result = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type as any
        });
        
        data = result.data;
        error = result.error;
      } else if (code) {
        // Handle code-based verification (PKCE flow)
        console.log('Processing code-based verification:', { code: code.substring(0, 10) + '...', type });
        
        const result = await supabase.auth.exchangeCodeForSession(code);
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error('Code exchange error:', error);
        throw new Error('Ongeldige of verlopen bevestigingslink.');
      }

      if (!data || !data.session) {
        throw new Error('Geen sessie ontvangen na bevestiging.');
      }

      console.log('Email confirmation successful, user:', data.session.user.email);

      // Update auth state
      updateAuthState(data.session);

      success = true;
      
      // Show success message
      toast.success('E-mailadres succesvol bevestigd! Je wordt doorgestuurd...');

      // Redirect to chat after successful confirmation
      setTimeout(() => {
        goto('/chat');
      }, 2000);

    } catch (err: any) {
      console.error('Auth callback error:', err);
      error = err.message || 'Er is een fout opgetreden bij het bevestigen van je e-mailadres.';
    } finally {
      isLoading = false;
    }
  });
</script>

<svelte:head>
  <title>DOBbie - E-mail Bevestiging</title>
  <meta name="description" content="Bevestig je e-mailadres voor DOBbie De Online Bedrijfsarts." />
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-[#F5F2EB] p-8">
  <div class="relative max-w-md w-full bg-white p-8 md:p-10 rounded-lg shadow-lg text-center">
    
    {#if isLoading}
      <!-- Loading state -->
      <div class="space-y-4">
        <div class="w-16 h-16 mx-auto bg-[#771138] rounded-full flex items-center justify-center">
          <svg class="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h1 class="font-serif text-[24px] font-bold text-[#771138]">E-mailadres bevestigen</h1>
        <p class="text-[#707070] text-[15px]">Een moment geduld, we bevestigen je e-mailadres...</p>
      </div>
      
    {:else if success}
      <!-- Success state -->
      <div class="space-y-4">
        <div class="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
          <svg class="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="font-serif text-[24px] font-bold text-[#771138]">Bevestiging gelukt!</h1>
        <p class="text-[#3D3D3D] text-[15px]">Je e-mailadres is succesvol bevestigd. Je wordt automatisch doorgestuurd naar DOBbie.</p>
        <div class="flex items-center justify-center space-x-2 text-[#707070] text-[14px]">
          <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Doorsturen...</span>
        </div>
      </div>
      
    {:else if error}
      <!-- Error state -->
      <div class="space-y-6">
        <div class="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center">
          <svg class="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <h1 class="font-serif text-[24px] font-bold text-[#771138] mb-2">Bevestiging mislukt</h1>
          <p class="text-red-600 text-[15px] mb-4">{error}</p>
          <p class="text-[#707070] text-[14px]">Probeer opnieuw te registreren of neem contact met ons op als het probleem aanhoudt.</p>
        </div>
        
        <div class="space-y-3">
          <a 
            href="/register" 
            class="block w-full py-3 px-6 bg-[#771138] text-white rounded-md hover:bg-[#5A0D29] transition-colors duration-200 font-semibold text-[15px]"
          >
            Opnieuw registreren
          </a>
          <a 
            href="/login" 
            class="block w-full py-3 px-6 border border-[#771138] text-[#771138] rounded-md hover:bg-[#771138] hover:text-white transition-all duration-200 font-semibold text-[15px]"
          >
            Inloggen
          </a>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  :global(body) {
    font-family: 'Open Sans', sans-serif;
    background-color: #F5F2EB;
  }

  .font-serif {
    font-family: 'Times New Roman', serif;
  }
</style>