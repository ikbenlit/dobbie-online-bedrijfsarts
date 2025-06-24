<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types'
	import { onMount } from 'svelte'
	import Navbar from '$lib/components/landing/Navbar.svelte';
	import { Toaster } from 'svelte-sonner';
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import { updateAuthState, user, supabaseClient } from '$lib/stores/userStore';

	export let data: LayoutData
	
	// Gebruik de juiste supabase client uit de layout data (met cookies)
	$: ({ supabase, session } = data)
	
	// Update de supabase client in de store zodat userStore de juiste client gebruikt
	$: supabaseClient.set(supabase);

	// Initialiseer de store met de server-data.
	// Gebruik optional chaining (?.) om de TypeError te voorkomen als de sessie null is.
	updateAuthState(session ?? null);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (session?.expires_at !== $page.data.session?.expires_at) {
				invalidateAll();
			}
			// Gebruik de bestaande helper-functie om de store consistent bij te werken.
			updateAuthState(session);
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

{#if $user && !$page.url.pathname.startsWith('/chat')}
	<Navbar />
{/if}

<div class="min-h-screen flex flex-col">
	<main class="flex-grow">
		<slot />
	</main>
</div>

<Toaster />
