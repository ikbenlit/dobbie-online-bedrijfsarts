-- Add foreign key constraints and validation checks

-- Constraint: individual accounts moeten INDIVIDUAL org hebben
ALTER TABLE profiles ADD CONSTRAINT check_individual_account 
CHECK (
  (account_type = 'individual' AND organization_id = (SELECT id FROM organizations WHERE org_code = 'INDIVIDUAL'))
  OR 
  (account_type = 'organization_member' AND organization_id != (SELECT id FROM organizations WHERE org_code = 'INDIVIDUAL'))
);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Apply trigger to profiles table
CREATE TRIGGER update_profiles_updated_at 
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to organizations table
CREATE TRIGGER update_organizations_updated_at 
BEFORE UPDATE ON organizations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 