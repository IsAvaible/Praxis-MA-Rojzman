<script lang="ts">
import {getAdminActions} from "../../../scripts/database/database";
import {fade} from "svelte/transition";
import Alert from "../../Essentials/Alert.svelte";

let actionsCount: number | string = 5;
let increaseBy = actionsCount;

let svgs = [{section: 'Übersicht', paths: ['M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6']},
    {section: 'Leistungen', paths: ['M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z']},
    {section: 'Aktuelles', paths: ['M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z']},
    {section: 'Team', paths: ['M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z']},
    {section: 'Texte', paths: ['M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z']},
    {section: 'Bilder', paths: ['M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z']},
    {section: 'Config', paths: ["M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"]}
];

// Does the job...
</script>

<div class="flow-root">
    {#key actionsCount}
        <ul class="my-6" in:fade={{duration: 500}}>
        {#await getAdminActions(actionsCount === 'all' ? undefined : actionsCount)}
            {#each Array(actionsCount === 'all' ? increaseBy : actionsCount) as _, i}
                <li in:fade={{duration: 500}}>
                    <div class="ml-2 relative pb-8 animate-pulse">
                        {#if i+1 !== actionsCount}<span class="absolute top-4 left-4 -ml-px h-[75%] w-0.5 bg-gray-200" aria-hidden="true"></span>{/if}
                        <div class="relative flex space-x-3">
                            <div class="h-8 w-8 bg-gray-400 rounded-full justify-center"></div>
                            <div class="flex-1 space-y-6 py-1 max-w-[50%]">
                                <div class="grid grid-cols-3 gap-4">
                                    <div class="h-2 bg-slate-200 rounded col-span-2"></div>
                                    <div class="h-2 bg-slate-200 rounded col-span-1"></div>
                                </div>
                            <div class="h-2 bg-slate-200 rounded col-span-1 max-w-[30%]"></div>
                            </div>
                        </div>
                    </div>
                </li>
            {/each}
        {:then actions}
            {#each actions as action, i}
                <li in:fade={{duration: 300}}>
                    <div class="mx-2 relative pb-8">
                        {#if i+1 !== actions.length}<span class="absolute top-4 left-4 -ml-px h-[75%] w-0.5 bg-gray-200" aria-hidden="true"></span>{/if}
                        <div class="relative flex space-x-3">
                            <div>
                                <span class="h-8 w-8 rounded-full bg-primary-400 flex items-center justify-center ring-8 ring-white dark:ring-slate-900">
                                    <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        {#each svgs.find(s => s.section === action.section).paths as path}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={path} />
                                        {/each}
                                    </svg>
                                </span>
                            </div>
                            <div class="flex-1 space-y-1">
                                <div class="flex items-center justify-between">
                                    <h3 class="text-sm font-medium">{action.description}</h3>
                                    <p class="text-sm text-gray-500 dark:text-slate-300">{action.performedAt.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                                <p class="text-sm text-gray-500  dark:text-slate-300">Account: {action.author}</p>
                            </div>
                        </div>
                    </div>
                </li>
            {:else}
                <Alert type={1} title={'Achtung:'} description={'Es wurden noch keine Admin Aktionen aufgezeichnet.'}/>
            {/each}
            {#if actions}
                <li>
                    <div class="relative flex justify-center items-center space-x-5">
                        {#if actionsCount !== 'all'}
                            <button on:click={() => actionsCount += increaseBy} class="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-1 active:ring-0 ring-inset ring-white">
                                <span class="text-sm font-medium">Mehr anzeigen</span>
                            </button>
                        {/if}
                        {#if actionsCount !== increaseBy && actionsCount !== 'all'}
                            <button on:click={() => actionsCount -= increaseBy} class="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-1 active:ring-0 ring-inset ring-white">
                                <span class="text-sm font-medium">Weniger anzeigen</span>
                            </button>
                        {/if}
                        {#if actionsCount === 'all' || actionsCount > increaseBy * 2}
                            <button on:click={() => actionsCount = increaseBy} class="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-1 active:ring-0 ring-inset ring-white">
                                <span class="text-sm font-medium">Zurücksetzen</span>
                            </button>
                        {/if}
                        {#if actionsCount > increaseBy * 2 && actionsCount !== 'all'}
                            <button on:click={() => actionsCount = 'all'} class="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-1 active:ring-0 ring-inset ring-white">
                                <span class="text-sm font-medium">Alle anzeigen</span>
                            </button>
                        {/if}
                    </div>
                </li>
            {/if}
        {:catch e}
            <Alert type={0} title={'Error!'} description={e.message}/>
        {/await}
    </ul>
    {/key}
</div>