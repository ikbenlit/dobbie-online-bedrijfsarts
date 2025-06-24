<script lang="ts">
  import type { ChatCategory } from '$lib/types/chat';
  import { createEventDispatcher } from 'svelte';
  import Icon from '$lib/components/ui/Icon.svelte';

  export let category: ChatCategory;

  const dispatch = createEventDispatcher();

  function handleClick(): void {
    dispatch('select', { id: category.id, title: category.title });
  }

  // Bepaal tekstkleur op basis van achtergrondkleur (eenvoudig: wit op donkere kleuren, anders donker)
  function isDarkColor(hex: string): boolean {
    // Simpele luminantie check
    if (!hex) return false;
    const c = hex.replace('#', '');
    const rgb = parseInt(c.length === 3 ? c.split('').map(x => x + x).join('') : c, 16);
    const r = (rgb >> 16) & 255, g = (rgb >> 8) & 255, b = rgb & 255;
    // Luminantie formule
    return (0.299 * r + 0.587 * g + 0.114 * b) < 150;
  }
  $: textColorClass = isDarkColor(category.color) ? 'text-white' : 'text-gray-900';
</script>

<!-- Chip met dynamische kleur en icoon -->
<button
  on:click={handleClick}
  class={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors whitespace-nowrap ${textColorClass}`}
  style={`background-color: ${category.color};`}
  aria-label={`Selecteer categorie: ${category.title}`}
>
  <!-- Dynamisch Lucide icoon -->
  <Icon name={category.icon} size={18} className={textColorClass} />
  {category.title}
</button> 