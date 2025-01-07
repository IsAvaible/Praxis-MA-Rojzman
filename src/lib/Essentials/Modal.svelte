<script lang="ts">
    import {createEventDispatcher, onMount} from "svelte";
    import {fade} from "svelte/transition";
    import fadeScale from "../../scripts/ui/transitionFadeScale";
    import {clickOutside} from "../../scripts/ui/clickOutside";
    import {unsavedChangesStore} from "../../scripts/stores/unsavedChangesStore";

    export let showCornerCloseButton: boolean = true;
    export let showMobileCloseButton: boolean = true;
    export let addSpacing: boolean = true;
    export let hideOnClickOutside: boolean = true;
    export let modalTopModal: boolean = false; // Whether the modal should be able to display over another modal (hacky)
    export let unsavedChangesCheck: boolean = true; // Whether the modal should display a confirm dialog if there are unsaved changes
    export let zIndex: number = 50;
    let open = true;

    let dispatch = createEventDispatcher();
    export const startHide = () => {
        if (unsavedChangesCheck && $unsavedChangesStore) {
            if (confirm('Auf dieser Seite liegen noch ungespeicherte Änderungen vor! Wollen sie die Seite trotzdem verlassen?')) {
                unsavedChangesStore.set(false);
            } else {
                return
            }
        }
        open = false;
        // the dispatch is delayed to allow the fade out transition to finish
        if (modalTopModal) {
            hide();
        }
    }

    const hide = () => {
        dialog.close();
        dispatch('hide', true);
    }

    let dialog;
    onMount(() => {
        dialog.showModal();
    })

    // Prevent default close on escape behaviour provided by the dialog, as it is handled by clickOutside
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
        }
    })
</script>


<!-- @component This is a general skeleton for modals (pop-ups) -->
<div class="inset-0 fixed h-full" style="z-index: {zIndex}" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <dialog bind:this={dialog} id="dialog" class="flex items-center justify-center w-screen  overflow-y-hidden {modalTopModal?'min-h-full':'pt-8 px-4 pb-20 min-h-screen'} text-center sm:block sm:p-0 bg-transparent dark:text-slate-200">
        {#if open}
        <div in:fade={{duration: 200}} out:fade|local={{duration: 300}} on:outroend={hide} class="fixed inset-0 {modalTopModal ? '' : 'bg-gray-500 dark:bg-slate-800 bg-opacity-75 dark:bg-opacity-75 transition-opacity'}" aria-hidden="true"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div use:clickOutside on:clickOutside={() => {if (hideOnClickOutside) {startHide()}}} in:fadeScale={{duration: 300*(modalTopModal?0:1), from: 1}} out:fadeScale|local={{duration: 200*(modalTopModal?0:1), from: 1, to: 0.95}}
             class="overflow-y-auto overflow-x-auto max-h-[90vh] scrollbar relative inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all
                     sm:align-middle sm:max-w-[80vw] lg:max-w-[70vw] {modalTopModal ? 'w-full':''} {addSpacing ? 'pl-1 max-sm:mt-12 sm:my-8 sm:px-3 lg:px-6 sm:py-3 lg:py-6' : 'm-0 p-0'}">
            {#if showCornerCloseButton}
                <div class="absolute top-0 right-0 pt-1 pr-1 mt-5 sm:mx-4">
                    <button on:click={() => startHide()} type="button" class="p-1 rounded-md
                    text-gray-400 hover:text-gray-500 hover:bg-gray-200 active:bg-gray-300 focus:text-gray-800
                    dark:text-slate-200 dark:hover:text-slate-100 dark:hover:bg-slate-700 dark:active:bg-slate-600 dark:focus:text-white">
                        <span class="sr-only">Schließen</span>
                        <!-- Heroicon name: outline/x -->
                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            {/if}
            <div class="sm:flex sm:items-start {addSpacing ? 'mx-5 my-5' : 'm-0 p-0'}">
                <slot/>
                {#if showMobileCloseButton}
                    <button on:click={startHide} type="button" class="sm:hidden mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-900 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 dark:bg-slate-800 dark:text-slate-200 hover:dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Schließen</button>
                {/if}
            </div>
        </div>
        {/if}
    </dialog>
</div>


<style>
    #dialog::backdrop {
        background-color: rgba(0, 0, 0, 0);
    }

    .scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #9499a1 #7e8288;
    }

    .scrollbar::-webkit-scrollbar {
        width: 10px;
        border-top-right-radius: inherit;
        border-bottom-right-radius: inherit;
    }

    .scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }

    .scrollbar::-webkit-scrollbar-thumb {
        background: #9499a1;
        border-radius: inherit;
    }

    .scrollbar::-webkit-scrollbar-thumb:hover {
        background: #7e8288;
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