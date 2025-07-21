<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase/client';
	import { toast } from 'svelte-sonner';
	import PasswordInput from '$lib/components/ui/PasswordInput.svelte';

	// State management
	let step: 'verify' | 'update' = 'verify';
	let email = '';
	let token = '';
	let newPassword = '';
	let confirmPassword = '';
	let isLoading = false;

	async function handleVerifyOtp() {
		if (!email || !token) {
			toast.error('Vul zowel je e-mailadres als de herstelcode in.');
			return;
		}

		// Verwijder eventuele spaties voor en na de code
		const cleanToken = token.trim();

		// Valideer expliciet of de code uit precies 6 cijfers bestaat
		if (!/^[0-9]{6}$/.test(cleanToken)) {
			toast.error('De herstelcode moet uit precies 6 cijfers bestaan.');
			return;
		}

		isLoading = true;
		const { data, error } = await supabase.auth.verifyOtp({
			email,
			token: cleanToken, // Gebruik de opgeschoonde code
			type: 'recovery'
		});

		if (error) {
			console.error('OTP verification error:', error);
			toast.error(error.message || 'Ongeldige code of e-mailadres.');
			isLoading = false;
		} else {
			console.log('✅ OTP verified successfully. User is now signed in for password update.');
			step = 'update';
			isLoading = false;
		}
	}

	async function handlePasswordUpdate() {
		if (newPassword !== confirmPassword) {
			toast.error('Wachtwoorden komen niet overeen.');
			return;
		}
		if (newPassword.length < 8) {
			toast.error('Wachtwoord moet minimaal 8 karakters lang zijn.');
			return;
		}

		isLoading = true;
		const { error } = await supabase.auth.updateUser({
			password: newPassword
		});

		if (error) {
			console.error('Password update error:', error);
			toast.error(error.message || 'Er ging iets mis bij het bijwerken van je wachtwoord.');
			isLoading = false;
		} else {
			toast.success('Wachtwoord succesvol bijgewerkt!');
			isLoading = false;
			await supabase.auth.signOut();
			goto('/login');
		}
	}
</script>

<svelte:head>
	<title>DOBbie - Wachtwoord Herstellen</title>
	<meta name="description" content="Herstel je wachtwoord voor DOBbie De Online Bedrijfsarts." />
</svelte:head>

<div class="min-h-screen flex flex-col md:flex-row">
	<!-- Linkerkant - Formulier -->
	<div
		class="relative w-full md:w-2/5 bg-[#F5F2EB] flex items-center justify-center p-8 order-2 md:order-1 overflow-hidden"
	>
		<div
			class="absolute -top-20 -left-24 w-72 h-72 bg-[#771138] rounded-full opacity-10 filter blur-3xl -z-10 animate-pulse-slow"
		></div>
		<div
			class="absolute -bottom-24 -right-20 w-80 h-80 bg-[#E9B046] rounded-full opacity-20 filter blur-3xl -z-10 animate-pulse-slower"
		></div>

		<div class="relative z-10 max-w-md w-full bg-white p-8 md:p-10 rounded-lg shadow-lg">
			{#if step === 'verify'}
				<!-- Stap 1: Verificatie formulier -->
				<div class="text-center mb-8">
					<h1 class="font-serif text-[28px] font-bold text-[#771138] mb-2">Herstelcode invoeren</h1>
					<p class="text-[#3D3D3D] text-[15px]">Voer je e-mail en de ontvangen code in.</p>
				</div>
				<form on:submit|preventDefault={handleVerifyOtp} class="space-y-6">
					<div>
						<label for="email" class="block text-[15px] font-semibold text-[#3D3D3D] mb-2">
							E-mailadres
						</label>
						<input
							id="email"
							type="email"
							bind:value={email}
							required
							class="bg-white border border-[#D1D5DB] rounded-md px-4 py-3 w-full focus:border-[#771138] focus:outline-none focus:ring-2 focus:ring-[#771138]/20 transition-all duration-300 ease-in-out"
							placeholder="naam@voorbeeld.nl"
						/>
					</div>
					<div>
						<label for="token" class="block text-[15px] font-semibold text-[#3D3D3D] mb-2">
							6-cijferige code
						</label>
						<input
							id="token"
							type="text"
							inputmode="numeric"
							autocomplete="one-time-code"
							bind:value={token}
							required
							maxlength="6"
							class="bg-white border border-[#D1D5DB] rounded-md px-4 py-3 w-full focus:border-[#771138] focus:outline-none focus:ring-2 focus:ring-[#771138]/20 transition-all duration-300 ease-in-out"
							placeholder="123456"
						/>
					</div>
					<button
						type="submit"
						disabled={isLoading}
						class="w-full font-bold text-[16px] rounded-md py-[14px] px-[28px] text-white transition-all duration-300 ease-in-out disabled:opacity-70 bg-[#771138] hover:bg-[#5A0D29] flex items-center justify-center"
					>
						{#if isLoading}
							<svg
								class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Verifiëren...
						{:else}
							Code verifiëren
						{/if}
					</button>
				</form>
			{:else if step === 'update'}
				<!-- Stap 2: Nieuw wachtwoord formulier -->
				<div class="text-center mb-8">
					<h1 class="font-serif text-[28px] font-bold text-[#771138] mb-2">
						Nieuw wachtwoord instellen
					</h1>
					<p class="text-[#3D3D3D] text-[15px]">Kies een sterk, nieuw wachtwoord.</p>
				</div>
				<form on:submit|preventDefault={handlePasswordUpdate} class="space-y-6">
					<div>
						<label for="password" class="block text-[15px] font-semibold text-[#3D3D3D] mb-2">
							Nieuw wachtwoord
						</label>
						<PasswordInput
							id="password"
							bind:value={newPassword}
							required
							minlength="8"
							placeholder="Minimaal 8 karakters"
							autocomplete="new-password"
						/>
					</div>
					<div>
						<label
							for="confirmPassword"
							class="block text-[15px] font-semibold text-[#3D3D3D] mb-2"
						>
							Bevestig wachtwoord
						</label>
						<PasswordInput
							id="confirmPassword"
							bind:value={confirmPassword}
							required
							minlength="8"
							placeholder="Herhaal je nieuwe wachtwoord"
							autocomplete="new-password"
						/>
					</div>
					<button
						type="submit"
						disabled={isLoading || !newPassword || !confirmPassword}
						class="w-full font-bold text-[16px] rounded-md py-[14px] px-[28px] text-white transition-all duration-300 ease-in-out disabled:opacity-70 bg-[#771138] hover:bg-[#5A0D29] flex items-center justify-center"
					>
						{#if isLoading}
							<svg
								class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Bijwerken...
						{:else}
							Wachtwoord bijwerken
						{/if}
					</button>
				</form>
			{/if}
			<div class="text-center mt-6">
				<a
					href="/login"
					class="block text-[14px] text-[#707070] hover:text-[#3D3D3D] transition-colors duration-200"
					>Terug naar inloggen</a
				>
			</div>
		</div>
	</div>

	<!-- Rechterkant - Info -->
	<div
		class="w-full md:w-3/5 text-white p-8 md:p-12 flex items-center relative overflow-hidden order-1 md:order-2 bg-[#771138] right-side"
	>
		<div class="relative z-10 max-w-xl mx-auto flex flex-col items-center justify-center h-full">
			<h2 class="font-serif text-[28px] font-bold mb-4 text-center md:text-left text-white">
				Veiligheid voorop
			</h2>
			<p class="text-[15px] mb-8 text-center md:text-left text-white opacity-90">
				Verifieer je identiteit met de code uit je e-mail om veilig een nieuw wachtwoord in te
				stellen.
			</p>

			<div class="space-y-4 mb-8 w-full max-w-md">
				<div class="flex items-center p-4 rounded-md bg-white/10 backdrop-blur-md feature-item">
					<div
						class="bg-[#E9B046] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-white"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<p class="text-[15px] text-white feature-text">6-cijferige herstelcode via e-mail</p>
				</div>
				<div class="flex items-center p-4 rounded-md bg-white/10 backdrop-blur-md feature-item">
					<div
						class="bg-[#E9B046] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-white"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<p class="text-[15px] text-white feature-text">Veilig en gecodeerd opgeslagen</p>
				</div>
				<div class="flex items-center p-4 rounded-md bg-white/10 backdrop-blur-md feature-item">
					<div
						class="bg-[#E9B046] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-white"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<p class="text-[15px] text-white feature-text">Direct toegang na reset</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		font-family: 'Open Sans', sans-serif;
		background-color: #f5f2eb;
	}

	.font-serif {
		font-family: 'Times New Roman', serif;
	}

	.right-side {
		color: white;
	}

	.right-side h2,
	.right-side p,
	.right-side .feature-text {
		color: white !important;
	}

	.feature-item {
		color: white;
	}

	/* Animaties voor de achtergrond elementen */
	@keyframes pulse-slow {
		0%,
		100% {
			opacity: 0.1;
			transform: scale(1);
		}
		50% {
			opacity: 0.2;
			transform: scale(1.05);
		}
	}
	@keyframes pulse-slower {
		0%,
		100% {
			opacity: 0.2;
			transform: scale(1);
		}
		50% {
			opacity: 0.3;
			transform: scale(1.03);
		}
	}

	.animate-pulse-slow {
		animation: pulse-slow 8s infinite ease-in-out;
	}
	.animate-pulse-slower {
		animation: pulse-slower 10s infinite ease-in-out;
	}
</style>