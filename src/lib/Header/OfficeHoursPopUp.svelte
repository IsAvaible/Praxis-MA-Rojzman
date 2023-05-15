<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    import {navigate} from "svelte-navigator";
    import OfficeHours from "../Misc/OfficeHours.svelte";
    import Modal from "../Essentials/Modal.svelte";
    // import Modal from "../Essentials/Modal.svelte";

    let dispatch = createEventDispatcher();

    function hide() {
        dispatch('hide', true);
    }

    let modal;
</script>

<Modal bind:this={modal} showCornerCloseButton={false} showMobileCloseButton={false} addSpacing={false} on:hide={hide}>
    <div class="block sm:w-[32rem]" id="office-hours-popup">
        <OfficeHours/>
        <div class="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex justify-end">
            <button on:click={() => {navigate("/kontakt"); modal.startHide()}} type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm sm:order-2">Kontakt</button>
            <button on:click={modal.startHide()} type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-900 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 dark:bg-slate-800 dark:text-slate-200 hover:dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Schließen</button>
        </div>
    </div>
</Modal>