<script lang="ts">
    import Modal from "../Essentials/Modal.svelte";
    import { createEventDispatcher } from "svelte";
    import { getFeature } from "../../scripts/database/database";
    import Alert from "../Essentials/Alert.svelte";
    import LoadingWheel from "../Misc/LoadingWheel.svelte";


    export let name;

    let dispatch = createEventDispatcher();
    const hide = () => {
        dispatch('hide', true);
        window.history.pushState({scroll: false}, '', '/leistungen');
    }
    document.onkeyup = (e) => {if (e.key == 'Escape') hide()}
</script>

<Modal on:hide={hide}>
    {#await getFeature(name)}
        <LoadingWheel showAfter="1000" size={17}/>
    {:then feature}
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-[80vw]">
            <div class="flex justify-center items-center w-full">
                <div class="flex items-center justify-center h-9 w-9 rounded-full bg-primary-100 dark:bg-primary-500 xl:h-10 xl:w-10">
                    <svg class="h-6 w-6 xl:h-8 xl:w-8 text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        {#each feature.svgPaths as path}
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={path} />
                        {/each}
                    </svg>
                </div>
                <h3 class="xl:text-4xl text-3xl text-gray-800 dark:text-slate-200 font-bold focus:outline-transparent uppercase ml-2" id="modal-title">{feature.title}</h3>
            </div>
            <div class="mt-4">
                {#if feature.longDescription}
                    <p class="ck-content">{@html feature.longDescription}</p>
                {:else}
                    <p class="text-center font-normal mb-2">{feature.shortDescription}</p>
                    <Alert type={1} title="Keine ausführliche Beschreibung vorhanden" description="Für diese Leistung ist leider keine ausführliche Beschreibung vorhanden."/>
                {/if}
            </div>
        </div>
    {:catch e}
        <Alert type={0} title="Fehler!" description='Wir konnten die Leistung mit dem Namen "{name}" nicht finden.'/>
    {/await}
</Modal>
