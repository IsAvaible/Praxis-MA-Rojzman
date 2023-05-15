<script lang="ts">
    import {navigate} from "svelte-navigator";
    import {getBlogEntries} from "../../scripts/database/database.js";
    import {createEventDispatcher} from "svelte";
    import DarkModeToggle from "../Misc/DarkModeToggle.svelte";
    import Alert from "../Essentials/Alert.svelte";

    let dispatch = createEventDispatcher();
const onNavigate = () => {
    dispatch("navigate");
}
</script>

<!-- This references entries from the Blog section (/aktuelles) -->
<div class="md:px-5 md:py-5 md:bg-gray-50 md:dark:bg-slate-800">
    <div>
        <h3 class="text-sm tracking-wide font-medium text-gray-500 uppercase dark:text-slate-200">Neueste Beiträge</h3>
        <ul class="mt-4 space-y-4">
            {#await getBlogEntries(false, 3)}
                {#each Array(3) as _}
                    <li class="text-base truncate showDelayed">
                        <p class="font-medium text-gray-900 hover:text-gray-600 dark:text-slate-200 dark:hover:text-slate-50 animate-pulse"> Loading... </p>
                    </li>
                {/each}
            {:then entries}
                {#each entries as entry}
                    <li class="text-base truncate">
                        <a href={"/aktuelles/" + entry.id} on:click|preventDefault={() => {navigate("/aktuelles/" + entry.id); onNavigate()}} class="cursor-pointer font-medium text-gray-900 hover:underline dark:text-slate-200"> {entry.title} </a>
                    </li>
                {/each}
            {:catch e}
                <li class="text-base truncate">
                    <Alert type={1} title="Beiträge konnten nicht geladen werden." description=''/>
                </li>
            {/await}
        </ul>
    </div>
    <div class="mt-5 text-sm flex items-center">
        <a href="/aktuelles" on:click|preventDefault={() => {navigate("/aktuelles"); onNavigate()}} class="cursor-pointer font-medium text-primary-600 dark:text-primary-500 hover:underline"> Alle Beiträge anzeigen <span aria-hidden="true">&rarr;</span></a>
        <div class="flex justify-end gap-4" style="flex-grow: 1">
            <DarkModeToggle/>
        </div>
    </div>
</div>