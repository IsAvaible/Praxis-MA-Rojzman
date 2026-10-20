<script lang="ts">
  import {slide} from "svelte/transition";
  import AlertIcon from "../Icons/AlertIcon.svelte";

  export let dismissable: boolean = true;
    export let storageKey: string = "disclaimer_banner_dismissed";

    let visible: boolean = true;

    if (typeof window !== "undefined" && window.sessionStorage) {
        visible = sessionStorage.getItem(storageKey) !== "true";
    }

    const dismiss = () => {
        visible = false;
        if (typeof window !== "undefined" && window.sessionStorage) {
            sessionStorage.setItem(storageKey, "true");
        }
    };
</script>

{#if visible}
    <aside
        aria-label="Inoffizielle Webseite Hinweis"
        class="bg-yellow-500 text-amber-950 dark:bg-amber-600 dark:text-amber-50 text-xs sm:text-sm font-semibold px-4 py-2 text-center tracking-wide flex items-center justify-between gap-2 shadow-sm"
        transition:slide={{ duration: 250 }}
    >
        <div class="flex items-center justify-center gap-2 flex-1 {dismissable ? 'pl-5' : ''}">
            <span class="flex-shrink-0 flex items-center">
                <AlertIcon/>
            </span>
            <span>
                <strong>Inoffizielles Portfolio-Projekt:</strong> Dies ist ein historisches Portfolioprojekt von
                <a href="https://www.linkedin.com/in/simon-conrad-sfc/" target="_blank" referrerpolicy="strict-origin-when-cross-origin" class="hover:underline">Simon Felix Conrad</a>
                und <u>keine</u> offizielle Webseite der <a href="https://www.allgemeinmedizin-kiedrich.de/" target="_blank" referrerpolicy="strict-origin-when-cross-origin" class="hover:underline">Praxis M.A. Rojzman.</a>
                Keine medizinische Beratung oder Terminvergabe.
            </span>
        </div>
        {#if dismissable}
            <button
                type="button"
                on:click={dismiss}
                aria-label="Hinweis schließen"
                class="flex-shrink-0 p-1 rounded-md hover:bg-yellow-600 hover:bg-opacity-25 dark:hover:bg-amber-700 dark:hover:bg-opacity-40 focus:outline-none focus:ring-2 focus:ring-amber-900 cursor-pointer transition-colors"
            >
                <span class="sr-only">Schließen</span>
                <svg class="h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        {/if}
    </aside>
{/if}
