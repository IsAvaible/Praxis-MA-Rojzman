<script lang="ts">
    import {scale, fade, slide} from "svelte/transition";
    import {sineInOut} from "svelte/easing"
    import {
        getTeamMember,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        uploadFile, deleteFiles, getPublicFileUrl, getTeamMembers
    } from "../../../scripts/database/database.ts";
    import {longpress} from "../../../scripts/ui/longpress.ts";
    import TwitterIcon from "../../Icons/TwitterIcon.svelte";
    import FlexIcon from "../../Icons/FlexIcon.svelte";
    import InstagramIcon from "../../Icons/InstagramIcon.svelte";
    import ImageCropperPopUp from "../General/ImageCropperPopUp.svelte";
    import LoadingWheel from "../../Misc/LoadingWheel.svelte";
    import EditableLinkIconWrapper from "./EditableLinkIconWrapper.svelte";
    import {compressImage} from "../../../scripts/media/Compressor";
    import {createEventDispatcher, onMount} from "svelte";
    import Alert from "../../Essentials/Alert.svelte";
    import {filedrop} from "filedrop-svelte";
    import {delay} from "../../../scripts/misc/delay";

    export let id;
    export let name = '';
    export let role = '';
    export let description = '';
    export let imageUrl = defaultImageUrl;

    export let instagramUrl = undefined;
    export let twitterUrl = undefined;
    export let flexUrl = undefined;

    export let newMember = false;

    const defaultImageUrl = "assets/DefaultProfilePicture.png";

    let dispatch = createEventDispatcher();

    // Checks whether the card has been edited by comparing start and current values
    let startName = name, startRole = role, startDescription = description, startImageUrl = imageUrl,
        startInstagramUrl = instagramUrl, startTwitterUrl = twitterUrl, startFlexUrl = flexUrl;

    $: edited = (startName != name || startRole != role || startDescription != description || startImageUrl != imageUrl
        || startInstagramUrl != instagramUrl || startTwitterUrl != twitterUrl || startFlexUrl != flexUrl)

    $: dispatch('edited', edited);

    let innerWidth = window.innerWidth;
    let textAreas = [];
    const resize = (elm) => {elm.style.height = "auto"; elm.style.height = (elm.scrollHeight) + "px";}
    onMount(() => [].slice.call(document.getElementsByTagName('textarea')).forEach((area) => {
        area.setAttribute("style", "overflow-y:hidden; resize: none");
        resize(area)
        area.addEventListener('input', () => resize(area));
        textAreas.push(area);
    }))
    $: if (innerWidth) {textAreas.forEach(resize)} // Triggers on window resize

    let submitState = 0; // 0 = inactive; 1 = loading; 2 = success; 3 = error
    let submitMessage; // The message displayed in the alert below the save button
    const submit = async () => {
        if (submitState === 2 || submitState === 3) { // Close the alert message instead of resubmitting
            submitState = 0;
            return;
        }

        submitState = 1;
        let filePath = `team/${id}.webp`
        let serverUrl;
        if (!(name && role && description)) {
            submitState = 3;
            submitMessage = 'Alle Pflichtfelder müssen ausgefüllt werden.'
            return;
        }
        try {
            if (avatarImage.src.match(/^blob:.+/g)) { // A new avatar was uploaded
                try {
                    await deleteFiles('images', [filePath]) // Delete the old image
                } catch (e) { // This will not trigger, when there was no old image!
                    submitState = 3;
                    submitMessage = e.message;
                    return;
                }

                let image = await fetch(avatarImage.src).then(r => r.blob()).then(blobFile => new File([blobFile], `${id}.png`, { type: "image/png" }));
                let cImage = await compressImage(image, 1.0, 192, 192);
                await uploadFile('images', filePath, cImage);
                serverUrl = await getPublicFileUrl('images', filePath) + `?t=${Date.now()}`;
            } else { // The old avatar is used
                serverUrl = imageUrl;
            }

            if (newMember) {
                await addTeamMember(id, name, role, description, serverUrl, instagramUrl, twitterUrl, flexUrl);
            }
            else {
                await updateTeamMember(id, name, role, description, serverUrl, instagramUrl, twitterUrl, flexUrl);
            }
            submitMessage = 'Team Mitglied erfolgreich ' + (newMember ? 'hinzugefügt' : 'bearbeitet') + '.';
            newMember = false;
            submitState = 2;
            // Reassigning start values
            startName = name; startRole = role; startDescription = description;  startImageUrl = imageUrl;
                startInstagramUrl = instagramUrl; startTwitterUrl = twitterUrl; startFlexUrl = flexUrl;
            await getTeamMembers(true);
        } catch (e) { // Error
            submitState = 3;
            submitMessage = `${e.message}`
        }
    }

    const reset = () => {
        if (!newMember) {
            getTeamMember(id).then((res) => {
                name = res.name;
                role = res.role;
                description = res.description;
                imageUrl = res.imageUrl;
                instagramUrl = '';
                twitterUrl = '';
                flexUrl = '';
                instagramUrl = res.instagramUrl;
                twitterUrl = res.twitterUrl;
                flexUrl = res.flexUrl;
                delay(1).then(() => textAreas.forEach(resize)); // Resizing doesn't work w/out the delay for some reason
            })
        }
    }

    let deleted;
    const del = async () => {
        if (!newMember) {
            try {
                await deleteTeamMember(id);
                try {
                    await deleteFiles('images', [`team/${id}.webp`])
                } catch (e) {}
                console.log(`Team Mitglied mit ID ${id} wurde gelöscht.`);
                await getTeamMembers(true);
                deleted = true;
            } catch (e) {
                alert(`Fehler beim löschen! ${e.message}`);
            }
        } else {
            deleted = true;
        }
    }

    // Avatar
    let fileDropOptions;
    let fileDropFiles;
    let fileDragOver = false;
    $: fileDropOptions = {accept: 'image/*', multiple: false, windowDrop: false, clickToUpload: false, hideInput: false, tabIndex: -1, fileLimit: readerLoading ? 0 : 1};
    $: if (fileDropFiles && fileDropFiles.accepted.length > 0) {files = fileDropFiles.accepted; fileDragOver = false}

    let files;
    let file;
    let fileReader = new FileReader();
    let avatarImage;
    let avatarLabel;
    let avatarInput;
    let showImageCropper = false;
    let readerLoading = false;
    let currentEditFile;
    let removeImageToggle = false;
    $: if (fileDragOver) removeImageToggle = false;

    $: if (files) {
        file = files[0];

        avatarImage.title = file.name;

        fileReader.onloadstart = function () {
            readerLoading = true;
        }

        fileReader.onload = function(event) {
            readerLoading = false;
            currentEditFile = event.target.result;
            showImageCropper = true;
        };

        fileReader.readAsDataURL(file);
        avatarLabel.blur();
        avatarInput.value = '';
    }

    // When the image input was focused with a mouse, cancelling the file selection dialog should hide the overlay
    let mouseFocus = false;
    let inputFocusCount = 0;
</script>
<svelte:window bind:innerWidth/>

{#if showImageCropper}<ImageCropperPopUp image={currentEditFile} on:submit={(e) => imageUrl = e.detail} on:close={() => showImageCropper = false}/>{/if}

{#if !deleted}
<div use:filedrop={fileDropOptions} on:filedrop={e => {fileDropFiles = e.detail.files}} on:filedragover={() => fileDragOver = true} on:filedragleave={() => fileDragOver = false} in:fade={{duration: 500}} out:scale|local={{duration: deleted ? 400 : 0}} role="listitem" class="{deleted ? 'hidden' : ''} relative mt-24 sm:min-w-[300px] mx-2 md:w-2/5 lg:w-2/5 xl:w-1/3 xl:max-w-sm bg-white dark:bg-slate-800">
    <div class="rounded overflow-hidden shadow-md">
        <div class="absolute -mt-20 w-full flex justify-center">
            <div in:scale={{easing: sineInOut, start: 0.3, duration: 500}} class="h-32 w-32 rounded-full overflow-hidden">
                <div class="relative rounded-full overflow-hidden h-full">
                    {#if readerLoading}
                        <div class="bg-gray-50 dark:bg-slate-900 flex min-h-full items-center justify-center pl-1.5">
                            <LoadingWheel size="20"/>
                        </div>
                    {/if}
                    <div class="{readerLoading ? 'hidden' : 'block'} h-full">
                        <img bind:this={avatarImage} src="{imageUrl}" alt="Profilbild von {name}" class="rounded-full object-cover h-full w-full drop-shadow-xl bg-white" />
                        <label on:focusin={() => mouseFocus = true} on:keydown={() => mouseFocus = false} on:mouseenter={() => removeImageToggle = false} on:click={() => {if (removeImageToggle) {imageUrl = defaultImageUrl; delay(1).then(() => removeImageToggle = false)}}} on:contextmenu|preventDefault={() => removeImageToggle = !removeImageToggle} bind:this={avatarLabel} for="avatar-input-{id}" class="has-tooltip absolute cursor-pointer inset-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100 {fileDragOver ? 'opacity-100' : ''}">
                            <span class="{removeImageToggle ? 'hidden' : ''} text-md font-medium">Ändern</span>
                            <span class="sr-only {removeImageToggle ? 'hidden' : ''}"> sie das Profilbild</span>
                            <input disabled={removeImageToggle} bind:this={avatarInput} bind:files on:focus={() => {if (inputFocusCount++%2!==0 && mouseFocus) avatarInput.blur()}} type="file" accept="image/*" id="avatar-input-{id}" name="avatar" class="absolute opacity-0 w-0">
                            {#if removeImageToggle}
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9 tooltip" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            {/if}
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div class="px-6 mt-16 ">
<!--            <h1 bind:innerHTML={name} placeholder="Name (*)" class="font-bold dark:text-slate-100 text-3xl text-center mb-1" contenteditable="true"></h1>-->
<!--            <p bind:innerHTML={role} placeholder="Rolle (*)" class="text-gray-800 dark:text-slate-100 text-sm text-center" contenteditable="true"></p>-->
<!--            <p bind:innerHTML={description} placeholder="Beschreibung (*)" class="text-center text-gray-600 dark:text-slate-200 text-base pt-3 font-normal" contenteditable="true"></p>-->
            <textarea bind:value={name} rows="1" placeholder="Name (*)" class="font-bold dark:text-slate-100 bg-transparent text-3xl text-center mb-1 w-full max-w-full"></textarea>
            <textarea bind:value={role} rows="1" placeholder="Rolle (*)" class="text-gray-800 dark:text-slate-100 bg-transparent text-sm text-center w-full max-w-full"></textarea>
            <textarea bind:value={description} rows="1" placeholder="Beschreibung (*)" class="text-center text-gray-600 bg-transparent dark:text-slate-200 text-base pt-3 font-normal w-full max-w-full"></textarea>

            <div class="w-full flex justify-center pt-5 pb-5">
                <EditableLinkIconWrapper on:change={e => flexUrl = e.detail} url={flexUrl} ariaLabel="Flex"><FlexIcon/></EditableLinkIconWrapper>
                <EditableLinkIconWrapper on:change={e => twitterUrl = e.detail} url={twitterUrl} ariaLabel="Twitter"><TwitterIcon/></EditableLinkIconWrapper>
                <EditableLinkIconWrapper on:change={e => instagramUrl = e.detail} url={instagramUrl} ariaLabel="Instagram"><InstagramIcon/></EditableLinkIconWrapper>
            </div>
            <div class="w-full mb-2 flex items-center justify-around">
                <div class="has-tooltip">
                    <button on:mouseup={e => e.currentTarget.blur()} on:mouseleave={e => e.currentTarget.blur()} use:longpress={1000} on:longpress={e => {e.currentTarget.blur(); del()}} on:keydown={e=>{if(e.code==='Space'||e.code==='Enter')del()}} class="mx-1 flex justify-center items-center font-medium text-primary-500 rounded-full border border-primary dark:border-none p-1 hover:text-primary-700 focus:animate-reverse-spin">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    <div class="tooltip absolute mt-1 -ml-4 z-10 py-2 px-3 flex text-sm font-medium text-black rounded-lg shadow bg-white dark:text-slate-200 dark:bg-slate-700">
                        Löschen
                    </div>
                </div>
                <div class="has-tooltip">
                    <button disabled={newMember || !edited} on:mouseup={e => e.currentTarget.blur()} on:mouseleave={e => e.currentTarget.blur()} use:longpress={1000} on:longpress={e => {e.currentTarget.blur(); reset()}} on:keydown={e=>{if(e.code==='Space'||e.code==='Enter')reset()}} class="text-primary-500  hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed mx-1 flex justify-center items-center font-medium rounded-full border border-primary dark:border-none p-1 focus:animate-reverse-spin disabled:focus:animate-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                            <path fill-rule="evenodd" d="M20.817 11.186a8.94 8.94 0 0 0-1.355-3.219 9.053 9.053 0 0 0-2.43-2.43 8.95 8.95 0 0 0-3.219-1.355 9.028 9.028 0 0 0-1.838-.18V2L8 5l3.975 3V6.002c.484-.002.968.044 1.435.14a6.961 6.961 0 0 1 2.502 1.053 7.005 7.005 0 0 1 1.892 1.892A6.967 6.967 0 0 1 19 13a7.032 7.032 0 0 1-.55 2.725 7.11 7.11 0 0 1-.644 1.188 7.2 7.2 0 0 1-.858 1.039 7.028 7.028 0 0 1-3.536 1.907 7.13 7.13 0 0 1-2.822 0 6.961 6.961 0 0 1-2.503-1.054 7.002 7.002 0 0 1-1.89-1.89A6.996 6.996 0 0 1 5 13H3a9.02 9.02 0 0 0 1.539 5.034 9.096 9.096 0 0 0 2.428 2.428A8.95 8.95 0 0 0 12 22a9.09 9.09 0 0 0 1.814-.183 9.014 9.014 0 0 0 3.218-1.355 8.886 8.886 0 0 0 1.331-1.099 9.228 9.228 0 0 0 1.1-1.332A8.952 8.952 0 0 0 21 13a9.09 9.09 0 0 0-.183-1.814z"/>
                        </svg>
                    </button>
                    {#if !newMember && edited}
                        <div class="tooltip absolute mt-1 -ml-8 z-10 py-2 px-3 flex text-sm font-medium text-black rounded-lg shadow bg-white dark:text-slate-200 dark:bg-slate-700">
                            Zurücksetzen
                        </div>
                    {/if}
                </div>
                <div class="has-tooltip">
                    <button on:click={submit} on:blur={() => {if (submitState > 1) submitState = 0}} class="mx-1 flex justify-center items-center font-medium text-primary-500 rounded-full border border-primary dark:border-none p-1 {['hover:text-primary-700', '', 'text-green-600 hover:text-green-700', 'text-red-500 hover:text-red-600'][submitState]}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 {['', 'animate-pulse', '', ''][submitState]}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <div class="tooltip absolute mt-1 -ml-5 z-10 py-2 px-3 flex text-sm font-medium text-black rounded-lg shadow bg-white dark:text-slate-200 dark:bg-slate-700">
                        {submitState === 2 ? 'Schließen' : 'Speichern'}
                    </div>
                </div>
            </div>
            {#if submitState > 1}
                <div class="mb-2" in:slide={{duration: 300}} out:slide|local={{duration: 300}}>
                    <Alert type={submitState === 3 ? 0 : 2} title={submitState === 3 ? "Fehler:" : "Gespeichert!"} description={submitMessage}/>
                </div>
            {/if}
        </div>
    </div>
</div>
{/if}