-- MIGRATION: 20250127_fix_rls_recursion.sql
-- Deze migratie lost een oneindige recursie-fout op in de RLS-policies.

-- Probleem:
-- Policies op 'profiles' en 'organizations' gebruikten een subquery op 'profiles' 
-- om de 'user_type' te checken. Dit veroorzaakte een oneindige lus (infinite recursion)
-- wanneer RLS werd geëvalueerd.

-- Oplossing:
-- 1. Een SECURITY DEFINER functie `get_my_user_type` aanmaken die de RLS-check omzeilt.
-- 2. De bestaande, problematische policies verwijderen.
-- 3. De policies opnieuw aanmaken met de nieuwe, veilige functie.

-- Stap 1: Creëer de veilige functie om het gebruikerstype op te halen
CREATE OR REPLACE FUNCTION public.get_my_user_type()
RETURNS TEXT AS $$
DECLARE
  user_type_result TEXT;
BEGIN
  -- Deze query wordt uitgevoerd met de rechten van de functie-eigenaar,
  -- waardoor de RLS-check op 'profiles' wordt omzeild en recursie wordt voorkomen.
  SELECT user_type INTO user_type_result
  FROM public.profiles
  WHERE id = auth.uid();
  RETURN user_type_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Stap 2: Verwijder de oude, recursieve policies
-- We gebruiken 'IF EXISTS' om fouten te voorkomen als de policy niet bestaat.
DROP POLICY IF EXISTS "Super admins have full access to all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can manage organizations" ON public.organizations;


-- Stap 3: Maak de policies opnieuw aan met de veilige functie
CREATE POLICY "Super admins have full access to all profiles"
ON public.profiles
FOR ALL
USING (public.get_my_user_type() = 'super_admin')
WITH CHECK (public.get_my_user_type() = 'super_admin');

CREATE POLICY "Super admins can manage organizations"
ON public.organizations
FOR ALL
USING (public.get_my_user_type() = 'super_admin')
WITH CHECK (public.get_my_user_type() = 'super_admin');

-- LET OP: Het is mogelijk dat de 'authenticated' policy op organizations ook moet worden aangepast
-- voor meer granulaire controle, maar dit lost de directe recursie-fout op.
-- De 'Allow anon read for INDIVIDUAL organization' policy van de vorige migratie
-- blijft essentieel voor de registratie van individuele gebruikers. 