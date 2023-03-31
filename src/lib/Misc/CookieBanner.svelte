<script>
    import {Link} from "svelte-navigator";
    import {slide} from "svelte/transition";
    import {cookieState, siteCookieStore} from "../../scripts/stores/cookies/siteCookieStore";
    import CookieConfigurator from "../Legal/CookieConfigurator.svelte";

    let showConfigurator = false;
    let cookieConfigurator;
</script>

<div out:slide|local class="max-w-screen-xl fixed bottom-10 z-10 mx-auto bg-white dark:bg-slate-800 inset-x-5 p-5 rounded-lg drop-shadow-2xl max-h-[80%] overflow-y-auto">
    {#if showConfigurator}
        <div in:slide class="pb-2 overflow-y-auto">
            <CookieConfigurator bind:this={cookieConfigurator} realtimeCookieState={false}/>
        </div>
    {/if}

    <div class="flex gap-4 flex-wrap md:flex-nowrap  text-center md:text-left items-center justify-center md:justify-between">
        <div class="w-full dark:text-slate-100">Diese Website nutzt externe Inhalte wie Karten und Videos, welche eventuell Cookies setzen und/oder Daten an Dritte weitergeben.
            <Link to="/datenschutzerklaerung" class="text-primary-600 dark:text-primary-500 whitespace-nowrap hover:underline">Mehr Erfahren</Link>
        </div>
        <div class="flex gap-4 items-center flex-shrink-0">
            <button on:click={() => {if (!showConfigurator) showConfigurator = true; else cookieConfigurator.denyAllCookies()}} class="text-primary-600 dark:text-primary-500 hover:underline">{#if !showConfigurator}Konfigurieren{:else}Alle Ablehnen{/if}</button>
            <button on:click={() => {siteCookieStore.set(showConfigurator ? cookieState.SOME : cookieState.ALL)}} class="bg-primary-500 dark:bg-primary-600 px-5 py-2 text-white rounded-md hover:bg-primary-700 focus:ring-1 focus:ring-inset focus:ring-white">Akzeptieren</button>
        </div>
    </div>
</div>
