import { writable } from 'svelte/store';

export const deviceOnlineStore = writable(true);

window.addEventListener('online', e => deviceOnlineStore.set(true));
window.addEventListener('offline', e => deviceOnlineStore.set(false));