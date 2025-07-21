<script lang="ts">
    import { animateOnScroll } from "$lib/actions/animateOnScroll";
    // Eventuele form handling logica komt hier later
</script>

<!-- Try Now Section -->
<section id="try-now" class="py-16 md:py-24 bg-bordeaux" use:animateOnScroll>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-card shadow-chat overflow-hidden">
            <div class="md:flex">
                <div class="md:w-1/2 p-8 md:p-12">
                    <h2 class="font-serif text-h2 font-bold text-bordeaux">
                        Klaar voor professioneel verzuimadvies?
                    </h2>
                    <p class="mt-4 text-body text-gray-dark">
                        Start direct met de Online Verzuimbuddy en krijg toegang tot professionele ondersteuning bij verzuim en re-integratie.
                    </p>
                    <form class="mt-8 space-y-6">
                        <div>
                            <label for="companyName" class="block text-sm font-medium text-gray-dark">Bedrijfsnaam</label>
                            <input type="text" id="companyName" name="companyName" autocomplete="organization" required class="mt-1 block w-full border border-gray-light rounded-input shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-bordeaux focus:border-transparent">
                        </div>
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-dark">Zakelijk e-mailadres</label>
                            <input type="email" id="email" name="email" autocomplete="email" required class="mt-1 block w-full border border-gray-light rounded-input shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-bordeaux focus:border-transparent">
                        </div>
                        <div>
                            <label for="employees" class="block text-sm font-medium text-gray-dark">Aantal medewerkers</label>
                            <select id="employees" name="employees" required class="mt-1 block w-full border border-gray-light rounded-input shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-bordeaux focus:border-transparent">
                                <option value="">Selecteer aantal</option>
                                <option value="1-10">1-10 medewerkers</option>
                                <option value="11-50">11-50 medewerkers</option>
                                <option value="51-200">51-200 medewerkers</option>
                                <option value="201+">201+ medewerkers</option>
                            </select>
                        </div>
                        <div>
                            <a href="/login" class="block w-full text-center bg-bordeaux hover:bg-bordeaux-hover text-white font-bold text-button py-3 px-6 rounded-button shadow-card hover:shadow-lg transition-all duration-300">
                                Start direct
                            </a>
                        </div>
                    </form>
                    <p class="mt-6 text-small text-gray-dark">
                        Door te registreren gaat u akkoord met onze <a href="/terms" class="text-bordeaux hover:text-bordeaux-hover">Voorwaarden</a> en <a href="/privacy" class="text-bordeaux hover:text-bordeaux-hover">Privacybeleid</a>.
                    </p>
                </div>
                <div class="md:w-1/2 bg-cream p-8 md:p-12 flex flex-col justify-center">
                    <div>
                        <div class="flex items-center mb-6">
                            <svg class="h-8 w-8 text-bordeaux mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            <h3 class="text-h3 font-semibold text-bordeaux">Wat U Krijgt</h3>
                        </div>
                        <ul class="space-y-3 text-gray-dark">
                            <li class="flex items-start">
                                <svg class="h-6 w-6 text-bordeaux mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span>24/7 toegang tot professioneel verzuimadvies</span>
                            </li>
                            <li class="flex items-start">
                                <svg class="h-6 w-6 text-bordeaux mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span>Compliant met Wet Verbetering Poortwachter</span>
                            </li>
                            <li class="flex items-start">
                                <svg class="h-6 w-6 text-bordeaux mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span>Gestructureerde dossieropbouw en documentatie</span>
                            </li>
                            <li class="flex items-start">
                                <svg class="h-6 w-6 text-bordeaux mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span>Proactieve herinneringen en deadlines</span>
                            </li>
                            <li class="flex items-start">
                                <svg class="h-6 w-6 text-bordeaux mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span>AVG-proof en veilige gegevensverwerking</span>
                            </li>
                        </ul>
                        <p class="mt-8 text-small text-gray-dark">
                            Sluit u aan bij honderden bedrijven die hun verzuimproces professioneel hebben georganiseerd.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    .gradient-bg {
        /* Gebruik de bestaande gradient of een nieuwe als die er is in de HTML */
        background: linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%); /* Lichte roze gradient als voorbeeld */
    }
</style>
