import {writable} from "svelte/store";

// Stores whether the user has allowed the
export const googleMapsAllowedStore = writable('googleMapsAllowed' in localStorage ? localStorage.googleMapsAllowed === 'true' : false);

googleMapsAllowedStore.subscribe(value => {
    localStorage.googleMapsAllowed = value;
})
