import { writable } from 'svelte/store';

export const deviceOnlineStore = writable(window.navigator.onLine);

window.addEventListener('online', e => deviceOnlineStore.set(true));
window.addEventListener('offline', e => deviceOnlineStore.set(false));