<script lang="ts">
    import {fade} from "svelte/transition";
    import {createEventDispatcher} from "svelte";
    import {navigate} from "svelte-navigator";
    import {clickOutside} from "../../../scripts/ui/clickOutside";
    import {getUser, signOut} from "../../../scripts/database/database";

    let dispatch = createEventDispatcher();
    function hide() {
        dispatch('hide', true);
    }

    export let links;
    export let activeLinkIndex;
</script>

<!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
<div class="fixed flex z-20 md:hidden w-full p-4" role="dialog" aria-modal="true">
    <!--
      Off-canvas menu overlay
    -->
    <div in:fade={{duration: 300}} out:fade|local={{duration: 300}} class="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>

    <!--
      Off-canvas menu, show/hide based on off-canvas menu state.
    -->
    <div in:fade={{duration: 300}} out:fade|local={{duration: 300}}  use:clickOutside on:clickOutside={hide} class="rounded-lg z-20 flex flex-col min-w-full mx-auto bg-white dark:bg-slate-800">
        <!--
          Close button, show/hide based on off-canvas menu state.
        -->
        <div class="absolute top-8 right-8 z-50">
            <button on:click={hide} type="button" class="bg-white dark:bg-transparent rounded-md p-2 inline-flex items-center justify-center text-gray-500 dark:text-slate-300 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                <span class="sr-only">Close sidebar</span>
                <!-- Heroicon name: outline/x -->
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div class="relative flex-1 h-0 pt-5 pb-4 min-w-full mx-auto overflow-y-auto">
            <div class="flex-shrink-0 flex items-center px-4">
                <img class="h-8 w-auto" src="assets/favicon.svg" alt="Logo">
                <p class="font-bold text-2xl ml-3 dark:text-slate-100 text-gray-800">Admin</p>
            </div>
            <nav class="mt-5 px-2 space-y-1">
                <!-- Current: "bg-gray-100 text-gray-900", Default: "text-gray-600 hover:bg-gray-50 hover:text-gray-900" -->
                {#each links as link, i}
                    <a href={link.link} on:click|preventDefault={() => {navigate(link.link, {state: {scroll: false}}); hide()}} class="{activeLinkIndex === i ? 'bg-gray-100 text-gray-900 dark:bg-slate-600 dark:text-slate-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-200 dark:hover:bg-slate-700'} cursor-pointer group flex items-center px-2 py-2 text-base font-medium rounded-md">
                        <svg class="{activeLinkIndex === i ? 'text-gray-500 dark:text-slate-300' : 'text-gray-400 group-hover:text-gray-500 dark:text-slate-300 dark:group-hover:text-slate-300'} mr-4 flex-shrink-0 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            {#each link.svgPaths as path}
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={path} />
                            {/each}
                        </svg>
                        {link.title}
                    </a>
                {/each}
            </nav>
        </div>
        <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div class="flex-shrink-0 w-full group block">
                <div class="flex items-center">
                    <div>
                        <img class="inline-block h-9 w-9 rounded-full" src="https://images.unsplash.com/photo-1651232881282-7bbbbb81e067?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80" alt="">
                    </div>
                    <div class="ml-3">
                        {#await getUser() then user}
                            <p class="text-sm font-medium text-gray-700 group-hover:text-gray-800 dark:text-slate-200 dark:group-hover:text-slate-200">{user.email}</p>
                        {/await}
                        <button on:click={() => signOut().then(() => navigate('admin/login'))} class="text-xs font-medium text-gray-500 group-hover:text-gray-700 cursor-pointer dark:text-slate-300 dark:group-hover:text-slate-200">Ausloggen</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="flex-shrink-0 w-14">
        <!-- Force sidebar to shrink to fit close icon -->
    </div>
</div>