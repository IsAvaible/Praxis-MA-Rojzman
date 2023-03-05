<script lang="ts">
    /* The html content of the tag */
    export let html: string;
    /* regex: Regex that matches the parts of the html around which the component should be inserted
    *  component: The component to insert
    *  props: The props to pass to the component
    *  predicateProp: A function that returns additional props to pass to the component based on the match
    * */
    export let rules: {regex: RegExp, component: any, props: any, predicateProp: (wrappedContent: string) => object}[];


    let parsedHTML = [html];
    rules.forEach(rule => {
        parsedHTML = parsedHTML.map(substr => substr.split(rule.regex)).flat();
    });
</script>

{#each parsedHTML as part}
    {@const match = (rules.find(rule => rule.regex.test(part)))}
    {#if match}
        <svelte:component this={match.component} {...match.props} {...(match.predicateProp ? match.predicateProp(part) : {})}>
            {@html part}
        </svelte:component>
    {:else}
        {@html part}
    {/if}
{/each}


