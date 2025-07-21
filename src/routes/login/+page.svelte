<script lang="ts">
  import { goto } from '$app/navigation';
  import { invalidateAll } from '$app/navigation';
  import { signIn, user } from '$lib/stores/userStore.js';
  import AvatarBubble from '$lib/components/ui/AvatarBubble.svelte';
  import PasswordInput from '$lib/components/ui/PasswordInput.svelte';

  let email = '';
  let password = '';
  let isLoading = false;
  let errorMessage = '';
  let rememberMe = false;

  async function handleLogin() {
    if (!email || !password) {
      errorMessage = 'Vul alle velden in.';
      return;
    }

    isLoading = true;
    errorMessage = '';

    try {
      console.log('Starting login process...');
      
      // Gebruik Supabase auth voor echte authenticatie
      await signIn(email, password);
      
      console.log('Succesvol ingelogd!');
      console.log('Current user state:', $user);
      
      // Force server-side session refresh door alle server load functions opnieuw uit te voeren
      console.log('Invalidating all server loads to sync session...');
      await invalidateAll();
      
      console.log('Redirecting to /chat...');
      await goto('/chat');
      
    } catch (error: any) {
      console.error('Fout bij inloggen:', error);
      
      // User-friendly error messages
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Onjuiste inloggegevens. Controleer je e-mailadres en wachtwoord.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Je account is nog niet bevestigd. Controleer je e-mail.';
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = 'Te veel login pogingen. Probeer het later opnieuw.';
      } else {
        errorMessage = 'Er is een fout opgetreden. Probeer het opnieuw.';
      }
      
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>DOBbie - De Online Bedrijfsarts - Login</title>
  <meta name="description" content="Log in om toegang te krijgen tot DOBbie De Online Bedrijfsarts." />
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen flex flex-col md:flex-row">
  <!-- Linkerkant - Login Formulier (md:w-2/5) -->
  <div class="relative w-full md:w-2/5 bg-[#F5F2EB] flex items-center justify-center p-8 order-2 md:order-1 overflow-hidden">
    <!-- Achtergrond decoratie -->
    <div class="absolute -top-20 -left-24 w-72 h-72 bg-[#771138] rounded-full opacity-10 filter blur-3xl -z-10 animate-pulse-slow"></div>
    <div class="absolute -bottom-24 -right-20 w-80 h-80 bg-[#E9B046] rounded-full opacity-20 filter blur-3xl -z-10 animate-pulse-slower"></div>

    <div class="relative z-10 max-w-md w-full bg-white p-8 md:p-10 rounded-lg shadow-lg">
      <!-- Logo en welkomstbericht -->
      <div class="text-center mb-8">
        <h1 class="font-serif text-[28px] font-bold text-[#771138] mb-2">Welkom terug</h1>
        <p class="text-[#3D3D3D] text-[15px]">Log in om verder te gaan met DOBbie - De Online Bedrijfsarts</p>
      </div>
      
      <form on:submit|preventDefault={handleLogin} class="space-y-6">
        <div>
          <label for="email" class="block text-[15px] font-semibold text-[#3D3D3D] mb-2">E-mailadres</label>
          <input 
            type="email" 
            id="email" 
            bind:value={email}
            class="bg-white border border-[#D1D5DB] rounded-md px-4 py-3 w-full focus:border-[#771138] focus:outline-none focus:ring-2 focus:ring-[#771138]/20 transition-all duration-300 ease-in-out"
            placeholder="naam@voorbeeld.nl" 
            required
          >
        </div>
        
        <div>
          <label for="password" class="block text-[15px] font-semibold text-[#3D3D3D] mb-2">Wachtwoord</label>
          <PasswordInput 
            id="password" 
            bind:value={password}
            placeholder="••••••••" 
            required
          />
        </div>
        
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="remember" 
              bind:checked={rememberMe}
              class="mr-2 h-4 w-4 accent-[#771138] border-[#D1D5DB] rounded"
            >
            <label for="remember" class="text-[14px] text-[#707070]">Onthouden</label>
          </div>
          <a href="/forgot-password" class="text-[14px] font-semibold text-[#771138] hover:text-[#5A0D29] transition-colors duration-200">Wachtwoord vergeten?</a>
        </div>
        
        <button 
          type="submit" 
          class="w-full font-bold text-[16px] rounded-md py-[14px] px-[28px] text-white transition-all duration-300 ease-in-out disabled:opacity-70 bg-[#771138] hover:bg-[#5A0D29] flex items-center justify-center"
          disabled={isLoading}
        >
          {#if isLoading}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Bezig met inloggen...
          {:else}
            Inloggen
          {/if}
        </button>
        
        {#if errorMessage}
          <p class="mt-2 text-center text-[14px] text-red-600">
            {errorMessage}
          </p>
        {/if}

        <div class="text-center space-y-2">
          <p class="text-[14px] text-[#707070]">
            Nog geen account? 
            <a href="/register" class="text-[#771138] hover:text-[#5A0D29] font-semibold transition-colors duration-200">Registreren</a>
          </p>
          <a href="/" class="block text-[14px] text-[#707070] hover:text-[#3D3D3D] transition-colors duration-200">Terug naar home</a>
        </div>
      </form>

      <div class="mt-6 bg-[#F5F2EB] text-[#3D3D3D] p-4 rounded-md shadow-sm text-[14px] text-center">
        <div class="font-semibold mb-1">Test inloggegevens:</div>
        <div><span class="font-medium">E-mail:</span> demo@dobbie.nl</div>
        <div><span class="font-medium">Wachtwoord:</span> dobbie123</div>
      </div>
    </div>
  </div>
  
  <!-- Rechterkant - Feature Showcase (md:w-3/5) -->
  <div class="w-full md:w-3/5 text-white p-8 md:p-12 flex items-center relative overflow-hidden order-1 md:order-2 bg-[#771138] right-side">
    <div class="relative z-10 max-w-xl mx-auto flex flex-col items-center justify-center h-full">
      <h2 class="font-serif text-[28px] font-bold mb-4 text-center md:text-left text-white">24/7 professioneel advies over verzuim</h2>
      <p class="text-[15px] mb-8 text-center md:text-left text-white opacity-90">DOBbie - De Online Bedrijfsarts helpt u met professionele begeleiding bij verzuim, Wet Poortwachter en personeelsbeleid.</p>
      
      <div class="space-y-4 mb-8 w-full max-w-md">
        <div class="flex items-center p-4 rounded-md bg-white/10 backdrop-blur-md feature-item">
          <div class="bg-[#E9B046] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="text-[15px] text-white feature-text">Direct antwoord op al uw vragen over verzuim</p>
        </div>
        <div class="flex items-center p-4 rounded-md bg-white/10 backdrop-blur-md feature-item">
          <div class="bg-[#E9B046] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="text-[15px] text-white feature-text">Actuele kennis van wet- en regelgeving</p>
        </div>
        <div class="flex items-center p-4 rounded-md bg-white/10 backdrop-blur-md feature-item">
          <div class="bg-[#E9B046] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="text-[15px] text-white feature-text">Professionele ondersteuning bij verzuimbeleid</p>
        </div>
      </div>
    </div>
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

  /* Styling voor de rechterkant */
  .right-side {
    color: white;
  }

  .right-side h2,
  .right-side p,
  .right-side .feature-text {
    color: white !important;
  }

  .feature-item {
    color: white;
  }

  /* Animaties voor de achtergrond elementen */
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.1; transform: scale(1); }
    50% { opacity: 0.2; transform: scale(1.05); }
  }
  @keyframes pulse-slower {
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(1.03); }
  }

  .animate-pulse-slow {
    animation: pulse-slow 8s infinite ease-in-out;
  }
  .animate-pulse-slower {
    animation: pulse-slower 10s infinite ease-in-out;
  }
</style> 