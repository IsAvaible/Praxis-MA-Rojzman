<script>
    import {createEventDispatcher} from 'svelte';
    import {navigate} from "svelte-navigator";
    import MenuBlogReference from "./MenuBlogReference.svelte";
    import Icon from "./Icon.svelte";

    let dispatch = createEventDispatcher();

    function hide() {
        dispatch('hide', true);
    }

    function toggleOfficeHoursPopUp() {
        hide();
        dispatch('toggleOfficeHoursPopUp', true);
    }
</script>

<!--
      Mobile menu, show/hide based on mobile menu state.

      Entering: "duration-200 ease-out"
        From: "opacity-0 scale-95"
        To: "opacity-100 scale-100"
      Leaving: "duration-100 ease-in"
        From: "opacity-100 scale-100"
        To: "opacity-0 scale-95"
    -->
<div class="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-10">
    <div class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-slate-800 dark:ring-slate-700 divide-y-2 divide-gray-50 dark:divide-slate-700">
        <div class="pt-5 pb-6 px-5">
            <div class="flex items-center justify-between">
                <button on:click={e => {e.stopPropagation(); navigate("/"); hide()}} >
                    <Icon/>
                </button>
                <span class="text-base font-medium text-gray-500 dark:text-slate-200">Praxis M.A. Rojzman</span>
                <div class="-mr-2">
                    <button on:click={hide} type="button" class="bg-white dark:bg-transparent rounded-md p-2 inline-flex items-center justify-center text-gray-400 dark:text-slate-300 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                        <span class="sr-only">Close menu</span>
                        <!-- Heroicon name: outline/x -->
                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
            <div class="mt-6">
                <nav class="grid gap-y-8">
                    {#each [
                        { title: 'Unsere Leistungen', onClick: (e) => navigate('/leistungen'), href: '/leistungen', svgPaths: ['M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z']},
                        { title: 'Das Team', onClick: (e) => navigate('/team'), href: '/team', svgPaths: ['M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z']},
                        { title: 'Aktuelles', onClick: (e) => navigate('/aktuelles'), href: '/aktuelles', svgPaths: ['M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z']},
                        { title: 'Sprechzeiten', onClick: (e) => toggleOfficeHoursPopUp(), href: undefined, svgPaths: ['M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z']},
                        { title: 'Rezeptanforderung', onClick: (e) => navigate('/rezeptanforderung'), href: '/rezeptanforderung', svgPaths: ['M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z']},
                    ] as { title, onClick, href, svgPaths }}
                        <a href={href} on:click|preventDefault={e => {onClick(e); hide()}} tabindex="0" class="cursor-pointer -m-3 p-3 flex items-center rounded-md hover:bg-gray-50 dark:hover:bg-slate-700">
                            <svg class="flex-shrink-0 h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                {#each svgPaths as svgPath}
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={svgPath} />
                                {/each}
                            </svg>
                            <span class="ml-3 text-base font-medium text-gray-900 dark:text-slate-200"> {title} </span>
                        </a>
                    {/each}
                </nav>
            </div>
        </div>
        <div class="py-6 px-5 space-y-6">
            <MenuBlogReference on:navigate={hide}/>
            <div>
                <a href="/kontakt" on:click|preventDefault={() => {navigate("/kontakt"); hide()}} class="cursor-pointer w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"> Kontakt </a>
            </div>
        </div>
    </div>
</div>

