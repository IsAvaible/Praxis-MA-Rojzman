<script lang="ts">
    import MobileMenu from "./MobileMenu.svelte";
    import {globalHistory, navigate} from "svelte-navigator";
    import {signOut} from "../../../supabase/database.ts";
    import {validateAuthentication} from "../../../utilities/validateAuthentication.ts";
    let user = validateAuthentication();

    let mobileMenuOpen = false;
    const toggleMobileMenu = () => {
        mobileMenuOpen = !mobileMenuOpen;
    }

    let links: {title: string, link: string, svgPaths: string[]}[] =
        [{title: 'Übersicht', link: 'admin', svgPaths: ['M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6']},
        {title: 'Leistungen', link: 'admin/leistungen', svgPaths: ['M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z']},
        {title: 'Aktuelles', link: 'admin/aktuelles', svgPaths: ['M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z']},
        {title: 'Team', link: 'admin/team', svgPaths: ['M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z']},
        {title: 'Texte', link: 'admin/texte', svgPaths: ['M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z']},
        {title: 'Bilder', link: 'admin/bilder', svgPaths: ['M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z']}]

    const getLinkIndex = () => links.findIndex((l) => l.link == window.location.pathname.substring(1))
    let activeLinkIndex = getLinkIndex();
    // Refresh the index even when switching between 404 pages; If the url does not match any entry, use the last index
    globalHistory.listen(() => activeLinkIndex = getLinkIndex() != -1 ? getLinkIndex() : activeLinkIndex);
</script>

{#if mobileMenuOpen}
    <MobileMenu on:hide={toggleMobileMenu} links={links} activeLinkIndex={activeLinkIndex}/>
{/if}
<div class="mt-10 mx-4 md:mx-10 my-10 lg:pl-8 4xl:min-w-[70%] 4xl:max-w-[70%] 4xl:mx-auto rounded-lg shadow-2xl shadow-gray-300 dark:shadow-black">
    <!-- Static sidebar for desktop -->
    <div class="hidden md:flex md:w-64 md:flex-col md:absolute">
        <!-- Sidebar component, swap this element with another sidebar if you like. NO! Adding this sidebar took a while -->
        <div class="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-700">
            <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div class="flex items-center flex-shrink-0 px-4">
                    <img class="h-8 w-auto" src="assets/favicon.svg" alt="Logo">
                    <p class="font-bold text-2xl ml-3 dark:text-slate-100 text-gray-800">Admin</p>
                </div>
                <nav class="mt-5 flex-1 px-2 bg-white dark:bg-slate-900 space-y-1">
                    {#each links as link, i}
                        <span on:click={() => {navigate(link.link, {state: {scroll: false}})}} class="{activeLinkIndex === i ? 'bg-gray-100 text-gray-900 dark:bg-slate-600 dark:text-slate-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-200 dark:hover:bg-slate-700'} cursor-pointer group flex items-center px-2 py-2 text-base font-medium rounded-md">
                            <svg class="{activeLinkIndex === i ? 'text-gray-500 dark:text-slate-300' : 'text-gray-400 group-hover:text-gray-500 dark:text-slate-300 dark:group-hover:text-slate-300'} mr-4 flex-shrink-0 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                {#each link.svgPaths as path}
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={path} />
                                {/each}
                            </svg>
                            {link.title}
                        </span>
                    {/each}
                </nav>
            </div>
            <div class="flex-shrink-0 flex border-t border-gray-200 dark:border-slate-700 p-4">
                <div class="flex-shrink-0 w-full group block">
                    <div class="flex items-center">
                        <div>
                            <img class="inline-block h-9 w-9 rounded-full" src="https://images.unsplash.com/photo-1651232881282-7bbbbb81e067?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80" alt="">
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-gray-700 group-hover:text-gray-800 dark:text-slate-200 dark:group-hover:text-slate-200">{user && user.email}</p>
                            <p on:click={() => signOut().then(() => navigate('admin/login'))} class="text-xs font-medium text-gray-500 group-hover:text-gray-700 cursor-pointer dark:text-slate-300 dark:group-hover:text-slate-200">Ausloggen</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="md:pl-64 flex flex-col flex-1">
        <div class="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
            <button on:click={toggleMobileMenu} type="button" class="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <span class="sr-only">Open sidebar</span>
                <!-- Heroicon name: outline/menu -->
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </div>
        <main class="flex flex-1 min-h-[87vh] rounded-lg md:rounded-none md:rounded-tr-lg md:rounded-br-lg">
            {#if user}
                <slot></slot>
            {/if}
        </main>
    </div>
</div>