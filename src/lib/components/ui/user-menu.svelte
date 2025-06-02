<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import Avatar from './avatar.svelte';
  import type { User } from '../../stores/userStore.js';
  import { clearUser } from '../../stores/userStore.js';
  import { theme, toggleTheme } from '../../stores/themeStore.js';
  import { sidebarStore } from '$lib/stores/sidebarStore.js';
  
  export let user: User;
  
  let isMenuOpen = false;
  let menuRef: HTMLDivElement;
  
  let sidebarOpen: boolean;
  sidebarStore.subscribe(value => {
    sidebarOpen = value.open;
  });

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  function handleClickOutside(event: MouseEvent) {
    if (menuRef && !menuRef.contains(event.target as Node) && isMenuOpen) {
      isMenuOpen = false;
    }
  }
  
  onMount(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });
  
  async function handleLogout() {
    clearUser();
    await goto('/login');
  }
</script>

<div class="relative" bind:this={menuRef}>
  <!-- Avatar knop: pas padding/justify/space aan als sidebar ingeklapt -->
  <button 
    class="flex items-center p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200 w-full"
    class:justify-center={!sidebarOpen}
    class:space-x-3={sidebarOpen}
    on:click={toggleMenu}
  >
    <Avatar {user} />
    
    <!-- Verberg tekst als sidebar ingeklapt -->
    {#if sidebarOpen}
      <div class="flex-1 text-left overflow-hidden transition-opacity duration-200 opacity-100">
        <div class="font-medium truncate">{user.name ?? user.email}</div>
        {#if user.name}
        <div class="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.email}</div>
        {/if}
      </div>
    {/if}
    
    <!-- Pijl-icoon: Verberg als sidebar ingeklapt -->
    {#if sidebarOpen}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-5 h-5 transform transition-transform duration-200 text-neutral-500 dark:text-neutral-400 transition-opacity opacity-100"
        class:rotate-180={isMenuOpen}
      >
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    {/if}
  </button>
  
  <!-- Dropdown menu -->
  {#if isMenuOpen}
    <div 
      class="absolute bottom-full mb-2 w-60 rounded-lg bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50 right-0"
      transition:fade={{ duration: 150 }}
    >
      <!-- Gebruikersinfo bovenaan -->
      <div class="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div class="font-medium">{user.name ?? user.email}</div>
        {#if user.name}
        <div class="text-sm text-neutral-500 dark:text-neutral-400">{user.email}</div>
        {/if}
      </div>
      
      <!-- Menu opties -->
      <div class="py-1">
        <!-- Instellingen -->
        <button class="flex items-center w-full px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-neutral-500 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Instellingen
        </button>
        
        <!-- Thema wisselen -->
        <button 
          class="flex items-center w-full px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
          on:click={toggleTheme}
        >
          {#if $theme === 'dark'}
            <!-- Zon icoon voor licht thema -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Overschakelen naar licht thema
          {:else}
            <!-- Maan icoon voor donker thema -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-neutral-500 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            Overschakelen naar donker thema
          {/if}
        </button>
        
        <!-- Taal wisselen -->
        <button class="flex items-center w-full px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-neutral-500 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          Taal wijzigen
        </button>
      </div>
      
      <div class="border-t border-neutral-200 dark:border-neutral-700">
        <!-- Uitloggen -->
        <button 
          on:click={handleLogout}
          class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Uitloggen
        </button>
      </div>
    </div>
  {/if}
</div> 