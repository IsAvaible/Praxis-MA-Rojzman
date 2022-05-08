<script lang="ts">
    import {navigate} from "svelte-navigator";
    import {createEventDispatcher} from "svelte";

    export let name: string;
    export let title: string;
    export let shortDescription: string;
    export let longDescription: string = undefined;
    export let svgPaths: string[];
    export let centerSvg = true;

    let dispatch = createEventDispatcher();
    const popUpShow = () => {
        dispatch('popUpShow', true);
    }
</script>

<div class="pt-6 h-full">
    <div class="flow-root bg-gray-50 dark:bg-slate-800 rounded-lg px-6 pb-8 h-full flex">
        <div class="-mt-6">
            <div class="{centerSvg ? 'flex' : ''} items-center justify-center">
                <span class="inline-flex p-3 bg-primary-500 rounded-md shadow-lg">
                  <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      {#each svgPaths as path}
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={path} />
                      {/each}
                  </svg>
                </span>
            </div>
            <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight dark:text-slate-200">{title}</h3>
            <p class="mt-5 text-base text-gray-500 dark:text-slate-300">{shortDescription}</p>
        </div>
    </div>
    {#if longDescription} <!-- Long Description ID -->
        <div class="w-full flex justify-end -mt-7">
            <svg on:click={() => {navigate('leistungen/' + name, {state: {scroll: false}}); popUpShow()}} xmlns="http://www.w3.org/2000/svg" class="mr- h-6 w-6 text-gray-500 hover:text-gray-800 dark:text-slate-300 dark:hover:text-slate-100 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
    {/if}
</div>