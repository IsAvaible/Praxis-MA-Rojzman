<script lang="ts">
    import {Link} from "svelte-navigator";
    import {onDestroy, onMount} from "svelte";
    import {prefersReducedMotionStore} from "../../scripts/stores/prefersReducedMotionStore";
    import {getConfigEntry} from "../../scripts/database/database";
    import {rainbowHeaderIconAnimationStore} from "../../scripts/stores/rainbowHeaderIconAnimationStore";

    let canvas;
let regularIcon;
let windowWidth;
let rainbowAnimate = true;

const initAnimation = async () => {
    // Source: https://svelte.dev/tutorial/bind-this
    const ctx = canvas.getContext('2d', {willReadFrequently: true});
    ctx.willReadFrequently = true;
    let frame = requestAnimationFrame(loop);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    function loop(t) {
        if (!canvas) return;
        frame = requestAnimationFrame(loop);

        for (let p = 0; p < imageData.data.length; p += 4) {
            const i = p / 4;
            const x = i % canvas.width;
            const y = i / canvas.width >>> 0;

            const r = 64 + (128 * x / canvas.width) + (64 * Math.sin(t / 1000));
            const g = 64 + (128 * y / canvas.height) + (64 * Math.cos(t / 1000));
            const b = 128;

            imageData.data[p + 0] = r;
            imageData.data[p + 1] = g;
            imageData.data[p + 2] = b;
            imageData.data[p + 3] = 255;
        }

        ctx.putImageData(imageData, 0, 0);
        if ($prefersReducedMotionStore || !rainbowAnimate) {
            cancelAnimationFrame(frame);
            return;
        }
    }

    return () => {
        cancelAnimationFrame(frame);
    };
}

let unsubscribe;
onMount(async () => {
    // If the request fails to resolve within 400ms, show the regular icon
    let loaded = false;
    setTimeout(() => {if (loaded == false) {regularIcon.classList.remove("hidden")}}, 400);
    try {
        rainbowAnimate = (await getConfigEntry("rainbow-header-icon-animation")).data.active as boolean;
    } catch { // Database unreachable
        rainbowAnimate = false;
    }
    loaded = true;
    rainbowHeaderIconAnimationStore.set(rainbowAnimate);
    await initAnimation();

    unsubscribe = rainbowHeaderIconAnimationStore.subscribe(value => {
        rainbowAnimate = value;

        if (rainbowAnimate) {
            canvas.classList.remove("hidden");
            regularIcon.classList.add("hidden");
        } else {
            canvas.classList.add("hidden");
            regularIcon.classList.remove("hidden");
        }

        initAnimation();
    });
});

onDestroy(() => {
    unsubscribe();
});

</script>
<svelte:window bind:outerWidth={windowWidth}/>

<Link to="/" id="headerIcon">
    <span class="sr-only">Homepage</span>
    <div class="has-tooltip">
        <canvas
                class="hidden fadeIn"
                bind:this={canvas}
                width={windowWidth >= 640 ? 44 : 34}
                height={windowWidth >= 640 ? 40 : 32}
        ></canvas>
        <img bind:this={regularIcon} class="h-8 w-auto sm:h-10 hidden fadeIn" src="assets/favicon.svg" alt="">
        <div class="tooltip inline-block ml-12 absolute z-10 py-2 px-3 text-sm font-medium text-black rounded-lg shadow bg-white dark:text-slate-200 dark:bg-slate-700">
            Startseite
        </div>
    </div>
</Link>


<style>
    canvas {
        width: 100%;
        height: 100%;
        background-color: #666;
        -webkit-mask: url('/assets/favicon.svg') 50% 50%/100% 100% no-repeat;
        mask: url('/assets/favicon.svg') 50% 50%/100% 100% no-repeat ;
    }

    .fadeIn {
        animation: fadeIn ease 0.5s;
        -webkit-animation: fadeIn ease 0.5s;
        -moz-animation: fadeIn ease 0.5s;
        -o-animation: fadeIn ease 0.5s;
        -ms-animation: fadeIn ease 0.5s;
    }
</style>



