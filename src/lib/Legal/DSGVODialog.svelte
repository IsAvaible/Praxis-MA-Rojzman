<script lang="ts">
    import type {Writable} from "svelte/store";
    import {writable} from "svelte/store";
    import {onDestroy} from "svelte";

    export let text = 'Dieser Teil der Webseite bettet Inhalte von einer anderen Webseite ein. Beim Laden der Inhalte könnten personenbezogene Daten an den Anbieter der Inhalte übertragen werden.';
    export let link;
    export let linkText = 'Mehr erfahren';
    export let buttonText = 'Inhalt laden';
    export let cookieStore: Writable<boolean> = writable(false)
    export let backgroundStyle = 'bg-hero-topography-700';
    export let blurBackground = false;

    let accepted = false;
    let alwaysAllow = true;

    const unsubscribe = cookieStore.subscribe(value => accepted = value);
    onDestroy(unsubscribe);

    const loadContent = () => {
        if (alwaysAllow) {
            cookieStore.set(true)
        }
        else {
            accepted = true
        }
    }
</script>

<!--
  @component
  This component defers the loading of it's slot until the user has accepted the appropriate cookie.
-->


{#if accepted}
    <slot/>
{:else}
    <div class="w-full h-full {backgroundStyle}">
        <div class="w-full h-full flex flex-col justify-center items-center {blurBackground ? 'backdrop-blur-sm' : ''} gap-1 p-4">
            <p class="text-md text-gray-800 text-center">{text}</p>
            {#if link}
                <a href={link} rel="noreferrer" target="_blank" class="text-primary-600 hover:underline">{linkText}</a>
            {/if}
            <button on:click={loadContent} class="bg-white text-gray-800 font-bold mt-2 px-4 py-2 rounded-md shadow-lg hover:shadow-md transition-shadow duration-300 hover:ring-1 hover:ring-black focus:shadow-md focus:ring-1 focus:ring-black">{buttonText}</button>
            <label class="flex items-center gap-1">
                <input type="checkbox" class="my-auto hover:cursor-pointer h-full" bind:checked={alwaysAllow}/>
                <span class="text-gray-800 -mt-[2px]">Immer zulassen</span>
            </label>
        </div>
    </div>
{/if}