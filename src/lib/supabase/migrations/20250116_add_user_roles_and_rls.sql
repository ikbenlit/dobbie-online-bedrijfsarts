-- MIGRATION: 20250116_add_user_roles_and_rls.sql
-- Deze migratie implementeert Row Level Security (RLS) en voegt een rolsysteem toe.

-- Stap 1: Voeg de 'user_type' kolom toe aan de 'profiles' tabel.
-- Dit stelt ons in staat om rollen (user, admin, super_admin) direct aan een profiel te koppelen.
ALTER TABLE public.profiles
ADD COLUMN user_type TEXT NOT NULL DEFAULT 'user'
CHECK (user_type IN ('user', 'admin', 'super_admin'));

-- Stap 2: Activeer Row Level Security (RLS) voor beide tabellen.
-- Dit is de hoofdschakelaar die ervoor zorgt dat de policies hieronder worden afgedwongen.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Stap 3: Creëer de policies voor de 'profiles' tabel.

-- Policy 3.1: Gebruikers kunnen hun eigen profiel inzien en bijwerken.
-- Dit is de basis van data-isolatie en privacy.
CREATE POLICY "Users can view and update their own profile"
ON public.profiles
FOR ALL
USING (auth.uid() = id);

-- Policy 3.2: Super admins hebben volledige toegang tot alle profielen.
-- Dit gebruikt de nieuwe 'user_type' kolom voor de check, wat flexibeler is dan hardcoded e-mails.
CREATE POLICY "Super admins have full access to all profiles"
ON public.profiles
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid() AND p.user_type = 'super_admin'
  )
);

-- Stap 4: Creëer de policies voor de 'organizations' tabel.

-- Policy 4.1: Ingelogde gebruikers mogen organisaties lezen.
-- Dit is nodig voor de frontend, bijvoorbeeld om een organisatielijst te tonen bij registratie.
CREATE POLICY "Authenticated users can read organizations"
ON public.organizations
FOR SELECT
USING (auth.role() = 'authenticated');

-- Policy 4.2: Alleen super admins kunnen organisaties aanmaken, wijzigen of verwijderen.
-- Dit voorkomt dat reguliere gebruikers de lijst met organisaties kunnen manipuleren.
CREATE POLICY "Super admins can manage organizations"
ON public.organizations
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid() AND p.user_type = 'super_admin'
  )
);

-- Stap 5: Wijs de super_admin rol toe aan de beheerders.
-- LET OP: Dit moet worden uitgevoerd NADAT de profielen voor deze e-mails bestaan.
-- Als ze nog niet bestaan, maak ze dan eerst aan in Supabase Auth en voer deze update daarna uit.
UPDATE public.profiles
SET user_type = 'super_admin'
WHERE email IN ('talar@dobbie.nl', 'colin@ikbenlit.nl');
