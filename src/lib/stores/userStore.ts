import { writable, derived, get } from 'svelte/store';
import type { User as SupabaseUser, Session, AuthChangeEvent, SupabaseClient } from '@supabase/supabase-js';

// Store voor de active supabase client (wordt ingesteld vanuit +layout.svelte)
export const supabaseClient = writable<SupabaseClient | null>(null);

// Uitgebreide User interface voor DoBbie specifieke data
export interface User {
  id: string;
  email: string;
  full_name?: string;
  account_type?: 'individual' | 'organization_member';
  organization_id?: string;
  subscription_status?: 'trial' | 'expired' | 'manual_active' | 'blocked';
  role: string;
}

// Auth state interface
export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

// Initialiseer de store
const initialAuthState: AuthState = {
  user: null,
  session: null,
  loading: true
};

// Creëer de writable store
const authStore = writable<AuthState>(initialAuthState);

// Derived store voor makkelijke toegang tot user
export const user = derived(authStore, ($authStore) => $authStore.user);

// Derived store voor loading state
export const loading = derived(authStore, ($authStore) => $authStore.loading);

// Derived store voor authenticated state
export const isAuthenticated = derived(authStore, ($authStore) => !!$authStore.user);

// Functie om auth state te updaten
export function updateAuthState(session: Session | null, loading = false) {
  const user =
		session?.user && session.user.email
			? {
					id: session.user.id,
					email: session.user.email,
					full_name: session.user.user_metadata?.full_name,
					account_type: session.user.user_metadata?.account_type,
					organization_id: session.user.user_metadata?.organization_id,
					subscription_status: session.user.user_metadata?.subscription_status,
					role: session.user.user_metadata?.role ?? 'user'
			  }
			: null;

  authStore.set({
    user,
    session,
    loading
  });
}

// Functie om gebruiker in te loggen
async function signIn(email: string, password: string, client?: SupabaseClient) {
  authStore.update(state => ({ ...state, loading: true }));
  
  // Gebruik de meegegeven client of probeer de client uit de store
  let supabase = client;
  if (!supabase) {
    const clientFromStore = get(supabaseClient);
    if (!clientFromStore) {
      throw new Error('No Supabase client available. Make sure the client is properly initialized.');
    }
    supabase = clientFromStore;
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Fetch complete profile data from database to get correct subscription_status
    if (data.session?.user) {
      console.log('Fetching profile data for user after login:', data.session.user.id);
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_status, full_name, account_type, organization_id, user_type')
        .eq('id', data.session.user.id)
        .single();
      
      if (!profileError && profile) {
        console.log('Profile data loaded:', profile);
        
        // Update session with profile data in user_metadata
        const updatedSession = {
          ...data.session,
          user: {
            ...data.session.user,
            user_metadata: {
              ...data.session.user.user_metadata,
              subscription_status: profile.subscription_status,
              full_name: profile.full_name,
              account_type: profile.account_type,
              organization_id: profile.organization_id,
              role: profile.user_type || 'user'
            }
          }
        };
        
        // Update auth state with enriched profile data
        updateAuthState(updatedSession, false);
        
        // Wacht op auth state change event om te bevestigen dat session is gesynchroniseerd
        console.log('[userStore] Waiting for auth state change confirmation...');
        await new Promise((resolve) => {
          const timeout = setTimeout(() => {
            console.log('[userStore] Auth state change timeout, proceeding anyway');
            resolve(void 0);
          }, 3000); // Verhoog timeout naar 3 seconden
          
          // Listen for next auth state change event
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('[userStore] Auth state change event:', event, {
              hasSession: !!session,
              userId: session?.user?.id,
              userEmail: session?.user?.email,
              expectedUserId: data.session?.user?.id,
              matches: session?.user?.id === data.session?.user?.id
            });
            
            if (event === 'SIGNED_IN' && session?.user?.id === data.session?.user?.id) {
              console.log('[userStore] Auth state change confirmed for correct user:', event);
              clearTimeout(timeout);
              subscription.unsubscribe();
              resolve(void 0);
            } else if (event === 'TOKEN_REFRESHED' && session?.user?.id === data.session?.user?.id) {
              console.log('[userStore] Token refreshed, considering as confirmation:', event);
              clearTimeout(timeout);
              subscription.unsubscribe();
              resolve(void 0);
            }
          });
        });
        
      } else {
        console.error('Error fetching profile data:', profileError);
        // Fallback to basic auth state update
        updateAuthState(data.session, false);
      }
    }
    
    return data;
  } catch (error) {
    authStore.update(state => ({ ...state, loading: false }));
    throw error;
  }
}

// Functie om gebruiker uit te loggen
async function signOut() {
  authStore.update(state => ({ ...state, loading: true }));
  
  const clientFromStore = get(supabaseClient);
  if (!clientFromStore) {
    console.error('No Supabase client available for signOut');
    updateAuthState(null, false);
    return;
  }
  
  try {
    const { error } = await clientFromStore.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    // Reset state anyway
    updateAuthState(null, false);
    throw error;
  }
}

// Functie om de user data in te stellen
function setUser(userData: User | null) {
  authStore.set({
    user: userData,
    session: null,
    loading: true
  });
}

function clearUser() {
  updateAuthState(null, false);
}

// Functie om de auth state te initialiseren (vervangen door de +layout.svelte logica)
// We laten deze hier voorlopig staan om geen andere delen van de code te breken
// maar de aanroep in +layout.svelte is de correcte manier.
export async function initializeAuth() {
  const clientFromStore = get(supabaseClient);
  if (!clientFromStore) {
    console.error('No Supabase client available for initializeAuth');
    return;
  }
  
  // Use getUser() instead of getSession() for security
  try {
    const { data: { user }, error } = await clientFromStore.auth.getUser();
    
    if (error) {
      console.error('Error getting user:', error);
      updateAuthState(null);
    } else if (user) {
      // Get the session safely after verifying user
      const { data: { session } } = await clientFromStore.auth.getSession();
      console.log('Auth state changed (init):', user.email);
      updateAuthState(session);
    } else {
      updateAuthState(null);
    }
  } catch (error) {
    console.error('Error during auth initialization:', error);
    updateAuthState(null);
  }

  clientFromStore.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
    console.log('Auth state changed:', event, session?.user?.email);
    updateAuthState(session);
  });
}

// Registration data interface
export interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  account_type: 'individual' | 'organization_member';
  organization_code: string;
}

// Functie om organisatiecode te valideren
async function validateOrganizationCode(code: string): Promise<{ valid: boolean; org_name?: string; organization_id?: string } | null> {
  const clientFromStore = get(supabaseClient);
  if (!clientFromStore) {
    throw new Error('No Supabase client available for organization validation');
  }

  try {
    const { data, error } = await clientFromStore.rpc('validate_organization_code', {
      org_code_to_check: code
    });

    if (error) {
      console.error('Error validating organization code:', error);
      return { valid: false };
    }

    // De RPC functie retourneert een array met resultaten
    if (data && data.length > 0) {
      const result = data[0];
      return {
        valid: result.is_valid,
        org_name: result.organization_name,
        organization_id: result.organization_id
      };
    }

    return { valid: false };
  } catch (error) {
    console.error('Exception during organization validation:', error);
    return { valid: false };
  }
}

// Functie om nieuwe gebruiker te registreren
async function registerUser(registrationData: RegistrationData) {
  authStore.update(state => ({ ...state, loading: true }));
  
  const clientFromStore = get(supabaseClient);
  if (!clientFromStore) {
    authStore.update(state => ({ ...state, loading: false }));
    throw new Error('No Supabase client available for registration');
  }

  try {
    // Prepare user metadata for the database trigger
    const userMetadata: Record<string, any> = {
      full_name: registrationData.full_name,
    };

    // Add organization_code to metadata if user is organization member
    if (registrationData.account_type === 'organization_member' && registrationData.organization_code) {
      userMetadata.organization_code = registrationData.organization_code;
    }

    // Register user with Supabase Auth
    const { data, error } = await clientFromStore.auth.signUp({
      email: registrationData.email,
      password: registrationData.password,
      options: {
        data: userMetadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      throw new Error(getLocalizedErrorMessage(error.message));
    }

    if (!data.user) {
      throw new Error('Er is een onbekende fout opgetreden tijdens registratie.');
    }

    // Check if email confirmation is required
    if (!data.session) {
      throw new Error('Controleer uw e-mail voor een bevestigingslink voordat u kunt inloggen.');
    }

    // Update auth state with the new session
    updateAuthState(data.session, false);

    return data;
  } catch (error: any) {
    authStore.update(state => ({ ...state, loading: false }));
    throw error;
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

// Export functions en stores
export { 
  authStore, 
  signIn, 
  signOut, 
  setUser, 
  clearUser, 
  validateOrganizationCode,
  registerUser,
  getLocalizedErrorMessage
}; 