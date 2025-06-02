<script lang="ts">
  import { chatStore } from '$lib/stores/chatStore';
  import type { ChatCategory, ChatQuestion } from '$lib/types/chat';
  // import type { Writable } from 'svelte/store'; // Niet nodig, ChatStoreValue is lokaal
  import CategoryChip from './CategoryChip.svelte';
  import QuestionChip from './QuestionChip.svelte';
  import { slide } from 'svelte/transition';

  interface ChatStoreValue {
    allCategories: ChatCategory[];
    activeCategoryId: string | null;
    showCategoryPicker: boolean;
    isLoading: boolean;
    error: string | null;
  }

  let allCategoriesFromStore: ChatCategory[] = [];
  let isLoading: boolean = true;
  let error: string | null = null;
  let activeCategoryId: string | null = null;
  let activeQuestions: ChatQuestion[] = [];

  let showAllCategories = false;
  const initialDisplayCount = 3; 

  chatStore.subscribe((value: ChatStoreValue) => {
    allCategoriesFromStore = value.allCategories;
    isLoading = value.isLoading;
    error = value.error;
    
    if (value.activeCategoryId !== activeCategoryId) {
      activeCategoryId = value.activeCategoryId;
      if (activeCategoryId) {
        const currentCategory = allCategoriesFromStore.find(cat => cat.id === activeCategoryId);
        activeQuestions = currentCategory ? currentCategory.questions : [];
      } else {
        activeQuestions = [];
      }
    }
  });

  $: displayedCategories = showAllCategories 
    ? allCategoriesFromStore 
    : allCategoriesFromStore.slice(0, initialDisplayCount);

  $: hasMoreButton = !showAllCategories && allCategoriesFromStore.length > initialDisplayCount;
  $: hasLessButton = showAllCategories && allCategoriesFromStore.length > initialDisplayCount;

  function handleCategorySelect(event: CustomEvent<{ id: string; title: string }>): void {
    chatStore.selectCategory(event.detail.id);
  }

  function handleQuestionSelect(event: CustomEvent<{ text: string }>): void {
    chatStore.selectQuestion(event.detail.text);
  }

  function toggleShowAllCategories(): void {
    showAllCategories = !showAllCategories;
  }

</script>

{#if isLoading}
  <div class="p-4 text-center">
    <p class="text-sm text-gray-500">Categorieën laden...</p>
  </div>
{:else if error}
  <div class="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
    <p class="text-sm font-semibold">Fout bij laden categorieën</p>
    <p class="text-xs">{error}</p>
  </div>
{:else if allCategoriesFromStore.length > 0}
  <div class="mb-2">
    <div class="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-lg shadow" role="toolbar" aria-label="Categorieën">
      {#if !activeCategoryId}
        <!-- Fallback chip: Kies een onderwerp -->
        <button
          class="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors whitespace-nowrap text-gray-900"
          style="background-color: #F8BBD9;"
          on:click={toggleShowAllCategories}
          aria-label="Kies een onderwerp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke="#E91E63" stroke-width="2" fill="#F8BBD9" /><path d="M8 12h8M12 8v8" stroke="#E91E63" stroke-width="2" stroke-linecap="round"/></svg>
          Kies een onderwerp
        </button>
      {/if}
      {#each displayedCategories as category (category.id)}
        <CategoryChip {category} on:select={handleCategorySelect} />
      {/each}
      {#if hasMoreButton}
        <button 
          on:click={toggleShowAllCategories}
          class="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors whitespace-nowrap"
        >
          Meer...
        </button>
      {/if}
      {#if hasLessButton} 
        <button 
          on:click={toggleShowAllCategories}
          class="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors whitespace-nowrap"
        >
          Minder...
        </button>
      {/if}
    </div>
  </div>

  <!-- MODAL: Categoriekiezer -->
  {#if showAllCategories}
    <div class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40" on:click={() => showAllCategories = false}>
      <div class="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full relative" on:click|stopPropagation>
        <button class="absolute top-3 right-3 text-gray-400 hover:text-gray-600" aria-label="Sluiten" on:click={() => showAllCategories = false}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 class="text-lg font-bold mb-4 text-gray-800">Waar kan ik je mee helpen?</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {#each allCategoriesFromStore as category (category.id)}
            <button
              class="flex flex-col items-center justify-center rounded-lg p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300"
              style={`background-color: ${category.color};`}
              on:click={() => { handleCategorySelect({ detail: { id: category.id, title: category.title } }); showAllCategories = false; }}
              aria-label={category.title}
            >
              <Icon name={category.icon} size={28} className={isDarkColor(category.color) ? 'text-white' : 'text-gray-900'} />
              <span class={`mt-2 text-xs font-semibold ${isDarkColor(category.color) ? 'text-white' : 'text-gray-900'}`}>{category.title}</span>
            </button>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  {#if activeCategoryId && activeQuestions.length > 0}
    <div class="mt-3 p-2 bg-gray-50 rounded-lg shadow-inner" transition:slide={{ duration: 250 }}>
      <h3 class="text-sm font-semibold text-gray-600 mb-2 px-1">Suggesties:</h3>
      {#each activeQuestions as question (question.text)} 
        <QuestionChip {question} on:selectQuestion={handleQuestionSelect} />
      {/each}
    </div>
  {/if}

{:else}
  <div class="p-4 text-center">
    <p class="text-sm text-gray-500">Geen categorieën beschikbaar.</p>
  </div>
{/if}

<style>
  /* Scrollbar styling is niet meer nodig en kan verwijderd worden */
</style> 