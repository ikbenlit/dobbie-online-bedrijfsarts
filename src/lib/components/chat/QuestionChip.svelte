<script lang="ts">
  import type { ChatQuestion } from '$lib/types/chat';
  import { createEventDispatcher } from 'svelte';

  export let question: ChatQuestion;

  const dispatch = createEventDispatcher();

  function handleClick(): void {
    dispatch('selectQuestion', { text: question.text });
  }
</script>

<button
  on:click={handleClick}
  class="w-full text-left p-3 my-1 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 ease-in-out"
  aria-label={`Selecteer vraag: ${question.text}`}
>
  <p class="text-sm text-gray-700">{question.text}</p>
</button> 