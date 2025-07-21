import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getMollieClient } from '$lib/server/mollie/client';

export const GET: RequestHandler = async ({ params, locals }) => {
	try {
		const user = await locals.getUser();
		if (!user) {
			throw error(401, 'Unauthorized');
		}

		const { id } = params;
		if (!id) {
			throw error(400, 'Payment ID is required');
		}

		const { supabase } = locals;

		// Get payment from local database
		const { data: localPayment, error: paymentError } = await supabase
			.from('payments')
			.select('*')
			.eq('mollie_payment_id', id)
			.eq('user_id', user.id)
			.single();

		if (paymentError && paymentError.code !== 'PGRST116') {
			console.error('Database error:', paymentError);
			throw error(500, 'Database error');
		}

		// Get payment status from Mollie
		const mollieClient = getMollieClient();
		let molliePayment;
		
		try {
			molliePayment = await mollieClient.payments.get(id);
		} catch (mollieError: any) {
			if (mollieError.statusCode === 404) {
				throw error(404, 'Payment not found');
			}
			throw error(500, 'Failed to fetch payment from Mollie');
		}

		// Verify that this payment belongs to the user (security check)
		if (molliePayment.metadata?.user_id !== user.id && localPayment?.user_id !== user.id) {
			throw error(403, 'Access denied');
		}

		// Update local payment status if it exists and status has changed
		if (localPayment && localPayment.status !== molliePayment.status) {
			const { data: updatedPayment } = await supabase
				.from('payments')
				.update({ 
					status: molliePayment.status,
					updated_at: new Date().toISOString()
				})
				.eq('id', localPayment.id)
				.select()
				.single();

			return json({
				success: true,
				payment: {
					...updatedPayment,
					mollie_data: {
						id: molliePayment.id,
						status: molliePayment.status,
						amount: molliePayment.amount,
						description: molliePayment.description,
						method: molliePayment.method,
						createdAt: molliePayment.createdAt,
						paidAt: molliePayment.paidAt,
						canceledAt: molliePayment.canceledAt,
						expiresAt: molliePayment.expiresAt,
						checkoutUrl: molliePayment._links?.checkout?.href
					}
				}
			});
		}

		// If no local payment exists, create it
		if (!localPayment) {
			const newPayment = {
				user_id: user.id,
				mollie_payment_id: molliePayment.id,
				amount: parseFloat(molliePayment.amount.value),
				currency: molliePayment.amount.currency,
				status: molliePayment.status,
				description: molliePayment.description || 'DoBbie Subscription'
			};

			const { data: createdPayment } = await supabase
				.from('payments')
				.insert(newPayment)
				.select()
				.single();

			return json({
				success: true,
				payment: {
					...createdPayment,
					mollie_data: {
						id: molliePayment.id,
						status: molliePayment.status,
						amount: molliePayment.amount,
						description: molliePayment.description,
						method: molliePayment.method,
						createdAt: molliePayment.createdAt,
						paidAt: molliePayment.paidAt,
						canceledAt: molliePayment.canceledAt,
						expiresAt: molliePayment.expiresAt,
						checkoutUrl: molliePayment._links?.checkout?.href
					}
				}
			});
		}

		// Return existing payment with Mollie data
		return json({
			success: true,
			payment: {
				...localPayment,
				mollie_data: {
					id: molliePayment.id,
					status: molliePayment.status,
					amount: molliePayment.amount,
					description: molliePayment.description,
					method: molliePayment.method,
					createdAt: molliePayment.createdAt,
					paidAt: molliePayment.paidAt,
					canceledAt: molliePayment.canceledAt,
					expiresAt: molliePayment.expiresAt,
					checkoutUrl: molliePayment._links?.checkout?.href
				}
			}
		});

	} catch (err: any) {
		console.error('Get payment error:', err);
		
		if (err.status) {
			throw err;
		}

		if (err.statusCode) {
			throw error(err.statusCode, err.detail || 'Mollie API error');
		}

		throw error(500, 'Internal server error');
	}
};