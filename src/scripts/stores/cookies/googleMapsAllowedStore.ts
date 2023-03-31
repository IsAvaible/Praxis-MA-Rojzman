import {persisted} from "svelte-local-storage-store";

// Stores whether the user has allowed Google maps to be loaded
export const googleMapsAllowedStore = persisted('googleMapsAllowed', false);
