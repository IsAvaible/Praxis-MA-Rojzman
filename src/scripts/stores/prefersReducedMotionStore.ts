import { writable } from 'svelte/store';

// This stores whether the user prefers reduced motion
export const prefersReducedMotionStore = writable(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

// When the user changes the preferred reduced motion setting, this updates the prefersReducedMotionStore
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', event => {
    console.log("Motion preference changed!")
    prefersReducedMotionStore.set(event.matches);
});