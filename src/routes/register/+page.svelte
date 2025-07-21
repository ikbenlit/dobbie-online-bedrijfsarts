<script lang="ts">
  import { goto } from '$app/navigation';
  import { registerUser, validateOrganizationCode } from '$lib/stores/userStore.js';
  import { debounce } from '$lib/utils.js';
  import PasswordInput from '$lib/components/ui/PasswordInput.svelte';
  
  // Multi-step state
  let currentStep = 1;
  const totalSteps = 3;
  const stepTitles = ['Basis informatie', 'Account type', 'Organisatie'];
  
  // Form data
  let registrationData = {
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    account_type: 'individual' as 'individual' | 'organization_member',
    organization_code: ''
  };
  
  // UI state
  let isLoading = false;
  let errorMessage = '';
  let successMessage = '';
  let orgValidationResult: any = null;
  let isValidatingOrg = false;
  
  // Validation state
  let formErrors: Record<string, string> = {};
  
  // Debounced organization validation
  const debouncedValidateOrg = debounce(async (code: string) => {
    if (!code || code.length < 2) {
      orgValidationResult = null;
      return;
    }
    
    isValidatingOrg = true;
    try {
      orgValidationResult = await validateOrganizationCode(code);
    } catch (error) {
      orgValidationResult = { valid: false };
    }
    isValidatingOrg = false;
  }, 500);
  
  // Form validation
  function validateCurrentStep(): boolean {
    formErrors = {};
    
    if (currentStep === 1) {
      if (!registrationData.email || !registrationData.email.includes('@')) {
        formErrors.email = 'Vul een geldig e-mailadres in.';
      }
      if (!registrationData.password || registrationData.password.length < 6) {
        formErrors.password = 'Wachtwoord moet minimaal 6 karakters zijn.';
      }
      if (registrationData.password !== registrationData.confirmPassword) {
        formErrors.confirmPassword = 'Wachtwoorden komen niet overeen.';
      }
      if (!registrationData.full_name || registrationData.full_name.trim().length < 2) {
        formErrors.full_name = 'Vul uw volledige naam in.';
      }
    }
    
    if (currentStep === 3) {
      if (registrationData.account_type === 'organization_member') {
        if (!registrationData.organization_code) {
          formErrors.organization_code = 'Organisatiecode is verplicht.';
        } else if (!orgValidationResult?.valid) {
          formErrors.organization_code = 'Ongeldige organisatiecode.';
        }
      }
    }
    
    return Object.keys(formErrors).length === 0;
  }
  
  // Navigation functions
  function nextStep() {
    if (!validateCurrentStep()) return;
    
    if (currentStep < totalSteps) {
      if (currentStep === 2 && registrationData.account_type === 'individual') {
        // Skip organization step for individual users
        handleRegistration();
      } else {
        currentStep++;
      }
    }
  }
  
  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
    }
  }
  
  // Handle registration submission with API first, fallback to client-side
  async function handleRegistration() {
    if (!validateCurrentStep()) return;
    
    isLoading = true;
    errorMessage = '';
    successMessage = '';
    
    try {
      // Try API route first
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Er is een fout opgetreden tijdens registratie.');
      }

      if (result.requiresConfirmation) {
        console.log('Email confirmatie vereist');
        successMessage = result.message;
        errorMessage = ''; // Clear error message
        isLoading = false; // Reset loading state
        return;
      } else {
        console.log('Registratie succesvol via API!');
        goto('/chat');
      }
    } catch (error: any) {
      console.error('API registratie fout, probeer client-side fallback:', error);
      
      // Fallback to client-side registration
      try {
        await registerUser(registrationData);
        console.log('Registratie succesvol via client-side fallback!');
        goto('/chat');
      } catch (clientError: any) {
        console.error('Client-side registratie fout:', clientError);
        errorMessage = clientError.message || error.message || 'Er is een fout opgetreden tijdens registratie.';
      }
    } finally {
      isLoading = false;
    }
  }
  
  // Handle organization code input
  function handleOrgCodeInput(event: Event) {
    const target = event.target as HTMLInputElement;
    registrationData.organization_code = target.value.toUpperCase();
    debouncedValidateOrg(registrationData.organization_code);
  }
</script>

<svelte:head>
  <title>DOBbie - De Online Bedrijfsarts - Registreren</title>
  <meta name="description" content="Registreer voor DOBbie De Online Bedrijfsarts." />
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen flex flex-col md:flex-row">
  <!-- Linkerkant - Registration Form -->
  <div class="relative w-full md:w-2/5 bg-[#F5F2EB] flex items-center justify-center p-8 order-2 md:order-1 overflow-hidden">
    <!-- Achtergrond decoratie -->
    <div class="absolute -top-20 -left-24 w-72 h-72 bg-[#771138] rounded-full opacity-10 filter blur-3xl -z-10 animate-pulse-slow"></div>
    <div class="absolute -bottom-24 -right-20 w-80 h-80 bg-[#E9B046] rounded-full opacity-20 filter blur-3xl -z-10 animate-pulse-slower"></div>

    <div class="relative z-10 max-w-md w-full bg-white p-8 md:p-10 rounded-lg shadow-lg">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="font-serif text-[28px] font-bold text-[#771138] mb-2">Account aanmaken</h1>
        <p class="text-[#3D3D3D] text-[15px]">Maak een account aan voor DOBbie - De Online Bedrijfsarts</p>
      </div>
      
      <!-- Step indicator -->
      <div class="flex items-center justify-between mb-6">
        {#each Array(totalSteps) as _, index}
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-semibold
              {index + 1 <= currentStep ? 'bg-[#771138] text-white' : 'bg-[#D1D5DB] text-[#707070]'}">
              {index + 1}
            </div>
            {#if index < totalSteps - 1}
              <div class="w-8 h-0.5 mx-2 
                {index + 1 < currentStep ? 'bg-[#771138]' : 'bg-[#D1D5DB]'}"></div>
            {/if}
          </div>
        {/each}
      </div>
      
      <div class="text-center mb-6">
        <p class="text-[14px] text-[#707070] font-medium">{stepTitles[currentStep - 1]}</p>
      </div>
      
      <!-- Form content -->
      <form on:submit|preventDefault={currentStep === totalSteps || (currentStep === 2 && registrationData.account_type === 'individual') ? handleRegistration : nextStep} class="space-y-4">
        
        <!-- Step 1: Basic Information -->
        {#if currentStep === 1}
          <div>
            <label for="full_name" class="block text-[15px] font-semibold text-[#3D3D3D] mb-2">Volledige naam</label>
            <input 
              type="text" 
              id="full_name" 
              bind:value={registrationData.full_name}
              class="bg-white border border-[#D1D5DB] rounded-md px-4 py-3 w-full focus:border-[#771138] focus:outline-none focus:ring-2 focus:ring-[#771138]/20 transition-all duration-300 ease-in-out"
              placeholder="Uw volledige naam" 
              required
            >
            {#if formErrors.full_name}
              <p class="mt-1 text-[14px] text-red-600">{formErrors.full_name}</p>
            {/if}
          </div>
          
          <div>
            <label for="email" class="block text-[15px] font-semibold text-[#3D3D3D] mb-2">E-mailadres</label>
            <input 
              type="email" 
              id="email" 
              bind:value={registrationData.email}
              class="bg-white border border-[#D1D5DB] rounded-md px-4 py-3 w-full focus:border-[#771138] focus:outline-none focus:ring-2 focus:ring-[#771138]/20 transition-all duration-300 ease-in-out"
              placeholder="naam@voorbeeld.nl" 
              required
            >
            {#if formErrors.email}
              <p class="mt-1 text-[14px] text-red-600">{formErrors.email}</p>
            {/if}
          </div>
          
          <div>
            <label for="password" class="block text-[15px] font-semibold text-[#3D3D3D] mb-2">Wachtwoord</label>
            <PasswordInput 
              id="password" 
              bind:value={registrationData.password}
              placeholder="Minimaal 6 karakters" 
              required
              autocomplete="new-password"
            />
            {#if formErrors.password}
              <p class="mt-1 text-[14px] text-red-600">{formErrors.password}</p>
            {/if}
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-[15px] font-semibold text-[#3D3D3D] mb-2">Bevestig wachtwoord</label>
            <PasswordInput 
              id="confirmPassword" 
              bind:value={registrationData.confirmPassword}
              placeholder="Herhaal uw wachtwoord" 
              required
              autocomplete="new-password"
            />
            {#if formErrors.confirmPassword}
              <p class="mt-1 text-[14px] text-red-600">{formErrors.confirmPassword}</p>
            {/if}
          </div>
        {/if}
        
        <!-- Step 2: Account Type -->
        {#if currentStep === 2}
          <div class="space-y-4">
            <p class="text-[15px] font-semibold text-[#3D3D3D] mb-4">Wat voor type account wilt u aanmaken?</p>
            
            <label class="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
              {registrationData.account_type === 'individual' ? 'border-[#771138] bg-[#771138]/5' : 'border-[#D1D5DB] hover:border-[#771138]/50'}">
              <input 
                type="radio" 
                bind:group={registrationData.account_type} 
                value="individual"
                class="mt-1 mr-3 h-4 w-4 accent-[#771138]"
              >
              <div>
                <div class="font-semibold text-[#3D3D3D] text-[15px]">Individuele gebruiker</div>
                <div class="text-[14px] text-[#707070] mt-1">Voor persoonlijk gebruik of kleine ondernemingen</div>
              </div>
            </label>
            
            <label class="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
              {registrationData.account_type === 'organization_member' ? 'border-[#771138] bg-[#771138]/5' : 'border-[#D1D5DB] hover:border-[#771138]/50'}">
              <input 
                type="radio" 
                bind:group={registrationData.account_type} 
                value="organization_member"
                class="mt-1 mr-3 h-4 w-4 accent-[#771138]"
              >
              <div>
                <div class="font-semibold text-[#3D3D3D] text-[15px]">Organisatie lid</div>
                <div class="text-[14px] text-[#707070] mt-1">Ik ben lid van een organisatie die DOBbie gebruikt</div>
              </div>
            </label>
          </div>
        {/if}
        
        <!-- Step 3: Organization -->
        {#if currentStep === 3 && registrationData.account_type === 'organization_member'}
          <div>
            <label for="organization_code" class="block text-[15px] font-semibold text-[#3D3D3D] mb-2">
              Organisatiecode
            </label>
            <div class="relative">
              <input 
                type="text" 
                id="organization_code" 
                bind:value={registrationData.organization_code}
                on:input={handleOrgCodeInput}
                class="bg-white border border-[#D1D5DB] rounded-md px-4 py-3 w-full focus:border-[#771138] focus:outline-none focus:ring-2 focus:ring-[#771138]/20 transition-all duration-300 ease-in-out uppercase"
                placeholder="ORGANISATIECODE" 
                required
              >
              
              {#if isValidatingOrg}
                <div class="absolute right-3 top-3">
                  <svg class="animate-spin h-5 w-5 text-[#771138]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              {/if}
            </div>
            
            {#if orgValidationResult}
              {#if orgValidationResult.valid}
                <p class="mt-2 text-[14px] text-green-600">
                  ✓ {orgValidationResult.org_name}
                </p>
              {:else}
                <p class="mt-2 text-[14px] text-red-600">
                  ✗ Ongeldige organisatiecode
                </p>
              {/if}
            {/if}
            
            {#if formErrors.organization_code}
              <p class="mt-1 text-[14px] text-red-600">{formErrors.organization_code}</p>
            {/if}
            
            <p class="mt-2 text-[14px] text-[#707070]">
              Neem contact op met uw beheerder als u de organisatiecode niet heeft.
            </p>
          </div>
        {/if}
        
        <!-- Navigation buttons -->
        <div class="flex justify-between mt-8">
          {#if currentStep > 1}
            <button 
              type="button" 
              on:click={prevStep}
              class="px-6 py-3 text-[#771138] border border-[#771138] rounded-md hover:bg-[#771138] hover:text-white transition-all duration-200"
            >
              Vorige
            </button>
          {:else}
            <div></div>
          {/if}
          
          <button 
            type="submit" 
            class="px-6 py-3 font-bold text-[16px] rounded-md text-white transition-all duration-300 ease-in-out disabled:opacity-70 bg-[#771138] hover:bg-[#5A0D29] flex items-center"
            disabled={isLoading}
          >
            {#if isLoading}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Bezig met registreren...
            {:else if currentStep === totalSteps || (currentStep === 2 && registrationData.account_type === 'individual')}
              Account aanmaken
            {:else}
              Volgende
            {/if}
          </button>
        </div>
        
        {#if errorMessage}
          <p class="mt-4 text-center text-[14px] text-red-600">
            {errorMessage}
          </p>
        {/if}
        
        {#if successMessage}
          <div class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div class="flex">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        {/if}
      </form>

      <div class="mt-6 text-center">
        <p class="text-[14px] text-[#707070]">
          Heeft u al een account? 
          <a href="/login" class="text-[#771138] hover:text-[#5A0D29] font-semibold transition-colors duration-200">Inloggen</a>
        </p>
      </div>
    </div>
  </div>
  
  <!-- Rechterkant - Benefits Showcase -->
  <div class="w-full md:w-3/5 text-white p-8 md:p-12 flex items-center relative overflow-hidden order-1 md:order-2 bg-[#771138] right-side">
    <div class="relative z-10 max-w-xl mx-auto flex flex-col items-center justify-center h-full">
      <h2 class="font-serif text-[28px] font-bold mb-4 text-center md:text-left text-white">Start vandaag nog met professioneel verzuimadvies</h2>
      <p class="text-[15px] mb-8 text-center md:text-left text-white opacity-90">Krijg toegang tot DOBbie - De Online Bedrijfsarts en ontvang direct professioneel advies over verzuim en personeelsbeleid.</p>
      
      <div class="space-y-4 mb-8 w-full max-w-md">
        <div class="flex items-center p-4 rounded-md bg-white/10 backdrop-blur-md feature-item">
          <div class="bg-[#E9B046] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="text-[15px] text-white feature-text">Onmiddellijk toegang tot verzuimexpertise</p>
        </div>
        <div class="flex items-center p-4 rounded-md bg-white/10 backdrop-blur-md feature-item">
          <div class="bg-[#E9B046] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="text-[15px] text-white feature-text">Veilig en vertrouwelijk advies op maat</p>
        </div>
        <div class="flex items-center p-4 rounded-md bg-white/10 backdrop-blur-md feature-item">
          <div class="bg-[#E9B046] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="text-[15px] text-white feature-text">Actuele kennis van wet- en regelgeving</p>
        </div>
      </div>
      
      <div class="text-center">
        <p class="text-[14px] text-white/80">Vertrouwd door HR-professionals en leidinggevenden</p>
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