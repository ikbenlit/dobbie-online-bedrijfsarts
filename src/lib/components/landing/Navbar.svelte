<script lang="ts">
	let mobileMenuOpen = false;

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	// JavaScript voor smooth scrolling wordt later in de +page.svelte of een globale utility afgehandeld
</script>

<nav class="bg-white shadow-card fixed w-full z-10">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<div class="flex items-center">
				<div class="flex-shrink-0 flex items-center">
					<svg class="h-8 w-8 text-bordeaux" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
							clip-rule="evenodd"
						></path>
					</svg>
					<span class="ml-2 text-h3 font-serif font-bold text-bordeaux">DOBbie - Online Verzuimadvies</span>
				</div>
			</div>
			<div class="hidden md:flex items-center space-x-8">
				<a href="#features" class="text-gray-dark hover:text-bordeaux transition-colors duration-300 text-body">Voordelen</a>
				<a href="#how-it-works" class="text-gray-dark hover:text-bordeaux transition-colors duration-300 text-body">Werkwijze</a>
				<a href="#testimonials" class="text-gray-dark hover:text-bordeaux transition-colors duration-300 text-body">Ervaringen</a>
				<a href="#pricing" class="text-gray-dark hover:text-bordeaux transition-colors duration-300 text-body">Tarieven</a>
			</div>
			<div class="flex items-center">
				<button
					id="mobile-menu-button"
					on:click={toggleMobileMenu}
					class="md:hidden text-gray-dark hover:text-bordeaux focus:outline-none"
					aria-label="Menu openen"
				>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
					</svg>
				</button>
				<a href="/login" class="hidden md:block bg-bordeaux hover:bg-bordeaux-hover text-white px-6 py-2 rounded-button font-bold text-button transition-colors duration-300">Start direct</a>
			</div>
		</div>
	</div>
	<!-- Mobile menu -->
	{#if mobileMenuOpen}
		<div id="mobile-menu" class="md:hidden bg-white border-t border-gray-light">
			<div class="px-2 pt-2 pb-3 space-y-1">
				<a href="#features" on:click={() => mobileMenuOpen = false} class="block px-3 py-2 rounded-button text-body font-medium text-gray-dark hover:text-bordeaux hover:bg-cream">Voordelen</a>
				<a href="#how-it-works" on:click={() => mobileMenuOpen = false} class="block px-3 py-2 rounded-button text-body font-medium text-gray-dark hover:text-bordeaux hover:bg-cream">Werkwijze</a>
				<a href="#testimonials" on:click={() => mobileMenuOpen = false} class="block px-3 py-2 rounded-button text-body font-medium text-gray-dark hover:text-bordeaux hover:bg-cream">Ervaringen</a>
				<a href="#pricing" on:click={() => mobileMenuOpen = false} class="block px-3 py-2 rounded-button text-body font-medium text-gray-dark hover:text-bordeaux hover:bg-cream">Tarieven</a>
				<a href="/login" on:click={() => mobileMenuOpen = false} class="block px-3 py-2 rounded-button text-body font-bold text-white bg-bordeaux hover:bg-bordeaux-hover">Start direct</a>
			</div>
		</div>
	{/if}
</nav> 