<script lang="ts">
	import { animateOnScroll } from "$lib/actions/animateOnScroll";
</script>

<!-- How It Works Section -->
<section id="how-it-works" class="py-16 md:py-24 bg-cream" use:animateOnScroll>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 md:mb-16">
            <h2 class="font-serif text-h2 font-bold text-bordeaux">Zo Werkt DOBbie - Online Verzuimadvies</h2>
            <p class="mt-4 text-body text-gray-dark max-w-3xl mx-auto">
                Professionele ondersteuning bij verzuim en re-integratie, direct beschikbaar wanneer u het nodig heeft.
            </p>
            <p class="mt-6 text-h3 font-semibold text-bordeaux">Efficiënt en compliant verzuimproces</p>
        </div>
        <div class="relative">
            <!-- Vertical Line -->
            <div class="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-bordeaux transform -translate-x-1/2"></div>

            <!-- Steps -->
            <div class="space-y-12 md:space-y-0 md:grid md:grid-cols-1 md:gap-x-8 md:gap-y-10">
                <!-- Step 1 -->
                <div class="relative md:flex md:items-start">
                    <div class="md:flex-shrink-0 md:w-1/2 md:pr-8 md:text-right">
                        <div class="w-12 h-12 bg-bordeaux rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto md:mr-0 md:ml-auto mb-4 md:mb-0 shadow-card">
                            1
                        </div>
                        <h3 class="text-h3 font-semibold text-bordeaux mb-2">Meld Verzuim</h3>
                        <p class="text-body text-gray-dark">
                            Registreer het verzuim en krijg direct advies over de te nemen stappen volgens de Wet Verbetering Poortwachter. Ontvang een gestructureerd plan van aanpak.
                        </p>
                    </div>
                    <div class="hidden md:block md:flex-shrink-0 md:w-1/2 md:pl-8">
                        <!-- Placeholder for potential image or graphic -->
                    </div>
                </div>

                <!-- Step 2 -->
                <div class="relative md:flex md:items-start mt-12 md:mt-0">
                    <div class="hidden md:block md:flex-shrink-0 md:w-1/2 md:pr-8">
                        <!-- Placeholder for potential image or graphic -->
                    </div>
                    <div class="md:flex-shrink-0 md:w-1/2 md:pl-8 md:text-left">
                        <div class="w-12 h-12 bg-bordeaux rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto md:ml-0 md:mr-auto mb-4 md:mb-0 shadow-card">
                            2
                        </div>
                        <h3 class="text-h3 font-semibold text-bordeaux mb-2">Ontvang Begeleiding</h3>
                        <p class="text-body text-gray-dark">
                            Krijg professioneel advies over de juiste aanpak, timing van interventies en wettelijke verplichtingen. Inclusief herinneringen voor belangrijke deadlines.
                        </p>
                    </div>
                </div>

                <!-- Step 3 -->
                <div class="relative md:flex md:items-start mt-12 md:mt-0">
                    <div class="md:flex-shrink-0 md:w-1/2 md:pr-8 md:text-right">
                        <div class="w-12 h-12 bg-bordeaux rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto md:mr-0 md:ml-auto mb-4 md:mb-0 shadow-card">
                            3
                        </div>
                        <h3 class="text-h3 font-semibold text-bordeaux mb-2">Monitor Voortgang</h3>
                        <p class="text-body text-gray-dark">
                            Volg de voortgang van het re-integratietraject, documenteer alle stappen en zorg voor een complete dossieropbouw conform wet- en regelgeving.
                        </p>
                    </div>
                    <div class="hidden md:block md:flex-shrink-0 md:w-1/2 md:pl-8">
                        <!-- Placeholder for potential image or graphic -->
                    </div>
                </div>

                <!-- Step 4 -->
                <div class="relative md:flex md:items-start mt-12 md:mt-0">
                    <div class="hidden md:block md:flex-shrink-0 md:w-1/2 md:pr-8">
                        <!-- Placeholder for potential image or graphic -->
                    </div>
                    <div class="md:flex-shrink-0 md:w-1/2 md:pl-8 md:text-left">
                        <div class="w-12 h-12 bg-bordeaux rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto md:ml-0 md:mr-auto mb-4 md:mb-0 shadow-card">
                            4
                        </div>
                        <h3 class="text-h3 font-semibold text-bordeaux mb-2">Succesvol Re-integreren</h3>
                        <p class="text-body text-gray-dark">
                            Begeleid de terugkeer naar werk met professioneel advies over werkhervatting, aanpassingen en duurzame inzetbaarheid.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center mt-12 md:mt-16">
            <a href="/login" class="bg-bordeaux hover:bg-bordeaux-hover text-white font-bold text-button py-3 px-8 rounded-button shadow-card hover:shadow-lg transition-all duration-300">
                Start direct
            </a>
        </div>
    </div>
</section> 