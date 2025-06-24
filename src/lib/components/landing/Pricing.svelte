<script lang="ts">
	import { animateOnScroll } from '$lib/actions/animateOnScroll';

	interface FeatureItem {
		text: string;
		included: boolean;
	}

	interface PricingTier {
		name: string;
		price: number;
		userRange?: string;
		priceSuffix: string;
		description: string;
		features: FeatureItem[];
		ctaText: string;
		ctaLink: string;
		popular?: boolean;
	}

	// External prop for tiers, with default fallback
	export let tiers: PricingTier[] = [];

	// Default tiers (als fallback)
	const defaultTiers: PricingTier[] = [
		{
			name: 'Individueel',
			price: 12,
			priceSuffix: '/maand',
			description: 'Voor zelfstandige professionals en kleine praktijken',
			features: [
				{ text: '24/7 toegang tot DoBie', included: true },
				{ text: 'Onbeperkt vragen stellen', included: true },
				{ text: 'Wet- en regelgeving updates', included: true },
				{ text: 'Exporteren van gesprekken', included: true },
				{ text: 'Basis rapportages', included: true }
			],
			ctaText: 'Start gratis proefperiode',
			ctaLink: '/login'
		},
		{
			name: 'Team',
			price: 10,
			userRange: '2-25',
			priceSuffix: '/maand per gebruiker',
			description: 'Voor HR-teams en middelgrote organisaties',
			features: [
				{ text: 'Alles van Individueel', included: true },
				{ text: 'Team dashboard', included: true },
				{ text: 'Gedeelde kennisbank', included: true },
				{ text: 'Prioriteit support', included: true },
				{ text: 'Uitgebreide rapportages', included: true }
			],
			ctaText: 'Vraag demo aan',
			ctaLink: '/contact',
			popular: true
		},
		{
			name: 'Organisatie',
			price: 8,
			userRange: '26-100',
			priceSuffix: '/maand per gebruiker',
			description: 'Voor grote organisaties met meerdere afdelingen',
			features: [
				{ text: 'Alles van Team', included: true },
				{ text: 'Organisatie dashboard', included: true },
				{ text: 'API toegang', included: true },
				{ text: 'Custom integraties', included: true },
				{ text: 'Dedicated support', included: true }
			],
			ctaText: 'Neem contact op',
			ctaLink: '/contact'
		}
	];

	// Use external tiers or fallback to default
	$: actualTiers = tiers.length > 0 ? tiers : defaultTiers;

	const enterpriseTier: PricingTier = {
		name: 'Enterprise',
		price: 6,
		userRange: '100+',
		priceSuffix: '/maand per gebruiker',
		description: 'Voor grote ondernemingen met specifieke eisen',
		features: [
			{ text: 'Alles van Organisatie', included: true },
			{ text: 'Maatwerk oplossingen', included: true },
			{ text: 'SLA garantie', included: true },
			{ text: 'Account manager', included: true },
			{ text: 'On-premise optie', included: true }
		],
		ctaText: 'Plan gesprek in',
		ctaLink: '/contact'
	};
</script>

<!-- Pricing Section -->
<section id="pricing" class="py-16 md:py-24 bg-[#F5F2EB]" use:animateOnScroll>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12 md:mb-16">
			<h2 class="text-3xl md:text-4xl font-bold text-[#771138]">
				Professioneel verzuimadvies voor elke organisatie
			</h2>
			<p class="mt-4 text-lg md:text-xl text-[#3D3D3D] max-w-3xl mx-auto">
				24/7 toegang tot expertise op het gebied van verzuim, Wet Poortwachter en personeelsbeleid
			</p>
		</div>

		<div class="grid gap-8 md:grid-cols-1 lg:grid-cols-3 items-start">
			{#each actualTiers as tier, i}
				<div
					class="bg-white rounded-lg shadow-lg p-6 md:p-8 pricing-card relative flex flex-col h-full {tier.popular ? 'border-2 border-[#771138] popular-card' : ''}"
				>
					{#if tier.popular}
						<div
							class="absolute top-0 -translate-y-1/2 bg-[#771138] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md uppercase tracking-wider"
						>
							Aanbevolen
						</div>
					{/if}
					<h3 class="text-2xl font-bold text-[#3D3D3D] mb-2">{tier.name}</h3>
					{#if tier.userRange}
						<div class="text-sm text-[#3D3D3D] mb-2">{tier.userRange} gebruikers</div>
					{/if}
					<p class="text-[#3D3D3D] mb-4 min-h-[40px]">{tier.description}</p>
					<div class="mb-6">
						<span class="text-4xl font-extrabold text-[#771138]">€{tier.price}</span>
						<span class="text-lg text-[#3D3D3D]">{tier.priceSuffix}</span>
					</div>
					<ul class="space-y-3 mb-8 text-[#3D3D3D] flex-grow">
						{#each tier.features as feature}
							<li class="flex items-center">
								<svg
									class="w-5 h-5 {feature.included ? 'text-[#771138]' : 'text-gray-300'} mr-2 flex-shrink-0"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									></path>
								</svg>
								<span>{feature.text}</span>
							</li>
						{/each}
					</ul>
					<a
						href={tier.ctaLink}
						class="block w-full text-center {tier.popular
							? 'bg-[#771138] hover:bg-[#5A0D29] text-white'
							: 'bg-[#E9B046] hover:bg-[#771138] hover:text-white text-black'} font-medium py-3 px-6 rounded-md shadow-md hover:shadow-lg transition-all duration-300 mt-auto"
					>
						{tier.ctaText}
					</a>
				</div>
			{/each}
		</div>

		<!-- Enterprise Section -->
		<div class="mt-16 md:mt-24">
			<div class="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8 md:p-10 text-center">
				<h3 class="text-2xl md:text-3xl font-bold text-[#771138] mb-3">{enterpriseTier.name}</h3>
				{#if enterpriseTier.userRange}
					<div class="text-sm text-[#3D3D3D] mb-2">{enterpriseTier.userRange} gebruikers</div>
				{/if}
				<p class="text-[#3D3D3D] mb-4">{enterpriseTier.description}</p>
				<div class="mb-6">
					<span class="text-4xl md:text-5xl font-extrabold text-[#771138]">€{enterpriseTier.price}</span>
					<span class="text-lg md:text-xl text-[#3D3D3D]">{enterpriseTier.priceSuffix}</span>
				</div>
				<ul class="space-y-2 mb-8 text-[#3D3D3D] text-left sm:text-center">
					{#each enterpriseTier.features as feature}
						<li class="flex items-center justify-center sm:justify-start">
							<svg
								class="w-5 h-5 text-[#771138] mr-2 flex-shrink-0"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								></path>
							</svg>
							<span>{feature.text}</span>
						</li>
					{/each}
				</ul>
				<a
					href={enterpriseTier.ctaLink}
					class="bg-[#771138] hover:bg-[#5A0D29] text-white font-medium py-3 px-8 rounded-md shadow-md hover:shadow-lg transition-all duration-300 text-lg inline-block"
				>
					{enterpriseTier.ctaText}
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.pricing-card {
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}
	.pricing-card:hover {
		transform: translateY(-8px);
		box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.15);
	}
	.popular-card {
		transform: scale(1.02);
	}
	.popular-card:hover {
		transform: scale(1.04) translateY(-8px);
	}
</style> 