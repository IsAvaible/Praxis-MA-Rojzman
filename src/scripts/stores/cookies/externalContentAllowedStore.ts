import {writable} from "svelte/store";

// Stores whether the user has allowed external content to be loaded
export const externalContentAllowedStore = writable('externalContentAllowed' in localStorage ? localStorage.externalContentAllowed === 'true' : true);

externalContentAllowedStore.subscribe(value => {
    localStorage.externalContentAllowed = value;
})
