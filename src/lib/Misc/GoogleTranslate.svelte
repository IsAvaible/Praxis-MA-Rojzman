<script>
    import {onMount} from "svelte";

    export let options;
    export let elementId = "google-translate-element";
    onMount(() => {
        googleTranslateInit();
    });
    function googleTranslateInit() {
        if (typeof google !== 'undefined' &&
            google != null &&
            google.translate != null &&
            google.translate.TranslateElement != null) {
            options.layout = google.translate.TranslateElement.InlineLayout.SIMPLE;
            new google.translate.TranslateElement(options, elementId);
        } else {
            setTimeout(googleTranslateInit, 300);
        }
    }
</script>


<svelte:head>
    {#if typeof google === "undefined"}
        <script async src="https://translate.google.com/translate_a/element.js"></script>
    {/if}
</svelte:head>

