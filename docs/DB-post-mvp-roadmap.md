# DoBie Post-MVP Roadmap & Features

## 📊 Status Overzicht & Prioritering

| Fase | Feature Category | Status | Business Value | Dev Effort | Dependencies |
|------|------------------|---------|----------------|------------|--------------|
| **FASE 2** | **Admin Dashboards** | ⚪ | Hoog | Medium | MVP Database |
| 2.1 | Super Admin Dashboard (Talar + Colin) | ⚪ | Kritiek | 3-4 weken | User base |
| 2.2 | Organization Admin Dashboard (Klanten) | ⚪ | Hoog | 2-3 weken | Orgs met >5 users |
| 2.3 | User Account Management | ⚪ | Medium | 1-2 weken | User feedback |
| **FASE 3** | **Database Uitbreidingen** | ⚪ | Medium | Medium | Growth data |
| 3.1 | Extended User Profiles | ⚪ | Medium | 1-2 weken | Feature requests |
| 3.2 | Organization Enhancements | ⚪ | Hoog | 2 weken | Billing complexity |
| 3.3 | Usage & Analytics Tables | ⚪ | Hoog | 2-3 weken | Business insights |
| **FASE 4** | **Advanced Features** | ⚪ | Medium | Hoog | Fase 2+3 |
| 4.1 | Automated Billing System | ⚪ | Hoog | 4-5 weken | Payment provider |
| 4.2 | Team Management | ⚪ | Medium | 3-4 weken | Large orgs |
| 4.3 | White-label Options | ⚪ | Laag | 3-4 weken | Enterprise deals |

**Legenda:** ⚪ = Nog te doen, 🔶 = In planning, ✅ = Voltooid

---

## 🎛️ FASE 2: Admin Dashboards

### **2.1 Super Admin Dashboard (Talar + Colin)**

**Doel:** Complete controle en inzicht over alle DoBie gebruikers en organisaties

**Route:** `/super-admin` (only voor talar@dobbie.nl en colin@ikbenlit.nl)

#### **Core Features:**

**📈 Overview Dashboard**
```
- Total users (individual + organization)
- Monthly growth metrics
- Revenue overview per organization
- System health & uptime
- Recent registrations feed
```

**🏢 Organization Management**
```
- Lijst alle organisaties + user counts
- Handmatig organisaties aanmaken/bewerken
- Org_codes genereren en uitdelen
- Billing email management
- Account activeren/deactiveren
```

**👥 User Management**
```
- Alle users overzicht (searchable/filterable)
- User details + login history
- Account status wijzigen (trial → active → blocked)
- Support tools: impersonate user (voor debugging)
- Password reset voor users
```

**💰 Billing & Revenue**
```
- Maandelijkse user counts per organisatie
- Revenue berekening per tier
- Export voor facturering (CSV/Excel)
- Payment status tracking
- Usage-based insights
```

**🔧 System Management**
```
- Error logs & monitoring
- Database health metrics
- AI usage costs (Vertex AI calls)
- Feature flags management
- System announcements
```

#### **Technical Implementation:**
```typescript
// Protected route met super admin check
if (!['talar@dobbie.nl', 'colin@ikbenlit.nl'].includes(user.email)) {
  throw redirect(403, '/unauthorized');
}

// Dashboard componenten
- OrganizationList.svelte
- UserManagement.svelte  
- BillingOverview.svelte
- SystemHealth.svelte
```

### **2.2 Organization Admin Dashboard (Klanten)**

**Doel:** HR managers kunnen hun eigen team beheren binnen DoBie

**Route:** `/org-admin` (alleen voor users met organization_role = 'admin')

#### **Core Features:**

**👥 Team Overview**
```
- Lijst van alle team members in eigen organisatie
- User status (active, trial, inactive)
- Last login timestamps
- Account creation dates
- Basic usage stats per team member
```

**🔗 Invite Management**
```
- Generate org_codes voor nieuwe team members
- Deactivate/reactivate team accounts
- Bulk invite via email lijst
- Track wie welke codes heeft gebruikt
```

**📊 Usage Insights**
```
- Team usage overview: "Jullie team heeft 245 vragen gesteld deze maand"
- Most popular categories
- Active vs. inactive team members
- Monthly cost preview
```

**⚙️ Organization Settings**
```
- Organization profile (naam, billing email)
- Account limits en tier info
- Contact voor support
- Team member permissions
```

#### **Business Logic:**
```sql
-- Alleen eigen org data zien
CREATE POLICY "org_admin_team_access" ON profiles
FOR SELECT USING (
  organization_id = (
    SELECT organization_id FROM profiles 
    WHERE id = auth.uid() AND organization_role = 'admin'
  )
);
```

### **2.3 User Account Management**

**Doel:** Individuele users kunnen hun eigen account beheren

**Route:** `/account` (alle authenticated users)

#### **Core Features:**

**👤 Profile Management**
```
- Edit full name, email
- Change password
- Organization info (read-only)
- Account type (individual vs organization)
```

**📊 Personal Usage**
```
- Personal chat statistics
- Most used categories
- Account history (registration date, etc.)
- Trial status / subscription info
```

**🔐 Security Settings**
```
- Login history
- Active sessions
- Two-factor authentication (future)
- Privacy settings
```

---

## 🗄️ FASE 3: Database Uitbreidingen

### **3.1 Extended User Profiles**

**Doel:** Meer context en personalisatie voor users

#### **Nieuwe Database Fields:**
```sql
ALTER TABLE profiles ADD COLUMN job_title TEXT;
ALTER TABLE profiles ADD COLUMN phone TEXT;
ALTER TABLE profiles ADD COLUMN language TEXT DEFAULT 'nl';
ALTER TABLE profiles ADD COLUMN timezone TEXT DEFAULT 'Europe/Amsterdam';
ALTER TABLE profiles ADD COLUMN last_login TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN account_created_by UUID REFERENCES profiles(id);
ALTER TABLE profiles ADD COLUMN preferences JSON DEFAULT '{}';
```

#### **Use Cases:**
- **job_title:** "HR Manager", "Bedrijfsarts" - voor targeting en insights
- **phone:** Support contact, important voor enterprise accounts
- **language:** Nederlands/Engels interface (i18n preparation)
- **timezone:** Scheduling, reminder timing
- **last_login:** Activity monitoring, inactive user cleanup
- **account_created_by:** Track wie accounts heeft aangemaakt (voor admin insight)
- **preferences:** Dark mode, notification settings, etc.

### **3.2 Organization Enhancements**

**Doel:** Betere organisatie management en business intelligence

#### **Nieuwe Database Fields:**
```sql
ALTER TABLE organizations ADD COLUMN industry TEXT;
ALTER TABLE organizations ADD COLUMN company_size_category TEXT;
ALTER TABLE organizations ADD COLUMN subscription_tier TEXT DEFAULT 'basic';
ALTER TABLE organizations ADD COLUMN contract_start_date DATE;
ALTER TABLE organizations ADD COLUMN contract_end_date DATE;
ALTER TABLE organizations ADD COLUMN account_manager TEXT;
ALTER TABLE organizations ADD COLUMN custom_branding JSON;
ALTER TABLE organizations ADD COLUMN api_access_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE organizations ADD COLUMN max_users INTEGER;
ALTER TABLE organizations ADD COLUMN notes TEXT;
```

#### **Use Cases:**
- **industry:** "Healthcare", "Government", "Finance" - voor specialisatie
- **company_size_category:** "SMB", "Mid-market", "Enterprise" - voor pricing
- **subscription_tier:** "basic", "premium", "enterprise" - voor feature access
- **contract_dates:** Billing cycles, renewal management
- **account_manager:** "Talar", "Colin" - wie beheert deze klant
- **custom_branding:** Logo URL, kleuren voor white-label
- **api_access:** Voor enterprise integraties
- **max_users:** Limieten per tier
- **notes:** Internal notes voor account management

### **3.3 Usage & Analytics Tables**

**Doel:** Inzicht in gebruik en business intelligence voor growth

#### **Nieuwe Tabellen:**
```sql
-- Chat usage tracking
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  message_count INTEGER DEFAULT 0,
  categories_used TEXT[],
  ip_address INET,
  user_agent TEXT
);

-- Monthly organization usage
CREATE TABLE organization_usage_monthly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  month DATE, -- '2024-01-01'
  active_users_count INTEGER,
  total_messages INTEGER,
  unique_categories_used TEXT[],
  tier_at_month_end TEXT,
  calculated_cost DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System events & audit log
CREATE TABLE system_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'user_created', 'org_created', 'billing_change'
  user_id UUID REFERENCES profiles(id),
  organization_id UUID REFERENCES organizations(id),
  event_data JSON,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **Analytics Views:**
```sql
-- Popular questions/categories
CREATE VIEW popular_categories AS
SELECT 
  unnest(categories_used) as category,
  COUNT(*) as usage_count,
  COUNT(DISTINCT user_id) as unique_users
FROM chat_sessions 
WHERE started_at > NOW() - INTERVAL '30 days'
GROUP BY category
ORDER BY usage_count DESC;

-- Organization health metrics
CREATE VIEW organization_health AS
SELECT 
  o.name,
  COUNT(p.id) as total_users,
  COUNT(cs.user_id) as active_users_last_30d,
  AVG(cs.message_count) as avg_messages_per_session
FROM organizations o
JOIN profiles p ON o.id = p.organization_id
LEFT JOIN chat_sessions cs ON p.id = cs.user_id 
  AND cs.started_at > NOW() - INTERVAL '30 days'
GROUP BY o.id, o.name;
```

---

## 🚀 FASE 4: Advanced Features

### **4.1 Automated Billing System**

**Doel:** Automatische factuur generatie en payment processing

#### **Payment Integration:**
```
Provider: Mollie (Nederlandse standaard)
- Subscription management
- Automatic invoicing
- Failed payment handling
- VAT calculation (Nederlandse BTW)
```

#### **Billing Logic:**
```sql
-- Subscription plans
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL, -- 'Individual', 'Small Team', 'Enterprise'
  price_per_user DECIMAL(10,2),
  min_users INTEGER,
  max_users INTEGER,
  features JSON
);

-- Organization subscriptions
CREATE TABLE organization_subscriptions (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  plan_id UUID REFERENCES subscription_plans(id),
  status TEXT CHECK (status IN ('active', 'past_due', 'canceled')),
  current_period_start DATE,
  current_period_end DATE,
  mollie_subscription_id TEXT
);
```

#### **Automated Flows:**
- Monthly user count calculation
- Automatic tier switching based on usage
- Invoice generation via Mollie
- Failed payment notifications
- Account suspension/reactivation

### **4.2 Team Management**

**Doel:** Advanced team management voor grote organisaties

#### **Team Structure:**
```sql
-- Departments binnen organisaties
CREATE TABLE departments (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  parent_department_id UUID REFERENCES departments(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User-department koppelingen
CREATE TABLE user_departments (
  user_id UUID REFERENCES profiles(id),
  department_id UUID REFERENCES departments(id),
  role TEXT DEFAULT 'member', -- 'admin', 'member'
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, department_id)
);
```

#### **Features:**
- Hierarchical team structure
- Department-based permissions
- Bulk user management
- Department-specific usage insights
- Team admin delegation

### **4.3 White-label Options**

**Doel:** Branded DoBie voor enterprise partners

#### **Customization Options:**
```sql
-- Organization branding
ALTER TABLE organizations ADD COLUMN branding JSON DEFAULT '{
  "logo_url": null,
  "primary_color": "#771138",
  "secondary_color": "#E9B046",
  "custom_domain": null,
  "footer_text": null
}';
```

#### **Features:**
- Custom logo en kleuren
- Custom domain (dobbie.bedrijfsnaam.nl)
- Branded email templates
- Custom footer/contact info
- API access voor integraties

---

## 📈 Implementation Prioritering

### **Phase 2A (Direct na MVP):**
1. Super Admin Dashboard (Talar's needs)
2. Basic Organization Admin (HR tools)
3. Extended user profiles (job_title, last_login)

### **Phase 2B (Na eerste betalende klanten):**
1. Usage analytics tables
2. Organization enhancements
3. Automated billing prep

### **Phase 3 (Enterprise ready):**
1. Team management
2. White-label options
3. API access

**Elke fase bouwt op de vorige en voegt concrete business value toe zonder over-engineering.**