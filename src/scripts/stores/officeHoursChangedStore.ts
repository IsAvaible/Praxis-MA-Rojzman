import {writable} from 'svelte/store';

// This stores whether the admin has changed the office hours
export const officeHoursChangedStore = writable(false);