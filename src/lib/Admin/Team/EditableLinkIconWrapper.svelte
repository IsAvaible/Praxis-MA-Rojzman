<script lang="ts">
    import {fade} from "svelte/transition";
    import {linkEditorActive} from "../../../utilities/adminTeamLinkEditorActive";
    import {createEventDispatcher, onMount} from "svelte";

    export let url;
    export let ariaLabel;

    let editing = false;
    let adding = false;
    let showTooltip = false;

    onMount(() => linkEditorActive.set(false));

    let differentEditorActive;
    linkEditorActive.subscribe((b) => {
        differentEditorActive = b;
    });

    const handleEditAddClick = () => {
        if (editing || adding) {
            adding = false;
            editing = false;
            change();
        } else {
            if (!url) {adding = true}
            editing = true;
        }
    }

    let linkEditField;
    $: if (linkEditField) linkEditField.focus()


    let dispatch = createEventDispatcher();
    const change = () => {
        dispatch('change', url ? url : undefined);
    }

    const plainPaste = (e) => {
        url = e.clipboardData.getData('text/plain');
    };

    const enter = () => {
        showTooltip = showTooltip || !differentEditorActive;
        if (showTooltip) linkEditorActive.set(true)
    }

    const leave = () => {
        if (!(!showTooltip && differentEditorActive)) {
            showTooltip = editing;
            linkEditorActive.set(showTooltip)
        }
    }
</script>

<!--The enter and leave method may alternatively be assigned to mouseenter and mouseleave events.-->
<div aria-label={ariaLabel} role="img" class="mx-5">
    <div class="cursor-pointer" on:click={!showTooltip ? enter : leave}>
        <slot/>
    </div>
    {#if showTooltip}
        <div in:fade={{duration: 300}} out:fade={{duration: 200}} style="margin-left: {url?-Math.max(Math.min(url.length, 44)*0.3, 3):(editing?-6:-1.25)}rem" class="absolute z-10 py-2 px-3 flex text-sm font-medium text-black rounded-lg shadow bg-white dark:text-slate-200 dark:bg-slate-700">
            <span class="flex items-center rounded-full p-2 hover:ring {url && !adding ? 'bg-primary-300 hover:ring-primary-400' : 'bg-lime-300 hover:ring-lime-400'} {editing || adding ? '':'cursor-pointer'}">
                {#if editing}<p bind:this={linkEditField} on:keydown={(e) => {if (e.keyCode === 10 || e.keyCode === 13) e.preventDefault()}} on:paste|preventDefault={plainPaste} contenteditable="true" bind:innerHTML={url} placeholder="{ariaLabel}-Adresse eingeben" class="mr-1 max-w-[320px] focus:outline-none break-words"></p>
                {:else if url}<p class="mr-1 max-w-[320px] focus:outline-none break-words">{url}</p>{/if}
                <svg on:click={handleEditAddClick} xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d={editing ? "M5 13l4 4L19 7" : (url ? "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" : "M12 4v16m8-8H4")}/>
                </svg>
            </span>
            {#if url && !adding}
                <span on:click={() => {url = ''; editing = false}} class="rounded-full bg-red-300 p-2 ml-2 hover:ring hover:ring-red-400 cursor-pointer flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </span>
            {/if}
        </div>
    {/if}
</div>