<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// Test state
	let testResults: any[] = [];
	let loading = false;
	let currentUser: any = null;

	// Test data
	let testCustomerData = {
		name: 'DoBbie Test User',
		email: 'test@dobbie.example'
	};

	let testSubscriptionData = {
		amount: '11.00',
		description: 'DoBbie Test Subscription',
		redirectUrl: 'http://localhost:5173/test/mollie'
	};

	let paymentIdToCheck = '';
	let webhookTestData = {
		id: '',
		resource: 'payments'
	};

	// Helper function to add results
	function addResult(operation: string, success: boolean, data: any, error?: string) {
		testResults = [...testResults, {
			timestamp: new Date().toLocaleTimeString(),
			operation,
			success,
			data,
			error
		}];
	}

	// API call wrapper
	async function apiCall(endpoint: string, method: string = 'GET', body?: any) {
		loading = true;
		try {
			const response = await fetch(endpoint, {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: body ? JSON.stringify(body) : undefined
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || `HTTP ${response.status}`);
			}

			return data;
		} finally {
			loading = false;
		}
	}

	// Test functions
	async function testCreateCustomer() {
		try {
			const result = await apiCall('/api/mollie/customers', 'POST', testCustomerData);
			addResult('Create Customer', true, result);
		} catch (error) {
			addResult('Create Customer', false, null, (error as Error).message);
		}
	}

	async function testCreateSubscription() {
		try {
			const result = await apiCall('/api/mollie/subscriptions', 'POST', testSubscriptionData);
			addResult('Create Subscription', true, result);
		} catch (error) {
			addResult('Create Subscription', false, null, (error as Error).message);
		}
	}

	async function testGetPaymentStatus() {
		if (!paymentIdToCheck.trim()) {
			addResult('Get Payment Status', false, null, 'Payment ID is required');
			return;
		}

		try {
			const result = await apiCall(`/api/mollie/payments/${paymentIdToCheck.trim()}`);
			addResult('Get Payment Status', true, result);
		} catch (error) {
			addResult('Get Payment Status', false, null, (error as Error).message);
		}
	}

	async function testWebhook() {
		if (!webhookTestData.id.trim()) {
			addResult('Test Webhook', false, null, 'ID is required');
			return;
		}

		try {
			const result = await apiCall('/api/webhooks/mollie', 'POST', webhookTestData);
			addResult('Test Webhook', true, result);
		} catch (error) {
			addResult('Test Webhook', false, null, (error as Error).message);
		}
	}

	async function clearResults() {
		testResults = [];
	}

	// Get current user info
	onMount(async () => {
		if (browser) {
			try {
				// Try to get current user from session (if logged in)
				const response = await fetch('/api/auth/user');
				if (response.ok) {
					currentUser = await response.json();
				}
			} catch (error) {
				console.log('No user session found - testing without authentication');
			}
		}
	});
</script>

<div class="min-h-screen bg-gray-50 py-12">
	<div class="mx-auto max-w-4xl px-4">
		<div class="rounded-lg bg-white shadow">
			<div class="border-b border-gray-200 px-6 py-4">
				<h1 class="text-2xl font-bold text-gray-900">🧪 Mollie API Test Dashboard</h1>
				<p class="mt-1 text-sm text-gray-600">Test alle Mollie operaties zonder de productie flow te beïnvloeden</p>
				
				{#if currentUser}
					<div class="mt-2 rounded-md bg-green-50 p-2">
						<p class="text-sm text-green-700">✅ Ingelogd als: {currentUser.email}</p>
					</div>
				{:else}
					<div class="mt-2 rounded-md bg-yellow-50 p-2">
						<p class="text-sm text-yellow-700">⚠️ Niet ingelogd - API calls verwachten authenticatie</p>
					</div>
				{/if}
			</div>

			<div class="p-6">
				<!-- Test Controls -->
				<div class="grid gap-6 md:grid-cols-2">
					<!-- Customer Operations -->
					<div class="rounded-lg border border-gray-200 p-4">
						<h2 class="mb-4 text-lg font-semibold text-gray-900">👤 Customer Operations</h2>
						
						<div class="space-y-3">
							<div>
								<label class="block text-sm font-medium text-gray-700">Name</label>
								<input
									bind:value={testCustomerData.name}
									type="text"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700">Email</label>
								<input
									bind:value={testCustomerData.email}
									type="email"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							</div>
							<button
								on:click={testCreateCustomer}
								disabled={loading}
								class="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
							>
								{loading ? 'Creating...' : 'Create Customer'}
							</button>
						</div>
					</div>

					<!-- Subscription Operations -->
					<div class="rounded-lg border border-gray-200 p-4">
						<h2 class="mb-4 text-lg font-semibold text-gray-900">💳 Subscription Operations</h2>
						
						<div class="space-y-3">
							<div>
								<label class="block text-sm font-medium text-gray-700">Amount (EUR)</label>
								<input
									bind:value={testSubscriptionData.amount}
									type="text"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700">Description</label>
								<input
									bind:value={testSubscriptionData.description}
									type="text"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							</div>
							<button
								on:click={testCreateSubscription}
								disabled={loading}
								class="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
							>
								{loading ? 'Creating...' : 'Create Subscription'}
							</button>
						</div>
					</div>

					<!-- Payment Status -->
					<div class="rounded-lg border border-gray-200 p-4">
						<h2 class="mb-4 text-lg font-semibold text-gray-900">💰 Payment Status</h2>
						
						<div class="space-y-3">
							<div>
								<label class="block text-sm font-medium text-gray-700">Payment ID</label>
								<input
									bind:value={paymentIdToCheck}
									type="text"
									placeholder="tr_abc123..."
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							</div>
							<button
								on:click={testGetPaymentStatus}
								disabled={loading || !paymentIdToCheck.trim()}
								class="w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
							>
								{loading ? 'Checking...' : 'Get Payment Status'}
							</button>
						</div>
					</div>

					<!-- Webhook Testing -->
					<div class="rounded-lg border border-gray-200 p-4">
						<h2 class="mb-4 text-lg font-semibold text-gray-900">🔗 Webhook Testing</h2>
						
						<div class="space-y-3">
							<div>
								<label class="block text-sm font-medium text-gray-700">Resource</label>
								<select
									bind:value={webhookTestData.resource}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								>
									<option value="payments">Payments</option>
									<option value="subscriptions">Subscriptions</option>
								</select>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700">ID</label>
								<input
									bind:value={webhookTestData.id}
									type="text"
									placeholder="tr_abc123... or sub_xyz456..."
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							</div>
							<button
								on:click={testWebhook}
								disabled={loading || !webhookTestData.id.trim()}
								class="w-full rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
							>
								{loading ? 'Testing...' : 'Test Webhook'}
							</button>
						</div>
					</div>

					<!-- Controls -->
					<div class="rounded-lg border border-gray-200 p-4">
						<h2 class="mb-4 text-lg font-semibold text-gray-900">🛠️ Controls</h2>
						
						<div class="space-y-3">
							<button
								on:click={clearResults}
								class="w-full rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
							>
								Clear Results
							</button>
							
							<div class="text-xs text-gray-500">
								<p><strong>Tip:</strong> Log in eerst om de API endpoints te testen</p>
								<p><strong>Note:</strong> Subscription creation vereist een first payment in Mollie</p>
								<p><strong>Webhook:</strong> Test webhook processing met echte Mollie IDs</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Test Results -->
				<div class="mt-8">
					<h2 class="mb-4 text-lg font-semibold text-gray-900">📊 Test Results ({testResults.length})</h2>
					
					{#if testResults.length === 0}
						<div class="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
							<p class="text-gray-500">Geen test results nog. Start met het testen van de Mollie operaties!</p>
						</div>
					{:else}
						<div class="space-y-4">
							{#each testResults.slice().reverse() as result}
								<div class="rounded-lg border border-gray-200 p-4 {result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
									<div class="flex items-center justify-between">
										<div class="flex items-center space-x-2">
											<span class="text-lg">{result.success ? '✅' : '❌'}</span>
											<span class="font-medium">{result.operation}</span>
											<span class="text-sm text-gray-500">{result.timestamp}</span>
										</div>
									</div>
									
									{#if result.error}
										<div class="mt-2">
											<p class="text-sm text-red-700"><strong>Error:</strong> {result.error}</p>
										</div>
									{/if}
									
									{#if result.data}
										<details class="mt-2">
											<summary class="cursor-pointer text-sm font-medium text-gray-700">Show Response Data</summary>
											<pre class="mt-2 overflow-auto rounded bg-gray-100 p-2 text-xs">{JSON.stringify(result.data, null, 2)}</pre>
										</details>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	input {
		@apply border border-gray-300 rounded-md px-3 py-2;
	}
	
	button:disabled {
		@apply cursor-not-allowed opacity-50;
	}
</style>