import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/login');
	}

	// Check if user has admin privileges
	const { data: profile, error } = await supabase
		.from('profiles')
		.select('user_type, full_name, email')
		.eq('id', session.user.id)
		.single();

	if (error) {
		console.error('Error fetching admin profile:', error);
		throw redirect(303, '/dashboard?error=profile_not_found');
	}

	// Only allow admin and super_admin users
	const allowedUserTypes = ['admin', 'super_admin'];
	if (!profile || !allowedUserTypes.includes(profile.user_type)) {
		throw redirect(303, '/dashboard?error=insufficient_privileges');
	}

	return {
		session,
		adminProfile: profile
	};
}; 