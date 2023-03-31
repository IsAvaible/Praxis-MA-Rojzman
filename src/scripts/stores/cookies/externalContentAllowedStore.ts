import {persisted} from "svelte-local-storage-store";

// Stores whether the user has allowed external content to be loaded
export const externalContentAllowedStore = persisted('externalContentAllowed', false);
