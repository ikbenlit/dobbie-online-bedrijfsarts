<!-- ThemeToggle.svelte -->
<script lang="ts">
  import { theme, toggleTheme } from '../stores/themeStore.js';
  import { onMount } from 'svelte';
  
  // Animatie instellingen
  let isTransitioning = false;
  let mounted = false;
  
  onMount(() => {
    mounted = true;
  });
  
  function handleToggle() {
    if (isTransitioning) return;
    
    isTransitioning = true;
    toggleTheme();
    
    // Reset transitie na animatie
    setTimeout(() => {
      isTransitioning = false;
    }, 300);
  }
</script>

<button
  aria-label={$theme === 'dark' ? 'Schakel over naar licht thema' : 'Schakel over naar donker thema'}
  class="relative inline-flex items-center justify-center w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-light"
  on:click={handleToggle}
  disabled={!mounted}
>
  <span class="sr-only">
    {$theme === 'dark' ? 'Schakel over naar licht thema' : 'Schakel over naar donker thema'}
  </span>
  
  <!-- Zon/maan icoon -->
  <div 
    class="absolute left-1 transform transition-transform duration-300 {$theme === 'dark' ? 'translate-x-6' : ''}" 
    aria-hidden="true"
  >
    {#if $theme === 'dark'}
      <!-- Maan Icoon -->
      <svg class="w-4 h-4 text-yellow-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    {:else}
      <!-- Zon Icoon -->
      <svg class="w-4 h-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
      </svg>
    {/if}
  </div>
</button> 