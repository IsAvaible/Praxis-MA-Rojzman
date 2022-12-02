import { writable } from 'svelte/store';

// This stores whether the user has already visited the home page
export const homeVisited = writable(false);