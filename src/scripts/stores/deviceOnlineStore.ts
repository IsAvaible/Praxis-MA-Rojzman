import { writable } from 'svelte/store';

// This stores whether the device is online
export const deviceOnlineStore = writable(window.navigator.onLine);

// These listeners update the deviceOnlineStore when the device goes online or offline
window.addEventListener('online', e => deviceOnlineStore.set(true));
window.addEventListener('offline', e => deviceOnlineStore.set(false));