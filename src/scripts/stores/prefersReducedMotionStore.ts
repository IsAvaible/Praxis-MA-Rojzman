import { writable } from 'svelte/store';

export const prefersReducedMotionStore = writable(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', event => {
    console.log("Motion preference changed!")
    prefersReducedMotionStore.set(event.matches);
});