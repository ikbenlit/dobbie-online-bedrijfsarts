import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/client.js';
import { EmailService } from '$lib/services/email.js';

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

    // Skip Supabase auth email (SMTP not ready yet)
    // Generate password reset with Supabase
    // const { error } = await supabase.auth.resetPasswordForEmail(email, {
    //   redirectTo
    // });

    // if (error) {
    //   console.error('Forgot password error:', error);
    //   return json({ error: 'Er is een fout opgetreden bij het verzenden van de reset e-mail' }, { status: 500 });
    // }

    // Get user info for personalized email
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('email', email)
      .single();

    // Send custom password reset email via Resend (temporary)
    try {
      await EmailService.sendPasswordReset({
        full_name: userProfile?.full_name || 'Gebruiker',
        email: email,
        reset_url: redirectTo
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return json({ error: 'Er is een fout opgetreden bij het verzenden van de reset e-mail' }, { status: 500 });
    }

    return json({ 
      message: 'Reset link is verzonden naar je e-mailadres' 
    });

  } catch (error) {
    console.error('Server error:', error);
    return json({ error: 'Server fout' }, { status: 500 });
  }
}