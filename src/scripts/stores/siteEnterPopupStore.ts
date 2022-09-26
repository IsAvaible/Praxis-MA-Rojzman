import { writable } from 'svelte/store';

// This stores whether the popup that appears when first entering the site was already shown
export const shown = writable(false);