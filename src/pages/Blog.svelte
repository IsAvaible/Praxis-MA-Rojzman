<script lang="ts">
    import {getBlogEntries} from "../scripts/database/database";
    import {useParams} from "svelte-navigator";
    import {delay} from "../scripts/misc/delay";
    import {slide} from "svelte/transition";

    import BlogEntry from "../lib/Blog/BlogEntry.svelte";
    import Alert from "../lib/Essentials/Alert.svelte";
    import LoadingWheel from "../lib/Misc/LoadingWheel.svelte";
    import Footer from "../lib/Essentials/Footer.svelte";
    import disableScroll from "disable-scroll";
    import {get} from "svelte/store";
    import {bannerPushContentStore} from "../scripts/stores/bannerPushContentStore";

    let urlID;
    let showErrorAlertDialog = false;

    let params = useParams()
    const onBlogEntriesMount = () => {
        // Scroll Entry with ID from URL into view
        if ($params.id) {
            urlID = $params.id;
            let element = document.getElementById(urlID);
            if (element) {
                delay(170).then(() => {
                    disableScroll.on();
                    scrollToElement(element, true);
                    disableScroll.off();
                });
            } else {
                console.log(`Der Beitrag mit der ID "${urlID}" konnte nicht in der Datenbank gefunden werden.`)
                showErrorAlertDialog = true;
            }

        }
    }

    const scrollToElement = (element: HTMLElement, smooth: boolean) => {
        let elementPosition = element.getBoundingClientRect().top;
        // If the header will be visible, add offset
        let headerVisible = (elementPosition - document.body.getBoundingClientRect().top) < window.innerHeight;
        let headerOffset = headerVisible ? 80 : 0;
        // If the banner is visible add additional offset
        let bannerElement = document.getElementById("banner");
        if (bannerElement && get(bannerPushContentStore)) {
            let bannerHeight = bannerElement.getBoundingClientRect().height;
            elementPosition -= bannerHeight;
        }
        window.scrollBy({top: elementPosition - headerOffset, behavior: smooth ? "smooth" : "auto"});
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
        if (expandedEntryIndex == index) { // If a new entry is expanded set the url to the id of the new entry
            urlID = id;
            delay(0).then(() => {
                disableScroll.on();
                scrollToElement(document.getElementById(id), true);
                disableScroll.off();
                history.replaceState({}, '', `aktuelles/${id}`);
            });
        } else { // If the entry is collapsed, the URL is reset
            history.replaceState({}, '', 'aktuelles');
            urlID = undefined;
        }
    }

    const onParamsIdChange = (paramsId) => {
        if (urlID == paramsId) return;
        urlID = paramsId;
        if (!document.getElementById(urlID)) return;
        expandedEntryIndex = undefined;
        scrollToElement(document.getElementById(urlID), true);
    }

    $: onParamsIdChange($params.id);  // When the id in the url changes, the entry with the id is scrolled into view

</script>

<Footer><div class="relative">
<div class="mx-4 md:mx-10 min-h-[87vh] pt-2 my-10 px-4 sm:px-6 lg:px-8 2xl:max-w-[80%] 2xl:mx-auto rounded-lg shadow-2xl shadow-gray-300 dark:shadow-black flex flex-col items-center">
    <div class="w-full flex justify-center items-center flex-col my-2 border-b border-gray-200 md:border-none pb-2">
        <h1 class="mb-4 text-3xl sm:text-4xl tracking-tight text-slate-900 font-extrabold dark:text-slate-200 focus:outline-transparent">
            Aktuelles
        </h1>
        <p class="text-lg text-slate-700 dark:text-slate-400 text-center">
            Hier finden sie Neuigkeiten rund um aktuelle Gesundheitsthemen
        </p>
    </div>
    {#if showErrorAlertDialog}
        <div out:slide|local>
            <Alert type={1} title="Unbekannte ID" description={`Der Blog Beitrag mit der in der URL angegeben ID "${urlID}" konnte nicht gefunden werden.`}>
                <button class="text-yellow-700 text-sm ml-1 rounded-md bg-yellow-300 hover:bg-yellow-400 hover:text-yellow-800 dark:bg-yellow-200 dark:hover:bg-yellow-300 dark:hover:text-yellow-800 px-2" on:click={() => {showErrorAlertDialog = false}}>Ok.</button>
            </Alert>
        </div>
    {/if}
    <div class="max-w-[100rem] w-full flex flex-col justify-between gap-y-8">
        {#await getBlogEntries(false, undefined)}
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
                            <div class="w-full absolute {expanded ? '-bottom-3' : 'bottom-0'} rounded-md flex {expanded?'':'hidden'} lg:flex justify-end">
                                <a href={`aktuelles/${blogEntry.id}`} on:click|preventDefault|stopPropagation={() => onEntryExpandClick(blogEntry.id, i)} class="underline text-sm font-semibold dark:font-medium bg-white rounded-md pl-1 pt-1 dark:bg-slate-900">
                                Beitrag {expanded ? 'einklappen' : 'lesen'}
                                </a>
                            </div>
                        </div>
                    {:else}
                        <Alert type={1} title='Hinweis:' description='Es wurden noch keine Blog Einträge verfasst.'/>
                    {/each}
                </div>
            </div>
        {:catch e}
            <div class="h-[45vh] w-full flex items-center justify-center">
                <Alert type={1} title="Blog konnte nicht geladen werden." description="Wir konnten die angeforderten Daten nicht laden, überprüfen sie bitte ihre Internetverbindung."/>
            </div>
        {/await}
    </div>
</div>
</div></Footer>