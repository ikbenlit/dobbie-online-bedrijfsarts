# Supabase Database Implementatieplan - DoBie MVP

## 🎯 **LAATSTE UPDATE: 15 JANUARI 2025 - 16:30**

### **VOLTOOID IN SESSION #1:**
✅ **Frontend Auth Infrastructure (PRE-REQUISITE)**
- ✅ Firebase naar Supabase client migratie
- ✅ User store architectuur volledig gemigreerd 
- ✅ Auth state management + session handling
- ✅ Login/logout flows werkend
- ✅ Component integratie (UserMenu, Avatar, etc.)

### **HUIDIGE STATUS:**
🎯 **Database Functions Geïmplementeerd** - Backend is klaar voor frontend integratie, nu FASE 4 (Testen).

---

## 📊 Status Overzicht & Prioritering

| Fase     | Component                  | Status | MVP       | Geschatte tijd | Session #1 Resultaat       |
|----------|----------------------------|--------|-----------|----------------|----------------------------|
| **PRE-FASE** | **Frontend Auth Infrastructure** | ✅ | ✅ KRITIEK | 2 uur          | ✅ **VOLTOOID**             |
| 0.1      | Firebase cleanup           | ✅     | ✅        | 30 min         | ✅ Alle dependencies verwijderd |
| 0.2      | Supabase client setup      | ✅     | ✅        | 45 min         | ✅ PKCE auth + helpers      |
| 0.3      | User store migratie        | ✅     | ✅        | 45 min         | ✅ Rich auth state + derived stores |
| 0.4      | Component integratie       | ✅     | ✅        | 30 min         | ✅ Login/UserMenu/Avatar bijgewerkt |
| **FASE 1** | **Database Schema Setup** | ✅     | ✅ KRITIEK | 2-3 uur        | **VOLTOOID**               |
| 1.1      | Organizations table aanmaken | ✅     | ✅        | 30 min         | ✅ Voltooid                |
| 1.2      | Profiles table aanmaken    | ✅     | ✅        | 45 min         | ✅ Voltooid                |
| 1.3      | Basis data seeding         | ✅     | ✅        | 30 min         | ✅ Voltooid                |
| 1.4      | Foreign key constraints    | ✅     | ✅        | 30 min         | ✅ Voltooid                |
| **FASE 2** | **Row Level Security (RLS)** | ✅ | ✅ KRITIEK | 2 uur        | **VOLTOOID**               |
| 2.1      | User roles & RLS policies  | ✅     | ✅        | 2 uur          | ✅ Voltooid                |
| **FASE 3** | **Database Functions**    | ✅ | ✅ KRITIEK | 1.5 uur        | ✅ Voltooid                |
| 3.1      | Profile creation trigger   | ✅     | ✅        | 1 uur          | ✅ Voltooid (na debug-sessie) |
| 3.2      | Organization validation function | ✅     | ✅        | 30 min         | ✅ Voltooid                |
| **FASE 4** | **Testing & Validation**  | ✅ | ✅ KRITIEK | 1 uur          | ✅ **VOLTOOID**            |
| 4.1      | Database queries testen    | ✅     | ✅        | 30 min         | ✅ Voltooid                |
| 4.2      | RLS policies valideren     | ✅     | ✅        | 30 min         | ✅ Voltooid                |
| **POST-MVP** | **Rapportage & Analytics** | ⚪     | ❌ LATER  | 3+ uur         | Na demo                    |
| P.1      | Manual reporting queries   | ⚪     | ❌        | 1.5 uur        | Later                      |
| P.2      | Admin dashboard database views | ⚪     | ❌        | 2 uur          | Later                      |
| P.3      | Usage tracking tables      | ⚪     | ❌        | 2 uur          | Later                      |

**TOTAAL MVP TIJD:**
- ✅ **Frontend Infrastructure**: 2 uur (VOLTOOID in Session #1)
- ⚪ **Database Setup**: 5-8 uur (KLAAR VOOR START)
- 📊 **TOTAAL**: 7-10 uur voor volledige MVP

### 🚀 **EERSTVOLGENDE PRIORITEITEN (Sessie #8):**

**KRITIEK - Volgende Stap:**
1. **End-to-End Testen van de Frontend Registratie Flow**
   - De backend is nu volledig gevalideerd. Alle focus kan nu naar het testen van de volledige gebruikerservaring via de UI, zoals beschreven in `10-user-registration-signup-implementatie.md`.

**Status na Sessie #8**: Backend is volledig functioneel en gevalideerd. Klaar voor frontend E2E testing. ✅

---

## 🎯 MVP Database Concepten

### **Data Storage Scope:**
- **WEL opslaan:** User accounts, organization koppelingen, profile info
- **NIET opslaan:** Chat gesprekken, usage analytics, billing data
- **Privacy by design:** Geen chat logging in MVP

### **Security Baseline:**
- **RLS Policies = Non-negotiable:** Database-level beveiliging voor AVG compliance
- **Row Level Security:** Users zien alleen eigen data, admins zien alles
- **Critical voor bedrijfsdata:** Jan van Belastingdienst mag geen Shell data zien

### **Organisatie Model:**
- **Manual Organization Management:** Talar maakt org_codes handmatig aan
- **Individual vs Organization Users:** Onderscheid via `account_type` en `organization_id`
- **No Auto-Billing:** Handmatige rapportage en facturering
- **Simple Structure:** Minimale tabellen, maximale flexibiliteit

### **User Registration Flow:**
```
User registreert met:
→ Email + Password (Supabase auth.users)
→ Full name + Organization ID (custom profiles table)
→ Organization ID "INDIVIDUAL" = individual account
→ Organization ID "BELASTINGDIENST" = organization member
→ Invalid Organization ID = registration error
```

---

## 🗄️ FASE 1: Database Schema Setup

### **1.1 Organizations Table**

**Concept:** Centrale tabel voor alle organisaties (klanten van Talar)

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_code TEXT UNIQUE NOT NULL,  -- "BELASTINGDIENST", "INDIVIDUAL"
  name TEXT NOT NULL,             -- "Belastingdienst", "Individual Users"
  billing_email TEXT,             -- Voor facturering (optioneel)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index voor snelle lookups
CREATE INDEX idx_organizations_org_code ON organizations(org_code);
```

**MVP Fields:**
- `org_code`: Mensleesbare identifier voor registratie
- `name`: Display naam voor UI en rapportage
- `billing_email`: Voor facturering (kan anders zijn dan contact email)

### **1.2 Profiles Table**

**Concept:** Uitbreiding van Supabase auth.users met DoBie-specifieke data

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  
  -- Account classification
  account_type TEXT NOT NULL CHECK (account_type IN ('individual', 'organization_member')),
  organization_id UUID REFERENCES organizations(id),
  
  -- Subscription status (voor toekomstige automatisering)
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'inactive', 'blocked')),
  trial_start_date TIMESTAMPTZ DEFAULT NOW(),
  trial_end_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes voor performance
CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX idx_profiles_account_type ON profiles(account_type);
CREATE INDEX idx_profiles_email ON profiles(email);
```

**Business Rules:**
- `individual` accounts hebben `organization_id` = "INDIVIDUAL" org
- `organization_member` accounts hebben specifieke organization_id
- Email moet unique zijn (via Supabase auth)

### **1.3 Basis Data Seeding**

**Concept:** Standaard organisaties aanmaken voor immediate use

```sql
-- Default organizations
INSERT INTO organizations (org_code, name, billing_email) VALUES 
('INDIVIDUAL', 'Individual Users', NULL),
('TEST-ORG', 'Test Organization', 'test@example.com');

-- Optional: Demo accounts (handmatig via Supabase auth + deze query)
-- INSERT INTO profiles (id, email, full_name, account_type, organization_id) 
-- VALUES (
--   'auth-user-id-here', 
--   'talar@dobbie.nl', 
--   'Talar Lazarian', 
--   'individual', 
--   (SELECT id FROM organizations WHERE org_code = 'INDIVIDUAL')
-- );
```

### **1.4 Foreign Key Constraints & Validation**

**Concept:** Database-level data integriteit

```sql
-- Constraint: individual accounts moeten INDIVIDUAL org hebben
ALTER TABLE profiles ADD CONSTRAINT check_individual_account 
CHECK (
  (account_type = 'individual' AND organization_id = (SELECT id FROM organizations WHERE org_code = 'INDIVIDUAL'))
  OR 
  (account_type = 'organization_member' AND organization_id != (SELECT id FROM organizations WHERE org_code = 'INDIVIDUAL'))
);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 🔒 FASE 2: Row Level Security (RLS)

### **2.1 RLS Policies voor Profiles**

**Concept:** Users kunnen alleen eigen data zien, behalve super admins

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users kunnen hun eigen profile zien en updaten
CREATE POLICY "Users can view and update own profile"
ON profiles
FOR ALL
USING (auth.uid() = id);

-- Policy 2: Super admins (Talar + Colin) kunnen alles zien
CREATE POLICY "Super admin full access"
ON profiles
FOR ALL
USING (
  auth.jwt() ->> 'email' IN ('talar@dobbie.nl', 'colin@ikbenlit.nl')
);
```

### **2.2 Organizations Access Policies**

**Concept:** Organisatie data is read-only voor users, full access voor admins

```sql
-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Policy 1: Alle authenticated users kunnen organizations lezen (voor org_code validation)
CREATE POLICY "Authenticated users can read organizations"
ON organizations
FOR SELECT
USING (auth.role() = 'authenticated');

-- Policy 2: Alleen super admins kunnen organizations wijzigen
CREATE POLICY "Super admin organizations management"
ON organizations
FOR ALL
USING (
  auth.jwt() ->> 'email' IN ('talar@dobbie.nl', 'colin@ikbenlit.nl')
);
```

### **2.3 Super Admin Policies**

**Concept:** Talar en Colin hebben volledige toegang tot alles

```sql
-- Function om super admin status te checken
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.jwt() ->> 'email' IN ('talar@dobbie.nl', 'colin@ikbenlit.nl');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Herbruikbare policy voor super admin access
-- Wordt gebruikt in toekomstige tabellen
```

---

## ⚙️ FASE 3: Database Functions

### **3.1 Profile Creation Trigger**

**Concept:** Automatisch profile aanmaken wanneer user zich registreert via Supabase auth

```sql
-- Function die wordt getriggered bij nieuwe auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, account_type, organization_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'account_type', 'individual'),
    CASE 
      WHEN NEW.raw_user_meta_data->>'organization_id' IS NOT NULL 
      THEN (SELECT id FROM organizations WHERE org_code = NEW.raw_user_meta_data->>'organization_id')
      ELSE (SELECT id FROM organizations WHERE org_code = 'INDIVIDUAL')
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger op auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### **3.2 Organization Validation Function**

**Concept:** Frontend kan organization codes valideren voor betere UX

```sql
-- Function om org_code te valideren tijdens registratie
CREATE OR REPLACE FUNCTION validate_organization_code(org_code TEXT)
RETURNS TABLE(valid BOOLEAN, org_name TEXT, org_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TRUE as valid,
    o.name as org_name,
    o.id as org_id
  FROM organizations o
  WHERE o.org_code = $1;
  
  -- Als geen results, return invalid
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::UUID;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usage example:
-- SELECT * FROM validate_organization_code('BELASTINGDIENST');
```

---

## ✅ FASE 4: Testing & Validation

### **4.1 Database Queries Testen**

**Test queries voor common use cases:**

```sql
-- Test 1: Individual user creation simulation
SELECT validate_organization_code('INDIVIDUAL');

-- Test 2: Organization user creation simulation  
SELECT validate_organization_code('TEST-ORG');

-- Test 3: Invalid organization code
SELECT validate_organization_code('INVALID-CODE');

-- Test 4: Count users per organization (voor rapportage)
SELECT 
  o.org_code,
  o.name,
  COUNT(p.id) as user_count
FROM organizations o
LEFT JOIN profiles p ON o.id = p.organization_id
GROUP BY o.id, o.org_code, o.name
ORDER BY user_count DESC;

-- Test 5: Active users last 30 days (basis usage tracking)
SELECT 
  o.org_code,
  COUNT(p.id) as active_users
FROM organizations o
LEFT JOIN profiles p ON o.id = p.organization_id
WHERE p.created_at > NOW() - INTERVAL '30 days'
  AND p.subscription_status = 'active'
GROUP BY o.id, o.org_code;
```

### **4.2 RLS Policies Valideren**

**Test security policies:**

```sql
-- Test als regular user (simulatie)
SET LOCAL role 'authenticated';
SET LOCAL request.jwt.claim.sub = 'test-user-id';
SET LOCAL request.jwt.claim.email = 'test@example.com';

-- Should only see own profile
SELECT * FROM profiles; 

-- Should see all organizations (read-only)
SELECT * FROM organizations;

-- Reset to default role
RESET ROLE;
```

---

## 📈 POST-MVP: Rapportage & Analytics

### **Manual Reporting Queries (Later):**

```sql
-- Monthly user count report per organization
CREATE VIEW monthly_user_report AS
SELECT 
  o.org_code,
  o.name as organization_name,
  COUNT(p.id) as total_users,
  COUNT(CASE WHEN p.subscription_status = 'active' THEN 1 END) as active_users,
  COUNT(CASE WHEN p.subscription_status = 'trial' THEN 1 END) as trial_users
FROM organizations o
LEFT JOIN profiles p ON o.id = p.organization_id
WHERE o.org_code != 'INDIVIDUAL'
GROUP BY o.id, o.org_code, o.name
ORDER BY total_users DESC;

-- Individual users summary
CREATE VIEW individual_users_report AS
SELECT 
  COUNT(*) as total_individual_users,
  COUNT(CASE WHEN subscription_status = 'active' THEN 1 END) as active_individual_users
FROM profiles p
JOIN organizations o ON p.organization_id = o.id
WHERE o.org_code = 'INDIVIDUAL';
```

---

## 🔧 Frontend Integration

### **✅ VOLTOOID - Auth Infrastructure (Session #1):**

**Supabase Client Setup:**
```typescript
// src/lib/supabase/client.ts - GEREED
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' // PKCE flow voor extra security
  }
});
```

**User Store Migratie:**
```typescript
// src/lib/stores/userStore.ts - GEREED
export interface User {
  id: string;
  email: string;
  full_name?: string;
  account_type?: 'individual' | 'organization_member';
  organization_id?: string;
  subscription_status?: 'trial' | 'active' | 'inactive' | 'blocked';
}
```

**Login Integration:**
```typescript
// src/routes/login/+page.svelte - GEREED
async function handleLogin() {
  await signIn(email, password); // Echte Supabase auth
  goto('/chat');
}
```

### **🔮 TODO - Registration Form Integration:**

```typescript
// Frontend validation voor organization code (NA database setup)
async function validateOrgCode(orgCode: string) {
  const { data } = await supabase
    .rpc('validate_organization_code', { org_code: orgCode });
  
  return data[0]; // { valid: boolean, org_name: string, org_id: uuid }
}

// Registration met organization metadata
async function registerUser(email: string, password: string, userData: UserData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: userData.fullName,
        organization_id: userData.organizationCode || 'INDIVIDUAL',
        account_type: userData.organizationCode ? 'organization_member' : 'individual'
      }
    }
  });
}
```

**Deze implementatie geeft je:**
- ✅ Eenvoudige maar krachtige database structuur
- ✅ Veilige RLS policies
- ✅ Automatische profile creation
- ✅ Handmatige organisatie management
- ✅ Basis voor toekomstige uitbreidingen