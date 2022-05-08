<script lang="ts">
import {navigate} from "svelte-navigator";

let blogPosts: { date: Date; imgLink: string; readTime: number; title: string; content: string }[4] = [
    {title: 'Flüchtlingshilfe in Zeiten des Ukrainekriegs', content: 'Nullam risus blandit ac aliquam justo ipsum. Quam mauris volutpat massa dictumst amet. Sapien tortor lacus arcu.', date: new Date(Date.UTC(2022, 3, 20)), readTime: 4, imgLink: ''},
    {title: 'Aktuelle COVID-19 Maßnahmen', content: 'Nullam risus blandit ac aliquam justo ipsum. Quam mauris volutpat massa dictumst amet. Sapien tortor lacus arcu.', date: new Date(Date.UTC(2022, 1, 11)), readTime: 2, imgLink: ''},
    {title: 'Brustkrebs frühzeitig erkennen', content: 'Nullam risus blandit ac aliquam justo ipsum. Quam mauris volutpat massa dictumst amet. Sapien tortor lacus arcu.', date: new Date(Date.UTC(2021, 11, 25)), readTime: 6, imgLink: ''},
    {title: 'Empfehlungen für Diabetiker', content: 'Nullam risus blandit ac aliquam justo ipsum. Quam mauris volutpat massa dictumst amet. Sapien tortor lacus arcu.', date: new Date(Date.UTC(2021, 11, 25)), readTime: 6, imgLink: ''},
]

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
        <div class="mt-12 grid gap-16 pt-12 lg:grid-cols-2 2xl:grid-cols-4 lg:gap-x-5 lg:gap-y-12">
            {#each blogPosts as post, i}
                <div class="{i > 2?'hidden':''} lg:block"> <!-- Only show 3 posts on small devices -->
                    <a href="#" class="block mt-4">
                        <p class="text-xl font-semibold text-gray-900 dark:text-slate-100">{post.title}</p>
                        <p class="mt-3 text-base text-gray-500 dark:text-slate-200">{post.content}</p>
                    </a>
                    <div class="mt-6 flex items-center">
                        <div class="flex-shrink-0">
                            <span class="sr-only">Bild des Beitrags</span>
                            <img loading="lazy" alt="" class="h-10 w-10 rounded-full" src="{post.imgLink || 'assets/DefaultMissingImage.svg'}">
                        </div>
                        <div class="ml-3">
                            <div class="flex space-x-1 text-sm text-gray-500 dark:text-slate-400">
                                <time datetime="{post.date.toISOString().split('T')[0]}"> {prettifyDate(post.date)} </time>
                                <span aria-hidden="true"> &middot; </span>
                                <span> {post.readTime} Min. Lesezeit</span>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>