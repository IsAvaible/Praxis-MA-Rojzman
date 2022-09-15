<script lang="ts">
    import {getBlogEntries} from "../scripts/database/database.ts";
    import {navigate, useParams} from "svelte-navigator";
    import {delay} from "../scripts/misc/delay";
    import {slide} from "svelte/transition";
    import {prefersReducedMotionStore} from "../scripts/stores/prefersReducedMotionStore";

    import BlogEntry from "../lib/Blog/BlogEntry.svelte";
    import Alert from "../lib/Essentials/Alert.svelte";
    import LoadingWheel from "../lib/Misc/LoadingWheel.svelte";
    import Footer from "../lib/Essentials/Footer.svelte";

    let urlID;
    let showErrorAlertDialog = false;

    let prefersReducedMotion;
    prefersReducedMotionStore.subscribe(b => prefersReducedMotion = b);

    let params = useParams()
    const onBlogEntriesMount = () => {
        // Scroll Entry with ID from URL into view
        if ($params.id) {
            urlID = $params.id;
            let element = document.getElementById(urlID);
            if (element) {
                delay(50).then(() => scrollToElement(element));
            } else {
                console.log(`Der Beitrag mit der ID "${urlID}" konnte nicht in der Datenbank gefunden werden.`)
                showErrorAlertDialog = true;
            }

        }
    }

    const scrollToElement = (element: HTMLElement) => {
        let elementPosition = element.getBoundingClientRect().top;
        delay(50).then(() => window.scrollBy({top: elementPosition - 65, behavior: "smooth"}));
    }

    let expandedEntryIndex: number = undefined;
    const toggleEntryExpand = (id: string, index: number) => {
        if (urlID == id || expandedEntryIndex == index) {
            expandedEntryIndex = -1
        } else {
            expandedEntryIndex = index;
        }
    }

    const onEntryExpandClick = (id: string, index: number) => {
        toggleEntryExpand(id, index);
        // The history state is replaced to prevent users from having to click back multiple times
        if (expandedEntryIndex == index) {
            history.replaceState({}, '', `aktuelles/${id}`)
            urlID = id;
            delay(0).then(() => scrollToElement(document.getElementById(id)));
        } else {
            history.replaceState({}, '', 'aktuelles')
            urlID = undefined;
        }
    }
</script>

<Footer><div class="relative">
<div class="mx-4 md:mx-10 min-h-[87vh] pt-2 my-10 px-4 sm:px-6 lg:px-8 2xl:max-w-[80%] 2xl:mx-auto w-full rounded-lg shadow-2xl shadow-gray-300 dark:shadow-black flex flex-col items-center">
    <div class="w-full flex justify-center items-center flex-col my-2 border-b border-gray-200 md:border-none pb-2">
        <h1 class="mb-4 text-3xl sm:text-4xl tracking-tight text-slate-900 font-extrabold dark:text-slate-200">
            Aktuelles
        </h1>
        <p class="text-lg text-slate-700 dark:text-slate-400 text-center">
            Hier finden sie Neuigkeiten rund um aktuelle Gesundheitsthemen
        </p>
    </div>
    {#if showErrorAlertDialog}
        <div out:slide|local>
            <Alert type={1} title="Unbekannte ID" description={`Der Blog Beitrag mit der in der URL angegeben ID "${urlID}" konnte nicht gefunden werden.`}>
                <button class="text-yellow-700 text-sm font-bold underline ml-1" on:click={() => showErrorAlertDialog = false}>Ok.</button>
            </Alert>
        </div>
    {/if}
    <div class="max-w-[100rem] w-full flex flex-col justify-between gap-y-8">
        {#await getBlogEntries()}
            <div class="w-full flex justify-center">
                <LoadingWheel size={25} showAfter={1000}/>
            </div>
        {:then blogEntries}
            <div role="list" aria-label="Blog Einträge" class="md:flex items-center flex-wrap sm:justify-around mx-10">
                <div class="w-full divide-gray-200 divide-y dark:divide-slate-700">
                    {#each blogEntries as blogEntry, i}
                        <!--Defines a scoped constant only valid within the each block-->
                        {@const expanded = (expandedEntryIndex === undefined ? blogEntry.id === urlID : expandedEntryIndex === i)}
                        <div class="mb-10 pt-10 relative {(expanded ? '':'cursor-pointer')}" on:click={() => {if (!expanded) {onEntryExpandClick(blogEntry.id, i)}}}
                             id={blogEntry.id}>
                            <BlogEntry {...blogEntry} expanded={expanded} on:mount={() => {if (i === blogEntries.length-1) onBlogEntriesMount()}}/>
                            <div class="w-full absolute bottom-0 rounded-md flex justify-end">
                                <a href={`aktuelles/${blogEntry.id}`} on:click|preventDefault|stopPropagation={() => onEntryExpandClick(blogEntry.id, i)} class="underline text-sm">
                                Beitrag {(expanded) ? 'einklappen' : 'lesen'}
                                </a>
                            </div>
                        </div>
                    {:else}
                        <Alert type={1} title='Hinweis:' description='Es wurden noch keine Blog Einträge verfasst.'/>
                    {/each}
                </div>
            </div>
        {:catch e}
            <Alert type={0} title="Blog konnte nicht geladen werden!" description="Error: {e.message}"/>
        {/await}
    </div>
</div>
</div></Footer>