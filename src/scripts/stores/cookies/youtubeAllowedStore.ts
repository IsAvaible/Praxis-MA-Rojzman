import {persisted} from "svelte-local-storage-store";

// Stores whether the user has allowed YouTube videos to be loaded
export const youtubeAllowedStore = persisted('youtubeAllowed', false);