<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	export let icon: string; // Lucide icon naam
	export let iconSize: number = 24; // Standaard 24px, kan 32px zijn voor voordelen sectie
	export let iconColorClass: string = 'text-pink-strong'; // Standaard Shirley's primaire roze
	export let title: string;
	export let text: string;
	export let cardBgClass: string = 'bg-off-white'; // Standaard #FEFEFE
</script>

<div class="{cardBgClass} p-4 md:p-6 rounded-card shadow-md text-center h-full flex flex-col">
	{#if icon}
		<div class="mx-auto mb-4 flex items-center justify-center flex-shrink-0">
			<!-- De iconBgClass van vroeger is nu onderdeel van de kaart zelf of niet meer nodig -->
			<Icon name={icon} size={iconSize} className={iconColorClass} />
		</div>
	{/if}
	<div class="flex-grow">
		<h3 class="font-source-sans-pro-semibold text-xl text-black mb-2">{title}</h3>
		<p class="font-roboto-regular text-base text-dark-gray">
			{text}
		</p>
	</div>
</div> 