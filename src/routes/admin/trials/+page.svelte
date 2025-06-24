<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase/client';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/ButtonElement.svelte';

	interface TrialUser {
		profile_id: string;
		email: string;
		full_name: string;
		days_remaining: number;
		last_activity: string;
	}

	let trials: TrialUser[] = [];
	let loading = true;
	let error: string | null = null;

	async function loadTrialUsers() {
		loading = true;
		error = null;

		try {
			const { data, error: rpcError } = await supabase.rpc('check_trial_expiry');

			if (rpcError) {
				throw rpcError;
			}

			trials = data || [];
		} catch (err) {
			console.error('Error loading trial users:', err);
			error = 'Kon proefgebruikers niet laden. Probeer het opnieuw.';
		} finally {
			loading = false;
		}
	}

	async function activateUser(profileId: string, fullName: string) {
		const notes = `Handmatig geactiveerd door admin via dashboard op ${new Date().toLocaleDateString('nl-NL')}`;
		
		try {
			const { error: activationError } = await supabase.rpc('manually_activate_user', {
				profile_id: profileId,
				notes: notes
			});

			if (activationError) {
				throw activationError;
			}

			// Show success and refresh the list
			alert(`${fullName} is succesvol geactiveerd!`);
			await loadTrialUsers();
		} catch (err) {
			console.error('Error activating user:', err);
			alert(`Fout bij het activeren van ${fullName}. Probeer het opnieuw.`);
		}
	}

	onMount(() => {
		loadTrialUsers();
	});

	$: expiredUsers = trials.filter(trial => trial.days_remaining <= 0);
	$: expiringSoonUsers = trials.filter(trial => trial.days_remaining > 0 && trial.days_remaining <= 5);
	$: activeUsers = trials.filter(trial => trial.days_remaining > 5);
</script>

<svelte:head>
	<title>Trial Overzicht | Admin | DoBbie</title>
	<meta name="description" content="Beheer proefgebruikers en activeer accounts." />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Trial Gebruikers</h1>
			<p class="mt-2 text-gray-600 dark:text-gray-300">
				Overzicht van alle gebruikers in hun proefperiode
			</p>
		</div>
		<Button on:click={loadTrialUsers} variant="secondary" disabled={loading}>
			{#if loading}
				<Icon name="clock" className="w-4 h-4 mr-2 animate-spin" />
				Laden...
			{:else}
				<Icon name="arrow-up" className="w-4 h-4 mr-2" />
				Vernieuwen
			{/if}
		</Button>
	</div>

	{#if error}
		<div class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
			<div class="flex">
				<Icon name="warning" className="h-5 w-5 text-red-400" />
				<div class="ml-3">
					<p class="text-sm font-medium text-red-800">{error}</p>
				</div>
			</div>
		</div>
	{/if}

	{#if loading}
		<div class="text-center py-12">
			<Icon name="clock" className="w-8 h-8 mx-auto text-gray-400 animate-spin mb-4" />
			<p class="text-gray-600 dark:text-gray-300">Proefgebruikers laden...</p>
		</div>
	{:else if trials.length === 0}
		<div class="text-center py-12">
			<Icon name="users" className="w-12 h-12 mx-auto text-gray-400 mb-4" />
			<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Geen proefgebruikers</h3>
			<p class="text-gray-600 dark:text-gray-300">Er zijn momenteel geen gebruikers in hun proefperiode.</p>
		</div>
	{:else}
		<!-- Summary Cards -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			<div class="bg-red-50 border border-red-200 rounded-lg p-6">
				<div class="flex items-center">
					<Icon name="clock-bold" className="h-8 w-8 text-red-600" />
					<div class="ml-4">
						<p class="text-2xl font-bold text-red-900">{expiredUsers.length}</p>
						<p class="text-sm text-red-600">Verlopen</p>
					</div>
				</div>
			</div>

			<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
				<div class="flex items-center">
					<Icon name="calendar-bold" className="h-8 w-8 text-yellow-600" />
					<div class="ml-4">
						<p class="text-2xl font-bold text-yellow-900">{expiringSoonUsers.length}</p>
						<p class="text-sm text-yellow-600">Verloopt binnenkort</p>
					</div>
				</div>
			</div>

			<div class="bg-green-50 border border-green-200 rounded-lg p-6">
				<div class="flex items-center">
					<Icon name="check-circle-bold" className="h-8 w-8 text-green-600" />
					<div class="ml-4">
						<p class="text-2xl font-bold text-green-900">{activeUsers.length}</p>
						<p class="text-sm text-green-600">Actief</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Users Table -->
		<div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
			<div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-medium text-gray-900 dark:text-white">Alle Proefgebruikers</h3>
			</div>
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
					<thead class="bg-gray-50 dark:bg-gray-700">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								Gebruiker
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								Status
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								Laatste Activiteit
							</th>
							<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								Acties
							</th>
						</tr>
					</thead>
					<tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
						{#each trials as trial}
							<tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center">
										<div class="flex-shrink-0 h-10 w-10">
											<div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
												<span class="text-sm font-medium text-primary-800">
													{trial.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
												</span>
											</div>
										</div>
										<div class="ml-4">
											<div class="text-sm font-medium text-gray-900 dark:text-white">
												{trial.full_name}
											</div>
											<div class="text-sm text-gray-500 dark:text-gray-300">
												{trial.email}
											</div>
										</div>
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									{#if trial.days_remaining <= 0}
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
											<Icon name="clock-bold" className="w-3 h-3 mr-1" />
											Verlopen
										</span>
									{:else if trial.days_remaining <= 5}
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
											<Icon name="calendar-bold" className="w-3 h-3 mr-1" />
											{trial.days_remaining} dagen over
										</span>
									{:else}
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
											<Icon name="check-circle-bold" className="w-3 h-3 mr-1" />
											{trial.days_remaining} dagen over
										</span>
									{/if}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
									{new Date(trial.last_activity).toLocaleDateString('nl-NL', {
										year: 'numeric',
										month: 'short',
										day: 'numeric'
									})}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<Button
										on:click={() => activateUser(trial.profile_id, trial.full_name)}
										variant="primary"
										size="default"
									>
										<Icon name="check-circle-bold" className="w-4 h-4 mr-1" />
										Activeer
									</Button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div> 