-- Migration: Fix the handle_new_user trigger to correctly populate the profiles table.
-- This version ensures all NOT NULL constraints are met and gracefully handles organization lookup.

-- First, drop the old, incorrect function and trigger to ensure a clean slate.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the corrected function.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  individual_org_id UUID;
BEGIN
  -- Find the ID for the 'INDIVIDUAL' organization.
  -- This makes the function resilient to changes in the actual UUID.
  SELECT id INTO individual_org_id FROM public.organizations WHERE org_code = 'INDIVIDUAL' LIMIT 1;

  -- If for some reason the INDIVIDUAL organization is not found, raise an exception.
  -- This prevents profiles from being created in an inconsistent state.
  IF individual_org_id IS NULL THEN
    RAISE EXCEPTION 'Default organization with org_code "INDIVIDUAL" not found.';
  END IF;

  -- Insert into public.profiles, providing all required fields.
  INSERT INTO public.profiles (id, email, full_name, account_type, organization_id)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Unnamed User'),
    'individual', -- Default account_type for new users.
    individual_org_id -- Link to the default 'INDIVIDUAL' organization.
  );
  RETURN new;
END;
$$;

-- Recreate the trigger on the auth.users table to call the function.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 