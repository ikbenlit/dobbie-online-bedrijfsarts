<!-- Sidebar.svelte -->
<script context="module" lang="ts">
    import type { Writable } from 'svelte/store';
    
    // Definitie van context key
    export const SidebarContextKey = Symbol('sidebar-context');
    
    // Context waarde type (met animate)
    export interface SidebarContextValue {
        sidebarStore: Writable<{ open: boolean }>;
        animate: boolean;
    }
</script>

<script lang="ts">
    import { getContext, setContext } from 'svelte';
    import { slide, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    // Gebruik $lib alias en importeer type
    import { sidebarStore, type SidebarState } from '$lib/stores/sidebarStore.js'; 

    // Interface import hier niet nodig, is al gedefinieerd in module script
    // import type { SidebarContextValue } from './sidebar.svelte'; 

    // Haal de gedeelde store op uit de context (vervangt de interne store)
    // const { sidebarStore } = getContext<SidebarContextValue>(SidebarContextKey);
    // GEBRUIK DE GEÏMPORTEERDE STORE DIRECT

    // Prop om animatie (hover effect) aan/uit te zetten
    export let animate = true; 

    // Reactive value for open state
    $: open = $sidebarStore.open;
    
    // Toggle functie voor de store
    function toggleSidebar() {
      sidebarStore.update((state: SidebarState) => ({ ...state, open: !state.open }));
    }

    // Functie om specifiek te sluiten (voor mobiele backdrop)
    function closeSidebar() {
      sidebarStore.update((state: SidebarState) => ({ ...state, open: false })); 
    }
    
    // Bied de store en animate aan via context
    setContext(SidebarContextKey, { sidebarStore, animate });

    // Helper function
    function cn(...classes: string[]) {
      return classes.filter(Boolean).join(' ');
    }
</script>

<!-- Container die zowel Desktop als Mobiel/Overlay bevat -->
<div class={cn($$props.class, "md:fixed md:inset-y-0 md:left-0 md:z-30 md:w-64")}> 

  <!-- Desktop Sidebar (zichtbaar vanaf md, breedte afhankelijk van 'open') -->
  <div 
    class={cn(
      "hidden md:flex h-full bg-brand-beige-light dark:bg-neutral-800 px-4 py-4 flex-col flex-shrink-0 transition-width duration-300 ease-in-out", 
      open ? 'md:w-64' : 'md:w-20' 
    )}
    role="navigation"
    aria-label="Hoofdnavigatie"
  >
    <!-- Slot BOVENAAN (bevat logo en links) -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden">
       <slot></slot> 
    </div>

    <!-- Desktop Toggle Knop (NU ONDER de slot, boven user menu) -->
    <div class="py-2 border-t border-neutral-200 dark:border-neutral-700"> <!-- border-t hersteld -->
       <button 
          on:click={toggleSidebar}
          class="w-full flex items-center justify-center p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          aria-label={open ? 'Sidebar inklappen' : 'Sidebar uitklappen'}
       >
          <!-- Icoon verandert mee (chevron left/right) -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
             {#if open}
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
             {:else}
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
             {/if}
          </svg>
          <!-- Optioneel: Tekst label dat verdwijnt -->
          {#if open}
             <span class="ml-2 text-sm transition-opacity duration-200 opacity-100">Inklappen</span>
          {:else}
             <span class="ml-2 text-sm transition-opacity duration-200 opacity-0"></span>
          {/if}
       </button>
    </div>

    <!-- User section blijft onderaan -->
    <div class="pt-2 border-t border-neutral-200 dark:border-neutral-700">
      <slot name="user"></slot>
    </div>
  </div>

  <!-- Mobiele Overlay (zichtbaar onder md, alleen als open=true) -->
  {#if open}
    <!-- Backdrop -->
    <div 
      transition:fade={{ duration: 200 }}
      class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
      on:click={closeSidebar}
      aria-hidden="true"
    ></div>

    <!-- Mobiele Sidebar Container -->
    <div 
      class={cn(
        "fixed inset-y-0 left-0 w-64 bg-brand-beige-light dark:bg-neutral-800 p-4 z-40 flex flex-col md:hidden",
        $$props.mobileClass // Behoud mogelijkheid voor extra classes
      )}
      transition:slide={{ duration: 300, axis: 'x', easing: quintOut }}
      role="dialog"
      aria-modal="true"
      aria-label="Mobiel navigatiemenu"
    >
      <!-- Sluitknop (optioneel, maar handig) -->
      <button
        type="button"
        class="absolute right-4 top-4 text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white md:hidden"
        on:click={closeSidebar}
        aria-label="Sluit navigatiemenu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <!-- Slot voor mobiele content -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden"> <!-- overflow toegevoegd -->
        <slot></slot> 
      </div>
      
      <!-- User section mobiel -->
      <div class="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <slot name="user"></slot> <!-- Gebruik hetzelfde user slot -->
      </div>
    </div>
  {/if}
</div>