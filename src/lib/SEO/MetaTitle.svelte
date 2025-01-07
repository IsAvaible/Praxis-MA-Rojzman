<script>
    import {onDestroy} from "svelte";
    import {unsavedChangesStore} from "../../scripts/stores/unsavedChangesStore";

    export let title;

    let originalTitle = document.title;
    onDestroy(() => {
        if (document.title === title) {
            document.title = originalTitle;
        }
    });
</script>

<svelte:head>
    <title>{$unsavedChangesStore ? '(*) ' : ''}{title}</title>
</svelte:head>