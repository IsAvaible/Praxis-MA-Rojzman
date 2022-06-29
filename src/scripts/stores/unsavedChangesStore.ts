import { writable } from 'svelte/store';

export const unsavedChangesStore = writable(false);