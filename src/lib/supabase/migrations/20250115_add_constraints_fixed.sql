-- Add foreign key constraints and validation checks (fixed version)

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

-- Function to validate account type and organization consistency
CREATE OR REPLACE FUNCTION validate_profile_organization()
RETURNS TRIGGER AS $$
DECLARE
  org_code_value TEXT;
BEGIN
  -- Get the org_code for the organization_id
  SELECT org_code INTO org_code_value 
  FROM organizations 
  WHERE id = NEW.organization_id;
  
  -- Validate business rules
  IF NEW.account_type = 'individual' AND org_code_value != 'INDIVIDUAL' THEN
    RAISE EXCEPTION 'Individual accounts must be linked to INDIVIDUAL organization';
  END IF;
  
  IF NEW.account_type = 'organization_member' AND org_code_value = 'INDIVIDUAL' THEN
    RAISE EXCEPTION 'Organization members cannot be linked to INDIVIDUAL organization';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Apply validation trigger to profiles table
CREATE TRIGGER validate_profile_organization_trigger
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION validate_profile_organization(); 