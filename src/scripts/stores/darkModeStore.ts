import { writable } from 'svelte/store';

// Get the current system value of the dark mode preference
export const getSystemTheme = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
// This stores whether the user has set the preferred color scheme to dark mode
export const darkModeStore = writable( (!('theme' in localStorage) ? getSystemTheme() : localStorage.theme === 'dark'));


// When the user changes the preferred color scheme, this updates the dark mode store
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    console.log("Color scheme changed!")
    if (!('theme' in localStorage)) darkModeStore.set(event.matches);
});

// Propagate the dark mode preference to the document
darkModeStore.subscribe(value => {
    if (value) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark')
})