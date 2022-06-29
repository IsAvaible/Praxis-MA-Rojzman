<script lang="ts">
    import Modal from "../../Essentials/Modal.svelte";
    import PageTitle from "../Navigation/PageTitle.svelte";
    import Alert from "../../Essentials/Alert.svelte";
    import {createEventDispatcher, onMount} from "svelte";

    let insertionCount = 0;
    let regex = /d=".+"/g;
    let selectedPaths;

    export let modalTopModal: boolean = false;
    export let iframeHeight: string = '50vh';

    const getPaths = (clipboard) => {
        selectedPaths = clipboard.match(regex).map(m => m.substring(3, m.length-1));
        return selectedPaths;
    }

    let dispatch = createEventDispatcher();
    const close = () => {
        dispatch('close');
    }
    const submit = () => {
        dispatch('submit', selectedPaths);
    }

    let contentElm;
    onMount(() => contentElm.scrollIntoView(false));

</script>

<Modal on:hide={close} modalTopModal={modalTopModal} unsavedChangesCheck={false}>
    <div bind:this={contentElm} class="flex flex-col flex-grow w-full sm:w-screen">
        <PageTitle titleAccent="Icon Selector" subTitle='Kopieren sie ein Icon als SVG aus der "Outline" Sektion und fügen sie es anschliessend mit dem untenstehenden Knopf ein.' showTitle={false}/>
        <iframe src="https://heroicons.com/" allow="clipboard-write" class="rounded-lg mb-4" style="min-height: {iframeHeight}"></iframe>
        {#key insertionCount}
            {#if insertionCount > 0}
                {#await navigator.clipboard.readText() then clipboard}
                    <div class="mx-auto flex group cursor-pointer" on:click={submit}>
                        <span class="inline-flex p-3 bg-primary-500 rounded-md shadow-lg w-fit group-hover:bg-primary-600">
                            <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                {#each getPaths(clipboard) as path}
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={path} />
                                {/each}
                            </svg>
                        </span>
                        <button class="ml-3 inline-flex font-medium rounded-md dark:border-2 border-white bg-primary-500 text-white p-3 transition dark:border-white group-hover:bg-primary-600">Bestätigen und schließen</button>
                    </div>
                {:catch e}
                    <Alert type={0} title="Fehler!" description="{e.message}"></Alert>
                {/await}
            {/if}
        {/key}
        <button on:click={() => insertionCount++} class="mt-4 mx-auto w-[50%] mb-4 flex justify-center font-medium text-white bg-primary-700 rounded-md border border-primary dark:border-none p-3 transition hover:bg-primary-800">Einfügen
            <svg class="ml-1 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        </button>
    </div>
</Modal>