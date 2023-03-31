<script lang="ts">
    import {clickOutside} from "../../scripts/ui/clickOutside";
    import {createEventDispatcher} from 'svelte';
    import {navigate} from "svelte-navigator";
    import {fade} from "svelte/transition";
    import OfficeHours from "../Misc/OfficeHours.svelte";
    // import Modal from "../Essentials/Modal.svelte";

    let dispatch = createEventDispatcher();

    function hide() {
        dispatch('hide', true);
    }
    document.onkeyup = (e) => {if (e.key == 'Escape') hide()}
</script>

<!--<Modal on:hide={hide}>-->
<!--    <div class="relative inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">-->
<!--        <OfficeHours/>-->
<!--        <div class="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex justify-end">-->
<!--            <button on:click={() => {navigate("/kontakt"); hide()}} type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm">Kontakt</button>-->
<!--            <button on:click={hide} type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-900 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 dark:bg-slate-800 dark:text-slate-200 hover:dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Schließen</button>-->
<!--        </div>-->
<!--    </div>-->
<!--</Modal>-->
<div in:fade={{duration: 300}} out:fade|local={{duration: 300}} class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-slate-800 dark:bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div use:clickOutside on:clickOutside={hide} class="relative inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <OfficeHours/>
            <div class="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex justify-end">
                <button on:click={() => {navigate("/kontakt"); hide()}} type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm">Kontakt</button>
                <button on:click={hide} type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-900 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 dark:bg-slate-800 dark:text-slate-200 hover:dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Schließen</button>
            </div>
        </div>
    </div>
</div>