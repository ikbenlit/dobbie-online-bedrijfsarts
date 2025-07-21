import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/client.js';

export async function POST({ request }) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return json({ error: 'Geldig e-mailadres is verplicht' }, { status: 400 });
    }

    // Get the origin from the request headers or use environment variable
    const origin = request.headers.get('origin') || 
                   process.env.VITE_PUBLIC_URL || 
                   'http://localhost:5173';
    
    const redirectTo = `${origin}/reset-password`;
    console.log('Password reset redirect URL:', redirectTo);

    // Generate password reset with Supabase (native email via SMTP)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo
    });

    if (error) {
      console.error('Forgot password error:', error);
      return json({ error: 'Er is een fout opgetreden bij het verzenden van de reset e-mail' }, { status: 500 });
    }

    // Supabase will automatically send password reset email via SMTP

    return json({ 
      message: 'Reset link is verzonden naar je e-mailadres' 
    });

  } catch (error) {
    console.error('Server error:', error);
    return json({ error: 'Server fout' }, { status: 500 });
  }
}