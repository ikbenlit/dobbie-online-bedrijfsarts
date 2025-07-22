import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getMollieClient } from '$lib/server/mollie/client';
import { createClient } from '$lib/supabase/client';
import { EmailService } from '$lib/services/email';
import crypto from 'crypto';

// Webhook signature verification
function verifyWebhookSignature(
	body: string, 
	signature: string | null, 
	secret: string
): boolean {
	if (!signature) {
		return false;
	}

	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(body)
		.digest('hex');

	return crypto.timingSafeEqual(
		Buffer.from(signature, 'hex'),
		Buffer.from(expectedSignature, 'hex')
	);
}

// Process payment webhook
async function processPaymentWebhook(paymentId: string, supabase: any) {
	try {
		const mollieClient = getMollieClient();
		const payment = await mollieClient.payments.get(paymentId);

		console.log('Processing payment webhook:', paymentId, 'status:', payment.status);

		// Get user from payment metadata or local database
		let userId = payment.metadata?.user_id;
		
		if (!userId) {
			// Try to find payment in local database
			const { data: localPayment } = await supabase
				.from('payments')
				.select('user_id, id')
				.eq('mollie_payment_id', paymentId)
				.single();

			userId = localPayment?.user_id;
		}

		if (!userId) {
			console.error('No user ID found for payment:', paymentId);
			return;
		}

		// Update or create local payment record
		const { data: existingPayment } = await supabase
			.from('payments')
			.select('id')
			.eq('mollie_payment_id', paymentId)
			.single();

		if (existingPayment) {
			// Update existing payment
			await supabase
				.from('payments')
				.update({
					status: payment.status,
					updated_at: new Date().toISOString()
				})
				.eq('mollie_payment_id', paymentId);
		} else {
			// Create new payment record
			await supabase
				.from('payments')
				.insert({
					user_id: userId,
					mollie_payment_id: payment.id,
					amount: parseFloat(payment.amount.value),
					currency: payment.amount.currency,
					status: payment.status,
					description: payment.description || 'DoBbie Payment'
				});
		}

		// Get user profile for notifications
		const { data: profile } = await supabase
			.from('profiles')
			.select('email, full_name')
			.eq('id', userId)
			.single();

		if (!profile) {
			console.error('User profile not found for payment:', paymentId);
			return;
		}

		// Handle payment status changes
		switch (payment.status) {
			case 'paid':
				console.log('Payment successful:', paymentId);
				
				// If this is a subscription payment, activate the subscription
				if (payment.subscriptionId) {
					await supabase
						.from('subscriptions')
						.update({
							status: 'active',
							updated_at: new Date().toISOString()
						})
						.eq('mollie_subscription_id', payment.subscriptionId);

					// Send subscription activated email
					try {
						await EmailService.sendSubscriptionActivated({
							full_name: profile.full_name || 'DOBbie gebruiker',
							email: profile.email,
							subscriptionId: payment.subscriptionId,
							amount: payment.amount,
							nextPaymentDate: undefined // Will be set by subscription webhook
						});
					} catch (emailError) {
						console.error('Failed to send subscription activation email:', emailError);
					}
				} else {
					// Send payment success email
					try {
						await EmailService.sendPaymentSuccess({
							full_name: profile.full_name || 'DOBbie gebruiker',
							email: profile.email,
							paymentId: payment.id,
							amount: payment.amount,
							subscriptionId: payment.subscriptionId
						});
					} catch (emailError) {
						console.error('Failed to send payment success email:', emailError);
					}
				}
				break;

			case 'failed':
			case 'canceled':
			case 'expired':
				console.log('Payment failed:', paymentId, 'status:', payment.status);
				
				// Send failure notification
				try {
					await EmailService.sendPaymentFailed({
						full_name: profile.full_name || 'DOBbie gebruiker',
						email: profile.email,
						paymentId: payment.id,
						amount: payment.amount,
						status: payment.status
					});
				} catch (emailError) {
					console.error('Failed to send payment failure email:', emailError);
				}
				break;

			default:
				console.log('Payment status update:', paymentId, 'status:', payment.status);
				break;
		}

	} catch (err) {
		console.error('Error processing payment webhook:', err);
		throw err;
	}
}

// Process subscription webhook
async function processSubscriptionWebhook(subscriptionId: string, supabase: any) {
	try {
		const mollieClient = getMollieClient();
		
		// Extract customer ID from subscription ID (format: sub_xxx for customer cst_xxx)
		const customerId = subscriptionId.replace('sub_', 'cst_');
		
		const subscription = await mollieClient.customerSubscriptions.get(customerId, subscriptionId);

		console.log('Processing subscription webhook:', subscriptionId, 'status:', subscription.status);

		// Find local subscription
		const { data: localSubscription } = await supabase
			.from('subscriptions')
			.select('user_id, id')
			.eq('mollie_subscription_id', subscriptionId)
			.single();

		if (!localSubscription) {
			console.error('Local subscription not found:', subscriptionId);
			return;
		}

		// Update subscription status
		await supabase
			.from('subscriptions')
			.update({
				status: subscription.status,
				next_billing_date: subscription.nextPaymentDate || null,
				updated_at: new Date().toISOString()
			})
			.eq('mollie_subscription_id', subscriptionId);

		// Get user profile for notifications
		const { data: profile } = await supabase
			.from('profiles')
			.select('email, full_name')
			.eq('id', localSubscription.user_id)
			.single();

		if (!profile) {
			console.error('User profile not found for subscription:', subscriptionId);
			return;
		}

		// Handle subscription events
		switch (subscription.status) {
			case 'active':
				console.log('Subscription activated:', subscriptionId);
				try {
					await EmailService.sendSubscriptionActivated({
						full_name: profile.full_name || 'DOBbie gebruiker',
						email: profile.email,
						subscriptionId: subscription.id,
						amount: subscription.amount,
						nextPaymentDate: subscription.nextPaymentDate
					});
				} catch (emailError) {
					console.error('Failed to send subscription activation email:', emailError);
				}
				break;

			case 'canceled':
			case 'suspended':
				console.log('Subscription deactivated:', subscriptionId, 'status:', subscription.status);
				break;

			default:
				console.log('Subscription status update:', subscriptionId, 'status:', subscription.status);
				break;
		}

	} catch (err) {
		console.error('Error processing subscription webhook:', err);
		throw err;
	}
}

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const body = await request.text();
		const signature = request.headers.get('x-mollie-signature');

		console.log('Received Mollie webhook');

		// Verify webhook signature (in production)
		if (process.env.NODE_ENV === 'production') {
			const webhookSecret = process.env.MOLLIE_WEBHOOK_SECRET;
			if (!webhookSecret) {
				console.error('MOLLIE_WEBHOOK_SECRET not configured');
				throw error(500, 'Webhook secret not configured');
			}

			if (!verifyWebhookSignature(body, signature, webhookSecret)) {
				console.error('Invalid webhook signature');
				throw error(401, 'Invalid signature');
			}
		}

		// Parse webhook data
		let webhookData;
		try {
			webhookData = JSON.parse(body);
		} catch (parseError) {
			console.error('Invalid webhook JSON:', parseError);
			throw error(400, 'Invalid JSON');
		}

		const { id, resource } = webhookData;

		if (!id || !resource) {
			console.error('Invalid webhook data structure:', webhookData);
			throw error(400, 'Invalid webhook data');
		}

		const { supabase } = locals;

		// Process based on resource type
		switch (resource) {
			case 'payments':
				await processPaymentWebhook(id, supabase);
				break;

			case 'subscriptions':
				await processSubscriptionWebhook(id, supabase);
				break;

			default:
				console.log('Unhandled webhook resource type:', resource);
				break;
		}

		// Always return 200 OK to acknowledge receipt
		return json({ 
			success: true, 
			message: 'Webhook processed successfully',
			resource,
			id 
		});

	} catch (err: any) {
		console.error('Webhook processing error:', err);
		
		// For webhook errors, we still want to return 200 to prevent retries
		// unless it's a security/validation issue
		if (err.status === 401 || err.status === 400) {
			throw err;
		}

		// Log error but return success to prevent webhook retries
		return json({ 
			success: false, 
			error: 'Internal processing error',
			message: 'Webhook received but processing failed'
		});
	}
};