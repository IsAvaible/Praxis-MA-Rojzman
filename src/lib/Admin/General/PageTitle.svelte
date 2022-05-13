<script lang="ts">
    export let title = 'Admin Tools:'
    export let titleAccent: string;
    export let subTitle: string = '';
    export let showTitle: boolean = true;
</script>

<div class="text-center w-full h-fit my-3 lg:my-10">
    <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-slate-100 sm:text-5xl md:text-6xl focus:outline-none">
        {#if showTitle}<span class="block xl:inline">{title} </span>{/if}
        <span class="block text-primary-600 xl:inline">{titleAccent}</span>
    </h1>
    <p class="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-slate-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">{subTitle}</p>
</div>