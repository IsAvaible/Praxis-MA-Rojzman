import {writable} from "svelte/store";

// Stores whether the user has allowed YouTube videos to be loaded
export const youtubeAllowedStore = writable('youtubeAllowed' in localStorage ? localStorage.youtubeAllowed === 'true' : true);

youtubeAllowedStore.subscribe(value => {
    localStorage.youtubeAllowed = value;
})
