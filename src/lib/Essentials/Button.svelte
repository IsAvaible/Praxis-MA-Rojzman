<script>
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher()
    const onClick = () => {
        dispatch('click')
    }
</script>


<button on:click={onClick} class="rounded-md shadow-sm px-4 py-3 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
    <slot/>
</button>