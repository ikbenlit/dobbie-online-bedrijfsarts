-- MIGRATION: 20250119_add_profile_creation_trigger_final_v3.sql
-- Deze migratie implementeert de profile-creation trigger op een robuuste (idempotente) manier.
-- v3: Opgelost: `full_name` kan `NULL` zijn, wat een `NOT NULL` constraint schond.

-- Stap 1: Definieer de functie `handle_new_user`.
-- Door `CREATE OR REPLACE` te gebruiken, zorgen we ervoor dat dit script opnieuw kan worden uitgevoerd zonder fouten.
CREATE OR REPLACE FUNCTION public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, account_type, organization_id)
  values (
    new.id,
    new.email,
    -- OPGELOST: Gebruik COALESCE om een standaardwaarde ('Onbekend') te bieden
    -- als `full_name` niet wordt meegegeven bij de registratie.
    coalesce(new.raw_user_meta_data->>'full_name', 'Onbekend'),
    case
      when new.raw_user_meta_data->>'organization_code' is not null then 'organization_member'
      else 'individual'
    end,
    (select id from public.organizations where org_code = coalesce(new.raw_user_meta_data->>'organization_code', 'INDIVIDUAL'))
  );
  return new;
end;
$$;

-- Stap 2: Verwijder de oude trigger als deze bestaat, om conflicten te voorkomen.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Stap 3: Maak de trigger aan die de functie activeert.
CREATE TRIGGER on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
