<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import {fade} from "svelte/transition";
    import {circIn} from "svelte/easing";
    import {clickOutside} from "../../scripts/ui/clickOutside";
    import {unsavedChangesStore} from "../../scripts/stores/unsavedChangesStore";

    export let desktopCloseButton: boolean = true;
    export let hideOnClickOutside: boolean = true;
    export let modalTopModal: boolean = false; // Whether the modal should be able to display over another modal (hacky)
    export let unsavedChangesCheck: boolean = true; // Whether the modal should display a confirm dialog if there are unsaved changes
    export let zIndex: number = 50;
    let open = true;

    let dispatch = createEventDispatcher();
    const hide = () => {
        if (unsavedChangesCheck && $unsavedChangesStore) {
            if (confirm('Auf dieser Seite liegen noch ungespeicherte Änderungen vor! Wollen sie die Seite trotzdem verlassen?')) {
                unsavedChangesStore.set(false);
            } else {
                return
            }
        }
        open = false;
    }
</script>


<!-- @component This is a general skeleton for modals (pop-ups) -->
<div class="inset-0 fixed h-full" style="z-index: {zIndex}" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center {modalTopModal?'min-h-full':'pt-8 px-4 pb-20 min-h-screen'} text-center sm:block sm:p-0">
        {#if open}
        <div in:fade={{duration: 200, easing: circIn}} out:fade|local={{duration: 300}} on:outroend={()=>dispatch('hide', true)} class="fixed inset-0 bg-gray-500 dark:bg-slate-800 bg-opacity-75 dark:bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        {#if !modalTopModal}<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>{/if}

        <div use:clickOutside on:clickOutside={() => {if (hideOnClickOutside) {hide()}}} in:fade={{duration: 300*(modalTopModal?0:1)}} out:fade|local={{duration: 200*(modalTopModal?0:1), easing: circIn}}
             class="overflow-y-auto max-h-[90vh] scrollbar relative inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all
                    {modalTopModal?'':'sm:my-8'} sm:align-middle {modalTopModal?'max-w-[99.9%] min-h-full':'sm:max-w-[80%] xl:max-w-7xl'} sm:p-6">
            {#if desktopCloseButton}
                <div class="absolute top-0 right-0 pt-1 pr-1 mx-4 my-5">
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
        {/if}
    </div>
</div>


<style>
    .scrollbar::-webkit-scrollbar {
        width: 10px;
        border-top-right-radius: inherit;
        border-bottom-right-radius: inherit;
    }

    .scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }

    .scrollbar::-webkit-scrollbar-thumb {
        background: darkgray;
        border-radius: inherit
    }

    .scrollbar::-webkit-scrollbar-thumb:hover {
        background: gray;
    }

    @media (max-width: 640px) {
        /* hide scrollbar on mobile */
        .scrollbar::-webkit-scrollbar-thumb {
            background: transparent;
        }

        /* show scrollbar on scroll */
        .scrollbar::-webkit-scrollbar-thumb:active {
            width: 5px;
            background: darkgray;
        }
    }
</style>