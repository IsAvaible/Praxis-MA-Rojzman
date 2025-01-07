<script lang="ts">
    import type {Feature} from "../../scripts/database/database";
    import {getFeatures, getShowcasedFeatures, updateFeatureOrder} from "../../scripts/database/database";
    import {fade} from "svelte/transition";
    import FeatureCard from "../../lib/Features/FeatureCard.svelte";
    import PageTitle from "../../lib/Admin/Navigation/PageTitle.svelte";
    import Modal from "../../lib/Essentials/Modal.svelte";
    import AddFeatureForm from "../../lib/Admin/Features/AddFeatureForm.svelte";
    import DeleteFeatureForm from "../../lib/Admin/Features/DeleteFeatureForm.svelte";
    import Alert from "../../lib/Essentials/Alert.svelte";
    import LoadingWheel from "../../lib/Misc/LoadingWheel.svelte";


    let options = [
        {title: 'Neue Leistung Hinzufügen', shortDescription: 'Fügen sie eine neue Leistung hinzu.', svgPaths: ['M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z']},
        {title: 'Leistung Bearbeiten', shortDescription: 'Editieren sie die ausgewählte Leistung.', svgPaths: ['M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z']},
        {title: 'Leistung Löschen', shortDescription: 'Löschen sie die ausgewählte Leistungen.', svgPaths: ['M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0']},
    ];
    let activeOption: number = -1;
    let selectedFeature: {index: number, data: Feature} = {index: -1, data: undefined};
    let refreshFeatures = 0; // Refresh features on increment
    let modification = false; // Whether the features were actually modified
    const changeOrder = async (feature: Feature, features: Feature[], by: number) => {
        // Return if the feature is already at the top or bottom
        if (by === -1 && feature.order === 0 || by === 1 && feature.order === features.length - 1) return;
        // Update objects
        const index = features.indexOf(feature);
        let sibling = features[index + by];
        sibling.order = feature.order;
        feature.order = feature.order + by;
        // Update the order of the features in the database
        await updateFeatureOrder(feature.name, feature.order, true);
        await updateFeatureOrder(sibling.name, sibling.order, false);
        // Update the selected feature to reflect the new order
        selectedFeature.index = index + by;
        // Refresh the features
        refreshFeatures++;
    }

    const onFeatureClick = (feature: Feature, i: number) => {
        if (selectedFeature.index === i) activeOption = 1;
        else selectedFeature = {index: i, data: feature};
    }
</script>

<!--{#if tmp}-->
<!--<Modal on:hide={() => tmp = false} hideOnClickOutside={false}>-->
<!--    <div class="w-[80vw]">-->
<!--        <HTMLEditor imageBucket="images" imagePath="team/"/>-->
<!--    </div>-->
<!--</Modal>-->
<!--{/if}-->

{#if activeOption !== -1}
    <Modal showMobileCloseButton={true} on:hide={() => {if (activeOption !== 1) selectedFeature={index: -1, data: undefined}; activeOption = -1; if (modification) refreshFeatures++; modification = false;}}>
        <div class="flex flex-col">
            <PageTitle titleAccent="{options[activeOption].title}" subTitle={options[activeOption].shortDescription} showTitle={false}/>
            {#key refreshFeatures}{#await getShowcasedFeatures() then showcasedFeatures}
                {#if activeOption === 0}
                    <AddFeatureForm {showcasedFeatures} on:modification={() => modification=true}/>
                {:else if activeOption === 1}
                    <AddFeatureForm editMode={true} {...selectedFeature.data} {showcasedFeatures} on:modification={() => modification=true} />
                {:else if activeOption === 2}
                    <DeleteFeatureForm feature={selectedFeature} on:modification={() => modification=true}/>
                {/if}
            {/await}{/key}
        </div>
    </Modal>
{/if}
<div class="flex flex-col mx-1 sm:mx-auto w-full">
    <PageTitle titleAccent="Leistungen" subTitle="In dieser Sektion können die angebotenen Leistungen modifiziert und gelöscht, sowie neue Einträge hinzugefügt werden."/>
    <div class="my-4 grid grid-cols-1 gap-8 lg:grid-cols-3 mx-auto w-full h-fit align-middle">
        {#each options as option, i}
            <button on:click={() => activeOption = i} class="cursor-pointer max-w-[370px] mx-auto min-w-fit sm:w-full px-2">
                <FeatureCard name={undefined} centerSvg={false} {...option}/>
            </button>
        {/each}
    </div>
    <div class="divide-gray-200 divide-y-2 dark:divide-slate-700 my-4 sm:mx-4 lg:my-10">
        <div class="text-center mb-3">
            <h2 class="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl dark:text-slate-100">Bisherige Leistungen</h2>
            <p class="mt-3 text-xl text-gray-500 dark:text-slate-400 sm:mt-4">Um eine der bisherigen Leistung auszuwählen, einfach diese anklicken.</p>
        </div>
        {#key refreshFeatures}
            {#await getFeatures(true)}
                <div class="w-full mt-6 pt-6 flex justify-center">
                    <LoadingWheel size={25} showAfter={1000}/>
                </div>
            {:then features}
                {#if features.length === 0}
                    <Alert type={1} title="Keine Leistungen vorhanden." description="Es sind noch keine Leistungen vorhanden. Bitte fügen sie eine Leistung hinzu."/>
                {:else}
                    {#await getShowcasedFeatures(true)}
                        <div class="w-full mt-6 pt-6 flex justify-center">
                            <LoadingWheel size={25} showAfter={1000}/>
                        </div>
                    {:then showcasedFeatures}
                        {#if showcasedFeatures.length !== 3}
                            <div class="pt-6">
                                <Alert type={1} title="Zu wenige Leistungen auf der Startseite." description="Momentan werden nur {showcasedFeatures.length} Leistungen auf der Startseite angezeigt. Bitte setzen sie mehr Leistungen über den Bearbeitungsdialog auf die Startseite um die Anzahl auf 3 zu erhöhen."/>
                            </div>
                        {/if}
                        <div class="mt-6 pt-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 py-5 gap-y-3">
                        {#each features as feature, i}
                            <button in:fade={{duration: 500}} on:click={() => onFeatureClick(feature, i)} class="mx-4 cursor-pointer h-full my-auto rounded-lg p-1 relative {selectedFeature.index===i?'bg-primary-300':''}">
                                <!--  If the feature is showcased on the homepage, show a star icon in the top left corner -->
                                {#if showcasedFeatures.map(f => f.name).includes(feature.name)}
                                    <div class="float-left h-3 w-3 rounded-full ml-1 mt-1 text-yellow-400 flex justify-start items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                {/if}
                                {#if selectedFeature.index === i}
                                    <div class="absolute h-full w-[115%] flex -ml-[9%] {i === 0 ? 'justify-end' : 'justify-between'}">
                                        {#if i !== 0}
                                            <button on:click|stopPropagation on:click={()=> changeOrder(feature, features, -1)} class="text-gray-800 hover:text-black dark:text-slate-200 dark:hover:text-slate-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                                </svg>
                                            </button>
                                        {/if}
                                        {#if i !== features.length - 1}
                                            <button on:click|stopPropagation on:click={()=> changeOrder(feature, features, +1)} class="text-gray-800 hover:text-black dark:text-slate-200 dark:hover:text-slate-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                </svg>
                                            </button>
                                        {/if}
                                    </div>
                                    <span class="float-right h-3 w-3 mr-1 mt-1 justify-center inline-flex rounded-full bg-primary-500 opacity-100"></span>
                                {/if}

                                <FeatureCard {...feature} expandViaIcon={false}></FeatureCard>
                            </button>
                        {/each}
                    </div>
                    {/await}
                {/if}
            {:catch e}
                <Alert type={0} title="Leistungen konnten nicht geladen werden!" description="Error: {e.message}"/>
            {/await}
        {/key}
    </div>
</div>


