<!-- AuroraBackground.svelte - More flexible version -->
<script lang="ts">
    // import { cn } from "$lib/utils"; // Test met relatief pad
    import { cn } from "../utils.js"; // Aangenomen dat utils.ts in src/lib staat, voeg .js toe
    
    export let className = "";
    export let showRadialGradient = true;
    // Verwijder $$restProps, deze zijn minder relevant voor een pure effect-component
</script>

<!-- Gebruik een div als root, pas className hier toe -->
<div class={cn("relative isolate overflow-hidden", className)}>
  <!-- Effect Container -->
  <div
    class={cn(
        `absolute -inset-[10px] opacity-50 will-change-transform 
        [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
        [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
        [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
        [background-image:var(--white-gradient),var(--aurora)]
        dark:[background-image:var(--dark-gradient),var(--aurora)]
        [background-size:300%,_200%]
        [background-position:50%_50%,50%_50%]
        filter blur-[10px] invert dark:invert-0
        after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
        after:dark:[background-image:var(--dark-gradient),var(--aurora)]
        after:[background-size:200%,_100%] 
        after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
        pointer-events-none`,
        showRadialGradient &&
          `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
      )}
  ></div>
  <!-- Slot Container - Plaats inhoud boven het effect -->
  <div class="relative z-10">
    <slot></slot>
  </div>
</div>