<script lang="ts">
	import { user } from '$lib/stores/userStore';
	import { derived } from 'svelte/store';
	import Icon from '$lib/components/ui/Icon.svelte';

	interface TrialInfo {
		daysRemaining: number;
		isExpiringSoon: boolean;
		isExpired: boolean;
		status: 'trial' | 'expired' | 'manual_active' | 'blocked' | null;
	}

	const trialInfo = derived(user, ($user): TrialInfo | null => {
		if (!$user?.trial_end_date || !$user?.subscription_status) {
			return null;
		}

		const trialEndDate = new Date($user.trial_end_date);
		const now = new Date();
		const daysRemaining = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
		const isExpired = daysRemaining <= 0;
		const isExpiringSoon = !isExpired && daysRemaining <= 5;

		return {
			daysRemaining,
			isExpiringSoon,
			isExpired,
			status: $user.subscription_status
		};
	});

	$: bannerClass = $trialInfo?.isExpiringSoon
		? 'bg-yellow-100 border-yellow-500 text-yellow-800'
		: $trialInfo?.isExpired
		? 'bg-red-100 border-red-500 text-red-800'
		: 'bg-primary-50 border-primary-300 text-primary-800';
</script>

{#if $user && $trialInfo && $trialInfo.status === 'trial'}
	<div class="p-4 mb-4 text-sm font-medium rounded-lg border {bannerClass}" role="alert">
		<div class="flex items-center">
			{#if $trialInfo.isExpiringSoon}
				<Icon name="clock-bold" class="w-5 h-5 mr-2" />
			{:else if $trialInfo.isExpired}
				<Icon name="lock-simple-bold" class="w-5 h-5 mr-2" />
			{:else}
				<Icon name="calendar-blank-bold" class="w-5 h-5 mr-2" />
			{/if}

			<span class="sr-only">Info</span>
			<div>
				{#if $trialInfo.isExpired}
					<span class="font-semibold">Je proefperiode is verlopen.</span>
					<a href="/contact" class="underline ml-1 hover:text-primary-600">Neem contact op om door te gaan.</a>
				{:else if $trialInfo.isExpiringSoon}
					<span class="font-semibold">Nog {$trialInfo.daysRemaining} dagen in je proefperiode.</span>
					<a href="/contact" class="underline ml-1 hover:text-primary-600">Klaar om te upgraden?</a>
				{:else}
					<span>Je hebt nog {$trialInfo.daysRemaining} dagen in je gratis proefperiode.</span>
				{/if}
			</div>
		</div>
	</div>
{/if} 