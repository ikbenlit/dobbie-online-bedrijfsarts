import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getMollieClient } from '$lib/server/mollie/client';
import { createClient } from '$lib/supabase/client';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const { supabase } = locals;
		const user = await locals.getUser();

		if (!user) {
			throw error(401, 'Unauthorized');
		}

		// Get user profile to ensure they exist
		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', user.id)
			.single();

		if (profileError || !profile) {
			throw error(404, 'User profile not found');
		}

		// Check if customer already exists
		const { data: existingCustomer } = await supabase
			.from('mollie_customers')
			.select('*')
			.eq('user_id', user.id)
			.single();

		if (existingCustomer) {
			return json({
				success: true,
				customer: existingCustomer,
				message: 'Customer already exists'
			});
		}

		// Get request data
		const body = await request.json();
		const { email, name } = body;

		// Validate required fields
		if (!email || !name) {
			throw error(400, 'Email and name are required');
		}

		// Create Mollie customer
		const mollieClient = getMollieClient();
		const mollieCustomer = await mollieClient.customers.create({
			name,
			email,
			metadata: {
				user_id: user.id,
				created_via: 'dobbie-api'
			}
		});

		// Store customer in database
		const { data: localCustomer, error: insertError } = await supabase
			.from('mollie_customers')
			.insert({
				user_id: user.id,
				mollie_customer_id: mollieCustomer.id
			})
			.select()
			.single();

		if (insertError) {
			// If database insert fails, we should ideally clean up the Mollie customer
			// For now, we'll log the error and return failure
			console.error('Failed to store customer locally:', insertError);
			throw error(500, 'Failed to create customer');
		}

		// Update profile with mollie_customer_id
		await supabase
			.from('profiles')
			.update({ mollie_customer_id: mollieCustomer.id })
			.eq('id', user.id);

		return json({
			success: true,
			customer: {
				...localCustomer,
				mollie_data: {
					id: mollieCustomer.id,
					name: mollieCustomer.name,
					email: mollieCustomer.email,
					createdAt: mollieCustomer.createdAt
				}
			}
		});

	} catch (err: any) {
		console.error('Create customer error:', err);
		
		if (err.status) {
			throw err;
		}

		// Handle Mollie API errors
		if (err.statusCode) {
			throw error(err.statusCode, err.detail || 'Mollie API error');
		}

		throw error(500, 'Internal server error');
	}
};