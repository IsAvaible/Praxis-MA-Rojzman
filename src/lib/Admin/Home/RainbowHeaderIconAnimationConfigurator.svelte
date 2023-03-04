<script lang="ts">
    import {updateConfigEntry} from "../../../scripts/database/database";
    import {rainbowHeaderIconAnimationStore} from "../../../scripts/stores/rainbowHeaderIconAnimationStore";
    import {scrollToHeader} from "../../../scripts/misc/scrollToHeader";
    import {onDestroy} from "svelte";

    let rainbowAnimate: boolean;
    const unsubscribe = rainbowHeaderIconAnimationStore.subscribe(value => rainbowAnimate = value);

    const updateConfig = async () => {
            await updateConfigEntry(
                "rainbow-header-icon-animation",
                {active: rainbowAnimate},
                {section: "HeaderIcon", description: "Regenbogen Logo Animation wurde " + (rainbowAnimate ? "aktiviert." : "deaktiviert.")}
            );
            rainbowHeaderIconAnimationStore.set(rainbowAnimate);
            scrollToHeader();
        }

    onDestroy(unsubscribe);
</script>


<div class="flex items-center justify-between pt-6 pb-6">
    <div class="flex items-center">
        <div class="flex-shrink-0 h-10 w-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 dark:text-slate-200">
                <path  d="M12 2v4M12 18v4M22 12h-4M6 12H2M4.929 4.929l2.828 2.828M16.243 16.243l2.828 2.828M19.071 4.929l-2.828 2.828M7.757 16.243L4.93 19.07" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
        </div>
        <div class="ml-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-slate-300">
                Regenbogen Logo
            </h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-slate-200">
                Wenn aktiv, leuchte das Logo links oben im Header in Regenbogenfarben.
            </p>
        </div>
    </div>
    <!--  Stylized checkmark that has a rainbow animation when active -->
    <div class="ml-3 h-7 flex items-center">
        <div class="checkbox-wrapper-57">
            <label class="container">
                <input type="checkbox" bind:checked={rainbowAnimate} on:change={updateConfig}>
                <div class="checkmark ring-1 ring-primary-500 bg-white dark:bg-slate-800 after:border-2 after:border-black dark:after:border-slate-200"></div>
            </label>
        </div>
    </div>
</div>


<style>
    .checkbox-wrapper-57 input[type="checkbox"] {
        visibility: hidden;
        display: none;
    }

    .checkbox-wrapper-57 *,
    .checkbox-wrapper-57 ::after,
    .checkbox-wrapper-57 ::before {
        box-sizing: border-box;
    }

    .checkbox-wrapper-57 .container {
        display: block;
        position: relative;
        cursor: pointer;
        font-size: 25px;
        user-select: none;
    }

    /* Create a custom checkbox */
    .checkbox-wrapper-57 .checkmark {
        position: relative;
        top: 0;
        left: 0;
        height: 1.3em;
        width: 1.3em;
        border-radius: 10px;
        transition: all 0.7s;
        --spread: 20px;
    }

    /* When the checkbox is checked, add a blue background */
    .checkbox-wrapper-57 .container input:checked ~ .checkmark {
        box-shadow: -10px -10px var(--spread) 0px #5B51D8, 0 -10px var(--spread) 0px #833AB4, 10px -10px var(--spread) 0px #a87de0, 10px 0 var(--spread) 0px #0bff00
        , 10px 10px var(--spread) 0px #3ee032, 0 10px var(--spread) 0px #1be56c, -10px 10px var(--spread) 0px #4cdeb3;
    }

    /* Create the checkmark/indicator (hidden when not checked) */
    .checkbox-wrapper-57 .checkmark::after {
        content: "";
        position: absolute;
        display: none;
    }

    /* Show the checkmark when checked */
    .checkbox-wrapper-57 .container input:checked ~ .checkmark::after {
        display: block;
    }

    /* Style the checkmark/indicator */
    .checkbox-wrapper-57 .container .checkmark::after {
        left: 0.5em;
        top: 0.34em;
        width: 0.25em;
        height: 0.5em;

        border-width: 0 0.15em 0.15em 0;
        transform: rotate(45deg);
    }
</style>






