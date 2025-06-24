<script lang="ts">
  // Props definieren
  export let title: string;
  export let description: string;
  export let primaryCta: { text: string; href: string };
  export let secondaryCta: { text: string; href: string; icon?: string } | undefined = undefined;
  export let mockupImage: { src: string; alt: string; width?: number; height?: number };
  export let avatarImage: { src: string; alt: string } | undefined = undefined;
  export let className: string = "bg-white"; // Default achtergrond wit

  import { cn } from '../../utils.js';
  import Link from "$lib/components/ui/Link.svelte";
  import Mockup from "$lib/components/ui/mockup.svelte";
  import Glow from "$lib/components/ui/glow.svelte"; // Teruggeplaatst
</script>

<section
  class={cn(
    "relative text-white", // Basiskleur tekst aangepast naar wit
    "py-12 md:py-20",
    "overflow-hidden",
    className // Toepassen van de achtergrondkleur prop
  )}
>
  <div class="relative mx-auto max-w-[1280px] flex flex-col gap-12 lg:gap-24">
    <div class="relative z-10 flex flex-col items-center gap-6 pt-8 md:pt-16 text-center lg:gap-10 px-4">
      <!-- Avatar en Tekst Blok -->
      <div class="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 w-full max-w-4xl">
        {#if avatarImage}
          <img 
            src={avatarImage.src} 
            alt={avatarImage.alt} 
            class="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-lg object-cover flex-shrink-0 mb-4 md:mb-0"
          />
        {/if}
        <div class="flex flex-col items-center md:items-start text-center md:text-left">
          <!-- Heading -->
          <h1
            class={cn(
              "inline-block animate-appear",
              "text-white", // Terug naar wit voor donkere achtergrond
              "font-source-sans-pro-bold",
              "text-3xl md:text-4xl tracking-tight", // Shirley styleguide (32px)
              "leading-[1.1] sm:leading-[1.1]",
              "drop-shadow-sm"
            )}
          >
            {title}
          </h1>
          <p
            class={cn(
              "max-w-2xl",
              "font-roboto-regular text-very-light-gray", // Terug naar lichtgrijs voor donkere achtergrond
              "text-lg md:text-xl" // Shirley styleguide (18px)
            )}
          >
            {@html description}
          </p>

          <!-- CTAs -->
          <div
            class="relative z-10 flex flex-col sm:flex-row flex-wrap justify-center md:justify-start items-center gap-4 mt-4 md:mt-6"
          >
            <Link
              href={primaryCta.href}
              size="large"
              variant="primary"
              icon="ArrowRight"
              iconPosition="right"
            >
              {primaryCta.text}
            </Link>
            {#if secondaryCta}
              <Link
                href={secondaryCta.href}
                size="large"
                variant="secondary"
                icon={secondaryCta.icon || undefined}
                iconPosition="right"
              >
                {secondaryCta.text}
              </Link>
            {/if}
          </div>
        </div>
      </div>

      <!-- Mockup - Nu onder de avatar/tekst sectie -->
      <div class="relative w-full pt-12 md:pt-16 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto">
        <Mockup
          className={cn(
            "shadow-xl", // Iets meer uitgesproken schaduw
            "border-neutral-200 dark:border-neutral-700" // Behoud een subtiele rand
          )}
        >
          <img
            src={mockupImage.src}
            alt={mockupImage.alt}
            width={mockupImage.width || 1200}
            height={mockupImage.height || 750}
            class="w-full h-auto object-contain rounded-lg"
            loading="eager"
            decoding="async"
          />
        </Mockup>
      </div>
    </div>
  </div>

  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <Glow variant="above" className="bg-pink-light/30 opacity-50 blur-3xl" />
  </div>
</section>