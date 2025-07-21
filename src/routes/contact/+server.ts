import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase/client';
import { EmailService } from '$lib/services/email.js';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.getSession();
	if (!session?.user) {
		throw error(401, 'Unauthorized');
	}

	const formData = await request.formData();
	const subject = formData.get('subject') as string;
	const message = formData.get('message') as string;
	const urgency = formData.get('urgency') as string;

	if (!subject || !message || !urgency) {
		throw error(400, 'Missing required form fields');
	}

	// 1. Update the user's profile in Supabase
	const { error: updateError } = await supabase
		.from('profiles')
		.update({ contacted_for_conversion: true })
		.eq('id', session.user.id);

	if (updateError) {
		console.error('Error updating profile:', updateError);
		throw error(500, 'Failed to update user profile.');
	}

	// 2. Get user profile for full name
	const { data: userProfile } = await supabase
		.from('profiles')
		.select('full_name')
		.eq('id', session.user.id)
		.single();

	// 3. Send email notification to admin via Resend
	try {
		await EmailService.sendContactForm({
			subject,
			message,
			urgency,
			user_id: session.user.id,
			user_email: session.user.email || 'N/A',
			full_name: userProfile?.full_name || 'Onbekende gebruiker'
		});
	} catch (emailError) {
		console.error('Error sending email via Resend:', emailError);
		// We don't block the user if email fails, but we should log it.
		// In a real app, you might have more robust error handling here.
	}

	return json({ success: true, message: 'Your message has been sent.' });
}; 