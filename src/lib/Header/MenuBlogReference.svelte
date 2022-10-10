<script lang="ts">
import {navigate} from "svelte-navigator";
import {getBlogEntries} from "../../scripts/database/database.js";
import {createEventDispatcher} from "svelte";
import {fade} from "svelte/transition";

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
            {#await getBlogEntries(false, 3) then entries}
                {#each entries as entry}
                    <li class="text-base truncate" in:fade={{duration: 200}}>
                        <span on:click={() => {navigate("/aktuelles/" + entry.id); onNavigate()}} class="cursor-pointer font-medium text-gray-900 hover:text-gray-600 dark:text-slate-200 dark:hover:text-slate-50"> {entry.title} </span>
                    </li>
                {/each}
            {/await}
        </ul>
    </div>
    <div class="mt-5 text-sm">
        <span on:click={() => {navigate("/aktuelles"); onNavigate()}} class="cursor-pointer font-medium text-primary-600 dark:text-primary-500 hover:text-primary-800 dark:hover:text-primary-600"> Alle Beiträge anzeigen <span aria-hidden="true">&rarr;</span></span>
    </div>
</div>