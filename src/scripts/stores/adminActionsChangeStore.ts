import { writable } from 'svelte/store';

// This stores whether a new entry was inserted into the admin actions table
export const adminActionsChangeStore = writable(false);