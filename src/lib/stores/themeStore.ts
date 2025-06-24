import { browser } from '$app/environment';
import { writable } from 'svelte/store';

type Theme = 'light' | 'dark';

// Haal de opgeslagen theme op uit localStorage
function getInitialTheme(): Theme {
  if (browser) {
    // Controleer eerst localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;
    
    // Controleer dan de gebruikersvoorkeur
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
  
  // Standaard light theme voor SSR
  return 'light';
}

// Maak de store
const theme = writable<Theme>(getInitialTheme());

// Toggle functie
function toggleTheme() {
  theme.update(currentTheme => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    if (browser) {
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
    return newTheme;
  });
}

// Initialiseer theme effect bij laden
if (browser) {
  theme.subscribe(value => {
    document.documentElement.classList.toggle('dark', value === 'dark');
  });
}

export { theme, toggleTheme }; 