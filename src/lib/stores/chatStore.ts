import { writable } from 'svelte/store';
import type { ChatCategory, ChatData, ChatQuestion } from '$lib/types/chat';
// De JSON data wordt direct geïmporteerd. Vite/SvelteKit handelt dit af.
import jsonData from '$lib/data/chat_category.json' assert { type: 'json' };

// --- Interface voor de store state (gebruikt door de hoofd writable) ---
interface ChatStoreState {
  allCategories: ChatCategory[];
  activeCategoryId: string | null;
  showCategoryPicker: boolean;
  isLoading: boolean;
  error: string | null;
}

// --- Initiële State voor de hoofd store ---
const initialState: ChatStoreState = {
  allCategories: [],
  activeCategoryId: null,
  showCategoryPicker: true, 
  isLoading: false,
  error: null,
};

// --- Hoofd Store Creatie ---
const { subscribe, update, set } = writable<ChatStoreState>(initialState);

// --- Aparte Store voor Geselecteerde Vraagtekst ---
// Deze store zal de tekst van de laatst geselecteerde vraag bevatten.
// Het inputveld kan hierop subscriben.
export const selectedQuestionText = writable<string | null>(null);

// --- Acties ---

/**
 * Laadt en verwerkt de categoriegegevens uit de geïmporteerde JSON.
 * Sorteert vragen binnen elke categorie op basis van 'displayOrder'.
 */
function fetchCategoriesData(): void {
  update((state) => ({ ...state, isLoading: true, error: null }));
  try {
    // Type cast de geïmporteerde JSON naar onze gedefinieerde ChatData interface
    const typedJsonData = jsonData as ChatData;

    // Sorteer vragen binnen elke categorie op displayOrder
    const sortedCategories = typedJsonData.categoriesData.map((category: ChatCategory) => ({
      ...category,
      questions: [...category.questions].sort((a: ChatQuestion, b: ChatQuestion) => a.displayOrder - b.displayOrder)
    }));

    update((state) => ({
      ...state,
      allCategories: sortedCategories,
      isLoading: false,
    }));
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Onbekende fout';
    console.error("Failed to load or parse categories data:", errorMessage);
    update((state) => ({
      ...state,
      isLoading: false,
      error: `Kon categorie data niet laden: ${errorMessage}`,
    }));
  }
}

/**
 * Togglet de zichtbaarheid van de categoriekiezer.
 */
function openCategoryPicker(): void {
  update((state) => ({ ...state, showCategoryPicker: !state.showCategoryPicker }));
}

/**
 * Selecteert een actieve categorie op basis van ID.
 * @param id De ID van de te selecteren categorie.
 */
function selectCategory(id: string | null): void { // Allow null to clear selection
  update((state) => {
    if (id === null) {
      return { ...state, activeCategoryId: null };
    }
    const categoryExists = state.allCategories.some((cat: ChatCategory) => cat.id === id);
    if (categoryExists) {
      // Optioneel: verberg de algemene picker als een categorie is gekozen,
      // afhankelijk van hoe de UI dit interpreteert.
      return { ...state, activeCategoryId: id };
    }
    console.warn(`Categorie met id "${id}" niet gevonden.`);
    return state; // Geen wijziging als categorie niet bestaat
  });
}

/**
 * Werkt de selectedQuestionText store bij met de tekst van de geselecteerde vraag.
 * @param questionText De tekst van de geselecteerde vraag.
 */
function selectQuestion(questionText: string): void {
  selectedQuestionText.set(questionText);
  // Optioneel: Nadat een vraag is geselecteerd en in het inputveld is geplaatst,
  // wil je misschien de categorie- en vragenselectie resetten.
  // Dit kan door activeCategoryId op null te zetten.
  // selectCategory(null); // Dit zou de vraagchips verbergen.
}

// --- Store Export ---
export const chatStore = {
  subscribe, // Van de hoofd writable store
  fetchCategoriesData,
  openCategoryPicker,
  selectCategory,
  selectQuestion,
  // De `selectedQuestionText` store wordt apart geëxporteerd en gebruikt.
};

// --- Initialisatie ---
// Roep fetchCategoriesData direct aan om de data te laden zodra de store is geïnitialiseerd.
// Dit zorgt ervoor dat de categorieën beschikbaar zijn wanneer componenten de store gebruiken.
fetchCategoriesData(); 