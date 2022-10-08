<script lang="ts">
    import Modal from "../../Essentials/Modal.svelte";
    import PageTitle from "../Navigation/PageTitle.svelte";
    import Alert from "../../Essentials/Alert.svelte";
    import {createEventDispatcher, onMount} from "svelte";

    let selectedPaths;

    export let modalTopModal: boolean = false;
    export let iframeHeight: string = '50vh';

    let insertionCount = 0;
    let svgFileInput: HTMLInputElement;
    let files: FileList;

    let svgPaths: string[] = [];
    let error: string = '';
    $: if (insertionCount > 0) {
        error = '';
        navigator.clipboard.readText().then(text => {
            svgPaths = getPaths(text);
        }).catch(e => {
            error = 'Failed to read clipboard';
        });
    }

    $: if (files && files.length > 0) {
        error = '';
        let file = files[0];
        let reader = new FileReader();
        reader.onload = (e) => {
            svgPaths = getPaths(e.target.result);
        };
        reader.onerror = (e) => {
            error = 'Failed to read file';
        };
        reader.readAsText(file);
    }

    const getPaths = (text) => {
        let regex = /d=".+?"/g;
        selectedPaths = text.match(regex).map(m => m.substring(3, m.length-1));
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
    onMount(() => {
        contentElm.scrollIntoView({block: "end", inline: "nearest"})
    });

</script>

<Modal on:hide={close} modalTopModal={modalTopModal} unsavedChangesCheck={false}>
    <div bind:this={contentElm} class="flex flex-col flex-grow w-full sm:w-screen">
        <PageTitle titleAccent="Icon Selector" subTitle='Kopieren sie ein Icon als SVG und fügen sie es anschliessend mit dem untenstehenden Knopf ein. Alternativ können sie auch eine .svg Datei nutzen.' showTitle={false}/>
        <iframe src="https://iconoir.com/" allow="clipboard-write" class="rounded-lg mb-4" title="Icon-Auswahl Webseite" style="min-height: {iframeHeight}"></iframe>
        {#if svgPaths && svgPaths.length > 0 || error}
            {#if error}
                <Alert type="0" title="Error!" description="{error}"/>
            {:else}
                <div class="mx-auto flex group cursor-pointer" on:click={submit}>
                    <span class="inline-flex p-3 bg-primary-500 rounded-md shadow-lg w-fit group-hover:bg-primary-600">
                        <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            {#each svgPaths as path}
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={path} />
                            {/each}
                        </svg>
                    </span>
                    <button class="ml-3 inline-flex font-medium rounded-md dark:border-2 border-white bg-primary-500 text-white p-3 transition dark:border-white group-hover:bg-primary-600">Bestätigen und schließen</button>
                </div>
            {/if}
        {/if}
        <button on:click={() => insertionCount++} class="mt-4 mx-auto w-[50%] flex justify-center font-medium text-white bg-primary-700 rounded-md border border-primary dark:border-none p-3 transition hover:bg-primary-800">
            Einfügen
            <svg class="ml-1 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        </button>
        <!--  When this button is clicked the user will be prompted to upload a svg file -->
        <!--  TODO: Recommend different Websites like https://feathericons.com/ or https://iconoir.com/ or https://heroicons.com/ -->
        <button on:click={() => svgFileInput.click()} class="mt-2 mx-auto w-[50%] flex justify-center font-medium text-white bg-primary-700 rounded-md border border-primary dark:border-none p-3 transition hover:bg-primary-800">
            Hochladen
            <input bind:this={svgFileInput} bind:files type="file" class="hidden" accept="image/svg+xml" >
            <svg class="ml-1 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-width="2" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
        </button>
    </div>
</Modal>