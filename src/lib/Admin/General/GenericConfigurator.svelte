<script lang="ts">
    import {
        getBannerConfig,
        getConfigEntry,
        updateConfigEntry
    } from "../../../scripts/database/database";
    import Alert from "../../Essentials/Alert.svelte";
    import LoadingWheel from "../../Misc/LoadingWheel.svelte";

    export let getInitialConfig: (configStore: any) => Promise<any>;
    export let updateFunction: (config: any) => Promise<any>;
    export let resetFunction: (configStore: any) => Promise<any>;

    let tableConfig;
    let resetLoading = false;
</script>

<!-- Form that allows the admin to configure Banner.svelte (../../Essentials/Banner.svelte) -->
{#await getInitialConfig(tableConfig)}
    <div class="flex justify-center"><LoadingWheel size={20} showAfter={1000}/></div>
{:then _}
    <div class="grid my-3" style="grid-template-columns: min-content 1fr; grid-auto-rows: 1fr; grid-row-gap: 10px">
        {#each Object.entries(tableConfig) as [configKey, configValue]}
            {#if configKey !== "updatedAt"}
                <label for="input-{configKey}" class="text-sm my-auto font-medium mr-3">{configKey}</label>
                <span class="flex items-center justify-center">
                {#if typeof tableConfig[configKey] === "boolean"}
                    <input type="checkbox" bind:checked={tableConfig[configKey]} id="input-{configKey}" />
                {:else if configValue instanceof Array}
                    <div class="flex gap-3 w-full" on:blur={() => updateConfigEntry('banner', tableConfig)}>
                        {#each configValue as element}
                            <div class="flex gap-2">
                                <input type="text" bind:value={element} class="border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                                <button on:click={() => {configValue.splice(configValue.indexOf(element), 1); configValue = configValue}} type="button" class="justify-center align-middle p-2 aspect-[1] rounded-md border dark:bg-slate-900 border-[f0f0f0] dark:border-none dark:hover:bg-slate-900 focus:outline-none active:ring-2 active:ring-primary-200 dark:active:ring-slate-200">
                                    <svg class="h-6 w-full text-gray-500 sm:hover:text-gray-800 dark:text-slate-400 sm:dark:hover:text-slate-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                </button>
                            </div>
                        {/each}
                        <button on:click={() => {configValue.push(""); configValue = configValue}} type="button" class="ml-auto justify-center align-middle p-2 aspect-[1] rounded-md border dark:bg-slate-900 border-[f0f0f0] dark:border-none dark:hover:bg-slate-900 focus:outline-none active:ring-2 active:ring-primary-200 dark:active:ring-slate-200">
                            <svg class="h-6 w-full text-gray-500 sm:hover:text-gray-800 dark:text-slate-400 sm:dark:hover:text-slate-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                            </svg>
                        </button>
                    </div>
                {:else}
                    <input autocomplete="off" bind:value={tableConfig[configKey]} required class="w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none disabled:bg-gray-100 disabled:dark:bg-slate-800 focus:border-primary-500" type="text" id="input-{configKey}"/>
                {/if}
            </span>
            {/if}
        {/each}
    </div>
    <div class="flex justify-center items-center gap-6">
        <button on:click={() => updateConfigEntry('banner', tableConfig)} class="px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 flex">
            <span class="text-sm font-medium">Speichern</span>
        </button>
        <button on:click={() => {resetLoading = true; resetFunction(tableConfig).then(() => resetLoading = false)}} class="px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 flex space-x-2">
            <span class="text-sm font-medium">Zurücksetzen</span>
            {#if resetLoading}
                <LoadingWheel size={5}/>
            {/if}
        </button>
    </div>
{:catch e}
    <Alert type={0} title="Error!" description={e.message}/>
{/await}
