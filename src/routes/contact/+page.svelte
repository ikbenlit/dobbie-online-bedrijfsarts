<script lang="ts">
	import { user } from '$lib/stores/userStore';
	import { supabase } from '$lib/supabase/client';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/ButtonElement.svelte';

	export let form: ActionData;

	let subject = 'Doorberekening DoBbie Abonnement';
	let message = '';
	let urgency: 'normal' | 'high' = 'normal';

	$: if ($user?.subscription_status === 'expired') {
		urgency = 'high';
		subject = 'Mijn DoBbie account is verlopen, graag reactiveren';
	}

	$: if (form?.success) {
		// Clear form or show success message
	}
</script>

<svelte:head>
	<title>Contact | DoBbie</title>
	<meta name="description" content="Neem contact op om uw DoBbie abonnement te activeren." />
</svelte:head>

<div class="container mx-auto max-w-2xl px-4 py-12">
	<div class="text-center mb-8">
		<Icon name="chat-circle-dots-bold" class="w-16 h-16 mx-auto text-primary-500" />
		<h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mt-4">
			Klaar voor de volgende stap?
		</h1>
		{#if $user?.subscription_status === 'expired'}
			<p class="mt-3 text-lg text-gray-600 dark:text-gray-300">
				Je proefperiode is verlopen. Vul het formulier in om je account te reactiveren en toegang
				te krijgen tot DoBbie Pro.
			</p>
		{:else}
			<p class="mt-3 text-lg text-gray-600 dark:text-gray-300">
				Laat ons weten dat je geïnteresseerd bent in een DoBbie Pro abonnement. We nemen zo
				snel mogelijk contact met je op.
			</p>
		{/if}
	</div>

	<form method="POST" use:enhance class="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
		<div>
			<label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-200"
				>Onderwerp</label
			>
			<div class="mt-1">
				<input
					type="text"
					name="subject"
					id="subject"
					bind:value={subject}
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
					required
				/>
			</div>
		</div>

		<div>
			<label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-200"
				>Bericht</label
			>
			<div class="mt-1">
				<textarea
					id="message"
					name="message"
					rows="4"
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
					placeholder="Vertel ons over je ervaring met DoBbie en je wensen..."
					bind:value={message}
					required
				></textarea>
			</div>
		</div>

		<input type="hidden" name="urgency" bind:value={urgency} />

		{#if form?.success}
			<div class="rounded-md bg-green-50 p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<Icon name="check-circle-fill" class="h-5 w-5 text-green-400" />
					</div>
					<div class="ml-3">
						<p class="text-sm font-medium text-green-800">Bericht succesvol verzonden!</p>
						<p class="mt-1 text-sm text-green-700">We nemen zo snel mogelijk contact met je op.</p>
					</div>
				</div>
			</div>
		{/if}

		{#if form?.error}
			<div class="rounded-md bg-red-50 p-4">
				<p class="text-sm font-medium text-red-800">{form.error}</p>
			</div>
		{/if}

		<div class="flex justify-end">
			<Button type="submit" variant="primary">Verstuur Bericht</Button>
		</div>
	</form>

	<div class="mt-10 text-center text-sm text-gray-500">
		<p>Je kunt ook direct contact opnemen:</p>
		<p class="font-medium">talar@dobbie.nl</p>
	</div>
</div> 