<script lang="ts">
  import type { Icon as LucideIcon } from 'lucide-svelte';
  import { icons } from 'lucide-svelte';
  import { onMount, tick } from 'svelte';

  export let name: string;
  export let size: string | number = 24;
  export let color: string | undefined = undefined; // Wordt via Tailwind class beheerd
  export let strokeWidth: string | number | undefined = undefined;
  export let className: string = ''; // Voor extra Tailwind classes

  let Component: LucideIcon | null = null;

  // Dynamisch importeren van het icoon op basis van de naam
  // $: if (name && icons[name]) {
  //   Component = icons[name];
  // }

  // Fallback voor als een icoon niet direct geladen kan worden of niet bestaat.
  // Dit kan verder uitgebreid worden met een default icoon.
  // $: if (!Component && name) {
  //   console.warn(`Icon "${name}" not found.`);
  // }

  // Workaround voor dynamische import met Svelte
  // Zie: https://github.com/lucide-icons/lucide/issues/507#issuecomment-1039833119
  let currentName = name;
  $: {
    if (name && icons[name]) {
      if (name !== currentName) {
        Component = null;
        currentName = name;
        // Forceer een re-render door Component even null te maken en dan weer te zetten
        tick().then(() => {
          Component = icons[name];
        });
      } else if (!Component) {
        Component = icons[name];
      }
    } else if (name) {
      console.warn(`Icon "${name}" not found in lucide-svelte library.`);
      Component = null; // Zorg dat er geen oud icoon blijft staan
    }
  }

</script>

{#if Component}
  <svelte:component 
    this={Component} 
    {size} 
    color={color} 
    strokeWidth={strokeWidth}
    class={className}
    aria-hidden="true"
  />
{:else if name}
  <!-- Fallback of placeholder voor als het icoon niet gevonden is -->
  <span class="text-transparent text-xs" aria-label={`Icon ${name} not found`}></span>
{/if} 