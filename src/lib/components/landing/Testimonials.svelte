<script lang="ts">
	import { animateOnScroll } from '$lib/actions/animateOnScroll';

  interface Testimonial {
    name: string;
    role: string;
    image: string;
    quote: string;
  }

  const testimonials: Testimonial[] = [
    {
      name: "Mark van der Berg",
      role: "HR Manager bij TechCorp",
      image: "/images/testimonials/mark.webp",
      quote: "DOBbie heeft ons enorm geholpen bij het stroomlijnen van ons verzuimproces. De 24/7 beschikbaarheid en accurate adviezen hebben onze HR-afdeling veel tijd bespaard."
    },
    {
      name: "Linda de Vries",
      role: "Casemanager Verzuim",
      image: "/images/avatar-1.webp",
      quote: "Als casemanager waardeer ik de actuele kennis van wet- en regelgeving. DOBbie geeft direct bruikbare antwoorden en houdt rekening met de laatste updates in de Wet Poortwachter."
    },
    {
      name: "Peter Jansen",
      role: "Directeur MKB",
      image: "/images/testimonials/peter.webp",
      quote: "Voor een klein bedrijf als het onze is DOBbie de perfecte oplossing. Professioneel advies wanneer we het nodig hebben, zonder de kosten van een fulltime bedrijfsarts."
    },
    {
      name: "Sarah Ahmed",
      role: "Teamleider Personeelszaken",
      image: "/images/avatar-3.webp",
      quote: "De combinatie van AI-technologie met gedegen medische en juridische kennis maakt DOBbie uniek. Het helpt ons om compliant te blijven en tegelijk efficiënt te werken."
    }
  ];
</script>

<!-- Testimonials Section -->
<section id="testimonials" class="py-16 md:py-24 bg-white" use:animateOnScroll>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 md:mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-[#771138]">Wat onze gebruikers zeggen</h2>
            <p class="mt-4 text-lg md:text-xl text-[#3D3D3D] max-w-3xl mx-auto">
                Ontdek hoe DOBbie organisaties helpt bij professionele verzuimbegeleiding.
            </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {#each testimonials as testimonial}
                <div class="bg-[#F5F2EB] p-6 rounded-lg shadow-md testimonial-card">
                    <div class="flex items-center mb-4">
                        <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            class="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                            <h3 class="font-bold text-[#3D3D3D]">{testimonial.name}</h3>
                            <p class="text-sm text-[#3D3D3D]">{testimonial.role}</p>
                        </div>
                    </div>
                    <p class="text-[#3D3D3D] italic">"{testimonial.quote}"</p>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
.testimonial-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.testimonial-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
}

section {
    font-family: 'Open Sans', sans-serif;
}

h2 {
    font-family: 'Times New Roman', serif;
}
</style> 