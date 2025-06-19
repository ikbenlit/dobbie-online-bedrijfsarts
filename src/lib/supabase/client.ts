import { createClient } from '@supabase/supabase-js';
import { goto } from '$app/navigation';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// Environment variables controleren
const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseAnonKey = PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY');
}

// Supabase client aanmaken
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Redirect naar login na session expires
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' // PKCE flow voor extra security
  }
});

// Auth helper functions
export const auth = {
  // Login functie
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Supabase auth error:', error.message);
      throw error;
    }
    
    return data;
  },

  // Logout functie  
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase signout error:', error.message);
      throw error;
    }
    // Redirect naar login
    await goto('/login');
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error.message);
      return null;
    }
    return session;
  },

  // Get current user
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting user:', error.message);
      return null;
    }
    return user;
  }
};

// Export default client voor direct gebruik
export default supabase; 