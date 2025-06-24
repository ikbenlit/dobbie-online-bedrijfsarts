<!-- SidebarLink.svelte -->
<script lang="ts">
    import { writable, get, type Writable } from 'svelte/store';
    import { slide } from 'svelte/transition';
    import { getContext } from 'svelte';
    // Importeer direct uit sidebar.svelte
    import { SidebarContextKey, type SidebarContextValue } from './sidebar.svelte';

    // Interface voor de link prop
    interface LinkDefinition {
      label: string;
      href: string;
      icon: string;
      target?: string;
    }

    // Props
    export let link: LinkDefinition = {
      label: "",
      href: "",
      icon: ""
    };
    
    export let className = "";
    
    // Get sidebar context
    const { sidebarStore, animate } = getContext<SidebarContextValue>(SidebarContextKey);
    $: open = $sidebarStore.open;
    
    // Helper function similar to cn from React
    function cn(...classes: string[]) {
      return classes.filter(Boolean).join(' ');
    }
  </script>
  
  <a 
    href={link.href}
    target={link.target || '_self'}
    rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
    class={cn(
      "flex items-center justify-start gap-2 group/sidebar py-2",
      className
    )}
  >
    <span>{@html link.icon}</span>
    
    {#if animate}
      <span 
        class="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition-all duration-300 ease-in-out whitespace-pre overflow-hidden"
        style={`max-width: ${open ? '200px' : '0px'}; opacity: ${open ? 1 : 0}; margin-left: ${open ? '8px' : '0px'};`}
      >
        {link.label}
      </span>
    {:else}
      <span 
        class="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre ml-2"
      >
        {link.label}
      </span>
    {/if}
  </a>