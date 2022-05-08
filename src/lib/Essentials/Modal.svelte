<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";
    import {circIn} from "svelte/easing";
    import {clickOutside} from "../../utilities/clickOutside.ts";

    export let desktopCloseButton: boolean = true;
    export let hideOnClickOutside: boolean = true;
    export let modalTopModal = false; // Whether the modal

    let dispatch = createEventDispatcher();
    const hide = () => {
        dispatch('hide', true);
    }
</script>


<!-- @component This is a general skeleton for modals (pop-ups) -->
<div class="z-50 inset-0 overflow-y-scroll fixed" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center {modalTopModal?'min-h-full':'pt-4 px-4 pb-20 min-h-screen'} text-center sm:block sm:p-0">
        <div in:fade={{duration: 200, easing: circIn}} out:fade={{duration: 300}} class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        {#if !modalTopModal}<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>{/if}

        <div use:clickOutside on:click_outside={() => {if (hideOnClickOutside) {hide()}}} in:fade={{duration: 300*(modalTopModal?0:1)}} out:fade={{duration: 200*(modalTopModal?0:1), easing: circIn}} class="relative inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all {modalTopModal?'':'sm:my-8'} sm:align-middle {modalTopModal?'max-w-[99.9%] min-h-full':'sm:max-w-[80%] xl:max-w-7xl'} sm:p-6">
            {#if desktopCloseButton}
                <div class="hidden sm:block absolute top-0 right-0 pt-4 mx-4 my-5">
                    <button on:click={() => hide()} type="button" class="rounded-md text-gray-400 hover:text-gray-500 focus:text-gray-800 dark:text-slate-200 dark:hover:text-slate-100 dark:focus:text-white">
                        <span class="sr-only">Close</span>
                        <!-- Heroicon name: outline/x -->
                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            {/if}
            <div class="sm:flex mx-4 my-5 sm:items-start">
                <slot/>
                <button on:click={hide} type="button" class="sm:hidden mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-900 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 dark:bg-slate-800 dark:text-slate-200 hover:dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Schließen</button>
            </div>
        </div>
    </div>
</div>