export interface MollieCustomer {
	id: string;
	mode: 'live' | 'test';
	name: string;
	email: string;
	locale?: string;
	metadata?: Record<string, any>;
	createdAt: string;
}

export interface MollieSubscription {
	id: string;
	mode: 'live' | 'test';
	customerId: string;
	status: 'pending' | 'active' | 'canceled' | 'suspended' | 'completed';
	amount: {
		currency: string;
		value: string;
	};
	times?: number;
	timesRemaining?: number;
	interval: string;
	startDate: string;
	nextPaymentDate?: string;
	description: string;
	method?: string[];
	metadata?: Record<string, any>;
	canceledAt?: string;
	createdAt: string;
}

export interface MolliePayment {
	id: string;
	mode: 'live' | 'test';
	customerId?: string;
	subscriptionId?: string;
	status: 'open' | 'canceled' | 'pending' | 'authorized' | 'expired' | 'failed' | 'paid';
	amount: {
		currency: string;
		value: string;
	};
	description: string;
	method?: string;
	metadata?: Record<string, any>;
	createdAt: string;
	paidAt?: string;
	canceledAt?: string;
	expiresAt?: string;
	failedAt?: string;
	checkoutUrl?: string;
	redirectUrl?: string;
	webhookUrl?: string;
}

export interface LocalMollieCustomer {
	id: number;
	user_id: string;
	mollie_customer_id: string;
	created_at: string;
	updated_at: string;
}

export interface LocalSubscription {
	id: number;
	user_id: string;
	mollie_subscription_id: string;
	status: 'pending' | 'active' | 'canceled' | 'suspended' | 'completed';
	start_date: string;
	next_billing_date?: string;
	amount: number;
	currency: string;
	created_at: string;
	updated_at: string;
}

export interface LocalPayment {
	id: number;
	user_id: string;
	mollie_payment_id: string;
	subscription_id?: number;
	amount: number;
	currency: string;
	status: 'open' | 'canceled' | 'pending' | 'authorized' | 'expired' | 'failed' | 'paid';
	description: string;
	created_at: string;
	updated_at: string;
}

export interface CreateSubscriptionRequest {
	userId: string;
	amount: string;
	description: string;
	redirectUrl: string;
	webhookUrl: string;
}

export interface WebhookPayload {
	id: string;
}