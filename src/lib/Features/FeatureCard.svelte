<script lang="ts">
    import {navigate} from "svelte-navigator";
    import {createEventDispatcher} from "svelte";
    import ConditionalWrapper from "../Misc/ConditionalWrapper.svelte";

    export let name: string;
    export let title: string;
    export let shortDescription: string;
    export let longDescription: string = undefined;
    export let svgPaths: string[];
    export let centerSvg = true;
    export let expandViaIcon = true;

    let dispatch = createEventDispatcher();
    const popUpShow = () => {
        dispatch('popUpShow', true);
    }

    let windowWidth;
    let smallScreen;
    $: smallScreen = windowWidth < 1024;
    const onLinkFollow = e => {
        e.preventDefault();
        navigate('leistungen/' + name, {state: {scroll: false}});
        popUpShow();
    }
</script>
<svelte:window bind:innerWidth={windowWidth}/>

<div class="pt-6 h-full group">
    <div class="flow-root bg-gray-50 dark:bg-slate-800 rounded-lg px-6 pb-8 h-full">
        <div class="-mt-6 text-start">
            <ConditionalWrapper condition={longDescription && expandViaIcon} on:click={onLinkFollow} href={'leistungen/' + name} a={true}>
            <div class="{centerSvg ? 'justify-center' : 'justify-start'} flex items-center">
                <span class="inline-flex p-3 bg-primary-500 rounded-md shadow-lg {longDescription && expandViaIcon ? 'hover:bg-primary-600' : ''}">
                  <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      {#each svgPaths as path}
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={path} />
                      {/each}
                  </svg>
                </span>
            </div>
            </ConditionalWrapper>
            <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight dark:text-slate-200">{title}</h3>
            <p class="mt-5 text-base text-gray-500 dark:text-slate-300">{shortDescription}</p>
        </div>
    </div>
    {#if longDescription} <!-- If a long description is provided, show a button that allows reading it -->
        <div class="w-full flex justify-end -mt-6 lg:-mt-7 pr-1">
            {#if smallScreen}
                <a href={'leistungen/' + name} on:click|preventDefault={() => {navigate('leistungen/' + name, {state: {scroll: false}}); popUpShow()}}>
                    <p class="text-sm text-gray-500 dark:text-slate-300 mr-1">Mehr Erfahren</p>
                </a>
            {:else}
                <div class="has-tooltip">
                    <a href={'leistungen/' + name} on:click|preventDefault={() => {navigate('leistungen/' + name, {state: {scroll: false}}); popUpShow()}}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 dark:text-slate-300 hover:text-gray-600 dark:hover:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </a>
                    <span class="tooltip absolute -ml-12 mt-2 z-10 py-2 px-3 flex text-sm font-medium text-black rounded-lg shadow bg-white dark:text-slate-200 dark:bg-slate-700">
                    Mehr erfahren
                    </span>
                </div>
            {/if}
        </div>
    {/if}
</div>