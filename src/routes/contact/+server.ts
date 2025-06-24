import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase/client';

// This would be replaced by a proper email sending service like Resend or Postmark
async function sendEmailToAdmin(formData: {
	subject: string;
	message: string;
	urgency: string;
	user_email: string;
	user_id: string;
}) {
	console.log('--- SENDING EMAIL TO ADMIN ---');
	console.log('To: talar@dobbie.nl');
	console.log(`From: noreply@dobbie.nl (on behalf of ${formData.user_email})`);
	console.log(`Subject: [DoBbie Contact] ${formData.subject}`);
	console.log(`Urgency: ${formData.urgency}`);
	console.log('---');
	console.log(formData.message);
	console.log('--- END OF EMAIL ---');

	// In a real app, you would have the logic here:
	// await resend.emails.send({ ... });

	return { success: true };
}

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

	// 2. Send email notification to admin (Talar)
	try {
		await sendEmailToAdmin({
			subject,
			message,
			urgency,
			user_id: session.user.id,
			user_email: session.user.email || 'N/A'
		});
	} catch (emailError) {
		console.error('Error sending email:', emailError);
		// We don't block the user if email fails, but we should log it.
		// In a real app, you might have more robust error handling here.
	}

	return json({ success: true, message: 'Your message has been sent.' });
}; 