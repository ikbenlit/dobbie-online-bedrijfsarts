# Onderzoeksrapport: Registratie van Nieuwe Gebruikers - DOBbie Systeem

*Datum: 24 juni 2025*  
*Onderzoeker: Claude Code*  
*Doel: Analyse van registratieproces voor organisaties en individuele gebruikers*

---

## Executive Summary

Het DOBbie systeem implementeert een geavanceerd twee-track registratieproces dat zowel individuele gebruikers als organisatieleden ondersteunt. Het systeem gebruikt een 3-staps wizard interface met real-time validatie, automatische trial toewijzing, en robuuste security implementatie via Row Level Security (RLS).

**Belangrijkste bevindingen:**
- ✅ Volledig functionerend multi-step registratieproces
- ✅ Real-time organisatiecode validatie
- ✅ Automatische 30-dagen trial voor alle gebruikers
- ✅ Robuuste security implementatie met RLS
- ⚠️ Complexe trigger logica die mogelijk versimpeld kan worden

---

## 1. REGISTRATIE VOOR ORGANISATIES

### 1.1 Frontend User Experience

**Locatie:** `/src/routes/register/+page.svelte`

**3-Staps Wizard Process:**

#### Stap 1: Basis Informatie
```javascript
// Vereiste velden:
- Volledige naam (min. 2 karakters)
- E-mailadres (email validatie)
- Wachtwoord (min. 6 karakters)  
- Wachtwoord bevestiging (matching validatie)
```

#### Stap 2: Account Type Selectie
```javascript
// Keuze tussen:
account_type: 'individual' | 'organization_member'

// UI implementatie:
- Radio buttons met duidelijke beschrijvingen
- Visual feedback via border/background changes
- Conditionale routing (individual skips step 3)
```

#### Stap 3: Organisatiecode Validatie
```javascript
// Real-time validatie:
const debouncedValidateOrg = debounce(async (code: string) => {
  if (!code || code.length < 2) return;
  
  isValidatingOrg = true;
  orgValidationResult = await validateOrganizationCode(code);
  isValidatingOrg = false;
}, 500);

// Visual feedback:
- Loading spinner tijdens validatie
- ✓ Groene check + organisatienaam bij success
- ✗ Rode error bij ongeldige code
- Automatische UPPERCASE conversie
```

### 1.2 Backend Validatie Process

**Locatie:** `/src/lib/supabase/migrations/20250119_add_org_validation_function.sql`

```sql
CREATE OR REPLACE FUNCTION public.validate_organization_code(
  org_code_to_check TEXT
)
RETURNS TABLE(is_valid BOOLEAN, organization_name TEXT, organization_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT
    TRUE as is_valid,
    o.name as organization_name,
    o.id as organization_id
  FROM public.organizations o
  WHERE o.org_code = org_code_to_check;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::UUID;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Belangrijke aspecten:**
- `SECURITY DEFINER`: Functie wordt uitgevoerd met eigenaar rechten
- Toegankelijk voor anonieme gebruikers (nodig tijdens registratie)
- Retourneert structured data (boolean + org details)

### 1.3 Beschikbare Organisaties

**Locatie:** `/src/lib/supabase/migrations/20250115_seed_organizations.sql`

```sql
INSERT INTO organizations (org_code, name, billing_email) VALUES 
('INDIVIDUAL', 'Individual Users', NULL),
('TEST-ORG', 'Test Organization', 'test@example.com'),
('BELASTINGDIENST', 'Belastingdienst', 'admin@belastingdienst.nl'),
('SHELL', 'Shell Nederland', 'billing@shell.nl');
```

---

## 2. REGISTRATIE VOOR INDIVIDUELE GEBRUIKERS

### 2.1 Vereenvoudigd Process

**Flow verschil:**
```javascript
// Stap 2 logica:
if (currentStep === 2 && registrationData.account_type === 'individual') {
  // Skip organisatie step voor individual users
  handleRegistration();
} else {
  currentStep++;
}
```

**Voordelen:**
- Minder friction voor individuele gebruikers
- Snellere registratie (2 stappen vs 3)
- Automatische toewijzing aan 'INDIVIDUAL' organisatie

### 2.2 Automatische Organisatie Toewijzing

**Backend logica** (`handle_new_user()` trigger):
```sql
-- Fallback: als geen organization_id is provided, default naar 'INDIVIDUAL'
SELECT id INTO final_organization_id 
FROM organizations 
WHERE org_code = 'INDIVIDUAL' 
LIMIT 1;
```

---

## 3. TECHNISCHE IMPLEMENTATIE

### 3.1 Registration Data Structure

**Interface definitie:**
```typescript
export interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  account_type: 'individual' | 'organization_member';
  organization_code: string;
}
```

### 3.2 Database Trigger System

**Locatie:** `/src/lib/supabase/migrations/20250125_correct_handle_new_user_logic.sql`

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    final_organization_id UUID;
    final_account_type TEXT;
BEGIN
    -- Account type bepaling
    final_account_type := COALESCE(new.raw_user_meta_data->>'account_type', 'individual');

    -- Organisatie ID bepaling
    IF new.raw_user_meta_data->>'organization_id' IS NOT NULL THEN
        final_organization_id := (new.raw_user_meta_data->>'organization_id')::UUID;
    ELSE
        SELECT id INTO final_organization_id 
        FROM organizations 
        WHERE org_code = 'INDIVIDUAL' 
        LIMIT 1;
    END IF;

    -- Profile creatie
    INSERT INTO public.profiles (id, email, full_name, account_type, organization_id)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Unnamed User'),
        final_account_type,
        final_organization_id
    );
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';
```

**Trigger activatie:**
- Wordt automatisch uitgevoerd bij elke nieuwe user registration
- Verwerkt metadata van Supabase Auth signup
- Creëert profiel in `profiles` tabel

### 3.3 Trial System Implementatie

**Locatie:** `/src/lib/supabase/migrations/20250622_extend_trial_period_30_days.sql`

```sql
-- 30-dagen trial voor nieuwe gebruikers
ALTER TABLE profiles ALTER COLUMN trial_end_date 
SET DEFAULT (NOW() + INTERVAL '30 days');

-- Subscription status opties
CHECK (subscription_status IN (
  'trial',          -- 0-30 dagen gratis toegang
  'expired',        -- Trial verlopen, geen toegang  
  'manual_active',  -- Handmatig geactiveerd door Talar
  'blocked'         -- Admin blocked
));
```

**Management functies:**
```sql
-- Handmatige activering (voor admins)
CREATE OR REPLACE FUNCTION manually_activate_user(
  profile_id UUID,
  notes TEXT DEFAULT NULL
)

-- Trial expiry check
CREATE OR REPLACE FUNCTION check_trial_expiry()

-- Automatische expiry
CREATE OR REPLACE FUNCTION auto_expire_trials()
```

---

## 4. SECURITY IMPLEMENTATIE

### 4.1 Row Level Security (RLS)

**Locatie:** `/src/lib/supabase/migrations/20250116_add_user_roles_and_rls.sql`

```sql
-- RLS activatie
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- User policies
CREATE POLICY "Users can view and update their own profile"
ON public.profiles
FOR ALL
USING (auth.uid() = id);

-- Admin policies  
CREATE POLICY "Super admins have full access to all profiles"
ON public.profiles
FOR ALL
USING (public.get_my_user_type() = 'super_admin');
```

### 4.2 Anti-Recursion Security

**Probleem:** RLS policies veroorzaakten oneindige recursie  
**Oplossing:** `SECURITY DEFINER` functie

```sql
-- Veilige functie om user type op te halen
CREATE OR REPLACE FUNCTION public.get_my_user_type()
RETURNS TEXT AS $$
DECLARE
  user_type_result TEXT;
BEGIN
  SELECT user_type INTO user_type_result
  FROM public.profiles
  WHERE id = auth.uid();
  RETURN user_type_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4.3 User Role System

```sql
-- User types in profiles tabel
user_type TEXT NOT NULL DEFAULT 'user'
CHECK (user_type IN ('user', 'admin', 'super_admin'))

-- Super admin toewijzing
UPDATE public.profiles
SET user_type = 'super_admin'
WHERE email IN ('talar@dobbie.nl', 'colin@ikbenlit.nl');
```

---

## 5. ERROR HANDLING & USER EXPERIENCE

### 5.1 Gelokaliseerde Foutmeldingen

**Locatie:** `src/lib/stores/userStore.ts:335-379`

```javascript
const errorMessages: Record<string, string> = {
  // Auth errors
  'Invalid login credentials': 'Ongeldige inloggegevens. Controleer uw e-mailadres en wachtwoord.',
  'Email not confirmed': 'E-mailadres nog niet bevestigd. Controleer uw inbox voor een bevestigingslink.',
  'User already registered': 'Dit e-mailadres is al geregistreerd. Probeer in te loggen of gebruik een ander e-mailadres.',
  'Password should be at least 6 characters': 'Wachtwoord moet minimaal 6 karakters bevatten.',
  // ... meer mappings
};
```

### 5.2 Frontend Validatie

```javascript
function validateCurrentStep(): boolean {
  formErrors = {};
  
  if (currentStep === 1) {
    if (!registrationData.email || !registrationData.email.includes('@')) {
      formErrors.email = 'Vul een geldig e-mailadres in.';
    }
    if (!registrationData.password || registrationData.password.length < 6) {
      formErrors.password = 'Wachtwoord moet minimaal 6 karakters zijn.';
    }
    // ... meer validaties
  }
  
  return Object.keys(formErrors).length === 0;
}
```

### 5.3 Loading States & Feedback

```svelte
<!-- Loading indicator tijdens registratie -->
{#if isLoading}
  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white">...</svg>
  Bezig met registreren...
{:else if currentStep === totalSteps}
  Account aanmaken
{:else}
  Volgende
{/if}

<!-- Organisatie validatie feedback -->
{#if orgValidationResult}
  {#if orgValidationResult.valid}
    <p class="mt-2 text-[14px] text-green-600">
      ✓ {orgValidationResult.org_name}
    </p>
  {:else}
    <p class="mt-2 text-[14px] text-red-600">
      ✗ Ongeldige organisatiecode
    </p>
  {/if}
{/if}
```

---

## 6. DATABASE SCHEMA OVERZICHT

### 6.1 Core Tables

#### Organizations Table
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_code TEXT UNIQUE NOT NULL,    -- "BELASTINGDIENST", "INDIVIDUAL"
  name TEXT NOT NULL,               -- "Belastingdienst", "Individual Users"  
  billing_email TEXT,              -- Optional billing email
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  
  -- Account classification
  account_type TEXT NOT NULL CHECK (account_type IN ('individual', 'organization_member')),
  organization_id UUID REFERENCES organizations(id),
  
  -- User role system
  user_type TEXT NOT NULL DEFAULT 'user' CHECK (user_type IN ('user', 'admin', 'super_admin')),
  
  -- Subscription management
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'expired', 'manual_active', 'blocked')),
  trial_start_date TIMESTAMPTZ DEFAULT NOW(),
  trial_end_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  
  -- Conversion tracking
  contacted_for_conversion BOOLEAN DEFAULT false,
  conversion_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.2 Indexing Strategy

```sql
-- Performance indexes
CREATE INDEX idx_organizations_org_code ON organizations(org_code);
CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX idx_profiles_account_type ON profiles(account_type);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_trial_end_date ON profiles(trial_end_date) WHERE subscription_status = 'trial';
CREATE INDEX idx_profiles_subscription_status ON profiles(subscription_status);
```

---

## 7. REGISTRATIE FLOW DIAGRAMMEN

### 7.1 Organisatie Registratie Flow

```
[Start Registratie]
        ↓
[Stap 1: Basis Info]
    ↓ (validatie)
[Stap 2: Account Type]
    ↓ (kies 'organization_member')
[Stap 3: Organisatiecode]
    ↓ (real-time validatie)
[validateOrganizationCode() RPC]
    ↓ (success)
[registerUser() functie]
    ↓
[Supabase Auth signup]
    ↓ (trigger)
[handle_new_user() trigger]
    ↓
[Profile creatie in DB]
    ↓
[Redirect naar /chat]
```

### 7.2 Individuele Registratie Flow

```
[Start Registratie]
        ↓
[Stap 1: Basis Info]
    ↓ (validatie)
[Stap 2: Account Type]
    ↓ (kies 'individual')
[Skip Stap 3 - Direct naar registratie]
    ↓
[registerUser() functie]
    ↓
[Supabase Auth signup]
    ↓ (trigger)
[handle_new_user() trigger]
    ↓ (auto-assign naar INDIVIDUAL org)
[Profile creatie in DB]
    ↓
[Redirect naar /chat]
```

---

## 8. AANBEVELINGEN & VERBETERPUNTEN

### 8.1 Sterke Punten ✅

1. **Uitstekende UX**: Multi-step wizard met duidelijke feedback
2. **Robuuste Validatie**: Real-time organisatie validatie
3. **Security**: Goed geïmplementeerde RLS policies
4. **Flexibiliteit**: Ondersteunt zowel B2B als B2C use cases
5. **Trial Management**: Volledig geautomatiseerd trial systeem
6. **Error Handling**: Nederlandse foutmeldingen met goede mapping

### 8.2 Verbeterpunten ⚠️

#### 8.2.1 Code Complexiteit
```javascript
// Huidige implementatie heeft complexe conditional logic:
if (currentStep === 2 && registrationData.account_type === 'individual')

// Voorstel: Extract naar aparte functions per registration type
const handleIndividualRegistration = () => { ... }
const handleOrganizationRegistration = () => { ... }
```

#### 8.2.2 Database Trigger Versimpeling
```sql
-- Huidige trigger heeft veel conditional logic
-- Overweeg split naar separate functions:
CREATE FUNCTION handle_individual_user()
CREATE FUNCTION handle_organization_user()
```

#### 8.2.3 Error Recovery
```javascript
// Missing: Retry mechanisms for failed registrations
// Toevoegen: Progressive retry with exponential backoff
```

#### 8.2.4 Analytics & Monitoring
```javascript
// Missing: Registration funnel tracking
// Toevoegen: Step completion tracking, drop-off analysis
```

### 8.3 Specifieke Aanbevelingen

#### 8.3.1 Code Refactoring (Prioriteit: Laag)
- Split registration logic per user type
- Extract validation functions naar separate utilities
- Implement registration state machine

#### 8.3.2 Performance Optimizatie (Prioriteit: Medium)
- Implement caching voor organization validation
- Add database connection pooling
- Optimize trigger performance met prepared statements

#### 8.3.3 Security Hardening (Prioriteit: Hoog)
- Add rate limiting op registration endpoints
- Implement CAPTCHA voor abuse prevention
- Add email domain validation voor organizational users

#### 8.3.4 User Experience (Prioriteit: Medium)
- Add password strength indicator
- Implement email address suggestions (typo detection)
- Add progress saving (draft registrations)

---

## 9. CONCLUSIE

Het DOBbie registratiesysteem is een goed geïmplementeerde, functionele oplossing die beide gebruikerstypes effectief ondersteunt. De technische implementatie toont aandacht voor security, user experience, en maintainability.

**Samenvatting scores:**
- **Functionaliteit**: 9/10 - Volledig werkend systeem
- **Security**: 8/10 - Goede RLS implementatie
- **User Experience**: 9/10 - Intuïtieve multi-step wizard
- **Code Quality**: 7/10 - Functioneel maar kan versimpeld worden
- **Maintainability**: 7/10 - Goede documentatie, complexe logica

Het systeem is productie-ready en ondersteunt effectief de business requirements voor zowel individuele gebruikers als organisaties.

---

**Rapport gegenereerd:** 24 juni 2025  
**Versie:** 1.0  
**Status:** Definitief