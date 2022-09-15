<script lang="ts">
import {navigate} from "svelte-navigator";
import {getBlogEntries} from "../../scripts/database/database.ts";

const prettifyDate = (date: Date) => {
    let day, month, year;
    [day, month, year] = date.toLocaleTimeString('de-DE', { year: 'numeric', month: 'short', day: 'numeric' }).replace(/[.,]/g, '').split(' ');
    return `${day}. ${month}, ${year}`;
}

</script>

<!-- This example requires Tailwind CSS v2.0+ -->
<div class="pt-16 pb-10 lg:pt-24 lg:px-8">
    <div class="relative divide-y-2 divide-gray-200">
        <div>
            <h2 class="text-3xl tracking-tight font-extrabold text-primary-600 dark:text-slate-100 sm:text-4xl">Unsere neusten Beiträge</h2>
            <p class="mt-3 text-xl text-gray-500 sm:mt-4 dark:text-slate-200">In unsere Kategorie <span on:click={() => navigate("/aktuelles")} class="cursor-pointer hover:text-gray-800 dark:hover:text-slate-100">"Aktuelles"</span> halten wir sie stets über Neuigkeiten rund um die Praxis und Gesundheit auf dem Laufenden.</p>
        </div>
        <div class="mt-12 grid gap-16 pt-12 md:grid-cols-2 2xl:grid-cols-4 lg:gap-x-5 lg:gap-y-12">
            {#await getBlogEntries(false, 4) then blogEntries}
                {#each blogEntries as entry, i}
                    <a on:click|preventDefault={() => navigate(`/aktuelles/${entry.id}`)} href={`/aktuelles/${entry.id}`} class="shadow-md hover:shadow-lg rounded-md p-4 {i > 2?'hidden':''} md:flex flex-col"> <!-- Only show 3 posts on small devices -->
                        <div class="justify-center">
                            <span class="sr-only">Bild des Beitrags</span>
                            <img loading="lazy" alt="" class="object-cover rounded-lg w-full bg-primary-300" src="{entry.previewImageUrl || 'assets/DefaultMissingImage.svg'}">
                        </div>
                        <div class="mt-3 mb-5 flex-1">
                            <p class="text-xl font-semibold text-gray-900 dark:text-slate-100">{entry.title}</p>
                            <p class="mt-3 text-base text-gray-500 dark:text-slate-200">{entry.previewText}</p>
                        </div>
                        <div class="flex space-x-1 text-sm text-gray-500 dark:text-slate-400">
                            <time datetime="{entry.createdAt.toISOString().split('T')[0]}"> {prettifyDate(entry.createdAt)} </time>
                            <span aria-hidden="true"> &middot; </span>
                            <span> x Min. Lesezeit</span>
                        </div>
                    </a>
                {/each}
            {/await}
        </div>
    </div>
</div>