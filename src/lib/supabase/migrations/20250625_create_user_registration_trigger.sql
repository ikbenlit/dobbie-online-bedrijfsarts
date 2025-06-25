-- Migration: Create trigger for automatic profile creation on user registration
-- This trigger ensures that every new user gets a profile created automatically

-- First, drop the trigger if it exists (to avoid errors on re-run)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger that calls handle_new_user() function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions to the trigger function
-- This ensures the function can access the organizations table
GRANT SELECT ON public.organizations TO public;
GRANT INSERT ON public.profiles TO public;