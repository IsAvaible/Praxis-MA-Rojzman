<script lang="ts">
    import {fade} from "svelte/transition";
    import {createEventDispatcher, onMount} from "svelte";
    export let id: string;
    export let author: string;
    export let title: string;
    export let previewText: string;
    export let content: string;
    export let previewImageUrl: string;
    export let createdAt: Date;
    export let expanded: boolean;

    let animationDuration: number = 0;
    let dispatch = createEventDispatcher();
    onMount(() => dispatch('mount'));
</script>

<div class="w-full flex rounded-lg overflow-clip" style="max-height: inherit">
    {#if previewImageUrl && !expanded}
        <img src="{previewImageUrl}" alt="Image with the URL {previewImageUrl}" class="bg-primary-50 rounded-md h-full aspect-video mr-3" in:fade style="max-height: inherit; max-width: 20%"/>
    {/if}
    <div>
        <p class="text-sm text-gray-500 dark:text-slate-300">
            <time datetime={createdAt.toISOString()}>{createdAt.toLocaleDateString()}</time>
        </p>
        <div class="mt-2 block">
            <p class="text-xl font-semibold text-gray-900 dark:text-slate-100">{title}</p>
            {#if expanded}
                <p in:fade class="mt-3 text-base dark:text-slate-200 ck-content">{@html content}</p>
            {:else}
                <p in:fade class="mt-3 text-base dark:text-slate-200">{previewText}</p>
            {/if}
        </div>
    </div>
</div>