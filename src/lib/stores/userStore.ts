import { writable, derived } from 'svelte/store';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '$lib/supabase/client';

// Uitgebreide User interface voor DoBbie specifieke data
export interface User {
  id: string;
  email: string;
  full_name?: string;
  account_type?: 'individual' | 'organization_member';
  organization_id?: string;
  subscription_status?: 'trial' | 'active' | 'inactive' | 'blocked';
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
function updateAuthState(session: Session | null, loading = false) {
  const user = session?.user ? {
    id: session.user.id,
    email: session.user.email!,
    full_name: session.user.user_metadata?.full_name,
    account_type: session.user.user_metadata?.account_type,
    organization_id: session.user.user_metadata?.organization_id,
    subscription_status: session.user.user_metadata?.subscription_status
  } : null;

  authStore.set({
    user,
    session,
    loading
  });
}

// Functie om gebruiker in te loggen
async function signIn(email: string, password: string) {
  authStore.update(state => ({ ...state, loading: true }));
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Auth state wordt automatisch bijgewerkt via onAuthStateChange
    return data;
  } catch (error) {
    authStore.update(state => ({ ...state, loading: false }));
    throw error;
  }
}

// Functie om gebruiker uit te loggen
async function signOut() {
  authStore.update(state => ({ ...state, loading: true }));
  
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    // Reset state anyway
    updateAuthState(null, false);
    throw error;
  }
}

// Legacy functies voor backwards compatibility
function setUser(email: string) {
  console.warn('setUser is deprecated, use signIn instead');
  // Voor nu, zet een basic user state voor compatibility
  authStore.update(state => ({
    ...state,
    user: {
      id: 'legacy-user',
      email,
    },
    loading: false
  }));
}

function clearUser() {
  updateAuthState(null, false);
}

// Initialize auth state listener
let initialized = false;

function initializeAuth() {
  if (initialized) return;
  
  // Listen voor auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session?.user?.email);
    updateAuthState(session, false);
  });

  // Get initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    updateAuthState(session, false);
  });

  initialized = true;
}

// Registration data interface
export interface RegistrationData {
  email: string;
  password: string;
  confirmPassword?: string;
  full_name: string;
  account_type: 'individual' | 'organization_member';
  organization_code?: string;
}

// Organization validation RPC call
export async function validateOrganizationCode(code: string) {
  if (!code) return { valid: false };

  const { data, error } = await supabase
    .rpc('validate_organization_code', { org_code_to_check: code.toUpperCase() });
  
  if (error) {
    console.error('Organization validation error:', error);
    return { valid: false };
  }

  const result = data?.[0];
  if (!result || !result.is_valid) {
    return { valid: false };
  }
  
  // Hernoem 'organization_id' naar 'org_id' voor consistentie binnen de store
  return { 
    valid: true, 
    org_name: result.organization_name, 
    org_id: result.organization_id 
  };
}

// Registration functie
export async function registerUser(registrationData: RegistrationData) {
  authStore.update(state => ({ ...state, loading: true }));
  
  try {
    let finalOrganizationId: string;

    if (registrationData.account_type === 'organization_member' && registrationData.organization_code) {
      const orgValidation = await validateOrganizationCode(registrationData.organization_code);
      if (!orgValidation.valid || !orgValidation.org_id) {
        throw new Error('Ongeldige organisatiecode.');
      }
      finalOrganizationId = orgValidation.org_id;
    } else {
      // Zoek de 'INDIVIDUAL' org ID op als het een individueel account is
      const { data: individualOrg, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('org_code', 'INDIVIDUAL')
        .single();
      
      if (orgError || !individualOrg) {
        console.error('Could not find INDIVIDUAL organization:', orgError);
        throw new Error('Standaard organisatie niet gevonden.');
      }
      finalOrganizationId = individualOrg.id;
    }
    
    // Supabase signup
    const { data, error } = await supabase.auth.signUp({
      email: registrationData.email,
      password: registrationData.password,
      options: {
        data: {
          full_name: registrationData.full_name,
          account_type: registrationData.account_type,
          organization_id: finalOrganizationId // Gebruik de correct gevonden ID
        }
      }
    });
    
    if (error) {
      throw new Error(getLocalizedErrorMessage(error.message));
    }
    
    return data;
  } catch (error) {
    authStore.update(state => ({ ...state, loading: false }));
    throw error;
  }
}

// Error message localization
function getLocalizedErrorMessage(errorMessage: string): string {
  const errorMap: Record<string, string> = {
    'User already registered': 'Dit e-mailadres is al geregistreerd. Probeer in te loggen.',
    'Password should be at least 6 characters': 'Wachtwoord moet minimaal 6 karakters bevatten.',
    'Invalid email': 'Ongeldig e-mailadres format.',
    'Signup is disabled': 'Registratie is momenteel uitgeschakeld.',
    'Email rate limit exceeded': 'Te veel registratiepogingen. Probeer later opnieuw.'
  };
  
  return errorMap[errorMessage] || 'Er is een onverwachte fout opgetreden. Probeer opnieuw.';
}

// Export functions en stores
export { 
  authStore, 
  signIn, 
  signOut, 
  setUser,  // Deprecated maar behouden voor compatibility
  clearUser, 
  initializeAuth,
  updateAuthState 
}; 