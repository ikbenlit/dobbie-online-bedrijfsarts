import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/client.js';
import type { RegistrationData } from '$lib/stores/userStore.js';

export async function POST({ request }) {
  try {
    const registrationData: RegistrationData = await request.json();

    // Validatie van verplichte velden
    if (!registrationData.email || !registrationData.email.includes('@')) {
      return json({ error: 'Geldig e-mailadres is verplicht' }, { status: 400 });
    }

    if (!registrationData.password || registrationData.password.length < 6) {
      return json({ error: 'Wachtwoord moet minimaal 6 karakters bevatten' }, { status: 400 });
    }

    if (registrationData.password !== registrationData.confirmPassword) {
      return json({ error: 'Wachtwoorden komen niet overeen' }, { status: 400 });
    }

    if (!registrationData.full_name || registrationData.full_name.trim().length < 2) {
      return json({ error: 'Volledige naam is verplicht' }, { status: 400 });
    }

    // Organisatie validatie variabele
    let organizationId: string | null = null;

    // Validatie voor organisatieleden
    if (registrationData.account_type === 'organization_member') {
      if (!registrationData.organization_code) {
        return json({ error: 'Organisatiecode is verplicht voor organisatieleden' }, { status: 400 });
      }

      // Valideer organisatiecode en haal organization_id op
      try {
        const { data: orgData, error: orgError } = await supabase.rpc('validate_organization_code', {
          org_code_to_check: registrationData.organization_code
        });

        if (orgError || !orgData || orgData.length === 0 || !orgData[0].is_valid) {
          return json({ error: 'Ongeldige organisatiecode' }, { status: 400 });
        }

        // Sla de organization_id op voor gebruik in metadata
        organizationId = orgData[0].organization_id;
      } catch (error) {
        console.error('Organization validation error:', error);
        return json({ error: 'Fout bij valideren organisatiecode' }, { status: 500 });
      }
    }

    // Get the origin from the request headers or use environment variable
    const origin = request.headers.get('origin') || 
                   process.env.VITE_PUBLIC_URL || 
                   'http://localhost:5173';
    
    const redirectTo = `${origin}/auth/callback`;
    console.log('Registration redirect URL:', redirectTo);

    // Prepare user metadata for the database trigger
    const userMetadata: Record<string, any> = {
      full_name: registrationData.full_name,
      account_type: registrationData.account_type,
    };

    // Add organization_id to metadata if user is organization member
    if (registrationData.account_type === 'organization_member' && organizationId) {
      userMetadata.organization_id = organizationId;
    }

    // Register user with Supabase Auth (with native email confirmation)
    const { data, error } = await supabase.auth.signUp({
      email: registrationData.email,
      password: registrationData.password,
      options: {
        data: userMetadata,
        emailRedirectTo: redirectTo
      }
    });

    if (error) {
      console.error('Registration error:', error);
      return json({ 
        error: getLocalizedErrorMessage(error.message) 
      }, { status: 400 });
    }

    if (!data.user) {
      return json({ 
        error: 'Er is een onbekende fout opgetreden tijdens registratie' 
      }, { status: 500 });
    }

    // Supabase will automatically send confirmation email via SMTP

    // Check if email confirmation is required
    if (!data.session) {
      return json({ 
        message: 'Controleer uw e-mail voor een bevestigingslink voordat u kunt inloggen',
        requiresConfirmation: true,
        userId: data.user.id
      });
    }

    // If user is immediately signed in (email confirmation disabled)
    return json({ 
      message: 'Registratie succesvol',
      requiresConfirmation: false,
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name
      }
    });

  } catch (error) {
    console.error('Server error during registration:', error);
    return json({ error: 'Server fout tijdens registratie' }, { status: 500 });
  }
}

// Functie om gelokaliseerde foutmeldingen te krijgen
function getLocalizedErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    // Auth errors
    'Invalid login credentials': 'Ongeldige inloggegevens. Controleer uw e-mailadres en wachtwoord.',
    'Email not confirmed': 'E-mailadres nog niet bevestigd. Controleer uw inbox voor een bevestigingslink.',
    'User already registered': 'Dit e-mailadres is al geregistreerd. Probeer in te loggen of gebruik een ander e-mailadres.',
    'Password should be at least 6 characters': 'Wachtwoord moet minimaal 6 karakters bevatten.',
    'Unable to validate email address: invalid format': 'Ongeldig e-mailadres formaat.',
    'Signup is disabled': 'Registratie is momenteel uitgeschakeld.',
    'Email rate limit exceeded': 'Te veel e-mails verzonden. Probeer het later opnieuw.',
    'For security purposes, you can only request this once every 60 seconds': 'Voor de veiligheid kunt u dit maar één keer per minuut aanvragen.',
    
    // Registration specific errors
    'weak password': 'Wachtwoord is te zwak. Gebruik minimaal 6 karakters.',
    'invalid email': 'Ongeldig e-mailadres.',
    'email address not authorized': 'Dit e-mailadres is niet geautoriseerd.',
    
    // Network errors
    'Failed to fetch': 'Geen internetverbinding. Controleer uw verbinding en probeer opnieuw.',
    'NetworkError': 'Netwerkfout. Controleer uw internetverbinding.',
    
    // Generic auth errors
    'invalid_grant': 'Ongeldige inloggegevens.',
    'unauthorized': 'Geen toegang.',
    'forbidden': 'Toegang geweigerd.',
    'not_found': 'Gebruiker niet gevonden.',
  };

  // Check for exact match first
  if (errorMessages[errorCode]) {
    return errorMessages[errorCode];
  }

  // Check for partial matches (case insensitive)
  const lowerErrorCode = errorCode.toLowerCase();
  for (const [key, message] of Object.entries(errorMessages)) {
    if (lowerErrorCode.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerErrorCode)) {
      return message;
    }
  }

  // Fallback to original error or generic message
  console.warn('Unmapped error code:', errorCode);
  return errorCode || 'Er is een onbekende fout opgetreden. Probeer het later opnieuw.';
}