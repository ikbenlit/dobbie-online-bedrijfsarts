import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getMollieClient } from '$lib/server/mollie/client';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const user = await locals.getUser();
		if (!user) {
			throw error(401, 'Unauthorized');
		}

		const { supabase } = locals;
		const body = await request.json();
		const { amount, description, redirectUrl, webhookUrl } = body;

		// Validate required fields
		if (!amount || !description || !redirectUrl) {
			throw error(400, 'Amount, description, and redirectUrl are required');
		}

		// Get or create Mollie customer
		let { data: mollieCustomer } = await supabase
			.from('mollie_customers')
			.select('*')
			.eq('user_id', user.id)
			.single();

		if (!mollieCustomer) {
			// Get user profile for customer creation
			const { data: profile } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', user.id)
				.single();

			if (!profile) {
				throw error(404, 'User profile not found');
			}

			// Create Mollie customer first
			const mollieClient = getMollieClient();
			const customer = await mollieClient.customers.create({
				name: profile.full_name || profile.email || 'DoBbie User',
				email: profile.email,
				metadata: {
					user_id: user.id,
					created_via: 'dobbie-subscription-api'
				}
			});

			// Store in database
			const { data: localCustomer } = await supabase
				.from('mollie_customers')
				.insert({
					user_id: user.id,
					mollie_customer_id: customer.id
				})
				.select()
				.single();

			mollieCustomer = localCustomer;
		}

		// Check for existing active subscription
		const { data: activeSubscription } = await supabase
			.from('subscriptions')
			.select('*')
			.eq('user_id', user.id)
			.eq('status', 'active')
			.single();

		if (activeSubscription) {
			throw error(409, 'User already has an active subscription');
		}

		// Create Mollie subscription
		const mollieClient = getMollieClient();
		const mollieSubscription = await mollieClient.customerSubscriptions.create(mollieCustomer.mollie_customer_id, {
			amount: {
				currency: 'EUR',
				value: amount
			},
			interval: '1 month',
			description,
			redirectUrl,
			webhookUrl: webhookUrl || undefined,
			metadata: {
				user_id: user.id,
				created_via: 'dobbie-api'
			}
		});

		// Calculate start and next billing dates
		const startDate = new Date();
		const nextBillingDate = new Date();
		nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

		// Store subscription in database
		const { data: localSubscription, error: subscriptionError } = await supabase
			.from('subscriptions')
			.insert({
				user_id: user.id,
				mollie_subscription_id: mollieSubscription.id,
				status: mollieSubscription.status as any,
				start_date: startDate.toISOString(),
				next_billing_date: mollieSubscription.nextPaymentDate || nextBillingDate.toISOString(),
				amount: parseFloat(amount),
				currency: 'EUR'
			})
			.select()
			.single();

		if (subscriptionError) {
			console.error('Failed to store subscription locally:', subscriptionError);
			// TODO: Consider canceling the Mollie subscription if local storage fails
			throw error(500, 'Failed to create subscription');
		}

		return json({
			success: true,
			subscription: {
				...localSubscription,
				mollie_data: {
					id: mollieSubscription.id,
					status: mollieSubscription.status,
					amount: mollieSubscription.amount,
					interval: mollieSubscription.interval,
					nextPaymentDate: mollieSubscription.nextPaymentDate,
					_links: mollieSubscription._links
				}
			}
		});

	} catch (err: any) {
		console.error('Create subscription error:', err);
		
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

export const PATCH: RequestHandler = async ({ request, locals }) => {
	try {
		const user = await locals.getUser();
		if (!user) {
			throw error(401, 'Unauthorized');
		}

		const { supabase } = locals;
		const body = await request.json();
		const { subscriptionId, action } = body;

		if (!subscriptionId || !action) {
			throw error(400, 'Subscription ID and action are required');
		}

		// Get local subscription
		const { data: subscription, error: subError } = await supabase
			.from('subscriptions')
			.select('*')
			.eq('id', subscriptionId)
			.eq('user_id', user.id)
			.single();

		if (subError || !subscription) {
			throw error(404, 'Subscription not found');
		}

		const mollieClient = getMollieClient();
		const mollieCustomerId = subscription.mollie_subscription_id.split('_')[0] + '_' + subscription.mollie_subscription_id.split('_')[1];

		let updatedSubscription;

		switch (action) {
			case 'cancel':
				// Cancel Mollie subscription
				await mollieClient.customerSubscriptions.cancel(mollieCustomerId, subscription.mollie_subscription_id);
				
				// Update local subscription
				const { data: canceledSub } = await supabase
					.from('subscriptions')
					.update({ 
						status: 'canceled',
						updated_at: new Date().toISOString()
					})
					.eq('id', subscriptionId)
					.select()
					.single();

				updatedSubscription = canceledSub;
				break;

			default:
				throw error(400, 'Invalid action');
		}

		return json({
			success: true,
			subscription: updatedSubscription,
			action
		});

	} catch (err: any) {
		console.error('Update subscription error:', err);
		
		if (err.status) {
			throw err;
		}

		if (err.statusCode) {
			throw error(err.statusCode, err.detail || 'Mollie API error');
		}

		throw error(500, 'Internal server error');
	}
};

export const DELETE: RequestHandler = async ({ url, locals }) => {
	try {
		const user = await locals.getUser();
		if (!user) {
			throw error(401, 'Unauthorized');
		}

		const subscriptionId = url.searchParams.get('id');
		if (!subscriptionId) {
			throw error(400, 'Subscription ID is required');
		}

		const { supabase } = locals;

		// Get subscription
		const { data: subscription, error: subError } = await supabase
			.from('subscriptions')
			.select('*')
			.eq('id', parseInt(subscriptionId))
			.eq('user_id', user.id)
			.single();

		if (subError || !subscription) {
			throw error(404, 'Subscription not found');
		}

		// Only allow deletion of canceled subscriptions
		if (subscription.status !== 'canceled') {
			throw error(400, 'Can only delete canceled subscriptions');
		}

		// Delete from database
		await supabase
			.from('subscriptions')
			.delete()
			.eq('id', parseInt(subscriptionId));

		return json({
			success: true,
			message: 'Subscription deleted'
		});

	} catch (err: any) {
		console.error('Delete subscription error:', err);
		
		if (err.status) {
			throw err;
		}

		throw error(500, 'Internal server error');
	}
};