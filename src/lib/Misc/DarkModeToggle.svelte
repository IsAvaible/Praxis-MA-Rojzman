<script lang="ts">
    import {darkModeStore, getSystemTheme} from "../../scripts/stores/darkModeStore";
    import {fade} from "svelte/transition";
    import {delay} from "../../scripts/misc/delay";
    import {longpress} from "../../scripts/ui/longpress";
    import {onDestroy} from "svelte";

    let checked;
    const unsubscribe = darkModeStore.subscribe(value => {
        checked = !value;
    });
    onDestroy(unsubscribe);

    const updateDarkMode = () => {
        showSystemNotification = false;
        delay(0).then(() => {
            darkModeStore.set(!checked);
            localStorage.theme = !checked ? 'dark' : 'light';
        });

    }

    let showSystemNotification = false;
    let showAlreadySystemNotification = false;
    const restoreSystemTheme = () => {
        if (!('theme' in localStorage)) {
            showAlreadySystemNotification = true;
            showSystemNotification = false;
            delay(3000).then(() => showAlreadySystemNotification = false);
            return;
        }

        checked = !getSystemTheme();
        darkModeStore.set(!checked);
        localStorage.removeItem('theme');
        showSystemNotification = true;
        showAlreadySystemNotification = false;
        delay(3000).then(() => showSystemNotification = false);

    }
</script>

<div class="wrapper flex items-center" use:longpress={1500} on:click={updateDarkMode} on:longpress={restoreSystemTheme} on:keydown={e => {if (e.code==='Space'||e.code==='Enter') {e.preventDefault(); checked = !checked; updateDarkMode()}}} >
    <input type="checkbox" id="hide-checkbox" class="peer" bind:checked={checked}>
    <label for="hide-checkbox" class="toggle peer-focus-visible:ring-1 peer-focus:ring-blue-400 dark:peer-focus-visible:ring-purple-600">
        <span class="sr-only">{checked ? 'Dunklen' : 'Hellen'} Modus aktivieren</span>
        <span class="toggle-button">
          <span class="crater crater-1"></span>
          <span class="crater crater-2"></span>
          <span class="crater crater-3"></span>
          <span class="crater crater-4"></span>
          <span class="crater crater-5"></span>
          <span class="crater crater-6"></span>
          <span class="crater crater-7"></span>
        </span>
        <span class="star star-1"></span>
        <span class="star star-2"></span>
        <span class="star star-3"></span>
        <span class="star star-4"></span>
        <span class="star star-5"></span>
        <span class="star star-6"></span>
        <span class="star star-7"></span>
        <span class="star star-8"></span>
    </label>

    {#if showSystemNotification || showAlreadySystemNotification}
        <div in:fade out:fade class="absolute
        left-0 right-0 mx-auto text-center table
        md:left-auto md:right-auto md:text-left md:mx-0 md:block md:mt-24 md:-ml-28
        z-10 py-2 px-3 text-sm font-medium text-black rounded-lg shadow bg-white dark:text-slate-200 dark:bg-slate-700">
            <nobr>Der Modus folgt {#if showSystemNotification}jetzt wieder{:else}bereits{/if} dem System.</nobr>
        </div>
    {/if}

</div>


<style>

    #hide-checkbox {
        opacity: 0;
        height: 0;
        width: 0;
    }

    .toggle {
        position: relative;
        cursor: pointer;
        display: inline-block;
        width: 60px;
        height: 30px;
        background: #211042;
        border-radius: 50px;
        transition: 500ms;
        overflow: hidden;
    }

    .toggle-button {
        position: absolute;
        display: inline-block;
        top: 1px;
        left: 0px;
        width: 27px;
        height: 27px;
        border-radius: 50%;
        background: #FAEAF1;
        overflow: hidden;
        box-shadow: 0 0 35px 4px rgba(255, 255, 255);
        transition: all 500ms ease-out;
    }

    .crater {
        position: absolute;
        display: inline-block;
        background: #f6dfe9;
        border-radius: 50%;
        transition: 500ms;
    }

    .crater-1 {
        background: #FFFFF9;
        width: 30px;
        height: 30px;
        left: 3px;
        bottom: 3px;
    }

    .crater-2 {
        width: 10px;
        height: 10px;
        top: -4px;
        left: 12px;
    }

    .crater-3 {
        width: 5px;
        height: 5px;
        top: 6px;
        right: -4px;
    }

    .crater-4 {
        width: 3px;
        height: 3px;
        top: 6px;
        left: 9px;
    }

    .crater-5 {
        width: 13px;
        height: 13px;
        top: 12px;
        left: 13px;
    }

    .crater-6 {
        width: 2px;
        height: 2px;
        top: 15px;
        left: 6px;
    }

    .crater-7 {
        width: 12px;
        height: 12px;
        bottom: 5px;
        left: 35px;
    }

    .star {
        position: absolute;
        display: inline-block;
        border-radius: 50%;
        background: #FFF;
        box-shadow: 1px 0 2px 2px rgba(255, 255, 255);
    }

    .star-1 {
        width: 6px;
        height: 6px;
        right: 90px;
        bottom: 40px;
    }

    .star-2 {
        width: 8px;
        height: 8px;
        right: 70px;
        top: 10px;
    }

    .star-3 {
        width: 1px;
        height: 1px;
        right: 26px;
        bottom: 23px;
    }

    .star-4 {
        width: 3px;
        height: 3px;
        right: 40px;
        bottom: 50px;
    }

    .star-5 {
        width: 4px;
        height: 4px;
        right: 10px;
        bottom: 35px;
    }

    .star-6, .star-7, .star-8 {
        width: 10px;
        height: 2px;
        border-radius: 2px;
        transform: rotate(-45deg);
        box-shadow: 5px 0px 4px 1px #FFF;
        animation-name: travel;
        animation-duration: 1.5s;
        animation-timing-function: ease-out;
        animation-iteration-count: infinite;
    }

    .star-6 {
        right: 30px;
        bottom: 30px;
        animation-delay: -2s;
    }

    .star-7 {
        right: 15px;
        bottom: 18px;
    }

    .star-8 {
        right: 27px;
        top: 3px;
        animation-delay: -4s;
    }

    @keyframes travel {
        0% {
            transform: rotate(-45deg) translateX(30px);
        }

        50% {
            transform: rotate(-45deg) translateX(-5px);
            box-shadow: 5px 0px 6px 1px #FFF;
        }

        100% {
            transform: rotate(-45deg) translateX(-9px);
            width: 2px;
            height: 2px;
            opacity: 0;
            box-shadow: none;
        }
    }

    #hide-checkbox:checked + .toggle {
        background: #24D7F7;
    }

    #hide-checkbox:checked + .toggle .toggle-button {
        background: #F7FFFF;
        transform: translateX(34px);
        box-shadow: 0 0 35px 5px rgba(255, 255, 255);
    }

    #hide-checkbox:checked + .toggle .toggle-button .crater {
        transform: rotate(-45deg) translateX(21px);
    }

    #hide-checkbox:checked + .toggle .star {
        animation: move 2s infinite;
        transform: none;
        box-shadow: none;
    }

    #hide-checkbox:checked + .toggle .star-1 {
        width: 40px;
        height: 10px;
        border-radius: 10px;
        background: #FFF;
        left: 20px;
        top: 25px;
        box-shadow: none;
    }

    #hide-checkbox:checked + .toggle .star-2 {
        width: 12px;
        height: 12px;
        background: #FFF;
        left: 26px;
        top: 23px;
        box-shadow: -1px 0 2px 0 rgba(0, 0 , 0, 0.1);
    }

    #hide-checkbox:checked + .toggle .star-3 {
        width: 16px;
        height: 16px;
        background: #FFF;
        left: 35px;
        top: 19px;
        box-shadow: -1px 0 2px 0 rgba(0, 0 , 0, 0.1);
    }

    #hide-checkbox:checked + .toggle .star-4 {
        width: 14px;
        height: 14px;
        background: #FFF;
        left: 46px;
        top: 21px;
        box-shadow: -1px 0 2px 0 rgba(0, 0 , 0, 0.1);
    }

    #hide-checkbox:checked + .toggle .star-5 {
        width: 60px;
        height: 15px;
        border-radius: 15px;
        background: #FFF;
        left: 30px;
        bottom: 20px;
        box-shadow: none;
    }

    #hide-checkbox:checked + .toggle .star-6 {
        width: 18px;
        height: 18px;
        background: #FFF;
        border-radius: 50%;
        left: 38px;
        bottom: 20px;
        box-shadow: -1px 0 2px 0 rgba(0, 0 , 0, 0.1);
    }

    #hide-checkbox:checked + .toggle .star-7 {
        width: 24px;
        height: 24px;
        background: #FFF;
        border-radius: 50%;
        left: 52px;
        bottom: 20px;
        box-shadow: -1px 0 2px 0 rgba(0, 0 , 0, 0.1);
    }

    #hide-checkbox:checked + .toggle .star-8 {
        width: 21px;
        height: 21px;
        background: #FFF;
        border-radius: 50%;
        left: 70px;
        top: 59px;
        box-shadow: -1px 0 2px 0 rgba(0, 0 , 0, 0.1);
    }

    @keyframes move {
        0% {
            transform: none;
        }

        50% {
            transform: translateX(2px);
        }
    }


</style>