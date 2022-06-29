<script>
    import Ckeditor from "./Ckeditor.svelte";
    import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document/build/ckeditor";
    import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/de.js';
    import {ImageUploader} from "../../../scripts/media/ImageUploader.ts";
    import { onDestroy } from 'svelte';
    import {deleteFiles} from "../../../scripts/database/database.ts";
    import {escapeString} from "../../../scripts/misc/escapeString.ts";

    export let imageBucket;
    export let imagePath;
    export let preFill = '<h2>Titel</h2><p>Inhalt...</p>';

    // Setting up editor prop to be sent to wrapper component
    let editor = DecoupledEditor;
    // Reference to initialised editor instance
    let editorInstance = null;
    // Setting up any initial data for the editor
    export let editorData = preFill;
    // Storing images stored withing the previous data to be checked against on exit [[bucket, path]]
    let prevImageKeys = Array.from(editorData.matchAll(new RegExp(escapeString(`src="${import.meta.env.VITE_SUPABASE_URL.toString()}/storage/`) + '.+\/public\/(.+?)\/(.+?)"', 'g')), m=>m[1] + "/" + m[2])

    export let saved = false;
    let imageUploader = undefined;
    let uploads = [];


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
            let visible = false;
            let qualitySelector = document.createElement('div');
            qualitySelector.classList.add('hidden');
            qualitySelector.innerHTML = `<label for="qualitySlider" style="margin-right: 3px">Qualität</label>
                <input value=${compressionQuality*100} min="1" type="range" id="qualitySlider" title='Hiermit stellen sie die Bildqualität ein. Um Speicherplatz auf seitens des Servers zu sparen ist diese normalerweise auf 75% gesetzt. Eine Änderung wird erst bei erneuten Rechtsklick des "Bild Einfügen"-Knopfs übernommen.'>`
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

    onDestroy(() => {
        if (imageUploader) {
            if (!saved) { // Clear all newly uploaded Images if the Editor is closed without saving
                deleteFiles(imageBucket, imageUploader.uploads.concat(uploads).map(key => key.substring(imageBucket.length + 1)))
                    .then(data => {if (data) console.log("Successfully deleted all uploaded Images:", data)})
                    .catch(e => console.log("Failed to delete uploaded Images."))
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
    })
</script>

<div class="block">
    <div class="border border-gray-200 dark:border-slate-900 rounded-lg">
        <Ckeditor
                disabled={false}
                bind:editor
                on:ready={onReady}
                bind:config={editorConfig}
                bind:value={editorData} />
    </div>
</div>