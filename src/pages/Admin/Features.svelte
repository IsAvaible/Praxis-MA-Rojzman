<script lang="ts">
    import {Feature, getFeatures} from "../../scripts/database/database";
    import {fade} from "svelte/transition";
    import FeatureCard from "../../lib/Features/FeatureCard.svelte";
    import PageTitle from "../../lib/Admin/Navigation/PageTitle.svelte";
    import Modal from "../../lib/Essentials/Modal.svelte";
    import AddFeatureForm from "../../lib/Admin/Features/AddFeatureForm.svelte";
    import DeleteFeatureForm from "../../lib/Admin/Features/DeleteFeatureForm.svelte";
    import Alert from "../../lib/Essentials/Alert.svelte";


    let options = [
        {title: 'Neue Leistung Hinzufügen', shortDescription: 'Fügen sie eine neue Leistung hinzu.', svgPaths: ['M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z']},
        {title: 'Leistung Bearbeiten', shortDescription: 'Editieren sie die ausgewählte Leistung.', svgPaths: ['M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z']},
        {title: 'Leistung Löschen', shortDescription: 'Löschen sie die ausgewählte Leistungen.', svgPaths: ['M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0']},
    ];
    let activeOption: number = -1;
    let selectedFeature: {index: number, data: Feature} = {index: -1, data: undefined};
    let refreshFeatures = 0; // Refresh features on increment
    let modification = false; // Whether the features were actually modified

    let tmp = true;
</script>

<!--{#if tmp}-->
<!--<Modal on:hide={() => tmp = false} hideOnClickOutside={false}>-->
<!--    <div class="w-[80vw]">-->
<!--        <HTMLEditor imageBucket="images" imagePath="team/"/>-->
<!--    </div>-->
<!--</Modal>-->
<!--{/if}-->

{#if activeOption !== -1}
    <Modal on:hide={() => {activeOption = -1; if (modification) refreshFeatures++; modification = false; selectedFeature={index: -1, data: undefined}}}>
        <div class="flex flex-col">
            <PageTitle titleAccent="{options[activeOption].title}" subTitle={options[activeOption].shortDescription} showTitle={false}/>
            {#if activeOption === 0}
                <AddFeatureForm on:modification={() => modification=true}/>
            {:else if activeOption === 1}
                <AddFeatureForm editMode={true} {...selectedFeature.data} on:modification={() => modification=true}/>
            {:else if activeOption === 2}
                <DeleteFeatureForm feature={selectedFeature} on:modification={() => modification=true}/>
            {/if}
        </div>
    </Modal>
{/if}
<div class="flex flex-col mx-1 sm:mx-auto w-full">
    <PageTitle titleAccent="Leistungen" subTitle="In dieser Sektion können die angebotenen Leistungen modifiziert und gelöscht, sowie neue Einträge hinzugefügt werden."/>
    <div class="my-4 grid grid-cols-1 gap-8 lg:grid-cols-3 mx-auto w-full h-fit align-middle">
        {#each options as option, i}
            <div on:click={() => activeOption = i} class="cursor-pointer max-w-[370px] mx-auto min-w-fit sm:w-full px-2">
                <FeatureCard name={undefined} centerSvg={false} {...option}/>
            </div>
        {/each}
    </div>
    <div class="divide-gray-200 divide-y-2 dark:divide-slate-700 my-4 mx-4 lg:my-10">
        <div class="text-center mb-3">
            <h2 class="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl dark:text-slate-100">Bisherige Leistungen</h2>
            <p class="mt-3 text-xl text-gray-500 dark:text-slate-400 sm:mt-4">Um eine der bisherigen Leistung auszuwählen, einfach diese anklicken.</p>
        </div>
        {#key refreshFeatures}
            {#await getFeatures(true) then features}
                <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 py-5">
                    {#each features as feature, i}
                        <div in:fade={{duration: 500}} on:click={() => selectedFeature = selectedFeature.index === i ? {index: -1, data: undefined} : {index: i, data: feature}} class="mx-4 cursor-pointer h-full my-auto rounded-lg p-1 {selectedFeature.index===i?'bg-primary-300':''}">
                            {#if selectedFeature.index === i}<span class="float-right h-3 w-3 mr-1 mt-1 justify-center inline-flex h-full w-full rounded-full bg-primary-500 opacity-100"></span>{/if}
                            <FeatureCard {...feature}></FeatureCard>
                        </div>
                    {/each}
                </div>
            {:catch e}
                <Alert type={0} title="Leistungen konnten nicht geladen werden!" description="Error: {e.message}"/>
            {/await}
        {/key}
    </div>
</div>


