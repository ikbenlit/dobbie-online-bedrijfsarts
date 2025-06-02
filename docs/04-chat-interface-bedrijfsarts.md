# 🎨 "De Online Bedrijfsarts" Chat: Professioneel en Direct – DoBie

**Concept**: Een minimalistische, schermvullende chatinterface die HR professionals, leidinggevenden en casemanagers verwelkomt met een zakelijke, directe benadering voor verzuimbegeleiding. De interface leidt hen door een praktische flow volgens de professionele aanpak van de bedrijfsarts. De interface voelt zakelijk en ondersteunend, zoals een digitale bedrijfsarts, en moedigt actie aan met een toegankelijke, professionele opmaak.

---

## Visueel Ontwerp

- **Algemene lay-out**:
  - De interface vult het volledige scherm, met een centrale witte chatcontainer (achtergrond: `#FFFFFF`, border-radius: 8px, lichte schaduw `box-shadow: 0 4px 12px rgba(0,0,0,0.15)`) van maximaal 800px breed op desktop, volledig breed op mobiel (<768px). De achtergrond is licht crème (`#F5F2EB`) voor een rustige, professionele uitstraling.
  - Bovenaan de chatcontainer een smalle, bordeaux header (`#771138`) met de tekst "De Online Bedrijfsarts" in Open Sans Bold (20px, wit), plus een klein DoBie-logo voor herkenbaarheid.
  - De container heeft een schone look met veel witruimte (16-32px padding) om afleiding te minimaliseren en focus te bevorderen.

- **Chatberichten**:
  - **Botberichten**: In licht crème speech bubbles (`#F5F2EB`, border-radius: 16px 16px 16px 4px, subtiele schaduw) aan de linkerkant, met zwarte tekst (Open Sans Regular, 15px). Een subtiele typanimatie (fade-in over 0,3 seconden) maakt de bot menselijker.
  - **Gebruikersberichten**: In bordeaux speech bubbles (`#771138`, border-radius: 16px 16px 4px 16px) aan de rechterkant met witte tekst (Open Sans Regular, 15px).
  - Berichten zijn gescheiden met 12px verticale ruimte; de container scrollt soepel bij langere gesprekken.

- **Invoerveld**:
  - Onderaan een groot invoerveld (wit, border-radius: 6px, 14px padding, border: 1px solid `#D1D5DB`) met een bordeaux focusstate (`#771138`, 2px border). Minimaal 48px hoog voor tapvriendelijkheid op mobiel.
  - Rechts een bordeaux verzendknop (`#771138`, border-radius: 6px) met een wit pijl-icoon (Lucide `Send`), die bij hover donkerder wordt (`#5A0D29`).

- **Quick actions en suggesties**:
  - Bovenaan, na het welkomstbericht, drie goudgele knoppen (`#E9B046`, border-radius: 16px, Open Sans Semibold, 14px, tekst: `#000000`) met suggesties: "Verzuimmelding", "Wet Poortwachter", "Beleid vraag". Knoppen hebben een lichte schaduw en worden bordeaux bij hover (`#771138`, tekst wit).
  - Quick action prompts verschijnen als 2-3 goudgele knoppen onder het invoerveld na elk antwoord, zoals "Meer informatie", "Naar wetgeving", "Nieuwe vraag". Tapvriendelijk (min. 44x44px) met een subtiel hover-effect.

- **Welkomstscherm**:
  - Bij inloggen een bordeaux banner (`#771138`, border-radius: 8px): "Welkom terug, [Naam]. Waar kan ik u vandaag mee helpen?" (Open Sans Bold, 18px, wit).
  - Daaronder quick actions en een intro: "Selecteer een onderwerp of stel uw vraag hieronder" (Open Sans Regular, 15px, `#3D3D3D`).

- **Animaties**:
  - Berichten verschijnen met een zachte fade-in (0,3 seconden).
  - Goudgele knoppen krijgen een bordeaux achtergrond en witte tekst bij hover, met een subtiele schaalvergroting (1.02x).
  - Invoerveld licht op met een bordeaux gloed bij focus.

- **Toegankelijkheid**:
  - WCAG AA-contrast: zwart op wit (>4.5:1), bordeaux op wit (>3:1).
  - Bordeaux outline (`#771138`) voor focusstates op invoerveld en knoppen.
  - Toetsenbordnavigatie: Tab door knoppen en invoerveld, Enter om te verzenden/kiezen.
  - Labels en aria-attributen voor schermlezers.

---

## Interactie-ontwerp

- **Welkomst en start**:
  - Na inloggen verschijnt het welkomstbericht: "Welkom terug, [Naam]. Waar kan ik u vandaag mee helpen?" met drie quick action knoppen: "Verzuimmelding", "Wet Poortwachter", "Beleid vraag".
  - Placeholder in het invoerveld: "Stel uw vraag over verzuim of beleid..."

- **Gespreksflow (Professionele aanpak)**:
  - **Onderwerp keuze**: Bij keuze voor "Verzuimmelding" vraagt de bot: "Wat is de situatie omtrent deze verzuimmelding?"
  - **Vrije invoer**: Bij tekst zoals "Medewerker is 3 weken ziek" herkent de bot de situatie en vraagt: "Kunt u aangeven welke stappen al zijn ondernomen?"
  - **Praktische vragen**:
    - **Situatie**: "Wat is de exacte situatie?"
    - **Huidige aanpak**: "Welke acties zijn al uitgevoerd?"
    - **Concrete oplossing**: "Op basis van de Wet Verbetering Poortwachter adviseer ik het volgende..."
  - **Quick actions**: 2-3 goudgele knoppen na elk antwoord, zoals "Meer informatie", "Naar wetgeving", "Nieuwe vraag". Deze sturen het gesprek zonder dwingend te zijn.
  - **Zakelijke bevestiging**: Bijv. "Ik begrijp de situatie." of "Laten we de juiste stappen doorlopen."

- **Actiegerichte afronding**:
  - Na een coaching cyclus: "Op basis van wat je vertelt, zou ik dit proberen: [concrete tip]. Check ook Module 2 in je programma voor meer eiwitinspiratie!" met knop "Naar Module 2".
  - Optie om door te gaan: "Nog meer vragen? Stel ze gerust!" met nieuwe coaching knoppen.

- **Programma-integratie**:
  - Links naar specifieke modules: "Dat staat in Module 3, klik hier: [LINK]"
  - Verwijzing naar caloriecalculator: "Bereken je persoonlijke gegevens met de calculator: [LINK]"
  - Werkboek verwijzingen: "Pak je werkboek erbij bij Module 5, daar staat een goede oefening!"

- **Responsiveness**:
  - Mobile-first: op mobiel (<768px) schaalt de chatcontainer naar volledige breedte, met aangepaste tekst (14px) en grotere knoppen (min. 44x44px).
  - Padding (16-24px) en coaching knoppen stapelen verticaal op mobiel.

---

## Gebruikerservaring (UX)

- **Eerste indruk**: De professionele toon ("Welkom terug!") en duidelijke coaching knoppen maken de interface uitnodigend en motiverend, als een persoonlijke coaching sessie.
- **Flow en gebruiksgemak**: Coaching suggesties en vrije invoer bieden flexibiliteit; quick actions helpen bij vastlopen, en praktische vragen geven structuur.
- **DoBie's directe toon**: Voelt als een digitale DoBie, met motiverende bevestigingen ("Ik begrijp de situatie.") en no-nonsense oplossingen ("Op basis van de Wet Verbetering Poortwachter adviseer ik het volgende...").
- **Visuele helderheid**: Schone lay-out, consistente kleuren (bordeaux, licht crème, wit), en Open Sans + Open Sans zorgen voor een professionele, zakelijke ervaring.
- **Feedback bij fouten**: Bij ongeldige invoer: "Hmm, kun je wat meer details geven? Ik help je graag verder!" (vriendelijk, `#337AB7`).

---

## Aansluiting bij DoBie Styleguide

- **Kleuren**: Bordeaux (`#771138`) voor buttons/accenten, goudgeel (`#E9B046`) voor quick actions, licht crème (`#F5F2EB`) voor achtergrond, wit (`#FFFFFF`) voor de container.
- **Typografie**: Open Sans (Bold 18px voor headers, Semibold 16px voor knoppen), Open Sans (Regular 15px voor berichten, 14px voor secundaire tekst).
- **Componenten**: Afgeronde knoppen (border-radius: 6px) en speech bubbles (border-radius: 16px voor bubbles), zachte schaduwen, tapvriendelijke invoervelden.
- **Responsiveness**: Mobile-first, schalende typografie, verticale knoppen op mobiel.
- **Toegankelijkheid**: WCAG AA-contrast, duidelijke focusstates, toetsenbordnavigatie.
- **Tone of voice**: Zakelijk, professioneel, ondersteunend (bijv. "Goedemorgen, waarmee kan ik u helpen?").

---

## Voorbeeldinteractie

1. **Welkomstscherm**: "Welkom terug, Jan. Waar kan ik u vandaag mee helpen?" met knoppen: "Verzuimmelding", "Wet Poortwachter", "Beleid vraag".

2. **Keuze of invoer**:
   - Kiest "Verzuimmelding": Bot vraagt: "Wat is de situatie omtrent deze verzuimmelding?"
   - Typt: "Medewerker is 3 weken ziek." Bot: "Kunt u aangeven welke stappen al zijn ondernomen?"

3. **Professionele flow**:
   - Gebruiker: "Alleen ziekmelding gedaan, nog geen vervolgacties."
   - Bot: "Volgens de Wet Verbetering Poortwachter dient u binnen 6 weken een probleemanalyse te hebben. Ik adviseer om de volgende stappen te ondernemen: 1) Plan een gesprek met de medewerker, 2) Documenteer de afspraken, 3) Start met de probleemanalyse." [Knoppen: "Meer informatie", "Naar wetgeving", "Nieuwe vraag"]
   - Gebruiker klikt: "Naar wetgeving"
   - Bot: "In de Wet Verbetering Poortwachter staat het volgende over de probleemanalyse: [LINK naar wetgeving]. Wilt u hier meer informatie over?"

4. **Afronding**: "Heeft u nog andere vragen over deze situatie?" [Knoppen: nieuwe onderwerpen]

---

## MVP vs Nice-to-Haves

### ✅ **MVP - Must-Haves**
- Schermvullende chatinterface met DoBie's branding
- Basis welkomstbericht met personalisatie
- Vrije tekstinvoer met onderwerp-herkenning
- Chat bubbles met juiste styling en animaties
- Invoerveld met verzendknop
- Doorverwijzingen naar programma-onderdelen
- Responsive design (desktop + mobiel)
- Basic error handling

### 🚀 **Nice-to-Haves**
- Coaching categorieën als knoppen ("Verzuimmelding", "Wet Poortwachter", "Beleid vraag")
- Quick action buttons na elk antwoord
- Geavanceerde animaties en hover-effecten
- Context-aware responses binnen sessie
- Typing indicator en betere loading states
- Voice input/output mogelijkheden