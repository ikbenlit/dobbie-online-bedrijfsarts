import { writable } from 'svelte/store';

export interface User {
  email: string | null;
  name?: string;
  // Voeg hier eventueel andere gebruikersinformatie toe
}

// Initialiseer de store met een null gebruiker (niet ingelogd)
const initialUser: User = { email: null };

// Creëer de writable store
const userStore = writable<User>(initialUser);

// Functie om gebruiker in te loggen (simpelweg de store updaten)
function setUser(email: string) {
  userStore.set({ email });
}

// Functie om gebruiker uit te loggen (store resetten)
function clearUser() {
  userStore.set({ email: null });
}

// Exporteer de store en de update functies
export { userStore, setUser, clearUser }; 