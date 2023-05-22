<script>
    import {onDestroy} from "svelte";

    export let title;

    let originalTitle = document.title;
    onDestroy(() => {
        if (document.title === title) {
            document.title = originalTitle;
        }
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>