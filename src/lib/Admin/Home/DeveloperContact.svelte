<script lang="ts">
    let parent;

    let isRotate = false;

    function toggle() {
        isRotate = !isRotate;
    }
</script>


<div class="flex justify-center items-center">
    <div id="parent" data-rotate="{isRotate}" bind:this={parent}>
        <div id="child" class="shadow-md bg-hero-topography-100">
            <div class="flex flex-col gap-5" style="padding: 10px; max-width: 75%">
                <h2 class="text-4xl tracking-tight font-bold text-gray-800 dark:text-slate-200">Entwickler Kontaktieren</h2>
                <form on:submit|preventDefault class="px-8 pt-6 pb-8 mb-4">
                    <div class="mb-4">
                        <label class="block text-gray-700 font-bold mb-2" for="name">
                            Name
                        </label>
                        <input
                                class="w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none focus:border-primary-500"
                                id="name" type="text">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-bold mb-2" for="email">
                            Email
                        </label>
                        <input
                                class="w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none focus:border-primary-500"
                                id="email" type="email">
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 font-bold mb-2" for="message">
                            Nachricht
                        </label>
                        <textarea
                                class="w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none focus:border-primary-500"
                                id="message" rows="6"></textarea>
                    </div>
                    <div class="flex items-center justify-between">
                        <button
                                class="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-1 active:ring-0 ring-inset ring-white"
                                type="submit" on:click={toggle}>
                            Absenden
                        </button>
                        <p class="text-sm text-gray-600 mt-2">
                            Please do not misuse this feature. If you need help, please visit the guides section instead.
                        </p>
                    </div>
                </form>
            </div>

            <div class="grandChild"></div>
            <div class="grandChild"></div>
            <div class="grandChild"></div>
        </div>
    </div>
</div>


<style>
    :root {
        --black: hsl(0, 0%, 11%);
        --time: 500ms;
    }

    *, ::before, ::after {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
    }

    #parent {
        width: 100%;
        aspect-ratio: 2.5/1;

        padding: 16px;
        perspective: 1000px;
    }

    #child {
        width: 100%;
        height: 100%;

        position: relative;

        perspective: 1000px;
        transform-style: preserve-3d;
        transition: transform var(--time);

        border: 1px solid var(--black);
    }

    #parent[data-rotate=true] #child {
        transform: translate3d(0, 0, -200px) rotate3d(0.1, -0.1, 0.1, 86deg);
    }

    .grandChild {
        width: 20%;
        aspect-ratio: 3/1;

        position: absolute;
        top: 8px;
        right: 8px;

        border: 1px solid var(--black);
        transition: transform var(--time);
    }

    #parent[data-rotate=true] .grandChild {
        transition-delay: var(--time);
    }

    #parent[data-rotate=true] .grandChild:nth-child(2) {
        transform: translate3d(0, 0, 20px);
    }

    #parent[data-rotate=true] .grandChild:nth-child(3) {
        transform: translate3d(0, 0, 40px);
    }
</style>