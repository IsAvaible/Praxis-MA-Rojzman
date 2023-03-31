import {persisted} from 'svelte-local-storage-store';
import {get, writable} from "svelte/store";

const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
export const darkModeStore = writable(); // Stores whether dark mode is enabled
export const themePreferenceStore = persisted('themePreference', 'system'); // Stores the user's theme preference


// Propagate the dark mode preference to the document
darkModeStore.subscribe(darkMode => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
});

// Monitor the system theme
prefersDarkMode.addEventListener('change', event => {
    console.log("System color scheme changed!")
    if (get(themePreferenceStore) === 'system') darkModeStore.set(event.matches);
});

// Keep the dark mode store in sync with the theme preference
themePreferenceStore.subscribe(value => {
    if (value === 'system') darkModeStore.set(prefersDarkMode.matches);
    else darkModeStore.set(value === 'dark');
})
