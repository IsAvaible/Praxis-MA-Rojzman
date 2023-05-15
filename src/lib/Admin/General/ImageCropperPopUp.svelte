<script>
    import Cropper from "svelte-easy-crop";
    import Modal from "../../Essentials/Modal.svelte";
    import {createEventDispatcher} from "svelte";
    import PageTitle from "../Navigation/PageTitle.svelte";
    import getCroppedImg from "../../../scripts/media/cropUtils";
    import LoadingWheel from "../../Misc/LoadingWheel.svelte";

    export let image;
    export let aspect = 1;
    export let cropShape = 'round';
    export let modalTopModal = false;

    let crop = { x: 0, y: 0 };
    let zoom = 1;
    let pixelCrop;
    let cropperSize;
    let windowWidth = window.innerWidth;
    $: cropperSize = Math.min(windowWidth - 170, 650);
    let loading = false;

    let dispatch = createEventDispatcher();
    const close = () => {
        dispatch('close');
    }
    const submit = () => {
        loading = true;
        getCroppedImg(image, pixelCrop).then((cropped) => {
            dispatch('submit', cropped);
            close();
        }).catch((e) => {
            loading = false;
            alert(e.message);
        })
    }
</script>
<svelte:window bind:innerWidth={windowWidth}/>

<Modal on:hide={close} modalTopModal={modalTopModal}>
    <div class="w-[80vw] grid-cols-1 overflow-y-auto">
        <div class="relative">
            <PageTitle showTitle={false} titleAccent="Bild Zuschneiden"/>
        </div>
        <div class="mx-auto" style="width: {cropperSize + 40}px; height: {cropperSize}px">
            <input bind:value={zoom} min="1" max="4" step="0.005" type="range" orient="vertical" class="float-right focus:outline-none focus:ring-0 focus:shadow-none">
            <div class="mx-auto relative" style="width: {cropperSize}px; height: {cropperSize}px">
                <Cropper {image} aspect={aspect} maxZoom={4} zoomSpeed={0.5} cropShape={cropShape} on:cropcomplete={e => pixelCrop = e.detail.pixels} bind:crop bind:zoom/>
            </div>
        </div>
        <button on:click={submit} class="mt-5 cursor-pointer w-full flex justify-center items-center font-medium text-white bg-primary-600 rounded-md border border-primary dark:border-none p-3 transition hover:bg-primary-700">
            Bestätigen
            {#if loading}
                <span class="ml-2"><LoadingWheel/></span>
            {/if}
        </button>
    </div>
</Modal>


<style>
    input[type=range][orient=vertical]
    {
        writing-mode: bt-lr; /* IE */
        -webkit-appearance: slider-vertical; /* Chromium */
        width: 8px;
        height: 175px;
        cursor: ns-resize;
    }
</style>