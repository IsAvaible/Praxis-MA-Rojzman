<script lang="ts">
    import {addBlogEntry, getBlogEntries, getUser, updateBlogEntry} from "../../../scripts/database/database";
    import {createEventDispatcher} from "svelte";
    import Alert from "../../Essentials/Alert.svelte";
    import HTMLEditor from "../General/HTMLEditor.svelte";
    import {unsavedChangesStore} from "../../../scripts/stores/unsavedChangesStore";
    import AddImageButtonWithPreview, {uploadCurrent} from "../General/AddImageButtonWithPreview.svelte";
    import LoadingWheel from "../../Misc/LoadingWheel.svelte";


    export let editMode: boolean = false;
    export let id = '';
    export let title = '';
    export let previewText = '';
    export let content = '<p>Der Inhalt der Beitrags (*)</p>';
    export let previewImageUrl = undefined;
    export let startId = id;

    // Checks whether the feature has been edited by comparing start and current values
    let startTitle = title, startPreviewText = previewText, startContent = content, startPreviewImageUrl = previewImageUrl;
    $: edited = (startTitle != title || startPreviewText != previewText || startContent != content || startPreviewImageUrl != previewImageUrl);
    $: unsavedChangesStore.set(edited);

    let ids = [];
    getBlogEntries().then(v => ids = v.map(f => f.id)).catch();

    let idInvalidState;
    $: if (!editMode && ids.includes(id)) {
        idInvalidState = 'duplicate';
    } else if (id !== (id = id.match(/[a-z\d-_+]*/g)?.join(''))) {
        idInvalidState = 'syntax';
    } else {
        idInvalidState = '';
    }

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
        <input autocomplete="off" bind:value={id} disabled={editMode} on:focus={disableSubmitted} on:blur={() => idInvalidState = idInvalidState === 'syntax' ? '' : idInvalidState} required class="{!idInvalidState ? 'mb-6' : ''} w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none disabled:bg-gray-100 disabled:dark:bg-slate-800 {!idInvalidState?'focus:border-primary-500':'border-red-500'}" placeholder="Eine einmalige ID für den Beitrag (URL) (*)" pattern="[a-z0-9-_+]+" title="Die einmalige ID der Leistung" type="text" id="featureName"/>
        {#if idInvalidState === 'syntax'}
            <div class="text-red-500 text-sm mb-6">Die ID darf nur Kleinbuchstaben, Zahlen, - und _ enthalten.</div>
        {:else if idInvalidState === 'duplicate'}
            <div class="text-red-500 text-sm mb-6">Die ID ist bereits vergeben.</div>
        {/if}
        <input autocomplete="off" bind:value={previewText} on:focus={disableSubmitted} required class="mb-6 w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none focus:border-primary-500" placeholder="Eine kurze Zusammenfassung des Inhalts (*)" type="text" title={editMode?'Kurze Zusammenfassung des Inhalts (*)':''} />
        <div class="mb-6" on:mousedown={disableSubmitted} title={editMode?'Inhalt des Beitrags':''}>
            <HTMLEditor bind:saved={submitted} bind:exportData={content} editorData={content} imageBucket="images" imagePath="blog/content/"/>
        </div>
        <div class="flex justify-center mb-6">
            <input required bind:value={previewImageUrl} class="absolute opacity-0 pointer-events-none">
            <AddImageButtonWithPreview imageUrl={previewImageUrl} on:change={e => previewImageUrl = e.detail} on:imageCropperStateChange={e => imageCropperActive = e.detail}/>
        </div>
        <button disabled={submitted || (idInvalidState && idInvalidState !== 'syntax')} type="submit" class="w-full flex justify-center font-medium text-white bg-primary-600 disabled:bg-primary-400 rounded-md border border-primary dark:border-none p-3 transition hover:bg-primary-700 disabled:hover:bg-primary-400">
            {editMode?'Speichern':'Hinzufügen'}
            {#if loading}
                <span class="ml-2"><LoadingWheel/></span>
            {/if}
        </button>
    </form>
    {#if submitted}
        <div class="mt-4">
            {#await uploadCurrent(`blog/preview/${id}.webp`, id, {quality: 0.9, maxWidth: 600, maxHeight: 338}) then previewImageUrl}
                {#await getUser() then user}
                {#await (editMode?updateBlogEntry:addBlogEntry)(id, user.email, title, previewText, content, previewImageUrl) then data}
                    <Alert type={2} title="Erfolg!{disableLoading()+onModify()}" description='Der Beitrag mit der ID "{id}" wurde erfolgreich {editMode?"bearbeitet":"hinzugefügt"}.'/>
                {:catch e}
                    <Alert type={0} title="Error!{disableLoading()}" description={e.message} on:click={() => submitted = false}/>
                {/await}
                {/await}
            {:catch e}
                <Alert type={0} title="Error!{disableLoading()}" description={e.message} on:click={() => submitted = false}/>
            {/await}
        </div>
    {/if}
{:else}
    <Alert type={0} title="Fehler!" description="Bitte wählen sie zuerst eine Leistung durch klicken aus."></Alert>
{/if}