<!-- Glow.svelte -->
<script lang="ts">
  import { cn } from "$lib/utils.js"; // Teruggeplaatst

  // Define allowed variants explicitly
  type GlowVariant = "default" | "below" | "above";

  export let variant: GlowVariant = "default";
  export let className: string = ""; // Nog steeds geaccepteerd, maar niet direct gebruikt in de test

  // Type the keys of variantClasses
  const variantClasses: { [key in GlowVariant]: string } = {
    default: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    below: "top-full left-1/2 -translate-x-1/2 -translate-y-1/2",
    above: "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2"
  };
</script>

<div
  class={cn(
    "absolute",
    variantClasses[variant],
    "h-[80vh] w-[100vw] lg:h-[100vh] lg:w-[80vw]",
    "rounded-full bg-pink-light/30 opacity-30 blur-[100px]", // Gebruik Shirley's pink-light
    className
  )}
>
  <!-- Glow met variants -->
</div> 