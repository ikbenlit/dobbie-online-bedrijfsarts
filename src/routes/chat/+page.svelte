<script lang="ts">
  import { onMount, tick } from 'svelte';
  import Sidebar from '$lib/components/ui/sidebar.svelte';
  import SidebarLink from '$lib/components/ui/sidebarlink.svelte';
  import UserMenu from '$lib/components/ui/user-menu.svelte';
  import MobileMenuTrigger from '$lib/components/ui/mobile-menu-trigger.svelte';
  import { sidebarStore } from '$lib/stores/sidebarStore.js';
  import { user, type User } from '$lib/stores/userStore.js';
  import { browser } from '$app/environment';
  import { chatStore, selectedQuestionText } from '$lib/stores/chatStore.js';
  import CategoryChipContainer from '$lib/components/chat/CategoryChipContainer.svelte';
  import ChatMessage from '$lib/components/chat/ChatMessage.svelte';
  
  // Voeg viewport meta tag toe voor mobiele apparaten
  if (browser) {
    // Controleer of er al een viewport meta tag is
    const existingViewport = document.querySelector('meta[name="viewport"]');
    if (!existingViewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
      document.head.appendChild(meta);
    }
  }
  
  // Haal de open state op voor conditionele styling
  let sidebarOpen: boolean;
  sidebarStore.subscribe(value => {
    sidebarOpen = value.open;
  });
  
  // Haal de user state op voor de UserMenu component
  let currentUser: User | null = null;
  user.subscribe((value: User | null) => {
    currentUser = value;
  });
  
  // Interface voor berichten
  interface Message {
    id: number;
    sender: 'user' | 'bot';
    text: string;
    role?: 'user' | 'model'; // Voor Vertex AI API
  }
  
  // State variabelen
  let userInput = '';
  let messages: Message[] = [];
  let isTyping = false;
  let scrollContainer: HTMLDivElement; // Referentie naar de scrollbare div
  let inputElement: HTMLInputElement; // Referentie naar het input element
  let showInfoModal = false; // State voor info modal
  
  // State voor categorie chips integratie
  let showCategoryChipsDisplay: boolean = false; // Zal geset worden door de store
  let activeCategorySelectedID: string | null = null; // Zal geset worden door de store

  // Definieer de structuur van de store's state voor typering
  interface PageChatStoreValue {
    allCategories: unknown[]; // We gebruiken allCategories hier niet direct, dus unknown is ok
    activeCategoryId: string | null;
    showCategoryPicker: boolean;
    isLoading: boolean;
    error: string | null;
  }

  chatStore.subscribe((value: PageChatStoreValue) => {
    showCategoryChipsDisplay = value.showCategoryPicker;
    activeCategorySelectedID = value.activeCategoryId;
  });

  // Reageer op selectie van een vraag uit de chip container
  $: if (browser && $selectedQuestionText) { 
    userInput = $selectedQuestionText;
    selectedQuestionText.set(null); 
    tick().then(() => {
      sendMessage(); 
    });
  }

  // Functie om naar de bodem van de chat te scrollen
  async function scrollToBottom() {
    await tick(); 
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }
  
  // Initialiseer de chat met welkomstbericht
  function initializeChat() {
    messages = [];
    messages = [{ 
      id: Date.now(), 
      sender: 'bot', 
      text: 'Hoi! Fijn dat je er bent. Waarmee kan ik je helpen?',
      role: 'model'
    }];
    scrollToBottom();
  }
  
  // Reset de chat naar de initiële toestand
  function resetChat() {
    console.log('Chat wordt gereset');
    userInput = '';
    initializeChat();
  }
  
  // Vereenvoudigde onMount
  onMount(() => {
    initializeChat();
  });
  
  // Functie om de API stream te verwerken en messages bij te werken
  async function processStream(response: Response, botMessageId: number) {
    if (!response.body) {
      throw new Error('Response body is null');
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let currentBotText = '';
    let isFirstChunk = true;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      
      if (isFirstChunk) {
        try {
          // Probeer het eerste chunk te parsen als JSON met model info
          const modelInfo = JSON.parse(chunk);
          if (modelInfo.type === 'model') {
            console.log('OpenAI Model:', modelInfo.model);
            isFirstChunk = false;
            continue; // Sla deze chunk over voor de chatberichten
          }
        } catch (e) {
          // Als het geen JSON is, behandel het als normale tekst
        }
        isFirstChunk = false;
      }

      currentBotText += chunk;

      messages = messages.map(msg =>
        msg.id === botMessageId ? { ...msg, text: currentBotText, role: 'model' } : msg
      );
      scrollToBottom(); 
    }
  }
  
  // Aangepaste sendMessage functie
  async function sendMessage() {
    const textToSend = userInput.trim();
    if (textToSend === '') return;

    const newUserMessage: Message = { 
      id: Date.now(), 
      sender: 'user', 
      text: textToSend,
      role: 'user' 
    };
    messages = [...messages, newUserMessage];
    scrollToBottom();
    
    userInput = '';

    showTypingIndicatorUI();
    const botMessageId = Date.now() + 1; 

    messages = [...messages, {
      id: botMessageId,
      sender: 'bot',
      text: '', 
      role: 'model'
    }];
    scrollToBottom();

    const messagesForAPI = messages
      .filter(msg => msg.role)
      .map(msg => ({
        role: msg.role,
        content: msg.text
      }));
      
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesForAPI }) 
      });

      if (!response.ok) {
        throw new Error(`API aanroep mislukt: ${response.statusText}`);
      }
      await processStream(response, botMessageId);

    } catch (error) {
      console.error('Fout bij het streamen van de API:', error);
      messages = messages.map(msg =>
        msg.id === botMessageId ? { ...msg, text: "Oeps, DOBbie ligt er zelf even uit. Probeer het zo opnieuw!" } : msg
      );
      scrollToBottom();
    } finally {
      removeTypingIndicatorUI();
      await tick();
      inputElement?.focus(); 
    }
  }
  
  // Functie voor het afhandelen van Enter-toets
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !isTyping) {
      sendMessage();
    }
  }

  function showTypingIndicatorUI() {
    isTyping = true;
    scrollToBottom();
  }

  function removeTypingIndicatorUI() {
    isTyping = false;
  }
</script>

<!-- Hoofdcontainer met nieuwe achtergrondkleur -->
<div class="flex flex-col sm:flex-row justify-center items-start bg-[#F5F2EB] text-[#3D3D3D]">
  <Sidebar on:resetChat={resetChat}>
    <!-- Sidebar achtergrond aangepast voor meer contrast -->
    <div class="p-4 flex-1 overflow-y-auto bg-white border-r border-[#D1D5DB]">
      <!-- Logo container met nieuwe styling -->
      <div class="h-12 flex items-center justify-center mb-6">
        <div 
          class="logo w-10 h-10 bg-[#771138] rounded-full flex items-center justify-center font-bold text-white text-lg shadow-md"
          class:w-full={sidebarOpen}
          class:max-w-[200px]={sidebarOpen}
          class:h-10={sidebarOpen}
          class:mx-auto={sidebarOpen}
        >
          DOBbie
        </div>
      </div>
      
      <!-- Nieuwe Chat Link met contrasterende styling -->
      <SidebarLink 
        link={{
          label: "Nieuwe Chat", 
          href: "/chat", 
          icon: `<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 4v16m8-8H4\" /></svg>`
        }}
        className="mb-4 bg-[#E9B046] text-black hover:bg-[#771138] hover:text-white rounded-md transition-colors duration-200"
      />

      <!-- Navigatie links met nieuwe styling -->
      <div class="space-y-2">
        <SidebarLink 
          link={{
            label: "Verzuimbeleid",
            href: "/beleid",
            icon: `<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6\" /></svg>`,
          }}
          className="text-[#3D3D3D] hover:bg-[#F5F2EB] rounded-md transition-colors duration-200"
        />
        <SidebarLink 
          link={{
            label: "Wet Poortwachter",
            href: "/wetgeving",
            icon: `<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2\" /></svg>`,
          }}
          className="text-[#3D3D3D] hover:bg-[#F5F2EB] rounded-md transition-colors duration-200"
        />
        <SidebarLink 
          link={{
            label: "Contact",
            href: "/contact",
            icon: `<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z\" /></svg>`,
          }}
          className="text-[#3D3D3D] hover:bg-[#F5F2EB] rounded-md transition-colors duration-200"
        />
      </div>
    </div>

    <!-- User menu met nieuwe styling -->
    <svelte:fragment slot="user">
      {#if currentUser}
        <div class="border-t border-[#D1D5DB] bg-white">
          <UserMenu user={currentUser} />
        </div>
      {/if}
    </svelte:fragment>
  </Sidebar>

  <!-- Mobile Menu Trigger (blijft ongewijzigd voor nu) -->
  <MobileMenuTrigger />

  <!-- Main chat area met nieuwe styling -->
  <div class="chat-container w-full max-w-3xl h-screen md:ml-64 bg-white rounded-none sm:rounded-lg shadow-lg flex flex-col overflow-hidden m-0">
    <!-- Nieuwe header met bedrijfsarts stijl -->
    <div class="chat-header bg-[#771138] p-4 flex items-center gap-3">
      <div class="logo w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-[#771138] text-lg">
        D
      </div>
      <h1 class="font-['Open_Sans'] font-bold text-xl text-white">DOBbie</h1>
    </div>

    <!-- Chat Berichten Area met nieuwe kleuren -->
    <div bind:this={scrollContainer} class="chat-messages flex-1 overflow-y-auto p-6 sm:p-4 space-y-3">
      <!-- CategoryChipContainer met nieuwe styling -->
      {#if showCategoryChipsDisplay}
        <div class="mt-1 mb-3">
          <CategoryChipContainer />
        </div>
      {/if}
      
      <!-- Berichten met nieuwe styling -->
      {#each messages as message, i (message.id)}
        <ChatMessage
          message={message.text}
          sender={message.sender}
          showAvatar={message.sender === 'bot' && (i === 0 || messages[i-1].sender !== 'bot')}
        />
      {/each}

      <!-- Typing indicator met nieuwe kleuren -->
      {#if isTyping}
        <div class="typing-indicator flex gap-1 p-3 bg-[#F5F2EB] rounded-lg self-start mb-2">
          <div class="typing-dot w-2 h-2 bg-[#D1D5DB] rounded-full animate-bounce"></div>
          <div class="typing-dot w-2 h-2 bg-[#D1D5DB] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          <div class="typing-dot w-2 h-2 bg-[#D1D5DB] rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
        </div>
      {/if}
    </div>

    <!-- Input Area met nieuwe styling -->
    <div class="chat-input-container p-4 border-t border-[#D1D5DB] flex gap-3 items-center">
      <input
        type="text"
        bind:value={userInput}
        bind:this={inputElement}
        on:keypress={handleKeyPress}
        placeholder="Typ uw vraag hier..."
        class="chat-input flex-1 p-4 border border-[#D1D5DB] rounded-md text-base min-h-[48px] font-['Open_Sans'] focus:outline-none focus:border-[#771138] focus:ring-2 focus:ring-[#771138]/20 transition-colors duration-200"
        disabled={isTyping}
      />
      <button
        on:click={() => sendMessage()}
        class="send-button bg-[#771138] text-white rounded-md w-12 h-12 flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-[#5A0D29] disabled:opacity-50"
        aria-label="Verzend bericht"
        disabled={isTyping || userInput.trim() === ''}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </button>
    </div>
  </div>
</div>

<!-- Info Modal met nieuwe styling -->
{#if showInfoModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-base sm:text-lg font-bold text-[#771138] font-['Times_New_Roman']">Over De Online Bedrijfsarts</h2>
        <button 
          on:click={() => showInfoModal = false}
          class="text-[#D1D5DB] hover:text-[#3D3D3D]"
          aria-label="Sluiten"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="space-y-3 sm:space-y-4 text-[#3D3D3D] text-sm sm:text-base font-['Open_Sans']">
        <p>De Online Bedrijfsarts helpt u met professioneel advies over verzuim, wetgeving en beleid. Duidelijk en direct, zonder omwegen.</p>
        
        <h3 class="font-bold mt-2 text-[#771138]">Hoe werkt het?</h3>
        <p>De chatbot volgt de Wet Verbetering Poortwachter en andere relevante wetgeving om u te ondersteunen bij:</p>
        <ul class="list-disc pl-5 space-y-1">
          <li>Verzuimbegeleiding</li>
          <li>Wet- en regelgeving</li>
          <li>Beleidsvraagstukken</li>
        </ul>
        
        <h3 class="font-bold mt-2 text-[#771138]">Privacy</h3>
        <p>Uw gesprekken worden niet opgeslagen en zijn alleen zichtbaar voor u. De chatbot gebruikt de context van het huidige gesprek om u beter te kunnen adviseren.</p>
        
        <h3 class="font-bold mt-2 text-[#771138]">Thema's</h3>
        <p>U kunt kiezen uit verschillende onderwerpen:</p>
        <ul class="list-disc pl-5 space-y-1">
          <li>Verzuimmelding</li>
          <li>Wet Poortwachter</li>
          <li>Beleid en procedures</li>
        </ul>
      </div>
      
      <div class="mt-5 sm:mt-6 flex justify-end">
        <button
          on:click={() => showInfoModal = false}
          class="rounded-md bg-[#771138] px-3 sm:px-4 py-2 font-['Open_Sans'] text-xs sm:text-sm font-medium text-white shadow-md hover:bg-[#5A0D29] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#771138] focus:ring-offset-2"
        >
          Sluiten
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Update bestaande stijlen */
  :global(.sidebar-link) {
    @apply p-3 flex items-center gap-3 transition-colors duration-200;
  }

  :global(.sidebar-link:hover) {
    @apply bg-[#F5F2EB];
  }

  :global(.sidebar-link.active) {
    @apply bg-[#771138] text-white;
  }

  /* Rest van de bestaande stijlen behouden */
  :global(body) {
    font-family: 'Open Sans', sans-serif;
  }

  .chat-header h1 {
    font-family: 'Times New Roman', serif;
  }

  /* Typing indicator animaties behouden maar met nieuwe kleuren */
  .typing-dot {
    animation: typingAnimation 1.4s infinite ease-in-out;
    background-color: #D1D5DB;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes typingAnimation {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-4px); }
  }

  /* Mobiele aanpassingen */
  @media (max-width: 640px) {
    .chat-container {
      border-radius: 0;
      height: 100vh;
      max-width: 100%;
      margin: 0;
    }
    .chat-messages {
      padding: 16px;
    }
  }
</style> 