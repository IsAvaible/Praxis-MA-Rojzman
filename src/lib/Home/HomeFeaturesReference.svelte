<script lang="ts">
    import {Link} from "svelte-navigator";
    import {fade} from "svelte/transition";
    import {getFeature, getShowcasedFeatures} from "../../scripts/database/database";
    import Alert from "../Essentials/Alert.svelte";
    import LoadingWheel from "../Misc/LoadingWheel.svelte";

    let showcasedFeatures = getShowcasedFeatures().then(d => Promise.all(d.map(f => getFeature(f.name))));
</script>

<div class="py-12">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="sr-only">Unsere Leistungen</h2>
        {#await showcasedFeatures}
            <div class="w-full h-20 mt-12 pt-12 flex justify-center items-center">
                <LoadingWheel size={25} showAfter={1000}/>
            </div>
        {:then showcasedFeatures}
            <dl class="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
                {#each showcasedFeatures as {name, title, shortDescription, longDescription, svgPaths}}
                    <div in:fade={{duration: 100}}>
                        <div>
                            <Link to={'leistungen/' + (longDescription ? name : '')}>
                                <div class="flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white hover:bg-primary-700 cursor-pointer">
                                    <!-- Heroicon name: outline/globe-alt -->
                                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        {#each svgPaths as path}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{path}" />
                                        {/each}
                                    </svg>
                                </div>
                            </Link>
                            <p class="mt-5 text-lg leading-6 font-medium text-gray-900 dark:text-slate-100">{title}</p>
                        </div>
                        <dd class="mt-2 text-base text-gray-500 dark:text-slate-200">{shortDescription}</dd>
                        <div class="w-full"><Link to={'leistungen/' + (longDescription ? name : '')} aria-label={shortDescription}><span class="ml-auto mr-4 table cursor-pointer text-gray-900 dark:text-slate-200 hover:underline">Mehr erfahren</span></Link></div>
                    </div>
                {/each}
            </dl>
        {:catch e}
            <Alert type={1} title='Leistungen konnten nicht geladen werden.' description="Wir konnten die angeforderten Daten nicht laden. Überprüfen sie bitte ihre Internetverbindung."/>
        {/await}
<!--        <div class="w-full">-->
<!--            <span class="mt-8 mx-auto table cursor-pointer border border-transparent rounded-md shadow px-5 py-3 inline-flex items-center text-base font-medium bg-primary-600 text-white hover:bg-primary-700 dark:text-slate-100" on:click={() => navigate('/leistungen')}>-->
<!--            Erfahren sie mehr über unsere Leistungen-->
<!--        </span>-->
<!--        </div>-->

    </div>
</div>