import { writable } from 'svelte/store';

export const darkModeStore = writable(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    console.log("Color scheme changed!")
    darkModeStore.set(event.matches);
});