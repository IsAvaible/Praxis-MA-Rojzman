<script>
    import Ckeditor from "./Ckeditor.svelte";
    import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document/build/ckeditor";
    import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/de.js';
    import {ImageUploader} from "../../../scripts/media/ImageUploader";
    import {onDestroy, onMount} from 'svelte';
    import {deleteFiles} from "../../../scripts/database/database";
    import {escapeString} from "../../../scripts/misc/escapeString";
    import {findImagesInHtml} from "../../../scripts/database/databaseHtmlImageTools";
    import Modal from "../../Essentials/Modal.svelte";

    export let imageBucket;
    export let imagePath;
    export let preFill = '<h2>Titel</h2><p>Inhalt...</p>';

    // Setting up editor prop to be sent to wrapper component
    let editor = DecoupledEditor;
    // Reference to initialised editor instance
    let editorInstance = null;
    // Setting up any initial data for the editor
    export let editorData = preFill;
    export let exportData;
    // Storing images stored withing the previous data to be checked against on exit [[bucket, path]]
    let prevImageKeys = findImagesInHtml(editorData);

    export let saved = false;
    let imageUploader = undefined;
    let uploads = [];

    // Convert youtube-nocookie.com to youtube.com embeds (as the editor does not support youtube-nocookie.com)
    editorData = editorData.replace(/youtube-nocookie\.com\/embed\/(.*)/g, "youtube.com/embed/$1")

    // Add lazy loading attribute to img tags
    $: editorData = editorData.replace(/<img (loading="lazy"){0} .*>/, match => match.replace(/<img/, '<img loading="lazy"'));
    // Convert youtube.com to youtube-nocookie.com embeds (privacy reasons)
    $: exportData = editorData.replace(/youtube\.com\/embed\/(.*)/g, "youtube-nocookie.com/embed/$1");

    // If needed, custom editor config can be passed through to the component
    // Uncomment the custom editor config if you need to customise the editor.
    // Note: If you don't pass toolbar object then Document editor will use default set of toolbar items.
    let editorConfig = {
        toolbar: {
            items: [
                "heading", "|",
                "fontSize", "fontColor", "fontBackgroundColor", "|",
                "bold", "italic", "underline", 'strikethrough', "|",
                "alignment", "|",
                "uploadImage", "mediaEmbed", "link", "|",
                "numberedList", "bulletedList", "|",
                "blockQuote", "insertTable", "|",
                "undo", "redo"
            ]
        },
        language: 'de',
        mediaEmbed: {previewsInData: true}
    };

    const openImageSearch = () => {
        open("https://pixabay.com/", "_blank");
        // Using Pixabay in the iframe is not possible
        // showImageSearchModal = !showImageSearchModal;
    }


    let showImageSearchModal = false;
    function onReady({ detail: editor }) {
        // Insert the toolbar before the editable area.
        editorInstance = editor;
        editor.ui
            .getEditableElement()
            .parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
        );
        let compressionQuality = 0.75;
        // Set the custom image Uploader
        editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
            // A new image uploader is created each time an image is uploaded, therefore we need to store previous uploads each time
            if (imageUploader) uploads = uploads.concat(imageUploader.uploads)
            return imageUploader = new ImageUploader(loader, imageBucket, imagePath, compressionQuality);
        };



        let fileUploadButton = document.querySelector('.ck-file-dialog-button');
        if (fileUploadButton) {
            // Add a button to the left of the file upload button to delete all uploads
            let searchImagesButton = document.createElement('div');
            searchImagesButton.innerHTML = `
            <button class="ck ck-button ck-off" type="button" tabindex="-1">
                <svg class="ck ck-icon ck-reset_all-excluded ck-icon_inherit-color ck-button__icon" viewBox="0 0 48 48"><rect width="48" height="48" rx="4" fill="#191B26"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M32.6525 24.8892L37.2639 30.7912H42.3448L34.8157 21.5238L41.7076 12.6792H36.9286L32.7029 18.2093L28.9132 12.6792H24.1006L30.4391 21.5238L23.5472 30.7912H28.5107L32.6525 24.8892ZM14.3852 12.6881C11.8443 12.7519 9.73311 13.6319 8.05141 15.3278C6.36972 17.0238 5.4972 19.1531 5.43396 21.7155V38.0377H8.99046V30.7836H14.3852C16.9277 30.7181 19.0457 29.8314 20.739 28.1237C22.4324 26.4159 23.3115 24.28 23.3765 21.7158C23.3116 19.1533 22.4324 17.0241 20.739 15.3281C19.0457 13.6321 16.9278 12.7523 14.3852 12.6884V12.6881ZM8.99046 27.1964V21.7155C9.02796 20.1664 9.55241 18.8819 10.5639 17.8617C11.5754 16.8416 12.8492 16.3127 14.3852 16.2749C15.9403 16.3127 17.2258 16.8416 18.2415 17.8617C19.2571 18.8818 19.7833 20.1664 19.8199 21.7155C19.7833 23.2839 19.2571 24.5802 18.2415 25.6046C17.2258 26.629 15.9403 27.1596 14.3852 27.1964H8.99046Z" fill="white"/>
                </svg>
                <span class="ck ck-button__label">Pixabay Durchsuchen</span>
            </button>`;
            searchImagesButton.addEventListener('click', () => {
                openImageSearch();
            })
            fileUploadButton.parentElement.insertBefore(searchImagesButton, fileUploadButton);
            // Add a quality slider to the left of the file upload button, which is hidden by default and only shown on right click
            let visible = false;
            let qualitySelector = document.createElement('div');
            qualitySelector.classList.add('hidden');
            qualitySelector.innerHTML = `<label for="qualitySlider" style="margin-right: 3px">Qualität</label>
            <input value=${compressionQuality*100} style="width: 5rem" min="1" type="range" id="qualitySlider" title='Hiermit stellen sie die Bildqualität ein. Um Speicherplatz auf seitens des Servers zu sparen ist diese normalerweise auf 75% gesetzt. Eine Änderung wird erst bei erneuten Rechtsklick des "Bild Einfügen"-Knopfs übernommen.'>`
            fileUploadButton.parentElement.appendChild(qualitySelector);
            fileUploadButton.parentElement.insertBefore(qualitySelector, fileUploadButton);
            fileUploadButton.addEventListener('contextmenu', (ev) => {
                ev.preventDefault();
                if (visible) {
                    qualitySelector.classList.add('hidden');
                    compressionQuality = qualitySelector.querySelector('#qualitySlider').value / 100;
                    if (imageUploader) imageUploader.compressionQuality = compressionQuality;
                }
                else {
                    qualitySelector.classList.remove('hidden');
                }
                visible = !visible;
            } )
        }
    }


    // CKEditor uses a div on the root level to display tooltips and dialogs.
    // As the <dialog> element used by the Modal is always rendered on the top level, CKEditor's div is not visible.
    // By moving the div into the dialog element, the tooltips and dialogs are visible again.

    /**
     * Moves the CKEditor pseudo DOM into the dialog element
     * @param element The CKEditor pseudo DOM element
     */
    const moveCKPseudoDOM = (element) => {
        const target = document.getElementById('dialog');
        target.appendChild(element);
        observer.disconnect();
    }

    /**
     * Observes the body for changes and moves the CKEditor pseudo DOM into the dialog element when it is added
     * @type {MutationObserver} The observer
     */
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node instanceof HTMLElement && node.classList.contains('ck-body-wrapper')) {
                        moveCKPseudoDOM(node);
                    }
                }
            }
        }
    });

    onMount(() => {
        const dialog = document.querySelector('dialog');
        if (dialog) {  // If there is a dialog, observe the body for changes
            observer.observe(document.body, { childList: true, subtree: true });
        }
    })





    // When the editor is destroyed, images that were uploaded but not saved and images that are not used anymore are deleted from the server
    onDestroy(() => {
        if (imageUploader) {
            if (!saved) { // Clear all newly uploaded Images if the Editor is closed without saving
                deleteFiles(imageBucket, imageUploader.uploads.concat(uploads).map(key => key.substring(imageBucket.length + 1)))
                    .then(data => {if (data) console.log("Successfully deleted all uploaded Images:", data)})
                    .catch(() => console.log("Failed to delete uploaded Images."))
            }
        }
        if (saved) {
            // Concat all uploads that were made during the editing process and the "starting" images.
            // If their link cannot be found in on of the images on the page, add them to the unused key.
            let unusedKeys = (imageUploader ? imageUploader.uploads.concat(prevImageKeys).concat(uploads) : prevImageKeys.concat(uploads)).filter(key => editorData.search(escapeString(key)) === -1);
            // Delete all unused keys (images)
            if (unusedKeys.length > 0) {
                deleteFiles(imageBucket, unusedKeys.map(key => key.substring(imageBucket.length + 1)))
                    .then(data => {if (data) console.log("Successfully deleted all unused Images:", data)})
                    .catch(e => console.log(`Failed to delete unused Images. ${e.message}`))
            }
        }
        observer.disconnect();
    })
</script>

{#if showImageSearchModal}
    <Modal on:hide={() => showImageSearchModal = false} modalTopModal={true}>
        <iframe class="w-screen h-screen rounded-lg mb-4" src="https://pixabay.com/" title="Online Bildersuche"></iframe>
    </Modal>
{/if}

<div class="block">
    <div class="border border-gray-200 dark:border-slate-900 rounded-lg">
        <Ckeditor
                bind:editor
                on:ready={onReady}
                bind:config={editorConfig}
                bind:value={editorData} />
    </div>
</div>