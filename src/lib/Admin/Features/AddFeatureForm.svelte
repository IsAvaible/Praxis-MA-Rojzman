<script lang="ts">
    import {getFeatures, addFeature, updateFeature} from "../../../scripts/database/database";
    import {createEventDispatcher} from "svelte";
    import Alert from "../../Essentials/Alert.svelte";
    import SvgSelector from "../General/SvgSelector.svelte";
    import HTMLEditor from "../General/HTMLEditor.svelte";
    import {unsavedChangesStore} from "../../../scripts/stores/unsavedChangesStore";
    import LoadingWheel from "../../Misc/LoadingWheel.svelte";

    export let editMode: boolean = false;
    export let name = '';
    export let title = '';
    export let shortDescription = '';
    export let longDescription = '' || '<p>Eine ausführliche Beschreibung (Optional)</p>';
    export let svgPaths = undefined;
    export let startName = name;

    // Checks whether the feature has been edited by comparing start and current values
    let startTitle = title, startShortDescription = shortDescription, startLongDescription = longDescription, startSvgPaths = svgPaths;
    $: edited = (startTitle != title || startShortDescription != shortDescription || startLongDescription != longDescription || startSvgPaths != svgPaths);
    $: unsavedChangesStore.set(edited);

    let names = [];
    getFeatures().then(v => names = v.map(f => f.name)).catch();

    let nameValid;
    $: nameValid = (name === startName || names.findIndex(f => f == name) === -1) && name === (name = name.match(/[a-z\d-_+]*/g)?.join(''));

    let emptySvg = "M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5";

    let svgSelectorState = false;
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
</script>

<!--The Edit Mode was entered with a feature selected.-->
{#if !editMode || startName}
    {#if svgSelectorState} <SvgSelector modalTopModal={true} iframeHeight="420px" on:submit={(event) => {svgPaths = event.detail; disableSubmitted(); svgSelectorState = false}} on:close={() => {disableSubmitted(); svgSelectorState = false}}/>{/if}

    <form on:submit|preventDefault={() => loading = submitted = true} class="{svgSelectorState?'invisible':''}">
        <input autocomplete="off" bind:value={title} on:focus={disableSubmitted} required class="mb-6 w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none focus:border-primary-500" placeholder="Ein prägnanter Titel (*)" type="text" title={editMode?'Titel (*)':''} />
        <input autocomplete="off" bind:value={shortDescription} on:focus={disableSubmitted} required class="mb-6 w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none focus:border-primary-500" placeholder="Eine kurze Beschreibung (*)" type="text" title={editMode?'Kurzbeschreibung (*)':''}/>
        <input autocomplete="off" bind:value={name} disabled={editMode} on:focus={disableSubmitted} required class="mb-6 w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none disabled:bg-gray-100 disabled:dark:bg-slate-800 {nameValid?'focus:border-primary-500':'border-red-500'}" placeholder="Ein einmaliger Name für die Leistung (URL) (*)" pattern="[a-z0-9-_+]+" title="Name der Leistung, Lediglich Kleinbuchstaben, -, _ und +, keine Umlaute o.ä." type="text" id="featureName"/>
        <div class="mb-6" on:mousedown={disableSubmitted} title={editMode?'Ausführliche Beschreibung (Optional)':''}>
            <HTMLEditor bind:saved={submitted} bind:editorData={longDescription} imageBucket="images" imagePath="feature/content/"/>
        </div>
        <div class="flex justify-center mb-6">
            <input required bind:value={svgPaths} class="absolute opacity-0 pointer-events-none">
            <button on:click={() => {svgSelectorState = true}} class="min-w-full lg:min-w-[50%] inline-flex font-light rounded-md border border-primary-400 p-3 transition hover:border-primary-600 items-center">
                <span class="inline-flex p-3 bg-primary-500 rounded-md shadow-lg w-fit">
                    <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        {#each svgPaths || [emptySvg] as path}
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={path} />
                        {/each}
                    </svg>
                </span>
                <span class="flex-grow font-light text-lg">Icon {!svgPaths ? 'auswählen (*)' : 'ändern'}</span>
            </button>
        </div>
        <button disabled={submitted} type="submit" class="w-full flex justify-center font-medium text-white bg-primary-600 rounded-md border border-primary dark:border-none p-3 transition hover:bg-primary-700">
            {editMode?'Speichern':'Hinzufügen'}
            {#if loading}
                <span class="ml-2"><LoadingWheel/></span>
            {/if}
        </button>
    </form>
    {#if submitted && !svgSelectorState}
        <div class="mt-4">
            {#await (editMode?updateFeature:addFeature)(name, title, shortDescription, longDescription, svgPaths) then data}
                <Alert type={2} title="Erfolg!{disableLoading()+onModify()}" description='Die Leistung mit dem Namen "{name}" wurde erfolgreich {editMode?"bearbeitet":"hinzugefügt"}.'/>
            {:catch e}
                <Alert type={0} title="Error!{disableLoading()}" description={e.message} on:click={() => submitted = false}/>
            {/await}
        </div>
    {/if}
{:else}
    <Alert type={0} title="Fehler!" description="Bitte wählen sie zuerst eine Leistung durch klicken aus."></Alert>
{/if}