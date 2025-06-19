-- Migration: Final and correct version of the handle_new_user trigger function.
-- This version correctly uses the metadata from the frontend signup process
-- to assign the right account_type and organization_id.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    -- Variable to hold the final organization_id to be inserted
    final_organization_id UUID;
    -- Variable to hold the final account_type
    final_account_type TEXT;
BEGIN
    -- Determine the account type. Default to 'individual' if not provided.
    final_account_type := COALESCE(new.raw_user_meta_data->>'account_type', 'individual');

    -- Check if an organization_id (as a UUID) was passed in the metadata.
    -- This is the preferred, direct way.
    IF new.raw_user_meta_data->>'organization_id' IS NOT NULL THEN
        -- Use the provided organization_id directly.
        -- We trust the frontend to have validated this via the RPC call.
        final_organization_id := (new.raw_user_meta_data->>'organization_id')::UUID;
    ELSE
        -- Fallback: if no organization_id is provided, default to the 'INDIVIDUAL' organization.
        SELECT id INTO final_organization_id 
        FROM organizations 
        WHERE org_code = 'INDIVIDUAL' 
        LIMIT 1;
    END IF;

    -- If, after all checks, we still don't have an organization ID, raise an error.
    IF final_organization_id IS NULL THEN
        RAISE EXCEPTION 'Could not determine organization for new user.';
    END IF;

    -- Insert the new profile with the determined values.
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
$function$; 