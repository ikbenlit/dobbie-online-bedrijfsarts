import { createClient } from '@supabase/supabase-js'
import { env } from '$env/dynamic/public'
import { goto } from '$app/navigation'

// Fallback values voor development
const supabaseUrl = env.PUBLIC_SUPABASE_URL || 'https://rcbokkgstwvlxwrpufsv.supabase.co'
const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYm9ra2dzdHd2bHh3cnB1ZnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzQ4NDQsImV4cCI6MjA2NTg1MDg0NH0.7_1HeuRxkJoR5jJ5cmpKMkQ4AjTlvOW9Xppgy4wjNE8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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