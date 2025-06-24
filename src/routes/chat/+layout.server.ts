import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/login');
	}
	
	// Fetch the user's profile to check their subscription status
	const { data: profile, error } = await supabase
		.from('profiles')
		.select('subscription_status')
		.eq('id', session.user.id)
		.single();

	if (error) {
		console.error('Error fetching profile for access control:', error);
		throw redirect(303, '/dashboard?error=profile_not_found');
	}

	const allowedStatus: string[] = ['trial', 'manual_active'];
	const hasAccess = profile && allowedStatus.includes(profile.subscription_status);

	if (!hasAccess) {
		// If the trial is expired or account is blocked, redirect them to the contact page
		throw redirect(303, '/contact?reason=access_denied');
	}

	return {
		session: session
	};
}; 