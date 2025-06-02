/**
 * Combines multiple class names into a single string.
 * Filters out falsy values.
 * @param {...(string | undefined | null | boolean)} args - Class names to combine.
 * @returns {string} - Combined class names.
 */
export function cn(...args) {
  return args.filter(Boolean).join(' ');
} 