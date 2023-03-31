import type {Writable} from "svelte/store";
import {get} from "svelte/store";

import {externalContentAllowedStore} from "./externalContentAllowedStore";
import {youtubeAllowedStore} from "./youtubeAllowedStore";
import {googleMapsAllowedStore} from "./googleMapsAllowedStore";
import {persisted} from "svelte-local-storage-store";


export enum cookieState {UNSET, NONE, SOME, ALL}
export const siteCookieStore: Writable<cookieState> = persisted('siteCookie', cookieState.UNSET);
export const siteCookies: {name: string, description: string, store: Writable<boolean>}[] = [
    {name: "Youtube", description: "Erlaubt das Einbinden von Youtube Videos", store: youtubeAllowedStore},
    {name: "Google Maps", description: "Erlaubt das Anzeigen des Praxisstandorts auf Google Maps", store: googleMapsAllowedStore},
    {name: "Externe Inhalte", description: "Erlaubt die Einbettung anderer externer Inhalte", store: externalContentAllowedStore}
]

let unsubscribed = false;
siteCookieStore.subscribe((siteCookie) => {
    if (siteCookie !== cookieState.UNSET && !unsubscribed) {
        unsubscribed = true;
        siteCookieStore.subscribe(siteCookie => {
            if (siteCookie == cookieState.ALL || siteCookie == cookieState.NONE) {
                siteCookies.forEach( cookie => {
                    cookie.store.set(siteCookie == cookieState.ALL);
                })
            }
        })

        siteCookies.forEach( cookie => {
            cookie.store.subscribe(value => {
                const cookieValues = siteCookies.map(cookie => get(cookie.store));
                if (cookieValues.every(value => value)) siteCookieStore.set(cookieState.ALL);
                else if (cookieValues.find(value => value))  siteCookieStore.set(cookieState.SOME);
                else siteCookieStore.set(cookieState.NONE);
            })
        })
    }
})



