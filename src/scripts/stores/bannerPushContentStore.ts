import { writable } from 'svelte/store';

// This is used to communicate with the banner. If it is active the banner will push content down and won't overlay it.
export const bannerPushContentStore = writable(true);