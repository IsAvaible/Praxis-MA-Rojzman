<script lang="ts">
import PageTitle from "../../lib/Admin/Navigation/PageTitle.svelte";
import { getBlogEntries } from "../../scripts/database/database";
import { fade } from "svelte/transition";
import LoadingWheel from "../../lib/Misc/LoadingWheel.svelte";
import Alert from "../../lib/Essentials/Alert.svelte";
import BlogEntryComponent from "../../lib/Blog/BlogEntry.svelte";
import Modal from "../../lib/Essentials/Modal.svelte";
import AddEntryForm from "../../lib/Admin/Blog/AddEntryForm.svelte";
import DeleteEntryForm from "../../lib/Admin/Blog/DeleteEntryForm.svelte";
import BlogEntryOutline from "../../lib/Admin/Blog/BlogEntryOutlines.svelte";


let options = [
    {title: 'Neuen Beitrag Hinzufügen', shortDescription: 'Fügen sie einen neuen Beitrag hinzu.', svgPaths: ['M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z']},
    {title: 'Beitrag Bearbeiten', shortDescription: 'Editieren sie den ausgewählten Beitrag.', svgPaths: ['M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z']},
    {title: 'Löschen Bestätigen', shortDescription: 'Wollen sie den ausgewählten Beitrag wirklich löschen?', svgPaths: ['M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0']},
];

let currentHover: number = -1;
let activeOption: number = -1;
let currentEntry = undefined;
let expandedEntryIndex: number = -1;
let refreshEntries = 0; // Refresh blog entries on increment
let modification = false; // Whether the current blog entry was modified

const expandEntry = (index: number) => {
    if (expandedEntryIndex == index) {
        expandedEntryIndex = -1
    } else {
        expandedEntryIndex = index;
    }
}


const addEntry = () => {
    currentEntry = undefined;
    activeOption = 0;
}


const editEntry = (blogEntry) => {
    currentEntry = blogEntry;
    activeOption = 1;
}

const deleteEntry = (blogEntry) => {
    currentEntry = blogEntry;
    activeOption = 2;
}
</script>


{#if activeOption !== -1}
    <Modal on:hide={() => {activeOption = -1; if (modification) refreshEntries++; modification = false; currentEntry=undefined}}>
        <div class="flex flex-col">
            <PageTitle titleAccent="{options[activeOption].title}" subTitle={options[activeOption].shortDescription} showTitle={false}/>
            {#if activeOption === 0}
                <AddEntryForm on:modification={() => modification=true}/>
            {:else if activeOption === 1}
                <AddEntryForm editMode={true} {...currentEntry} on:modification={() => modification=true}/>
            {:else if activeOption === 2}
                <DeleteEntryForm blogEntry={currentEntry} on:modification={() => modification=true}/>
            {/if}
        </div>
    </Modal>
{/if}
<div class="flex flex-col mx-1 sm:mx-auto w-full">
    <PageTitle titleAccent="Aktuelles" subTitle='Über die unteren Kontrolleinheiten können Beiträge in der "Aktuelles" Sektion hinzugefügt, geändert und gelöscht werden.'/>

    {#key refreshEntries}
        {#await getBlogEntries(true)}
            <div class="w-full flex justify-center">
                <LoadingWheel size={25} showAfter={1000}/>
            </div>
        {:then blogEntries}
            <div role="list" aria-label="Blog Einträge" class="md:flex items-center flex-wrap sm:justify-around mx-10">
                <div class="w-full divide-gray-200 divide-y-4 dark:divide-slate-700 my-4 mx-4 lg:my-10">
                    <div class="w-full divide-gray-200 divide-y dark:divide-slate-700">
                        {#each blogEntries as blogEntry, i}
                            <div class="relative group py-4" on:mouseenter={() => currentHover = i} on:mouseleave={() => currentHover = -1}>
                                <BlogEntryComponent {...blogEntry} expanded={expandedEntryIndex === i}/>
                                {#if currentHover === i}
                                    <div in:fade={{duration: 200}} out:fade|local={{duration: 200}} class="absolute ml-auto mr-auto top-0 left-0 z-10 w-full h-full bg-gray-500 dark:bg-slate-600 {expandedEntryIndex === i ? 'bg-opacity-10 dark:bg-opacity-10' : 'bg-opacity-25 dark:bg-opacity-25'} rounded-lg transition-opacity">
                                        <div class="flex h-full items-center justify-center max-w-3xl mx-auto text-white {i === blogEntries.length ? '' : 'mb-2'}">
                                            <div class="has-tooltip mx-4">
                                                <button on:click={() => expandEntry(i)} class="h-9 w-9 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white dark:ring-slate-900 hover:bg-primary-600 cursor-pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6p" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                    <span class="sr-only">Artikel Lesen</span>
                                                </button>
                                                <div class="tooltip absolute mt-1 -ml-9 z-10 py-2 px-3 flex opacity-90 text-sm font-medium text-black rounded-lg shadow bg-white dark:text-slate-200 dark:bg-slate-700">
                                                    Artikel Lesen
                                                </div>
                                            </div>
                                            <div class="has-tooltip mx-4">
                                                <button on:click={() => editEntry(blogEntry)} class="h-9 w-9 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white dark:ring-slate-900 hover:bg-primary-600 cursor-pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    <span class="sr-only">Bearbeiten</span>
                                                </button>
                                                <div class="tooltip absolute mt-1 -ml-7 z-10 py-2 px-3 flex opacity-90 text-sm font-medium text-black rounded-lg shadow bg-white dark:text-slate-200 dark:bg-slate-700">
                                                    Bearbeiten
                                                </div>
                                            </div>
                                            <div class="has-tooltip mx-4">
                                                <button on:click={() => deleteEntry(blogEntry)} class="h-9 w-9 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white dark:ring-slate-900 hover:bg-primary-600 cursor-pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    <span class="sr-only">Löschen</span>
                                                </button>
                                                <div class="tooltip absolute mt-1 -ml-5 z-10 py-2 px-3 flex opacity-90 text-sm font-medium text-black rounded-lg shadow bg-white dark:text-slate-200 dark:bg-slate-700">
                                                    Löschen
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        {:else}
                            <Alert type={1} title='Hinweis:' description='Es wurden noch keine Blog Einträge verfasst.'/>
                        {/each}
                    </div>
                    <div class="mt-12 pt-12">
                        <div class="overflow-hidden group relative">
                            <div class="blur-sm m-1">
                                <BlogEntryOutline/>
                            </div>
                            <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                <button on:click={() => addEntry()} class="font-medium text-black rounded-full shadow bg-white dark:text-slate-200 dark:bg-slate-700 p-4 hover:shadow-lg flex items-center cursor-pointer focus:ring-1 ring-gray-400 dark:ring-slate-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    Beitrag Hinzufügen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {:catch e}
            <Alert type={0} title="Blog konnte nicht geladen werden!" description="Error: {e.message}"/>
        {/await}
    {/key}
</div>