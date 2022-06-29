<script lang="ts">
    import BlogEntry from "../lib/Blog/BlogEntry.svelte";
</script>


<div class="mx-4 md:mx-10 min-h-[87vh] pt-2 my-10 px-4 sm:px-6 lg:px-8 2xl:max-w-[80%] 2xl:mx-auto rounded-lg shadow-2xl shadow-gray-300 dark:shadow-black flex flex-col items-center">
    <div class="w-full flex justify-center items-center flex-col my-2 border-b border-gray-200 md:border-none pb-2">
        <h1 class="mb-4 text-3xl sm:text-4xl tracking-tight text-slate-900 font-extrabold dark:text-slate-200">
            Aktuelles
        </h1>
        <p class="text-lg text-slate-700 dark:text-slate-400 text-center">
            Hier finden sie Neuigkeiten rund um aktuelle Gesundheitsthemen
        </p>
    </div>
    <div class="max-w-[100rem] w-full flex flex-col justify-between gap-y-8">
        {#each Array(5) as entry}
            <BlogEntry/>
        {/each}
    </div>
</div>
