import {writable} from "svelte/store";

// Stores whether the user has allowed YouTube videos to be loaded
export const youtubeAllowedStore = writable('youtubeAllowed' in localStorage ? localStorage.youtubeAllowed === 'true' : false);

youtubeAllowedStore.subscribe(value => {
    localStorage.youtubeAllowed = value;
})
