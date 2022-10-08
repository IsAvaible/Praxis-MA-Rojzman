<script lang="ts">
    import {fade} from "svelte/transition";
    import { inview } from 'svelte-inview';
    import { onMount } from 'svelte';
    import {createScene, rebindScene, sceneInitialized} from "../lib/webgl/scene";
    import {getFeature, getOfficeHours, getShowcasedFeatures} from "../scripts/database/database";
    import {navigate} from "svelte-navigator";

    import WebGl from "three/examples/jsm/capabilities/WebGL.js";
    import Title from "../lib/Home/Title.svelte";
    import Footer from "../lib/Essentials/Footer.svelte";
    import IntroSection from "../lib/Home/InfoSection.svelte";
    import FeatureSection from "../lib/Home/HomeFeaturesReference.svelte";
    import BlogSection from "../lib/Home/HomeBlogReference.svelte";
    import OfficeHours from "../lib/Misc/OfficeHours.svelte";

    let el;
    onMount(() => {
        if (!sceneInitialized) {
            createScene(el);
        } else {
            rebindScene(el);
        }
        // Query the database for essential values to populate the cache
        getOfficeHours();
        getShowcasedFeatures().then(d => d.forEach(f => getFeature(f.name)));
    });

    let isInView = false;
</script>


<Footer>
    {#if WebGl.isWebGLAvailable()}
        <canvas bind:this={el} id='webgl_canvas'></canvas>
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
    <div class="mt-[68vh] 4xl:mt-[74vh] mx-4 md:mx-10 pt-2 my-10 px-4 sm:px-6 lg:px-8 2xl:max-w-[80%] 2xl:mx-auto rounded-lg shadow-2xl shadow-gray-300 dark:shadow-black">
        <IntroSection/>
        <div use:inview={{unobserveOnEnter: true}} on:enter={() => isInView = true}>
            {#if isInView}
                <div in:fade={{duration: 700}}>
                    <FeatureSection/>
                    <BlogSection/>
                    <div class="-mx-4 sm:-mx-6 lg:-mx-8">
                        <div class="mb-0 pointer-events-none overflow-hidden">
                            <svg class="overflow-hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 100" x="0" y="0">
                                <polygon class="text-primary-100 dark:text-primary-800 fill-current" points="2560 0 2560 100 0 100"></polygon>
                            </svg>
                        </div>
                        <div class="bg-primary-100 dark:bg-primary-800 mx-auto bg-slate flex justify-center rounded-b-lg mt-0">
                            <div class="flex p-5 lg:p-7 mb-5">
                                <OfficeHours/>
                                <div class="my-auto grid grid-cols-1 items-center ml-3">
                                        <a href="https://goo.gl/maps/sk8AD42LZAhWAvYD7" target="_blank" class="hidden md:flex mx-auto mb-2 font-medium text-gray-900 dark:text-slate-100">
                                            <p>Kammstr. 2, 65399 Kiedrich</p>
                                        </a>
                                    <a href="/kontakt" on:click|preventDefault={() => navigate("/kontakt")} class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-8 py-4 bg-primary-600 shadow-md shadow-gray-400 dark:shadow-none text-sm font-medium text-white text-center hover:bg-primary-700 focus:outline-none sm:w-auto sm:text-base">Kontaktieren sie uns!</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {:else}
                <div class="min-h-[50vh]"></div>
            {/if}
        </div>
    </div>
</Footer>


<style lang="scss">
  #webgl_canvas {
    margin: 0;
    // Push to background
    position: absolute;
    top: 0;
    left: 0;
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
