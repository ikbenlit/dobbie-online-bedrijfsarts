<script lang="ts">
  import Icon from '$lib/components/ui/Icon.svelte';
  import {
    getButtonClasses,
    getIconStyling,
    type CommonButtonProps,
    type LinkSpecificProps,
    type ButtonVariant,
    type ButtonSize,
    type ButtonShape
  } from './button-styles.js';

  type $$Props = CommonButtonProps & LinkSpecificProps;

  export let href: string;
  export let variant: ButtonVariant = 'primary';
  export let size: ButtonSize = 'default';
  export let shape: ButtonShape = 'default';
  export let icon: string | undefined = undefined;
  export let iconPosition: 'left' | 'right' = 'left';
  export let elementClass: string = '';

  $: actualElementClass = $$props.class || elementClass;
  $: finalClasses = getButtonClasses({ variant, size, shape, class: actualElementClass });
  $: ({ iconSize, iconMargin } = getIconStyling({ size, iconPosition }));

</script>

<a {href} class={finalClasses} {...$$restProps} role="button">
  {#if icon && iconPosition === 'left'}
    <Icon name={icon} size={iconSize} className={iconMargin} />
  {/if}
  <slot />
  {#if icon && iconPosition === 'right'}
    <Icon name={icon} size={iconSize} className={iconMargin} />
  {/if}
</a> 