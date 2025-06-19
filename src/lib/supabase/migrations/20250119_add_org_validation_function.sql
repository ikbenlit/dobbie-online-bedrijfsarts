-- MIGRATION: 20250119_add_org_validation_function.sql
-- Deze migratie maakt een RPC-functie (Remote Procedure Call) aan die vanuit de frontend 
-- kan worden aangeroepen om een organisatiecode te valideren.

-- Stap 1: Definieer de functie `validate_organization_code`.
CREATE OR REPLACE FUNCTION public.validate_organization_code(
  -- De organisatiecode die vanuit de frontend wordt aangeleverd.
  org_code_to_check TEXT
)
-- De functie retourneert een tabel met drie kolommen.
RETURNS TABLE(is_valid BOOLEAN, organization_name TEXT, organization_id UUID) AS $$
BEGIN
  -- Probeer de organisatie te vinden op basis van de opgegeven code.
  RETURN QUERY
  SELECT
    TRUE as is_valid,
    o.name as organization_name,
    o.id as organization_id
  FROM public.organizations o
  WHERE o.org_code = org_code_to_check;

  -- Als de bovenstaande query geen rij vindt (omdat de code niet bestaat),
  -- wordt deze `IF NOT FOUND` blok uitgevoerd.
  IF NOT FOUND THEN
    -- Geef een resultaat terug dat aangeeft dat de code ongeldig is.
    RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::UUID;
  END IF;
END;
$$ 
-- Voer de functie uit in de 'plpgsql' taal.
-- 'SECURITY DEFINER' is hier ook belangrijk, omdat het de functie toestaat in de `organizations`
-- tabel te kijken, zelfs als een anonieme gebruiker (nog niet ingelogd) de check uitvoert.
LANGUAGE plpgsql SECURITY DEFINER; 