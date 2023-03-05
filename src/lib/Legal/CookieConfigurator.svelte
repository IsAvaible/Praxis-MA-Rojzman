<script lang="ts">
import {siteCookies} from "../../scripts/stores/cookies/siteCookieStore";
import {cookieState} from "../../scripts/stores/cookies/siteCookieStore";``
import {siteCookieStore} from "../../scripts/stores/cookies/siteCookieStore.js";
import {onDestroy} from "svelte";
import {get} from "svelte/store";

export let realtimeCookieState = true; // Whether the cookie state should be updated in real time or only on exit
export let showAdditionalControls = false; // Whether to show the "Accept all" and "Decline all" buttons

// This stores the state of the checkboxes
// (we cannot use reactive statements on the stores, because Svelte only supports reactive statements on top level imports)
let cookieStates: boolean[] = [];
let unsubscribers: (() => void)[] = [];
for (let i = 0; i < siteCookies.length; i++) {
    if (realtimeCookieState) {
        unsubscribers.push(siteCookies[i].store.subscribe(value => {
            cookieStates[i] = value;
        }))
    } else if (get(siteCookieStore) === cookieState.UNSET) {
        cookieStates[i] = true; // Default all cookies to true if the user has not set a preference
    }
}

onDestroy(() => {
    for (let i = 0; i < siteCookies.length; i++) {
        siteCookies[i].store.set(cookieStates[i]);
    }
    unsubscribers.forEach(unsubscribe => unsubscribe());
});
</script>


{#each siteCookies as cookie, i}
    <div class="flex items-center justify-between">
        <div class="flex items-start">
            <div class="">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-slate-200">
                    {cookie.name}
                </h3>
                <p class="text-sm text-gray-500 dark:text-slate-200">
                    {cookie.description}
                </p>
            </div>
        </div>
        <div class="ml-3 h-7 flex items-center">
            <label class="container">
                {#key $siteCookieStore}
                    <input type="checkbox" checked={cookieStates[i]} on:change={() => {if (realtimeCookieState) cookie.store.update(value => !value)}}>
                {/key}
            </label>
        </div>
    </div>
{/each}
{#if showAdditionalControls}
    <div class="flex justify-between font-normal text-black dark:text-primary-500 mt-2">
        <button on:click={() => siteCookieStore.set(cookieState.NONE)} class="hover:underline">Alle Ablehnen</button>
        <button on:click={() => siteCookieStore.set(cookieState.ALL)} class="hover:underline">Alle Akzeptieren</button>
    </div>
{/if}
