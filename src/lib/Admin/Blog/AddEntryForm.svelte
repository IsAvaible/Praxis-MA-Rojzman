<script lang="ts">
    import {getBlogEntries, addBlogEntry, updateBlogEntry, getUser} from "../../../scripts/database/database";
    import {createEventDispatcher} from "svelte";
    import Alert from "../../Essentials/Alert.svelte";
    import HTMLEditor from "../General/HTMLEditor.svelte";
    import {unsavedChangesStore} from "../../../scripts/stores/unsavedChangesStore";
    import AddImageButtonWithPreview, { uploadCurrent } from "../General/AddImageButtonWithPreview.svelte";
    import LoadingWheel from "../../Misc/LoadingWheel.svelte";


    export let editMode: boolean = false;
    export let id = '';
    export let title = '';
    export let previewText = '';
    export let content = '' || '<p>Der Inhalt der Beitrags (*)</p>';
    export let previewImageUrl = undefined;
    export let startId = id;

    // Checks whether the feature has been edited by comparing start and current values
    let startTitle = title, startPreviewText = previewText, startContent = content, startPreviewImageUrl = previewImageUrl;
    $: edited = (startTitle != title || startPreviewText != previewText || startContent != content || startPreviewImageUrl != previewImageUrl);
    $: unsavedChangesStore.set(edited);
    $: console.log(previewImageUrl);

    let ids = [];
    getBlogEntries().then(v => ids = v.map(f => f.id)).catch();

    let nameValid;
    $: nameValid = (id === startId || ids.findIndex(e => e == id) === -1) && id === (id = id.match(/[a-z\d-_+]*/g)?.join(''));

    let imageCropperActive = false;
    let previewImageChanged = undefined;
    let loading = false;
    let submitted = false;

    const disableSubmitted = () => {
        submitted = false;
        disableLoading();
    }
    const disableLoading = () => {
        loading = false;
        return '';
    }

    let dispatch = createEventDispatcher();
    const onModify = () => {
        unsavedChangesStore.set(false);
        dispatch('modification');
        return '';
    }

    $: if (imageCropperActive) {submitted = false}
</script>

<!--The Edit Mode was entered with a entry selected.-->
{#if !editMode || startId}
    <form on:submit|preventDefault={() => loading = submitted = true}>
        <input autocomplete="off" bind:value={title} on:focus={disableSubmitted} required class="mb-6 w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none focus:border-primary-500" placeholder="Ein prägnanter Titel (*)" type="text" title={editMode?'Titel (*)':''} />
        <input autocomplete="off" bind:value={id} disabled={editMode} on:focus={disableSubmitted} required class="mb-6 w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none disabled:bg-gray-100 disabled:dark:bg-slate-800 {nameValid?'focus:border-primary-500':'border-red-500'}" placeholder="Eine einmalige ID für den Beitrag (URL) (*)" pattern="[a-z0-9-_+]+" title="ID der Leistung, Lediglich Kleinbuchstaben, -, _ und +, keine Umlaute o.ä." type="text" id="featureName"/>
        <input autocomplete="off" bind:value={previewText} on:focus={disableSubmitted} required class="mb-6 w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none focus:border-primary-500" placeholder="Eine kurze Zusammenfassung des Inhalts (*)" type="text" title={editMode?'Kurze Zusammenfassung des Inhalts (*)':''} />
        <div class="mb-6" on:mousedown={disableSubmitted} title={editMode?'Inhalt des Beitrags':''}>
            <HTMLEditor bind:saved={submitted} bind:editorData={content} imageBucket="images" imagePath="feature/"/>
        </div>
        <div class="flex justify-center mb-6">
            <input required bind:value={previewImageUrl} class="absolute opacity-0 pointer-events-none">
            <AddImageButtonWithPreview imageUrl={previewImageUrl} on:change={e => previewImageUrl = e.detail} on:imageCropperStateChange={e => imageCropperActive = e.detail}/>
        </div>
        <button disabled={submitted} type="submit" class="w-full flex justify-center font-medium text-white bg-primary-600 rounded-md border border-primary dark:border-none p-3 transition hover:bg-primary-700">
            {editMode?'Speichern':'Hinzufügen'}
            {#if loading}
                <span class="ml-2"><LoadingWheel/></span>
            {/if}
        </button>
    </form>
    {#if submitted}
        <div class="mt-4">
            {#await uploadCurrent(`blog/${id}.webp`, id, {quality: 0.9, maxWidth: 600, maxHeight: 338}) then previewImageUrl}
                {#await (editMode?updateBlogEntry:addBlogEntry)(id, getUser().email, title, previewText, content, previewImageUrl) then data}
                    <Alert type={2} title="Erfolg!{disableLoading()+onModify()}" description='Der Beitrag mit der ID "{id}" wurde erfolgreich {editMode?"bearbeitet":"hinzugefügt"}.'/>
                {:catch e}
                    <Alert type={0} title="Error!{disableLoading()}" description={e.message} on:click={() => submitted = false}/>
                {/await}
            {:catch e}
                <Alert type={0} title="Error!{disableLoading()}" description={e.message} on:click={() => submitted = false}/>
            {/await}
        </div>
    {/if}
{:else}
    <Alert type={0} title="Fehler!" description="Bitte wählen sie zuerst eine Leistung durch klicken aus."></Alert>
{/if}