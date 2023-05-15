<script lang="ts">
    import type {ComponentType} from "svelte";

    export let condition: boolean|undefined
    export let component: ComponentType | undefined = undefined
    export let a = false
    export let span = false
    export let element: HTMLElement | undefined = undefined
    $: passthrough = (({ condition, component, a, span, element, ...passthrough }) => passthrough)($$props)
</script>

<!--See: https://github.com/txstate-etc/svelte-components/blob/main/docs/ConditionalWrapper.md-->
{#if condition || (typeof condition === 'undefined' && component)}
    {#if component}
        <svelte:component this={component} bind:element {...passthrough}><slot></slot></svelte:component>
    {:else}
        {#if a}
            <!-- svelte-ignore a11y-missing-attribute -->
            <a on:click bind:this={element} {...passthrough}><slot></slot></a>
        {:else if span}
            <span on:click bind:this={element} {...passthrough}><slot></slot></span>
        {:else}
            <div on:click bind:this={element} {...passthrough}><slot></slot></div>
        {/if}
    {/if}
{:else}
    <slot></slot>
{/if}