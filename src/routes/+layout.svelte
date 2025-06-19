<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { initializeAuth } from '$lib/stores/userStore.js';

	// Initialiseer Supabase auth wanneer de app start
	onMount(() => {
		initializeAuth();
	});
</script>

<div class="min-h-screen flex flex-col">
	<main class="flex-grow">
		<slot />
	</main>
</div>
