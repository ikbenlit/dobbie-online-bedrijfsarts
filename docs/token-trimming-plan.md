# Technisch Implementatieplan: Fase 1 - Token-bewuste Prompt Trimming

**Doel:** De chatbot stabiel maken door het "afgebroken chat"-probleem definitief op te lossen. Dit wordt bereikt door de naïeve context-limiter (`slice(-8)`) te vervangen door een robuust mechanisme dat de gespreksgeschiedenis beperkt op basis van een geschat aantal tokens. Dit garandeert dat er altijd voldoende ruimte overblijft voor de AI om een volledig antwoord te genereren. Dit document dient als leidraad voor de development.

---

## 1. Projectoverzicht & Status

| Fase | Sub-fase / Deliverable | Status | Verantwoordelijke(n) | Notities |
| :--- | :--- | :--- | :--- | :--- |
| **Fase 1** | 1.1 Ontwikkelen van de Tokenizer Utility | ⏳ Gepland | Backend Developer | Creëren van een herbruikbare service voor token-estimatie en trimming. |
| | 1.2 Integratie in de Chat Service | ⏳ Gepland | Backend Developer | De nieuwe utility toepassen op de inkomende chatgeschiedenis. |
| | 1.3 Aanpassen van de Frontend | ⏳ Gepland | Frontend Developer | De `slice(-8)`-beperking verwijderen en de volledige geschiedenis doorsturen. |
| | 1.4 Testen en Verificatie | ⏳ Gepland | QA / Developer | Handmatig valideren dat lange gesprekken niet meer vastlopen. |

---

## 2. Architecturale Principes

Alle ontwikkeling volgt deze kernprincipes:
*   **DRY (Don't Repeat Yourself):** Voorkom duplicatie. Hergebruik bestaande componenten, helpers en services waar mogelijk.
*   **SOC (Separation of Concerns):** Isoleer functionaliteit in eigen services/modules. De token-logica wordt in een aparte utility geplaatst.
*   **Strategy & Factory Patterns:** Gebruik design patterns zoals de Strategy en Factory patterns om tier-specifieke logica en het aanmaken van objecten te centraliseren en te ontkoppelen.
*   **Clean Architecture:** Respecteer de grenzen tussen de verschillende lagen (bv. UI, business logic, data access). Businesslogica hoort niet in de UI-laag thuis.

---

## 3. Development Standaarden

*   **Test Locatie:** Testbestanden (bv. `*.test.ts`) horen thuis in een `__tests__` submap, of in de `tests/` map op root niveau. Plaats testbestanden **nooit** in `src/`.
*   **Project-libs:** Maak gebruik van bestaande project-bibliotheken (bv. voor I/O, configuratie, logging) in plaats van deze functionaliteit opnieuw te implementeren.

---

## 4. Teststrategie

*   **Pragmatische Aanpak:** Hou de teststrategie simpel en gefocust.
*   **Unit Tests (Essentieel):** Schrijf een unit test voor de nieuwe, pure `trimMessagesToTokenLimit` functie in de Tokenizer Utility. Test verschillende scenario's: een lege array, een array onder de limiet, en een array die getrimd moet worden. Dit garandeert de correcte werking van de kernlogica.
*   **Handmatige verificatie (Cruciaal):** Test de 'happy path' en de kritieke gebruikersflow handmatig. Voer een zeer lang gesprek (20+ berichten) met de chatbot om te valideren dat de antwoorden niet meer worden afgebroken.

---

## Fase 1: Implementatie van Token-bewuste Prompt Trimming

**Doel:** De naïeve `slice(-8)` context management vervangen door een robuust, token-gebaseerd trimming mechanisme om te garanderen dat de input-prompt nooit een veilige limiet overschrijdt.

### **Sub-fase 1.1: Ontwikkelen van de Tokenizer Utility**

*   **Doel:** Creëer een centrale, herbruikbare helper-module voor het schatten van token-aantallen en het snoeien van de berichten-array.
*   **Backend Developer Taken:**
    1.  **Aanmaken bestand:** Creëer een nieuw bestand: `src/lib/server/utils/token-helper.ts`.
    2.  **Implementeren Token Estimator:** Schrijf een pure functie `estimateTokens(text: string): number`. Gebruik de `text.length / 4` vuistregel als betrouwbare schatting.
    3.  **Implementeren Trimming Functie:** Schrijf de kernfunctie `trimMessagesToTokenLimit(messages: Message[], limit: number): Message[]`. Deze functie moet:
        *   Van achter naar voren door de `messages` array itereren.
        *   De tokens van elk bericht optellen.
        *   Stoppen met het toevoegen van oudere berichten zodra de `limit` is bereikt.
        *   Ervoor zorgen dat een eventuele systeemprompt (indien aanwezig) altijd behouden blijft.

### **Sub-fase 1.2: Integratie in de Chat Service**

*   **Doel:** De nieuwe utility toepassen in de `chat-service` om de inkomende berichten te verwerken voordat ze naar de AI worden gestuurd.
*   **Backend Developer Taken:**
    1.  **Aanpassen `chat-service.ts`:** Open `src/lib/server/vertex-ai/chat-service.ts`.
    2.  **Importeren Utility:** Importeer de `trimMessagesToTokenLimit` functie uit de nieuwe token-helper.
    3.  **Toepassen Trimming:** In de `createChatStream` functie, roep `trimMessagesToTokenLimit` aan op de `messages` array voordat deze naar de `createPromptWithContext` functie wordt doorgegeven. Stel een veilige limiet in (bv. `100000` tokens, wat ruim binnen de 1M-limiet van het model valt).

### **Sub-fase 1.3: Aanpassen van de Frontend**

*   **Doel:** Zorg ervoor dat de volledige chatgeschiedenis naar de backend wordt gestuurd, aangezien de trim-logica nu server-side is.
*   **Frontend Developer Taken:**
    1.  **Aanpassen `+page.svelte`:** Open `src/routes/chat/+page.svelte`.
    2.  **Verwijderen `slice`:** Zoek de `sendMessage` functie en de `messagesForAPI` constante. Verwijder de `.slice(-8)`-methode uit de definitie.

### **Definition of Done voor Fase 1:**
*   De `slice(-8)`-logica is volledig verwijderd uit de frontend-code.
*   De nieuwe `token-helper.ts` module is geïmplementeerd en heeft een passerende unit test voor de trim-logica.
*   De `chat-service.ts` gebruikt de nieuwe helper om de context te beperken.
*   **Verificatie:** Een gebruiker kan een zeer lang gesprek voeren (20+ berichten) zonder dat de chat wordt afgebroken. De AI behoudt de context van de meest recente berichten in het gesprek.

---
