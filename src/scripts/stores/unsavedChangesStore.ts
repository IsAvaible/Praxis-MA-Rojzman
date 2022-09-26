import { writable } from 'svelte/store';

// When this store is true, the user (admin) is currently editing content and has unsaved changes.
// The navigator will check this store and prompt the user to save their changes before leaving the page.
export const unsavedChangesStore = writable(false);