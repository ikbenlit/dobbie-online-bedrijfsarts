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
	<title>DoBbie - Online Verzuimadvies | Uw digitale partner in verzuimbegeleiding</title>
	<meta name="description" content="24/7 professioneel advies over verzuim, Wet Poortwachter en personeelsbeleid. Direct antwoord op al uw vragen over verzuimbegeleiding en wet- en regelgeving." />

	<!-- Favicon -->
	<link rel="icon" type="image/png" href="/images/logo-dobie-favicon.png" />
	<link rel="apple-touch-icon" href="/images/logo-dobie-favicon.png" />

	<!-- Open Graph voor social sharing -->
	<meta property="og:title" content="DoBbie - Online Verzuimadvies | Uw digitale partner in verzuimbegeleiding" />
	<meta property="og:description" content="24/7 professioneel advies over verzuim, Wet Poortwachter en personeelsbeleid. Direct antwoord op al uw vragen over verzuimbegeleiding en wet- en regelgeving." />
	<meta property="og:image" content="https://onlineverzuimadvies.nl/images/dobbie-social-card.webp" />
	<meta property="og:url" content="https://onlineverzuimadvies.nl/" />
	<meta property="og:type" content="website" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="DoBbie - Online Verzuimadvies | Uw digitale partner in verzuimbegeleiding" />
	<meta name="twitter:description" content="24/7 professioneel advies over verzuim, Wet Poortwachter en personeelsbeleid. Direct antwoord op al uw vragen over verzuimbegeleiding en wet- en regelgeving." />
	<meta name="twitter:image" content="https://onlineverzuimadvies.nl/images/dobbie-social-card.webp" />

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
		tiers={[
			{
				name: "Individueel",
				price: 12,
				priceSuffix: "/maand",
				description: "Voor zelfstandige professionals en kleine praktijken",
				features: [
					{ text: "24/7 toegang tot DoBie", included: true },
					{ text: "Onbeperkt vragen stellen", included: true },
					{ text: "Wet- en regelgeving updates", included: true },
					{ text: "Exporteren van gesprekken", included: true },
					{ text: "Basis rapportages", included: true }
				],
				ctaText: "Start gratis proefperiode",
				ctaLink: "/login"
			},
			{
				name: "Team",
				price: 10,
				userRange: "2-25",
				priceSuffix: "/maand per gebruiker",
				description: "Voor HR-teams en middelgrote organisaties",
				features: [
					{ text: "Alles van Individueel", included: true },
					{ text: "Team dashboard", included: true },
					{ text: "Gedeelde kennisbank", included: true },
					{ text: "Prioriteit support", included: true },
					{ text: "Uitgebreide rapportages", included: true }
				],
				ctaText: "Vraag demo aan",
				ctaLink: "/contact",
				popular: true
			},
			{
				name: "Organisatie",
				price: 8,
				userRange: "26-100",
				priceSuffix: "/maand per gebruiker",
				description: "Voor grote organisaties met meerdere afdelingen",
				features: [
					{ text: "Alles van Team", included: true },
					{ text: "Organisatie dashboard", included: true },
					{ text: "API toegang", included: true },
					{ text: "Custom integraties", included: true },
					{ text: "Dedicated support", included: true }
				],
				ctaText: "Neem contact op",
				ctaLink: "/contact"
			},
			{
				name: "Enterprise",
				price: 6,
				userRange: "100+",
				priceSuffix: "/maand per gebruiker",
				description: "Voor grote ondernemingen met specifieke eisen",
				features: [
					{ text: "Alles van Organisatie", included: true },
					{ text: "Maatwerk oplossingen", included: true },
					{ text: "SLA garantie", included: true },
					{ text: "Account manager", included: true },
					{ text: "On-premise optie", included: true }
				],
				ctaText: "Plan gesprek in",
				ctaLink: "/contact"
			}
		]}
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

