<script lang="ts">
	import Navbar from '$lib/components/landing/Navbar.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import Features from '$lib/components/landing/Features.svelte';
	import HowItWorks from '$lib/components/landing/HowItWorks.svelte';
	import Testimonials from '$lib/components/landing/Testimonials.svelte';
	import Pricing from '$lib/components/landing/Pricing.svelte';
	import TryNow from '$lib/components/landing/TryNow.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		// Smooth scrolling voor ankerlinks
		document.querySelectorAll('a[href^="#"]').forEach(anchor => {
			const htmlAnchor = anchor as HTMLAnchorElement;
			htmlAnchor.addEventListener('click', function(e: MouseEvent) {
				e.preventDefault();
				
				const targetId = htmlAnchor.getAttribute('href');
				if (!targetId || targetId === '#') return;
				
				const targetElement = document.querySelector(targetId);
				if (targetElement) {
					window.scrollTo({
						top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
						behavior: 'smooth'
					});
				}
			});
		});
	});

</script>

<svelte:head>
	<title>De Online Bedrijfsarts | Uw digitale partner in verzuimbegeleiding</title>
	<meta name="description" content="24/7 professioneel advies over verzuim, Wet Poortwachter en personeelsbeleid. Direct antwoord op al uw vragen over verzuimbegeleiding en wet- en regelgeving." />

	<!-- Favicon -->
	<link rel="icon" type="image/png" href="/images/logo-dobie-favicon.png" />
	<link rel="apple-touch-icon" href="/images/logo-dobie-favicon.png" />

	<!-- Open Graph voor social sharing -->
	<meta property="og:title" content="De Online Bedrijfsarts | Uw digitale partner in verzuimbegeleiding" />
	<meta property="og:description" content="24/7 professioneel advies over verzuim, Wet Poortwachter en personeelsbeleid. Direct antwoord op al uw vragen over verzuimbegeleiding en wet- en regelgeving." />
	<meta property="og:image" content="https://deonlinebedrijfsarts.nl/images/dobie-social-card.webp" />
	<meta property="og:url" content="https://deonlinebedrijfsarts.nl/" />
	<meta property="og:type" content="website" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="De Online Bedrijfsarts | Uw digitale partner in verzuimbegeleiding" />
	<meta name="twitter:description" content="24/7 professioneel advies over verzuim, Wet Poortwachter en personeelsbeleid. Direct antwoord op al uw vragen over verzuimbegeleiding en wet- en regelgeving." />
	<meta name="twitter:image" content="https://deonlinebedrijfsarts.nl/images/dobie-social-card.webp" />

	<meta name="robots" content="noindex, nofollow" />
	<style>
		body {
			font-family: 'Open Sans', sans-serif;
			scroll-behavior: smooth;
		}
	</style>
</svelte:head>

<div class="bg-[#F5F2EB]">
	<Navbar />
	<Hero />
	<Features />
	<HowItWorks />
	<Testimonials />
	<Pricing 
		prices={{
			individual: {
				name: "Individueel",
				price: 12,
				period: "maand",
				features: [
					"24/7 toegang tot DoBie",
					"Onbeperkt vragen stellen",
					"Wet- en regelgeving updates",
					"Exporteren van gesprekken",
					"Basis rapportages"
				]
			},
			team: {
				name: "Team",
				price: 10,
				period: "maand",
				userRange: "2-25",
				features: [
					"Alles van Individueel",
					"Team dashboard",
					"Gedeelde kennisbank",
					"Prioriteit support",
					"Uitgebreide rapportages"
				]
			},
			organization: {
				name: "Organisatie",
				price: 8,
				period: "maand",
				userRange: "26-100",
				features: [
					"Alles van Team",
					"Organisatie dashboard",
					"API toegang",
					"Custom integraties",
					"Dedicated support"
				]
			},
			enterprise: {
				name: "Enterprise",
				price: 6,
				period: "maand",
				userRange: "100+",
				features: [
					"Alles van Organisatie",
					"Maatwerk oplossingen",
					"SLA garantie",
					"Account manager",
					"On-premise optie"
				]
			}
		}}
	/>
	<TryNow />
	<Footer />
</div>

<style>
	:global(h1, h2) {
		font-family: 'Times New Roman', serif;
	}
	
	:global(.primary-button) {
		@apply bg-[#771138] text-white hover:bg-[#5A0D29] transition-colors duration-200;
	}
	
	:global(.secondary-button) {
		@apply bg-[#E9B046] text-black hover:bg-[#771138] hover:text-white transition-colors duration-200;
	}
</style>

