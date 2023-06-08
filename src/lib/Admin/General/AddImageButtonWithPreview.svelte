<script lang="ts">
    import ImageCropperPopUp from "./ImageCropperPopUp.svelte";
    import {filedrop} from "filedrop-svelte";
    import {createEventDispatcher} from "svelte";

    export let imageUrl;
    export let required = true;

    const dispatch = createEventDispatcher();

    let fileDropOptions;
    let fileDropFiles;
    let fileDragOver = false;
    let readerLoading = false;
    $: fileDropOptions = {accept: 'image/*', multiple: false, windowDrop: false, clickToUpload: false, hideInput: false, tabIndex: -1, fileLimit: readerLoading ? 0 : 1};  // Disable file drop while loading
    $: if (fileDropFiles && fileDropFiles.accepted.length > 0) {files = fileDropFiles.accepted; fileDragOver = false}  // Update files on file drop

    let files;
    let file;
    let fileReader = new FileReader();
    let imageElement;
    let imageInput;
    let showImageCropper;
    let currentEditFile;

    $: if (files) {  // When a file is uploaded (drop or input)
        file = files[0];  // Get the first (and only) file

        imageElement.title = file.name;

        fileReader.onloadstart = function () {  // Show loading animation
            readerLoading = true;
        }

        fileReader.onload = function(event) {  // When the file is loaded open it in the image cropper
            readerLoading = false;
            currentEditFile = event.target.result;
            showImageCropper = true;
        };

        fileReader.readAsDataURL(file);
        imageInput.value = '';
    }

    $: if (showImageCropper == false) {dispatch('change', imageUrl)}
    $: dispatch('imageCropperStateChange', showImageCropper);
</script>

<script context="module" lang="ts">
    import {deleteFiles, getPublicFileUrl, uploadFile} from "../../../scripts/database/database";
    import {compressImage} from "../../../scripts/media/Compressor";

    let imageUrl;

    /**
     * Uploads the current image to the server and returns the url
     * Can be called from outside the component
     * @param filePath The path to the file
     * @param fileName The name of the file
     * @param compressOptions The options for the image compression
     */
    export async function uploadCurrent(filePath: string, fileName: string, compressOptions: {quality: number, maxHeight: number, maxWidth: number}): Promise<string> {
        let serverUrl: string;
        let imageElement: HTMLImageElement = document.getElementById('buttonImageElement') as HTMLImageElement;
        if (imageElement.src.match(/^blob:.+/g)) { // If a new image was uploaded
            try {
                await deleteFiles('images', [filePath]) // Delete the old image
            } catch (e) { // This will not trigger, when there was no old image!
                throw e
            }

            // Get the image as a file
            let image = await fetch(imageElement.src).then(r => r.blob()).then(blobFile => new File([blobFile], `${fileName}.png`, { type: "image/png" }));
            // Compress the image
            let cImage = await compressImage(image, compressOptions.quality, compressOptions.maxHeight, compressOptions.maxWidth);
            // Upload the image
            await uploadFile('images', filePath, cImage);
            // Get the url of the image
            serverUrl = await getPublicFileUrl('images', filePath) + `?t=${Date.now()}`;
        } else { // If no new image was uploaded
            serverUrl = imageUrl;  // Use the old url
        }
        return serverUrl;  // Return the url
    }
</script>


{#if showImageCropper}<ImageCropperPopUp image={currentEditFile} modalTopModal={true} aspect={16/9} cropShape={'rect'} on:submit={(e) => {imageUrl = e.detail; showImageCropper = false}} on:close={() => {showImageCropper = false}}/>{/if}
<div use:filedrop={fileDropOptions} on:filedrop={e => {fileDropFiles = e.detail.files}} on:filedragover={() => fileDragOver = true} on:filedragleave={() => fileDragOver = false} class="min-w-full lg:min-w-[50%] inline-flex font-light rounded-md border-2 border-primary-400 p-3 transition hover:border-primary-600 items-center relative cursor-pointer">
    <span class="inline-flex p-3 bg-primary-500 rounded-md shadow-lg w-fit relative {imageUrl ? 'hidden':''}">
        <svg class="h-6 w-6 text-white" stroke-width="2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
    </span>
    <img bind:this={imageElement} id="buttonImageElement" src="{imageUrl}" alt="Bild des Blogbeitrags" class="{imageUrl ? '':'hidden'} max-w-[7em] rounded-sm object-cover w-fit drop-shadow-xl bg-white" />
    <label for="image-input" class="has-tooltip absolute cursor-pointer inset-0 w-full h-full opacity-0">
        <input bind:this={imageInput} bind:files type="file" accept="image/*" id="image-input" name="avatar" class="absolute opacity-0 w-0">
    </label>
    <span class="flex-grow font-light text-lg text-center">Vorschaubild {!imageUrl ? 'hochladen' + (required ? ' (*)' : '') : 'ändern'}</span>
</div>