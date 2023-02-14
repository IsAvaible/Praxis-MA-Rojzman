<script lang="ts">
    // import {fade} from "svelte/transition";
    // import { inview } from 'svelte-inview';
    import { onMount } from 'svelte';
    import {createScene, rebindScene, sceneInitialized} from "../lib/webgl/scene";
    import {getFeature, getOfficeHours, getShowcasedFeatures} from "../scripts/database/database";
    import {Link} from "svelte-navigator";

    import WebGl from "three/examples/jsm/capabilities/WebGL.js";
    import Title from "../lib/Home/Title.svelte";
    import Footer from "../lib/Essentials/Footer.svelte";
    import InfoSection from "../lib/Home/InfoSection.svelte";
    import FeatureSection from "../lib/Home/HomeFeaturesReference.svelte";
    import BlogSection from "../lib/Home/HomeBlogReference.svelte";
    import OfficeHours from "../lib/Misc/OfficeHours.svelte";

    let webGlSupported = WebGl.isWebGLAvailable();
    let canvas: HTMLCanvasElement;
    let canvasWrapper: HTMLDivElement;
    let header: HTMLDivElement;
    let headerHeight: number;
    let mounted: boolean = false;

    const resizeCanvasWrapper = () => {
        requestAnimationFrame(() => {
            if (canvasWrapper) {
                canvasWrapper.style.minHeight = Math.max(canvas.clientHeight - headerHeight + 10, window.innerHeight / 2) + "px";
            }
        });
    };

    onMount(() => {
        if (!webGlSupported) {
            // Sometimes webGl claims not to be supported, but it is. Recheck every two seconds whether it is.
            setInterval(() => webGlSupported = WebGl.isWebGLAvailable(), 2000);
        }
        header = document.getElementById("header") as HTMLDivElement;
        headerHeight = header.clientHeight;
        mounted = true;
        // on resize
        resizeCanvasWrapper();
        window.addEventListener("resize", resizeCanvasWrapper);

        // Query the database for essential values to populate the cache
        try {
            getOfficeHours();
            getShowcasedFeatures().then(d => d.forEach(f => getFeature(f.name)));
        } catch (e) {}
    });

    $: if (webGlSupported && mounted) {
        if (!sceneInitialized) {
            createScene(canvas);
        } else {
            rebindScene(canvas);
        }
    }
</script>


<Footer>
    {#if webGlSupported}
        <div bind:this={canvasWrapper}>
            <canvas bind:this={canvas} id='webgl_canvas'></canvas>
        </div>
    {:else}
        <div id="webgl_error" class="font-medium text-xl lg:text-2xl text-center">
            <div class="flex">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 md:-mr-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="flex-grow">
                    WebGl is not supported by your browser.<br>
                    Try switching to a browser with WebGL support to use this website as intended.
                </p>
            </div>
        </div>
    {/if}
    <Title/>
    <div class="z-10 mx-4 md:mx-10 pt-2 mb-10 px-4 sm:px-6 lg:px-8 2xl:max-w-[80%] 2xl:mx-auto rounded-lg shadow-2xl shadow-gray-300 dark:shadow-black bg-white dark:bg-slate-900">
        <InfoSection/>
<!--        <div use:inview={{unobserveOnEnter: true}} on:enter={() => isInView = true}>-->
<!--            {#if isInView}-->
<!--                <div in:fade={{duration: 700}}>-->
        <div>
            <FeatureSection/>
            <BlogSection/>
            <div class="-mx-4 sm:-mx-6 lg:-mx-8 bg-primary-100 dark:bg-primary-800 rounded-b-lg">
                <div class="mb-0 pointer-events-none overflow-hidden">
                    <svg class="overflow-hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 30" x="0" y="0">
                        <polygon class="text-white dark:text-slate-900 fill-current" points="0 0 0 30 1000 0"></polygon>
                    </svg>
                </div>
                <div class="mx-auto bg-slate flex justify-center mt-0">
                    <div class="flex p-5 lg:p-7 mb-5 flex-wrap justify-center items-center">
                        <div class="overflow-x-auto">
                            <OfficeHours/>
                        </div>
                        <div class="my-auto grid grid-cols-1 md:ml-3 w-56">
                            <a href="https://goo.gl/maps/sk8AD42LZAhWAvYD7" target="_blank" rel="noreferrer" class="hidden md:flex mx-auto mb-2 font-medium text-gray-800 dark:text-slate-100 hover:underline">
                                <p>Kammstr. 2, 65399 Kiedrich</p>
                            </a>
                            <Link to="/kontakt" class="w-full inline-flex justify-center focus:outline-1 rounded-md border border-transparent shadow-sm px-8 py-4 bg-primary-600 shadow-md shadow-gray-400 dark:shadow-none text-sm font-medium text-white text-center hover:bg-primary-700 sm:w-auto sm:text-base">Kontaktieren sie uns!</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--    {:else}-->
        <!--        <div class="min-h-[50vh]"></div>-->
        <!--    {/if}-->
        <!--</div>-->
    </div>
</Footer>


<style lang="scss">
  #webgl_canvas {
    margin: 0;
    // Push to background
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    // Disable side scrolling
    max-height: 80%;
    max-width: 100%;
    overflow-x: hidden;
    // Fade to bottom
    mask-image: linear-gradient(to bottom, black 0%, black 85%, transparent 100%);
  }

  #webgl_error {
    color: #D8000C;
    background-color: #FFD2D2;
    position: absolute;
    top: 35vh;
    left: 0;
    right: 0;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    border-radius: 50px;
    padding: 1em;
    max-height: 80%;
    max-width: 90%;
  }
</style>
