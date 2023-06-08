<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import {slide} from "svelte/transition";
    import {backInOut} from "svelte/easing";
    import {bannerPushContentStore} from "../../scripts/stores/bannerPushContentStore";
    import {Link} from "svelte-navigator";

    export let name: string;
    export let mobileText: string;
    export let desktopText: string;
    export let active: boolean = false;
    export let activeUntil: Date = null;
    export let buttonText: string = null;
    export let buttonUrl: string = null;
    export let buttonAction: Function = null;
    export let svgPaths: string[] = ["M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"];
    export let hideable: boolean = true;
    export let animateIn: boolean = false;
    export let animateOut: boolean = true;
    export let pulseIcon: boolean = false;
    export let id: string = null;

    let dispatch = createEventDispatcher();
    const hide = () => {
        dispatch("hide", true);
    }

    if (activeUntil && activeUntil.getTime() < Date.now()) {
        active = false;
    }
</script>

{#if active}
    <!-- The banner has a negative z-index to prevent it from appearing over dropdown menus during their fade animation -->
    <div class="bg-primary-600 -z-10 {$bannerPushContentStore ? '' : 'absolute w-full'}" in:slide={{duration: 300 * (animateIn ? 1 : 0)}} out:slide={{duration: 400 * (animateOut ? 1 : 0), easing: backInOut}} id={id}>
        <div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
            <div class="flex items-center justify-center sm:justify-between flex-wrap">
                <div class="w-0 flex-1 flex items-center justify-center sm:justify-start">
                    <span class="flex p-2 rounded-lg bg-primary-800">
                      <!-- Heroicon name: outline/speakerphone -->
                      <svg class="h-6 w-6 text-white {pulseIcon ? 'animate-pulse' : ''}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          {#each svgPaths as path}
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{path}" />
                          {/each}
                      </svg>
                    </span>
                    <p class="ml-3 font-medium text-white dark:text-slate-200 truncate">
                        <span class="md:hidden"> {mobileText} </span>
                        <span class="hidden md:inline"> {desktopText} </span>
                    </p>
                </div>
                {#if buttonText && (buttonAction || buttonUrl)}
                    <div class="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto flex justify-center">
                        {#if buttonAction}
                            <button on:click={() => buttonAction()} class="cursor-pointer flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-primary-50"> {buttonText} </button>
                        {:else if buttonUrl}
                            {#if buttonUrl.startsWith("/")}
                                <Link to={buttonUrl} class="cursor-pointer flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:ring-2 hover:ring-primary-400">{buttonText}</Link>
                                tst
                            {:else}
                                <a href={(buttonUrl.startsWith('www') ? 'https://' : '') + buttonUrl} target="_blank" referrerpolicy="strict-origin-when-cross-origin" class="cursor-pointer flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:ring-2 hover:ring-primary-400"> {buttonText} </a>
                            {/if}
                        {/if}
                    </div>
                {/if}
                <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3 {hideable ? '' : 'invisible sm:hidden'}">
                    <button on:click={hide} type="button" class="-mr-1 flex p-2 rounded-md hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2">
                        <span class="sr-only">Dismiss</span>
                        <!-- Heroicon name: outline/x -->
                        <svg class="h-6 w-6 text-white dark:text-slate-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}