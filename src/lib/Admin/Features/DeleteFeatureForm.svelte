<script>
    import {deleteFeature} from "../../../scripts/database/database.ts";
    import {createEventDispatcher} from "svelte";
    import FeatureCard from "../../Features/FeatureCard.svelte";
    import Alert from "../../Essentials/Alert.svelte";


    let submitted = false;
    export let feature;

    let dispatch = createEventDispatcher();
    const onModify = () => {
        dispatch('modification');
        return '';
    }
</script>


{#if feature.index !== -1}
    <form on:submit|preventDefault={() => submitted = true}>
        <FeatureCard {...feature.data}/>
        <button type="submit" class="mt-4 mx-auto w-[50%] mb-4 flex justify-center font-medium text-white bg-red-700 rounded-md border border-primary dark:border-none p-3 transition hover:bg-red-800">
            <svg class="mr-1 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Unwiderruflich Löschen
        </button>
    </form>
    {#if submitted}
        {#await deleteFeature(feature.data.name) then data}
            <Alert type={2} title="Erfolg!{onModify()}" description='Die Leistung mit dem Namen "{feature.data.name}" wurde erfolgreich gelöscht.'/>
        {:catch e}
            <Alert type={0} title="Error!" description={e.message}/>
        {/await}
    {/if}
{:else}
    <Alert type={0} title="Fehler!" description="Bitte wählen sie zuerst eine Leistung durch klicken aus."></Alert>
{/if}