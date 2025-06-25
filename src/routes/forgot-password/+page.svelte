<script lang="ts">
  import { toast } from 'svelte-sonner';
  
  let email = '';
  let isLoading = false;
  let message = '';
  let isSuccess = false;

  async function handleForgotPassword() {
    if (!email || !email.includes('@')) {
      message = 'Vul een geldig e-mailadres in.';
      isSuccess = false;
      return;
    }

    isLoading = true;
    message = '';
    isSuccess = false;

    try {
      // Use API route for consistency
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Er ging iets mis bij het verzenden van de reset e-mail.');
      }

      message = `Een 6-cijferige code is verstuurd naar ${email}. Controleer je inbox.`;
      isSuccess = true;
      toast.success('Herstelcode verstuurd!');
      email = ''; // Clear form

    } catch (error: any) {
      console.error('Forgot password error:', error);
      message = error.message || 'Er ging iets mis. Controleer je e-mailadres en probeer opnieuw.';
      isSuccess = false;
      toast.error(error.message);
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>DOBbie - De Online Bedrijfsarts - Wachtwoord Vergeten</title>
  <meta name="description" content="Reset je wachtwoord voor DOBbie De Online Bedrijfsarts." />
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen flex flex-col md:flex-row">
  <!-- Linkerkant - Forgot Password Form -->
  <div class="relative w-full md:w-2/5 bg-[#F5F2EB] flex items-center justify-center p-8 order-2 md:order-1 overflow-hidden">
    <!-- Achtergrond decoratie -->
    <div class="absolute -top-20 -left-24 w-72 h-72 bg-[#771138] rounded-full opacity-10 filter blur-3xl -z-10 animate-pulse-slow"></div>
    <div class="absolute -bottom-24 -right-20 w-80 h-80 bg-[#E9B046] rounded-full opacity-20 filter blur-3xl -z-10 animate-pulse-slower"></div>

    <div class="relative z-10 max-w-md w-full bg-white p-8 md:p-10 rounded-lg shadow-lg">
      <!-- Logo en welkomstbericht -->
      <div class="text-center mb-8">
        <h1 class="font-serif text-[28px] font-bold text-[#771138] mb-2">Wachtwoord vergeten?</h1>
        <p class="text-[#3D3D3D] text-[15px]">Voer je e-mailadres in om je wachtwoord te resetten</p>
      </div>
      
      <form on:submit|preventDefault={handleForgotPassword} class="space-y-6">
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
            Bezig met verzenden...
          {:else}
            Reset wachtwoord
          {/if}
        </button>
        
        {#if message}
          <p class="mt-2 text-center text-[14px] {isSuccess ? 'text-green-600' : 'text-red-600'}">
            {message}
          </p>
        {/if}

        <div class="text-center space-y-2">
          <p class="text-[14px] text-[#707070]">
            Weet je je wachtwoord weer? 
            <a href="/login" class="text-[#771138] hover:text-[#5A0D29] font-semibold transition-colors duration-200">Inloggen</a>
          </p>
          <a href="/" class="block text-[14px] text-[#707070] hover:text-[#3D3D3D] transition-colors duration-200">Terug naar home</a>
        </div>
      </form>
    </div>
  </div>
  
  <!-- Rechterkant - Info -->
  <div class="w-full md:w-3/5 text-white p-8 md:p-12 flex items-center relative overflow-hidden order-1 md:order-2 bg-[#771138] right-side">
    <div class="relative z-10 max-w-xl mx-auto flex flex-col items-center justify-center h-full">
      <h2 class="font-serif text-[28px] font-bold mb-4 text-center md:text-left text-white">Geen zorgen, we helpen je verder</h2>
      <p class="text-[15px] mb-8 text-center md:text-left text-white opacity-90">Voer je e-mailadres in en we sturen je instructies om je wachtwoord te resetten.</p>
      
      <div class="space-y-4 mb-8 w-full max-w-md">
        <div class="flex items-center p-4 rounded-md bg-white/10 backdrop-blur-md feature-item">
          <div class="bg-[#E9B046] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="text-[15px] text-white feature-text">Veilige wachtwoord reset via e-mail</p>
        </div>
        <div class="flex items-center p-4 rounded-md bg-white/10 backdrop-blur-md feature-item">
          <div class="bg-[#E9B046] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="text-[15px] text-white feature-text">Snel en eenvoudig proces</p>
        </div>
        <div class="flex items-center p-4 rounded-md bg-white/10 backdrop-blur-md feature-item">
          <div class="bg-[#E9B046] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="text-[15px] text-white feature-text">24/7 ondersteuning beschikbaar</p>
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