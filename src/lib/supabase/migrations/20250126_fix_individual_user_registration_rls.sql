-- MIGRATION: 20250126_fix_individual_user_registration_rls.sql
-- Deze migratie lost een RLS-probleem op dat optrad bij de registratie van individuele gebruikers.

-- Probleem:
-- Anonieme gebruikers (die zich registreren) konden de 'INDIVIDUAL' organisatie niet vinden
-- omdat de RLS-policy op de 'organizations' tabel alleen leesrechten gaf aan 'authenticated' gebruikers.

-- Oplossing:
-- Een nieuwe policy toevoegen die anonieme gebruikers specifiek toestaat om de 'INDIVIDUAL'
-- organisatie te lezen. Dit is nodig om het `organization_id` te verkrijgen voor het aanmaken
-- van het gebruikersprofiel.

-- Verwijder de policy eerst als deze al bestaat om het script idempotent te maken.
DROP POLICY IF EXISTS "Allow anon read for INDIVIDUAL organization" ON public.organizations;

CREATE POLICY "Allow anon read for INDIVIDUAL organization"
ON public.organizations
FOR SELECT
TO anon
USING (org_code = 'INDIVIDUAL'); 