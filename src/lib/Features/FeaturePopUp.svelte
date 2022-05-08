<script lang="ts">
    import Modal from "../Essentials/Modal.svelte";
    import { createEventDispatcher } from "svelte";
    import { getFeature } from "../../supabase/database.ts";
    import Alert from "../Essentials/Alert.svelte";


    export let name;

    let dispatch = createEventDispatcher();
    const hide = () => {
        dispatch('hide', true);
        window.history.pushState({scroll: false}, '', '/leistungen');
    }
    document.onkeyup = (e) => {if (e.key == 'Escape') hide()}
</script>

<Modal on:hide={hide}>
    {#await getFeature(name) then feature}
        <div class="mx-auto absolute flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-500 sm:mx-0 sm:h-10 sm:w-10">
            <!-- Heroicon name: outline/exclamation -->
            <svg class="h-6 w-6 text-primary-600 dark:text-primary-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {#each feature.svgPaths as path}
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={path} />
                {/each}
            </svg>
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-[80vw]">
            <h3 class="xl:text-4xl text-3xl text-center text-gray-800 dark:text-slate-200 font-bold sm:w-4/6 w-5/6 mx-auto focus:outline-transparent uppercase" id="modal-title">{feature.title}</h3>
            <div class="mt-4">
                <p class="ck-content">{@html feature.longDescription}</p>
            </div>
        </div>
    {:catch e}
        <Alert type={0} title="Fehler!" description='Wir konnten die Leistung mit dem Namen "{name}" nicht finden.'/>
    {/await}
</Modal>
