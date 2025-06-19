/**
 * Combines multiple class names into a single string.
 * Filters out falsy values.
 * @param {...(string | undefined | null | boolean)} args - Class names to combine.
 * @returns {string} - Combined class names.
 */
export function cn(...args) {
  return args.filter(Boolean).join(' ');
}

/**
 * Debounces a function call, delaying its execution until after the specified delay.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} - The debounced function.
 */
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
} 