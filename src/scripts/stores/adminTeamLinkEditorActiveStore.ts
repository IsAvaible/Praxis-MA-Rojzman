import { writable } from 'svelte/store';

// This is used to store the state of the link editor in the team section of the admin panel
export const linkEditorActive = writable(false);