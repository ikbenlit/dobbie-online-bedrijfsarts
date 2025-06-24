import type { Action } from 'svelte/action';

interface AnimateOnScrollParams {
    delay?: number;
    duration?: number;
    threshold?: number;
    once?: boolean; // Optie om animatie maar één keer uit te voeren
}

export const animateOnScroll: Action<HTMLElement, AnimateOnScrollParams | undefined> = (
    node,
    params
) => {
    const defaultParams: Required<AnimateOnScrollParams> = {
        delay: 0,
        duration: 500,
        threshold: 0.1,
        once: true, // Standaard animatie één keer uitvoeren
    };

    const currentParams = { ...defaultParams, ...params };

    let observer: IntersectionObserver;

    // Initiele stijl (onzichtbaar en voorbereid op transitie)
    node.style.opacity = '0';
    node.style.transition = `opacity ${currentParams.duration}ms ease-out ${currentParams.delay}ms`;

    const observerOptions: IntersectionObserverInit = {
        root: null,
        rootMargin: '0px',
        threshold: currentParams.threshold,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                node.style.opacity = '1'; // Maak zichtbaar
                if (currentParams.once) {
                    observer.unobserve(node); // Stop met observeren indien 'once' true is
                }
            } else if (!currentParams.once) {
                // Optioneel: element weer onzichtbaar maken als het uit beeld is en 'once' is false
                // node.style.opacity = '0'; 
            }
        });
    };

    observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(node);

    return {
        destroy() {
            if (observer) {
                observer.disconnect();
            }
        },
        // Optioneel: update functie als params dynamisch zouden kunnen veranderen
        // update(newParams) {
        //     currentParams = { ...defaultParams, ...newParams };
        //     node.style.transition = `opacity ${currentParams.duration}ms ease-out ${currentParams.delay}ms`;
        //     // Je zou hier de observer opnieuw kunnen opzetten als threshold verandert
        // }
    };
}; 