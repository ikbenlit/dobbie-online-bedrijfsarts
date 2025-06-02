# 🎨 De Online Bedrijfsarts – UX/UI Styleguide (v1)

*Deze styleguide bevat de richtlijnen voor de landingspagina, chatbotinterface en bijbehorende visuele elementen van De Online Bedrijfsarts (Doby).*

---

## 🌈 Kleurenpalet

### Primaire kleuren

* **Bordeaux** `#771138` – Hoofdaccent: knoppen, iconen, bullets
* **Bordeaux Hover** `#5A0D29` – Hover-staat van interactieve elementen
* **Licht Crème** `#F5F2EB` – Achtergronden, basisstijl

### Accentkleuren

* **Goudgeel** `#E9B046` – Call-to-action knoppen, highlights
* **Lichtgrijs** `#D1D5DB` – Panelen, borders, subtiele scheiding
* **Donkergrijs** `#3D3D3D` – Subtitels, secundaire tekst

### Neutrale kleuren

* **Zwart** `#000000` – Body-tekst, koppen
* **Wit** `#FFFFFF` – Contentkaarten, witruimte, chatballonnen

---

## 🔠 Typografie

Er worden twee lettertypen gebruikt: **Open Sans** (sans-serif) en **Times New Roman** (serif).

### Typografie-specificaties

**Open Sans (Sans-Serif):**

* **Gewichten/stijlen:** Regular (400), Semibold (600), Bold (700)
* **Toepassing:**

  * **Body-tekst:** 15px, #3D3D3D (subtiel grijs)
  * **Knoppen:** 16px, Bold, #FFFFFF op #771138
  * **Subkoppen (H3):** 20px, Semibold, #771138

**Times New Roman (Serif):**

* **Toepassing:**

  * **Kopteksten (H1, H2):** 24px – 28px, #000000 of #771138 (voor classic touch)

### Hiërarchie samenvatting

1. **H1 (Hoofdtitel):** Times New Roman Bold 28px – #771138
2. **H2 (Sectietitel):** Times New Roman Semibold 24px – #771138
3. **H3 (Subtitel):** Open Sans Semibold 20px – #3D3D3D
4. **Body-tekst:** Open Sans Regular 15px – #3D3D3D
5. **Kleine tekst:** Open Sans Regular 14px – #707070

---

## 🧩 Componenten

### Buttons

* **Primaire knop:** #771138 achtergrond, #FFFFFF tekst, hover: #5A0D29
* **Call-to-action:** #E9B046 achtergrond, #000000 tekst
* **Border-radius:** 6px
* **Padding:** 14px 28px
* **Font:** Open Sans Bold, 16px

### Formulieren & Input

* **Achtergrond:** #FFFFFF
* **Rand:** 1px solid #D1D5DB
* **Focus:** 2px solid #771138
* **Placeholder:** #CCCCCC
* **Border-radius:** 6px

### Cards & Containers

* **Achtergrond:** #FFFFFF of #F5F2EB
* **Schaduw:** `box-shadow: 0 2px 8px rgba(0,0,0,0.1)`
* **Border-radius:** 8px
* **Padding:** 16px-24px

### Links

* **Inline link:** #771138, hover #5A0D29
* **Bezochte links:** #707070

---

## 💬 Chatbot Interface

### Chat Container

* **Max-breedte:** 800px desktop, full-width mobiel
* **Achtergrond:** #FFFFFF
* **Border-radius:** 8px (bovenste hoeken)
* **Schaduw:** `box-shadow: 0 4px 12px rgba(0,0,0,0.15)`

### Chatballonnen

* **Bot-ballon:**

  * Achtergrond: #F5F2EB
  * Tekst: #000000, Open Sans Regular 15px
  * Border-radius: 16px 16px 16px 4px
  * Max-width: 75%

* **User-ballon:**

  * Achtergrond: #771138
  * Tekst: #FFFFFF, Open Sans Regular 15px
  * Border-radius: 16px 16px 4px 16px
  * Max-width: 75%

### Quick Reply Buttons

* **Achtergrond:** #E9B046
* **Tekst:** #000000, Open Sans Semibold 14px
* **Hover:** #5A0D29, tekst #FFFFFF
* **Border-radius:** 16px
* **Padding:** 8px 16px

---

## 🌐 Landingspagina Elementen

### Hero-sectie

* **Hoofdtitel:** Times New Roman Bold 28px, #771138
* **Subtitel:** Open Sans Regular 18px, #3D3D3D
* **CTA-knop:** #771138 achtergrond, #FFFFFF tekst
* **Achtergrond:** #F5F2EB

### Features-sectie

* **Sectietitel:** Times New Roman Semibold 24px, #771138
* **Feature cards:** #FFFFFF achtergrond, 8px border-radius, subtiele schaduw
* **Feature iconen:** 24px, #771138 of #E9B046
* **Feature tekst:** Open Sans Regular 15px, #3D3D3D

### Voordelen-sectie

* Grid-layout met cards
* **Iconen:** 32px, #E9B046
* **Titel per voordeel:** Open Sans Semibold 18px, #771138
* **Beschrijving:** Open Sans Regular 14px, #707070

### Widget Knop

* **Gesloten:** #771138 achtergrond, #FFFFFF icoon (24px)
* **Border-radius:** 50%
* **Grootte:** 60x60px
* **Schaduw:** `box-shadow: 0 4px 12px rgba(119,17,56,0.3)`

---

## 🗣️ Tone of Voice & Woordgebruik

* **Zakelijk en to the point** – Antwoorden zijn kort, duidelijk en onderbouwd
* **Professioneel en ondersteunend** – Gericht op HR, leidinggevenden, casemanagers
* **Kernwoorden:** helder, feitelijk, zonder poespas
* **Geen medische adviezen** – Focus op verzuim, beleid en proces

**Voorbeelden:**

* "Wat moet ik doen als een medewerker te laat komt?"
* "Hoe lang mag een ziekmelding duren voordat ik actie onderneem?"
* "Wat zegt de Wet Verbetering Poortwachter hierover?"

---

## 🎯 Implementatie Checklist

* [ ] Kleurenpalet als CSS-variabelen
* [ ] Fonts laden via Google Fonts
* [ ] Lucide Icons als iconset (of alternatief in lijnstijl)
* [ ] Responsive breakpoints instellen
* [ ] Toegankelijkheid: WCAG 2.1 AA

---

> **Opmerking:** Dit document is opgesteld in Markdown-formaat voor eenvoudige export en versiebeheer.
