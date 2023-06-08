<script>
    import {clickOutside} from "../../scripts/ui/clickOutside";
    import {createEventDispatcher} from 'svelte';
    import MenuBlogReference from "./MenuBlogReference.svelte";
    import {Link} from "svelte-navigator";
    import fadeScale from "../../scripts/ui/transitionFadeScale";

    let dispatch = createEventDispatcher();

    let show = true;
    function hide() {
        show = false;
    }
</script>

<!--
  'More' flyout menu, show/hide based on flyout menu state.
-->

{#if show}
<div in:fadeScale={{duration: 200, from: 0.95}} out:fadeScale|local={{duration: 150, from: 1, to: 0.95}} on:outroend|once={() => dispatch('hide', true)} use:clickOutside on:clickOutside={hide} class="absolute z-10 left-1/2 origin-top-center transform -translate-x-1/2 mt-3 px-2 w-screen max-w-md sm:px-0">
    <div class="rounded-lg shadow-lg ring-1 ring-black dark:ring-slate-700 ring-opacity-5 overflow-hidden">
        <div class="relative grid gap-6 bg-white dark:bg-slate-800 px-5 py-6 sm:gap-8 sm:p-8">
            <Link on:click={hide} to="/FAQ" class="cursor-pointer -m-3 p-3 flex items-start rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">
                <!-- Heroicon name: outline/support -->
                <svg class="flex-shrink-0 h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="ml-4">
                    <p class="text-base font-medium text-gray-900 dark:text-slate-200">FAQ</p>
                    <p class="mt-1 text-sm text-gray-500 dark:text-slate-200">Antworten zu den beliebtesten Fragen um das Thema Gesundheit und die Praxis</p>
                </div>
            </Link>

            <Link to='/rezeptanforderung' on:click={hide} class="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer">
                <!-- Heroicon name: outline/bookmark-alt -->
                <svg class="flex-shrink-0 h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div class="ml-4">
                    <p class="text-base font-medium text-gray-900 dark:text-slate-200">Rezeptanforderung</p>
                    <p class="mt-1 text-sm text-gray-500 dark:text-slate-200">Bestellen sie Folgerezept für Dauererkrankung zur schnellen Abholung vor Ort</p>
                </div>
            </Link>

            <a href="https://g.page/r/CduYIOKWcFs3EBE/review" target="_blank" referrerpolicy="strict-origin-when-cross-origin" class="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">
                <!-- Heroicon name: outline/shield-check -->
                <svg class="flex-shrink-0 h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <div class="ml-4">
                    <p class="text-base font-medium text-gray-900 dark:text-slate-200">Bewerten Sie Uns</p>
                    <p class="mt-1 text-sm text-gray-500 dark:text-slate-200">Wir würden uns über eine Rezension auf Google Maps freuen!</p>
                </div>
            </a>

<!--            <GoogleTranslate-->
<!--                    elementId={'google-translate-element'}-->
<!--                    options={{ pageLanguage: 'de' }}-->
<!--            />-->
<!--            <div class="w-full flex justify-center rounded-lg">-->
<!--                <div id="google-translate-element">-->

<!--                </div>-->
<!--            </div>-->

        </div>
        <MenuBlogReference on:navigate={hide}/>
    </div>
</div>
{/if}