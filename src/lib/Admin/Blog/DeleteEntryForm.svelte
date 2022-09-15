<script>
    import {deleteBlogEntry} from "../../../scripts/database/database.ts";
    import {createEventDispatcher} from "svelte";
    import Alert from "../../Essentials/Alert.svelte";
    import BlogEntryComponent from "../../Blog/BlogEntry.svelte";


    let submitted = false;
    export let blogEntry;

    let dispatch = createEventDispatcher();
    const onModify = () => {
        dispatch('modification');
        return '';
    }
</script>


<form on:submit|preventDefault={() => submitted = true}>
    <BlogEntryComponent {...blogEntry}/>
    <button type="submit" class="mt-4 mx-auto w-[50%] mb-4 flex justify-center font-medium text-white bg-red-700 rounded-md border border-primary dark:border-none p-3 transition hover:bg-red-800">
        <svg class="mr-1 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Unwiderruflich Löschen
    </button>
</form>
{#if submitted}
    {#await deleteBlogEntry(blogEntry.id) then data}
        <Alert type={2} title="Erfolg!{onModify()}" description='Der Beitrag mit der ID "{blogEntry.id}" und dem Titel "{blogEntry.title}" wurde erfolgreich gelöscht.'/>
    {:catch e}
        <Alert type={0} title="Error!" description={e.message}/>
    {/await}
{/if}