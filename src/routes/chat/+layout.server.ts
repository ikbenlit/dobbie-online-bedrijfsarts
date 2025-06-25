import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals: { getUser, supabase } }) => {
	const user = await getUser();

	if (!user) {
		throw redirect(307, '/login');
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select('subscription_status')
		.eq('id', user.id)
		.single();

	// Optioneel: redirect als de gebruiker geen actieve status heeft
	if (profile?.subscription_status === 'blocked' || profile?.subscription_status === 'expired') {
		// throw redirect(307, '/pricing');
	}

	return {
		user,
	};
}; 