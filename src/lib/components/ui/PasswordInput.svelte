<script lang="ts">
  export let value = '';
  export let placeholder = '••••••••';
  export let required = false;
  export let id = '';
  export let minlength: number | undefined = undefined;
  export let disabled = false;
  export let autocomplete = 'current-password';
  export let className = '';

  let showPassword = false;

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }
</script>

<div class="relative">
  <input 
    {id}
    type={showPassword ? 'text' : 'password'}
    bind:value
    {placeholder}
    {required}
    {minlength}
    {disabled}
    {autocomplete}
    class="bg-white border border-[#D1D5DB] rounded-md px-4 py-3 pr-12 w-full focus:border-[#771138] focus:outline-none focus:ring-2 focus:ring-[#771138]/20 transition-all duration-300 ease-in-out {className}"
  >
  
  <button
    type="button"
    on:click={togglePasswordVisibility}
    class="absolute right-3 top-1/2 -translate-y-1/2 text-[#707070] hover:text-[#771138] transition-colors duration-200 p-1"
    tabindex="-1"
  >
    {#if showPassword}
      <!-- Eye slash icon (hide) -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
      </svg>
    {:else}
      <!-- Eye icon (show) -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    {/if}
  </button>
</div>