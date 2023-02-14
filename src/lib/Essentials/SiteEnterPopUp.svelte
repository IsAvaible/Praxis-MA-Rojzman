<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { clickOutside } from "../../scripts/ui/clickOutside";
    import {shown} from "../../scripts/stores/siteEnterPopupStore";
    import {navigate} from "svelte-navigator";
    import { fade } from "svelte/transition";

    export let svgPaths: string[] = ["M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"]; // Default SVG is a warning sign
    export let title: string;
    export let content: string;
    export let active: boolean;
    export let buttonText: string = undefined;
    export let buttonLink: string = undefined;

    // This prevents the PopUp from showing up when changing routes. Only reloading the page will trigger the PopUp again.
    let initialLoad: boolean;
    shown.subscribe(value => {
        initialLoad = !value;
    });

    let dispatch = createEventDispatcher();
    const hide = () => {
        dispatch("hide", true);
        shown.update(() => true)
    }
    document.onkeyup = (e) => {if (e.key == 'Escape') hide()}
</script>

{#if initialLoad && active}
    <div out:fade|local={{duration: 300}} class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div use:clickOutside on:clickOutside={hide} class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-500 sm:mx-0 sm:h-10 sm:w-10">
                            <!-- Heroicon name: outline/clock -->
                            <svg class="h-6 w-6 text-primary-600 dark:text-primary-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                {#each svgPaths as path}
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{path}" />
                                {/each}
                            </svg>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-slate-100" id="modal-title">{title}</h3>
                            <div class="mt-2">
                                <p class="font-light text-md text-gray-500 dark:text-slate-200">{content}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button on:click={() => {navigate(buttonLink); hide()}} type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm">{buttonText}</button>
                    <button on:click={hide} type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-900 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 dark:bg-slate-800 dark:text-slate-200 hover:dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Schließen</button>
                </div>
            </div>
        </div>
    </div>
{/if}