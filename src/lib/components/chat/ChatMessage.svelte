<script lang="ts">
  import { marked } from 'marked';
  import type { Tokens } from 'marked';
  
  export let message: string = "";
  export let sender: 'bot' | 'user' = 'bot';
  export let showAvatar: boolean = false;

  // DoBbie's custom renderer voor bedrijfsarts-specifieke content
  const renderer = new marked.Renderer();
  
  // Custom styling voor DOBbie's professionele uitdrukkingen
  renderer.text = (token: Tokens.Text | Tokens.Escape | Tokens.Tag) => {
    let text = String(token.text ?? '');
    
    // DOBbie's zakelijke keywords met subtiele styling
    text = text
      .replace(/\bWet Verbetering Poortwachter\b/gi, '<span class="inline-flex items-center bg-[#771138]/10 text-[#771138] px-2 py-1 rounded font-semibold text-sm">⚖️ Wet Verbetering Poortwachter</span>')
      .replace(/\bWVP\b/gi, '<span class="inline-flex items-center bg-[#771138]/10 text-[#771138] px-2 py-1 rounded font-semibold text-sm">⚖️ WVP</span>')
      .replace(/\bArbowet\b/gi, '<span class="inline-flex items-center bg-[#3D3D3D]/10 text-[#3D3D3D] px-2 py-1 rounded font-semibold text-sm">📋 Arbowet</span>')
      .replace(/\bAVG\b/gi, '<span class="inline-flex items-center bg-[#3D3D3D]/10 text-[#3D3D3D] px-2 py-1 rounded font-semibold text-sm">🔒 AVG</span>');

    // Termijnmarkering met professionele badges
    text = text.replace(/(\d+)\s*(weken|dagen|maanden|jaar)/gi, (match: string, amount: string, period: string) => {
      return `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#E9B046]/20 text-[#E9B046] border border-[#E9B046]/30">
        🕒 ${amount} ${period}
      </span>`;
    });

    // Proces stappen markeren
    text = text.replace(/stap (\d+)/gi, (match: string, stepNum: string) => {
      return `<span class="inline-flex items-center bg-[#D1D5DB] text-[#3D3D3D] px-2 py-1 rounded-lg text-sm font-medium">
        📝 Stap ${stepNum}
      </span>`;
    });

    return text;
  };
  
  // Custom links voor DOBbie's professionele content
  renderer.link = function(token: Tokens.Link) {
    const { href, title, text } = token;
    if (text === '[RICHTLIJN]' || text === 'RICHTLIJN') {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-[#771138] text-white rounded-lg hover:bg-[#5A0D29] transition-colors duration-200 font-medium text-sm shadow-sm">
        📋 Bekijk richtlijn →
      </a>`;
    }
    if (text === '[FORMULIER]' || text === 'FORMULIER') {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-[#E9B046] text-black rounded-lg hover:bg-[#D19E3A] transition-colors duration-200 font-medium text-sm shadow-sm">
        📄 Download formulier →
      </a>`;
    }
    if (text === '[ADVIES]' || text === 'ADVIES') {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-[#3D3D3D] text-white rounded-lg hover:bg-[#2D2D2D] transition-colors duration-200 font-medium text-sm shadow-sm">
        💡 Lees meer advies →
      </a>`;
    }
    // Gewone links
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-[#771138] underline hover:text-[#5A0D29] transition-colors font-medium">${text}</a>`;
  };

  // Custom list rendering voor actielijsten en procedures
  renderer.list = function(token: Tokens.List) {
    const ordered = token.ordered ?? false;
    const itemsHtml = (token.items ?? [])
      .map(item => `<li class="flex items-start"><span class="mr-2 mt-1 text-[#771138]">${ordered ? '📋' : '•'}</span><span>${this.parser.parse(item.tokens)}</span></li>`)
      .join('');
    
    // Check of het een procedure-lijst is
    if (itemsHtml.includes('Meld ') || itemsHtml.includes('Plan ') || itemsHtml.includes('Controleer ') || 
        itemsHtml.includes('Bespreek ') || itemsHtml.includes('Documenteer ')) {
      return `<div class="bg-[#F5F2EB] rounded-lg p-4 my-4 border-l-4 border-[#771138]">
        <h4 class="font-semibold text-[#771138] mb-3 flex items-center">
          📋 <span class="ml-2">Te ondernemen stappen:</span>
        </h4>
        <ul class="space-y-2 text-[#3D3D3D]">${itemsHtml}</ul>
      </div>`;
    }
    
    const listClass = ordered ? 'list-decimal' : 'list-disc';
    return `<${ordered ? 'ol' : 'ul'} class="${listClass} ml-4 space-y-1 text-[#3D3D3D]">${itemsHtml}</${ordered ? 'ol' : 'ul'}>`;
  };

  // Custom blockquotes voor belangrijke informatie
  renderer.blockquote = function(token: Tokens.Blockquote) {
    return `<div class="bg-gradient-to-r from-[#F5F2EB] to-[#FFFFFF] border-l-4 border-[#E9B046] p-4 my-4 rounded-r-lg">
      <div class="flex items-start">
        <span class="text-xl mr-3 text-[#E9B046]">⚠️</span>
        <div class="text-[#3D3D3D] font-medium">${token.text ?? ''}</div>
      </div>
    </div>`;
  };

  // Custom strong rendering voor belangrijke termen
  renderer.strong = function(token: Tokens.Strong) {
    const text = this.parser.parseInline(token.tokens);
    return `<strong class="font-semibold text-[#771138]">${text}</strong>`;
  };
  
  // Configureer marked met custom renderer
  marked.setOptions({ 
    renderer,
    breaks: true,  // Line breaks worden <br>
    gfm: true      // GitHub flavored markdown
  });
  
  // Parse de message alleen voor bot berichten
  $: formattedMessage = sender === 'bot' ? marked(message) : message;
</script>

{#if sender === 'bot'}
  <div class="chat-message flex items-start gap-3 mb-4">
    {#if showAvatar}
      <div class="chat-avatar w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 bg-[#771138] flex items-center justify-center">
        <span class="text-white text-sm font-semibold">DB</span>
      </div>
    {:else}
      <div class="chat-avatar-spacer w-8 md:w-10 flex-shrink-0"></div>
    {/if}
    <div class="speech-bubble left bg-[#F5F2EB] text-[#000000] rounded-[16px_16px_16px_4px] max-w-[75%] shadow-sm border border-[#D1D5DB]/30">
      <div class="prose prose-sm prose-dobie max-w-none px-4 py-3">
        {@html formattedMessage}
      </div>
    </div>
  </div>
{:else}
  <div class="chat-message flex items-start justify-end gap-3 mb-4">
    <div class="speech-bubble right bg-[#771138] text-white rounded-[16px_16px_4px_16px] max-w-[75%] shadow-sm">
      <div class="px-4 py-3 font-medium">
        {@html message}
      </div>
    </div>
  </div>
{/if}

<style>
  /* Custom prose styling voor DOBbie's professionele chatbot */
  :global(.prose-dobie) {
    --tw-prose-body: #3D3D3D;
    --tw-prose-headings: #771138;
    --tw-prose-links: #771138;
    --tw-prose-bold: #771138;
    --tw-prose-quotes: #3D3D3D;
    --tw-prose-quote-borders: #E9B046;
    font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  /* Override prose defaults voor professionele chat bubbles */
  :global(.prose-dobie p) {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    line-height: 1.6;
    font-size: 15px;
  }

  :global(.prose-dobie p:first-child) {
    margin-top: 0;
  }

  :global(.prose-dobie p:last-child) {
    margin-bottom: 0;
  }

  /* Professionele links styling */
  :global(.prose-dobie a) {
    text-decoration: none;
    font-weight: 600;
    border-bottom: 1px solid transparent;
    transition: all 0.2s ease;
  }

  :global(.prose-dobie a:hover) {
    border-bottom-color: #771138;
  }

  /* Styling voor lists in chat */
  :global(.prose-dobie ul) {
    margin-top: 0.75em;
    margin-bottom: 0.75em;
  }

  :global(.prose-dobie li) {
    margin-top: 0.25em;
    margin-bottom: 0.25em;
    line-height: 1.5;
  }

  /* Styling voor strong/bold text */
  :global(.prose-dobie strong) {
    color: #771138;
    font-weight: 600;
  }

  /* Headings styling */
  :global(.prose-dobie h1, .prose-dobie h2, .prose-dobie h3) {
    color: #771138;
    font-family: 'Times New Roman', serif;
    font-weight: 600;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }

  :global(.prose-dobie h1:first-child, .prose-dobie h2:first-child, .prose-dobie h3:first-child) {
    margin-top: 0;
  }

  /* Code en pre styling voor eventuele technische content */
  :global(.prose-dobie code) {
    background-color: #F5F2EB;
    color: #771138;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
    font-weight: 500;
  }

  /* Responsive aanpassingen */
  @media (max-width: 640px) {
    :global(.prose-dobie) {
      font-size: 14px;
    }
    
    :global(.prose-dobie p) {
      font-size: 14px;
    }
    
    .speech-bubble {
      max-width: 85%;
    }
  }

  /* Speech bubble specifieke styling */
  .speech-bubble {
    position: relative;
    word-wrap: break-word;
    font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  /* Hover effects voor interactieve elementen */
  .chat-message:hover .speech-bubble {
    box-shadow: 0 4px 12px rgba(119, 17, 56, 0.1);
    transition: box-shadow 0.2s ease;
  }
</style>