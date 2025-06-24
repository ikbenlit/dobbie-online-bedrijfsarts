-- Migration: Correct the search_path for the handle_new_user function.
-- This fix, identified by the user, correctly sets the search_path to 'public',
-- allowing the SECURITY DEFINER function to find the necessary tables.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'  -- Correct search_path to resolve tables.
AS $function$
DECLARE
  individual_org_id UUID;
BEGIN
  -- Find the ID for the 'INDIVIDUAL' organization.
  SELECT id INTO individual_org_id 
  FROM organizations 
  WHERE org_code = 'INDIVIDUAL' 
  LIMIT 1;

  IF individual_org_id IS NULL THEN
    RAISE EXCEPTION 'Default organization with org_code "INDIVIDUAL" not found.';
  END IF;

  INSERT INTO profiles (id, email, full_name, account_type, organization_id)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Unnamed User'),
    'individual',
    individual_org_id
  );
  
  RETURN new;
END;
$function$; 