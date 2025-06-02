<script lang="ts">
	import { page } from '$app/stores';
	import AvatarBubble from '$lib/components/ui/AvatarBubble.svelte';
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-beige-light px-4">
	{#if $page.status === 404}
		<div class="flex flex-col items-center justify-center w-full max-w-xl mx-auto">
			<h1 class="mb-8 text-4xl md:text-5xl font-bold font-sans text-black text-center">Whoops, deze pagina bestaat niet!</h1>
			<div class="flex justify-center w-full mb-8">
				<AvatarBubble 
					text="Klik hieronder om terug te gaan naar de startpagina."
					avatarSize="large"
					bubblePosition="top"
					bubbleAlign="center"

				/>
			</div>
			<a
				href="/"
				class="mt-4 btn-primary inline-block text-center font-semibold rounded-[6px] px-8 py-4 text-xl md:text-2xl text-white bg-brand-pink-strong hover:bg-brand-pink-hover transition-colors duration-300 shadow-md"
			>Terug naar home</a>
		</div>
	{:else}
		<h1 class="mb-4 text-4xl font-bold text-red-600 sm:text-5xl">Er is een fout opgetreden</h1>
		<p class="mb-8 text-lg text-gray-600 sm:text-xl">
			Er is iets misgegaan. Foutcode: {$page.status}
		</p>
		<p class="text-md text-gray-500">{$page.error?.message}</p>
		<a
			href="/"
			class="mt-8 rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
		>Terug naar de startpagina</a>
	{/if}
</div>

<style>
	:global(body) {
		background: #F7F3F0;
	}
</style> 