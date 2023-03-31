<script lang="ts">
    import {onMount} from 'svelte';
    import {createScene, rebindScene, sceneInitialized} from "../webgl/scene";

    import WebGl from "three/examples/jsm/capabilities/WebGL.js";

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
    });

    $: if (webGlSupported && mounted) {
        if (!sceneInitialized) {
            createScene(canvas);
        } else {
            rebindScene(canvas);
        }
    }
</script>


{#if webGlSupported}
    <div bind:this={canvasWrapper}>
        <canvas bind:this={canvas} id='webgl_canvas'></canvas>
    </div>
{:else}
    <div class="min-h-[70vh]">
        <div id="webgl_error" class="font-medium text-xl lg:text-2xl text-center">
            <div class="flex">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 md:-mr-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="flex-grow">
                    WebGl wird von ihrem Browser nicht unterstützt<br>
                    Die Hintergrundgrafik kann deshalb nicht angezeigt werden
                </p>
            </div>
        </div>
    </div>

{/if}


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