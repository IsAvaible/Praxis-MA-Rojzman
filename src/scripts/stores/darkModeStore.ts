import { writable } from 'svelte/store';

// This stores whether the user has set the preferred color scheme to dark mode
export const darkModeStore = writable(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

// When the user changes the preferred color scheme, this updates the dark mode store
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    console.log("Color scheme changed!")
    darkModeStore.set(event.matches);
});