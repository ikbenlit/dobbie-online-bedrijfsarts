import { createMollieClient } from '@mollie/api-client';
import { dev } from '$app/environment';

let mollieClient: ReturnType<typeof createMollieClient> | null = null;

export function getMollieClient() {
	if (!mollieClient) {
		const apiKey = dev 
			? process.env.MOLLIE_API_KEY_TEST 
			: process.env.MOLLIE_API_KEY_LIVE;

		if (!apiKey) {
			throw new Error(`Mollie API key not configured for ${dev ? 'development' : 'production'} environment`);
		}

		mollieClient = createMollieClient({ apiKey });
	}

	return mollieClient;
}

export function resetMollieClient() {
	mollieClient = null;
}