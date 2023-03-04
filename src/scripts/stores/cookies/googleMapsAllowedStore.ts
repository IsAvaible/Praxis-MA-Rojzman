import {writable} from "svelte/store";

// Stores whether the user has allowed Google maps to be loaded
export const googleMapsAllowedStore = writable('googleMapsAllowed' in localStorage ? localStorage.googleMapsAllowed === 'true' : true);

googleMapsAllowedStore.subscribe(value => {
    localStorage.googleMapsAllowed = value;
})
