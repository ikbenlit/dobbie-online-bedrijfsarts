<script lang="ts">
	import { animateOnScroll } from "$lib/actions/animateOnScroll";
</script>

<!-- Features Section -->
<section id="features" class="py-16 md:py-24 bg-white" use:animateOnScroll>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12 md:mb-16">
			<h2 class="font-serif text-h2 font-bold text-bordeaux">Waarom DOBbie?</h2>
			<p class="mt-4 text-body text-gray-dark max-w-3xl mx-auto">
				Professioneel advies over verzuim en re-integratie, direct beschikbaar wanneer u het nodig heeft. Efficiënt, betrouwbaar en altijd up-to-date met de laatste wet- en regelgeving.
			</p>
		</div>
		<div class="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			<!-- Feature 1 -->
			<div class="bg-white rounded-card shadow-card p-6 transition-all duration-300 feature-card">
				<div class="w-12 h-12 bg-cream rounded-lg flex items-center justify-center mb-4">
					<svg class="h-6 w-6 text-bordeaux" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
					</svg>
				</div>
				<h3 class="text-h3 font-semibold text-bordeaux">Wet- en Regelgeving</h3>
				<p class="mt-2 text-body text-gray-dark">Actueel advies volgens de Wet Verbetering Poortwachter en andere relevante wetgeving. Altijd compliant en up-to-date.</p>
			</div>
			
			<!-- Feature 2 -->
			<div class="bg-white rounded-card shadow-card p-6 transition-all duration-300 feature-card">
				<div class="w-12 h-12 bg-cream rounded-lg flex items-center justify-center mb-4">
					<svg class="h-6 w-6 text-bordeaux" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
				</div>
				<h3 class="text-h3 font-semibold text-bordeaux">24/7 Beschikbaar</h3>
				<p class="mt-2 text-body text-gray-dark">Direct toegang tot professioneel advies, ook buiten kantooruren. Snelle ondersteuning wanneer u het nodig heeft.</p>
			</div>
			
			<!-- Feature 3 -->
			<div class="bg-white rounded-card shadow-card p-6 transition-all duration-300 feature-card">
				<div class="w-12 h-12 bg-cream rounded-lg flex items-center justify-center mb-4">
					<svg class="h-6 w-6 text-bordeaux" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
					</svg>
				</div>
				<h3 class="text-h3 font-semibold text-bordeaux">Dossiervorming</h3>
				<p class="mt-2 text-body text-gray-dark">Gestructureerde vastlegging van alle stappen in het verzuimproces. Compliant met wet- en regelgeving en AVG.</p>
			</div>
			
			<!-- Feature 4 -->
			<div class="bg-white rounded-card shadow-card p-6 transition-all duration-300 feature-card">
				<div class="w-12 h-12 bg-cream rounded-lg flex items-center justify-center mb-4">
					<svg class="h-6 w-6 text-bordeaux" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
					</svg>
				</div>
				<h3 class="text-h3 font-semibold text-bordeaux">Professioneel Advies</h3>
				<p class="mt-2 text-body text-gray-dark">Concrete antwoorden op basis van jarenlange expertise in bedrijfsgeneeskunde en arbeidswetgeving.</p>
			</div>
			
			<!-- Feature 5 -->
			<div class="bg-white rounded-card shadow-card p-6 transition-all duration-300 feature-card">
				<div class="w-12 h-12 bg-cream rounded-lg flex items-center justify-center mb-4">
					<svg class="h-6 w-6 text-bordeaux" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
					</svg>
				</div>
				<h3 class="text-h3 font-semibold text-bordeaux">Procesondersteuning</h3>
				<p class="mt-2 text-body text-gray-dark">Stapsgewijze begeleiding bij verzuim en re-integratie. Van eerste ziekmelding tot volledige werkhervatting.</p>
			</div>
			
			<!-- Feature 6 -->
			<div class="bg-white rounded-card shadow-card p-6 transition-all duration-300 feature-card">
				<div class="w-12 h-12 bg-cream rounded-lg flex items-center justify-center mb-4">
					<svg class="h-6 w-6 text-bordeaux" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
					</svg>
				</div>
				<h3 class="text-h3 font-semibold text-bordeaux">Maatwerk Oplossingen</h3>
				<p class="mt-2 text-body text-gray-dark">Gepersonaliseerd advies voor uw specifieke situatie. Rekening houdend met branche, bedrijfsgrootte en context.</p>
			</div>
		</div>
	</div>
</section>

<style>
.feature-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(119,17,56,0.15);
}
</style> 