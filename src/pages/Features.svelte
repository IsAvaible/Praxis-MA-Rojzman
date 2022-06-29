<script lang="ts">
    import {getFeatures} from "../scripts/database/database.ts";
    import { fade } from "svelte/transition";
    import { useParams } from 'svelte-navigator'
    import FeaturePopUp from "../lib/Features/FeaturePopUp.svelte";
    import FeatureCard from "../lib/Features/FeatureCard.svelte";
    import Alert from "../lib/Essentials/Alert.svelte";

    let features: {title: string, description: string, svgPath: string}[];
    let title = 'Unsere Leistungen';
    let subtitle = 'Diese Services bieten wir ihnen an';
    let description = 'Phasellus lorem quam molestie id quisque diam aenean nulla in. Accumsan in quis quis nunc, ullamcorper malesuada. Eleifend condimentum id viverra nulla.';

    let params = useParams();
    let detailPopUpActive = true;
</script>

{#key detailPopUpActive}
    {#if $params.name && detailPopUpActive}
        <FeaturePopUp name={$params.name} on:hide={() => detailPopUpActive = false}/>
    {/if}
{/key}
<div class="relative py-8 lg:py-12">
    <div class="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">
        <h1 class="text-gray-500 dark:text-slate-100 text-lg text-center font-normal pb-3 uppercase">{title}</h1>
        <h2 class="xl:text-4xl text-3xl text-center text-gray-800 dark:text-slate-200 font-extrabold sm:w-4/6 w-5/6 mx-auto focus:outline-transparent">{subtitle}</h2>
        <p class="mt-5 max-w-prose mx-auto text-xl text-gray-500 dark:text-slate-300">{description}</p>
        <div class="mt-12">
            {#await getFeatures() then features}
                <div in:fade={{duration: 500}} class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {#each features as feature}
                        <FeatureCard {...feature} on:popUpShow={() => detailPopUpActive = true}/>
                    {/each}
                </div>
            {:catch e}
                <Alert type={1} title="Fehler beim Laden." description="Wir konnten die angeforderten Daten nicht laden, überprüfen sie bitte ihre Internetverbindung."/>
            {/await}
        </div>
    </div>
</div>