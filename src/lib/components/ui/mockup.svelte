<!-- Mockup.svelte -->
<script lang="ts">
    import { cn } from "$lib/utils.js"; // Added .js extension

    export let className: string = "";
</script>

<div
  class={cn(
    "relative overflow-hidden rounded-xl border border-foreground/10 bg-background/50 p-2", // Consider theme colors
    "ring-1 ring-foreground/5 backdrop-blur-sm", // Consider theme colors
    className
  )}
>
  <div class="rounded-lg overflow-hidden">
    <slot />
  </div>
</div> 