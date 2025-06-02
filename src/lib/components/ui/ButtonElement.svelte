<script lang="ts">
  import Icon from '$lib/components/ui/Icon.svelte';
  import {
    getButtonClasses,
    getIconStyling,
    type CommonButtonProps,
    type ButtonElementSpecificProps,
    type ButtonVariant, // Exporteren voor gebruik als default
    type ButtonSize,
    type ButtonShape
  } from './button-styles.js'; // .js extensie toegevoegd

  // Combineer de gedeelde props met de specifieke button props
  type $$Props = CommonButtonProps & ButtonElementSpecificProps;

  // Exporteer props met defaults van button-styles.ts of hier gedefinieerd
  export let variant: ButtonVariant = 'primary';
  export let size: ButtonSize = 'default';
  export let shape: ButtonShape = 'default';
  export let icon: string | undefined = undefined;
  export let iconPosition: 'left' | 'right' = 'left';
  export let type: $$Props['type'] = 'button'; // Standaard 'button' voor een button element
  export let className: string = ''; // Hernoemd van elementClass naar className en later effectief 'class'

  // Dynamisch classes en icoon styling ophalen
  // Gebruik $$props.class om de class van de parent te ontvangen, fallback naar className prop indien nodig.
  $: actualClass = $$props.class || className; 
  $: finalClasses = getButtonClasses({ variant, size, shape, class: actualClass });
  $: ({ iconSize, iconMargin } = getIconStyling({ size, iconPosition }));

</script>

<button {type} class={finalClasses} {...$$restProps}>
  {#if icon && iconPosition === 'left'}
    <Icon name={icon} size={iconSize} className={iconMargin} />
  {/if}
  <slot />
  {#if icon && iconPosition === 'right'}
    <Icon name={icon} size={iconSize} className={iconMargin} />
  {/if}
</button> 