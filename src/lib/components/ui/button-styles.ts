import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline';
export type ButtonSize = 'default' | 'large';
export type ButtonShape = 'default' | 'round';

export interface CommonButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  icon?: string;
  iconPosition?: 'left' | 'right';
  class?: string; // Voor extra Tailwind classes direct op het element
}

// Props specifiek voor een Link-achtig component
export type LinkSpecificProps = HTMLAnchorAttributes & {
  href: string; // href is verplicht voor een link
  type?: never; // type is niet relevant voor een link
};

// Props specifiek voor een Button-element component
export type ButtonElementSpecificProps = HTMLButtonAttributes & {
  href?: never; // href is niet relevant voor een button element
  type?: 'button' | 'submit' | 'reset'; // type is relevant voor een button
};

// Basis Tailwind klassen
const baseClasses =
  "inline-flex items-center justify-center font-source-sans-pro-semibold text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

// Klassen per variant
const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-pink-strong text-white hover:bg-pink-hover focus:ring-pink-strong shadow-md hover:shadow-lg',
  secondary: 'bg-white text-pink-strong border-2 border-pink-strong hover:bg-pink-light focus:ring-pink-strong',
  tertiary: 'bg-blue-accent text-white hover:bg-blue-light focus:ring-blue-accent shadow-md hover:shadow-lg',
  outline: 'bg-transparent text-pink-strong border border-pink-strong hover:bg-pink-light focus:ring-pink-strong'
};

// Klassen per grootte
const sizeClasses: Record<ButtonSize, string> = {
  default: 'px-7 py-3.5',
  large: 'px-8 py-4 text-lg'
};

// Klassen per vorm
const shapeClasses: Record<ButtonShape, string> = {
  default: 'rounded-md',
  round: 'rounded-button-round'
};

export function getButtonClasses(props: CommonButtonProps): string {
  const appliedVariant = props.variant || 'primary';
  const appliedSize = props.size || 'default';
  const appliedShape = props.shape || 'default';
  const extraClasses = props.class || '';

  return `
    ${baseClasses}
    ${variantClasses[appliedVariant]}
    ${sizeClasses[appliedSize]}
    ${shapeClasses[appliedShape]}
    ${extraClasses}
  `.trim().replace(/\s+/g, ' ');
}

export function getIconStyling(props: CommonButtonProps): { iconSize: number; iconMargin: string } {
  const iconSize = (props.size || 'default') === 'large' ? 20 : 18;
  const iconMargin = (props.iconPosition || 'left') === 'left' ? 'mr-2' : 'ml-2';
  return { iconSize, iconMargin };
} 