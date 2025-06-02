# 🔗 API & Authenticatieplan - "Shirley in je pocket"-chatbot

## 🎯 Overzicht
Een chatbot voor Shirley's bestaande Academy-klanten die naadloos integreert met haar WordPress Academy-omgeving. Alle leden hebben toegang tot de bot.

---

## 🤖 "Shirley in je pocket"-chatbot

### 💡 Implementatie-aanpak (niet-technisch)

**Hoe het werkt voor Shirley's klanten:**
1. Klant logt in op WordPress Academy zoals gewoonlijk
2. Ziet chatbox "Shirley in je pocket" op Academy-pagina
3. Kan direct vragen stellen - bot weet automatisch dat ze ingelogd zijn
4. Krijgt antwoorden in Shirley's stijl met verwijzingen naar juiste modules

**Hoe het werkt technisch:**
1. Jij bouwt chatbot als aparte webapplicatie op Vercel
2. Chatbot wordt ingebed in Shirley's WordPress (zoals YouTube video)
3. Bij elke vraag checkt de bot: "Is deze persoon ingelogd in Academy?"
4. Zo ja → antwoord geven. Zo nee → doorverwijzen naar login

**Voordelen van deze aanpak:**
- **Volledige controle** - alle bot-logica draait op jouw Vercel
- **Makkelijk onderhoud** - updates in jouw code, niet in WordPress
- **Snel testen** - bot apart ontwikkelen en testen
- **Automatisch schaalbaar** - Vercel schaalt mee met gebruik
- **Minimale WordPress-impact** - Shirley hoeft bijna niks te doen

---

## 🔐 Authenticatie Strategie

### **WordPress Session Validation**
```javascript
// Verificatie via WordPress inlog-status
const validateWordPressSession = async (wpNonce) => {
  const response = await fetch('https://afvallenindeovergang.nl/wp-json/shirley/v1/verify-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': wpNonce
    },
    credentials: 'include'
  });
  return response.ok;
};
```

### **Toegangslogica**
- **Alle ingelogde Academy-leden** hebben automatisch toegang
- **Niet-ingelogde bezoekers** krijgen melding om eerst in te loggen
- **Session-based** - geen permanente tokens of complexe auth

---

## 🔗 API Integraties

### **AI Core (OpenAI)**
```javascript
API: OpenAI GPT-4-turbo
Endpoint: https://api.openai.com/v1/chat/completions

// Server-side call (Vercel function)
const getChatResponse = async (userMessage, academyContext) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: shirleySystemPrompt },
      { role: "user", content: userMessage }
    ],
    max_tokens: 500,
    temperature: 0.7
  });
  return response.choices[0].message.content;
};
```

### **Content Database (Pinecone)**
```javascript
API: Pinecone Vector Database
Endpoint: https://${INDEX_NAME}-${PROJECT_ID}.svc.${ENVIRONMENT}.pinecone.io

// Zoek relevante Academy-content
const searchAcademyContent = async (userQuestion) => {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: userQuestion
  });
  
  const searchResults = await pinecone.query({
    vector: embedding.data[0].embedding,
    topK: 3,
    includeMetadata: true,
    namespace: "shirley-academy"
  });
  
  return searchResults.matches;
};
```

### **WordPress Integration**
```javascript
// Minimale WordPress REST API voor user verificatie
API: WordPress Custom Endpoint
Endpoint: https://afvallenindeovergang.nl/wp-json/shirley/v1/verify-user
Method: POST
Headers: X-WP-Nonce voor verificatie
```

---

## 🔄 Chat Flow

1. **User stelt vraag** in chatbot
2. **Verificatie**: Check WordPress login-status
3. **Content zoeken**: Pinecone zoekt relevante Academy-modules
4. **AI Response**: OpenAI genereert antwoord in Shirley's stem
5. **Link toevoegen**: Automatisch links naar Academy-content toevoegen
6. **Antwoord tonen** aan gebruiker

---

## 🚀 Deployment & Integration

### **Vercel Hosting**
```
https://shirley-bot.vercel.app/
├── /academy-bot          → Chatbot interface
└── /api/
    ├── chat             → Hoofdchat endpoint
    ├── verify-user      → WordPress verificatie
    └── search-content   → Academy content zoeken
```

### **WordPress Embedding**
```html
<!-- Simpel iframe embed in Academy-pagina -->
<div id="shirley-chatbot">
  <iframe 
    src="https://shirley-bot.vercel.app/academy-bot"
    width="100%" 
    height="600px"
    frameborder="0"
    title="Shirley in je pocket">
  </iframe>
</div>
```

### **WordPress Plugin (Minimaal)**
```php
<?php
// Simpele REST API endpoint voor user verificatie
add_action('rest_api_init', function () {
  register_rest_route('shirley/v1', '/verify-user', array(
    'methods' => 'POST',
    'callback' => 'shirley_verify_academy_user',
    'permission_callback' => 'is_user_logged_in'
  ));
});

function shirley_verify_academy_user($request) {
  $user = wp_get_current_user();
  
  if ($user->ID === 0) {
    return new WP_Error('not_logged_in', 'Please log in first', array('status' => 401));
  }
  
  // Alle ingelogde users hebben toegang
  return array(
    'success' => true,
    'user_id' => $user->ID,
    'display_name' => $user->display_name
  );
}
?>
```

---

## 🛡️ Security & Privacy

### **Data Protection**
- **Geen chat-opslag** - conversaties worden niet permanent bewaard
- **Session-only** memory (max 1 uur actief)
- **GDPR-compliant** - geen tracking van persoonlijke data
- **Input sanitization** tegen kwaadaardige input

### **API Security**
```javascript
// Environment variables (server-side only)
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
WORDPRESS_VERIFY_SECRET=...

// Rate limiting per gebruiker
const rateLimiter = {
  maxRequests: 50,      // Max 50 vragen per uur
  window: '1h'          // Reset elke uur
};
```

### **WordPress Security**
- **Nonce verification** voor alle API-calls
- **CORS configuratie** alleen voor jouw Vercel domein
- **SSL/HTTPS** verplicht voor alle communicatie

---

## 📊 Monitoring & Analytics

### **Usage Tracking (Anoniem)**
```javascript
const metrics = {
  totalQuestions: 0,
  averageResponseTime: 0,
  popularTopics: {},
  errorRate: 0
};
```

### **Error Handling**
```javascript
const errorMessages = {
  notLoggedIn: "Je moet eerst inloggen in de Academy om Shirley te kunnen spreken.",
  serverError: "Oeps, ik ben even niet bereikbaar. Probeer het over een paar minuten nog eens!",
  rateLimitExceeded: "Rustig aan! Je hebt veel vragen gesteld. Probeer het over een uurtje nog eens."
};
```

---

## 🔧 Implementation Timeline

### **Week 1-2: Bot Development**
- [x] Vercel project opzetten
- [x] OpenAI + Pinecone integratie
- [x] Basis chatbot interface
- [x] Local testing

### **Week 3: WordPress Integration**
- [ ] WordPress plugin ontwikkelen
- [ ] REST API endpoint testen
- [ ] Iframe embedding testen
- [ ] Cross-origin configuratie

### **Week 4: Testing & Launch**
- [ ] Test met Shirley's testaccount
- [ ] Performance optimalisatie
- [ ] Error handling verfijnen
- [ ] Go-live met eerste echte klanten

### **Na Launch: Monitoring**
- [ ] Usage analytics opzetten
- [ ] Feedback verzamelen van klanten
- [ ] Bot responses optimaliseren
- [ ] Academy content updates verwerken

---

## 💰 Operational Costs (maandelijks)

```
OpenAI API: €50-100    (500-1000 vragen/maand)
Pinecone: €20          (starter plan)
Vercel Pro: €20        (custom domains + analytics)
Total: €90-140/maand
```

**Scaling**: Bij >2000 vragen/maand: €200-300/maand
**Break-even**: Als bot Shirley 2-3 uur/week bespaart, verdient het zichzelf terug

---

## 🎯 Success Metrics

**Voor Shirley:**
- Minder herhalende vragen in community
- Hogere klantretentie door 24/7 support
- Meer tijd voor nieuwe content/klanten

**Voor Klanten:**
- Snelle antwoorden (<3 seconden)
- Relevante doorverwijzingen naar Academy-content
- Motiverende, herkenbare Shirley-stem

**Technisch:**
- >99% uptime
- <3 seconden laadtijd
- <5% error rate