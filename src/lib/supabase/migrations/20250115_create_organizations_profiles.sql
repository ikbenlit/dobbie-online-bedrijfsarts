-- Migration script to create 'organizations' and 'profiles' tables

-- Create 'organizations' table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_code TEXT UNIQUE NOT NULL,  -- "BELASTINGDIENST", "INDIVIDUAL"
  name TEXT NOT NULL,             -- "Belastingdienst", "Individual Users"
  billing_email TEXT,             -- Optional billing email
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX idx_organizations_org_code ON organizations(org_code);

-- Create 'profiles' table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  
  -- Account classification
  account_type TEXT NOT NULL CHECK (account_type IN ('individual', 'organization_member')),
  organization_id UUID REFERENCES organizations(id),
  
  -- Subscription status (for future automation)
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'inactive', 'blocked')),
  trial_start_date TIMESTAMPTZ DEFAULT NOW(),
  trial_end_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX idx_profiles_account_type ON profiles(account_type);
CREATE INDEX idx_profiles_email ON profiles(email); 