# Technische Implementatie voor ChatMessage Stijlen met Marked

In deze handleiding beschrijven we hoe je de chatberichten in een vergelijkbare chatbot kunt stijlen met behulp van de `marked` bibliotheek en aangepaste renderers, zoals geïmplementeerd in `ChatMessage.svelte`.

## Vereisten
- **SvelteKit**: Zorg ervoor dat je project is opgezet met SvelteKit.
- **Marked**: Installeer de `marked` bibliotheek voor het parsen van Markdown.
- **Tailwind CSS**: Gebruik Tailwind CSS voor styling.

## Stappen

1. **Installeer Marked**
   
   Voeg de `marked` bibliotheek toe aan je project:
   ```bash
   npm install marked
   ```

2. **Maak een Custom Renderer**
   
   In je Svelte component, importeer `marked` en maak een nieuwe renderer aan:
   ```typescript
   import { marked } from 'marked';
   const renderer = new marked.Renderer();
   ```

3. **Definieer Aangepaste Render Methodes**
   
   Voeg aangepaste methodes toe aan de renderer om specifieke stijlen toe te passen:
   
   - **Text**: Vervang specifieke uitdrukkingen door gestylede HTML elementen.
   - **Link**: Stijl links als knoppen voor specifieke tekst zoals `[MODULE]`, `[CALCULATOR]`, etc.
   - **List**: Pas de weergave van lijsten aan, inclusief actie-lijstjes met specifieke styling.
   - **Blockquote**: Stijl blockquotes met een achtergrond en een icoon.

   Voorbeeld:
   ```typescript
   renderer.text = (token) => {
     let text = String(token.text ?? '');
     text = text.replace(/Gewoon doen!/gi, '<span class="inline-flex items-center bg-green-200 text-green-800 px-2 py-1 rounded-full font-bold text-sm">✅ Gewoon doen!</span>');
     return text;
   };
   
   renderer.link = function(token) {
     const { href, text } = token;
     return `<a href="${href}" class="text-pink-600 underline">${text}</a>`;
   };
   ```

4. **Configureer Marked**
   
   Stel `marked` in met de aangepaste renderer en opties:
   ```typescript
   marked.setOptions({
     renderer,
     breaks: true,
     gfm: true
   });
   ```

5. **Integreer in Svelte Component**
   
   Gebruik de `marked` functie om berichten te parsen en te renderen binnen je Svelte component:
   ```svelte
   $: formattedMessage = sender === 'bot' ? marked(message) : message;
   ```

6. **Stijl de Chatberichten**
   
   Gebruik Tailwind CSS om de gestylede HTML elementen verder aan te passen binnen je Svelte component:
   ```css
   :global(.prose-pink) {
     --tw-prose-body: #374151;
     --tw-prose-bold: #374151;
   }
   ```

Volg deze stappen om de chatberichten in je chatbot te stijlen zoals geïmplementeerd in `ChatMessage.svelte`. Pas de stijlen aan naar jouw voorkeuren en zorg ervoor dat de gebruikerservaring consistent en aantrekkelijk is.


# Session Log - Bullet Lists Opmaak Verbetering

## Probleem
- Vetgedrukte tekst (`**tekst**`) in bullet lists werd niet correct weergegeven
- Markdown syntax bleef zichtbaar als literale sterretjes
- Normale vetgedrukte tekst buiten lijsten werkte wel correct

## Root Cause
- Custom `renderer.list` functie in `ChatMessage.svelte` verstoorde Markdown parsing binnen lijstitems
- `parseInline()` verwerkte geen `**bold**` syntax binnen list context

## Oplossingen Geprobeerd
1. **Strong renderer verwijderen** - Hielp niet, probleem was specifiek bij lijsten
2. **ParseInline aanpassen** - Nog steeds geen verwerking van bold syntax
3. **Handmatige vervanging** ✅ - **WERKENDE OPLOSSING**

## Finale Fix
**Bestand:** `src/lib/components/chat/ChatMessage.svelte`
```javascript
// In renderer.list functie:
let content = this.parser.parseInline(item.tokens);
// Handmatig **tekst** vervangen door <strong>tekst</strong>
content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
```

## Extra Verbetering
- **Roze bullets:** CSS toegevoegd voor `::marker` pseudo-element
```css
:global(.prose ul li::marker) {
  color: #771138; /* Bordeaux kleur voor consistentie met de styleguide */
}
```

## Resultaat
- ✅ Vetgedrukte tekst in bullet lists werkt correct
- ✅ Bordeaux bullets passend bij de stijl van de app
- ✅ Normale tekst opmaak blijft ongewijzigd

## Lessons Learned

1. **Markdown Parsing in Lists**
   - Het is belangrijk om te begrijpen hoe Markdown parsing werkt binnen verschillende contexten, zoals lijsten. De standaard `parseInline()` functie van `marked` kan bepaalde syntaxis zoals `**bold**` niet correct verwerken binnen lijstitems, wat handmatige aanpassingen vereist.

2. **Custom Renderers**
   - Het gebruik van custom renderers kan krachtig zijn, maar vereist zorgvuldige implementatie om ervoor te zorgen dat alle gewenste Markdown-syntaxis correct wordt verwerkt. Het is essentieel om te testen hoe deze renderers omgaan met verschillende Markdown-elementen.

3. **CSS Styling**
   - Kleine CSS-aanpassingen, zoals het kleuren van bullets, kunnen een groot verschil maken in de consistentie en esthetiek van de gebruikersinterface. Het gebruik van pseudo-elementen zoals `::marker` kan effectief zijn voor het aanpassen van lijststijlen.

4. **Iteratief Probleemoplossen**
   - Het oplossen van problemen met Markdown rendering kan een iteratief proces zijn. Het is nuttig om verschillende benaderingen te proberen en te documenteren welke oplossingen wel en niet werken, zoals het verwijderen van de `strong` renderer en het aanpassen van `parseInline()`.

5. **Documentatie en Communicatie**
   - Het bijhouden van een gedetailleerd session log helpt bij het vastleggen van problemen en oplossingen, wat waardevol is voor toekomstige referentie en voor het delen van kennis binnen het team.
