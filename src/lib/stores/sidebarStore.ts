import { writable } from 'svelte/store';

// Exporteer de interface
export interface SidebarState {
  open: boolean;
}

export const sidebarStore = writable<SidebarState>({ open: false }); 