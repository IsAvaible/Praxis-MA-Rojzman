<script lang="ts">
    import {navigate} from "svelte-navigator";

    let features = [
        {title: 'Vorsorgeuntersuchungen', description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.', link: '/leistungen/', svgPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'},
        {title: 'Corona Schnell und PCR Tests', description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.', link: '/leistungen/', svgPath: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2'},
        {title: 'Hausbesuche', description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.', link: '/leistungen/', svgPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'},
    ];
</script>

<div class="py-12">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="sr-only">Unsere Leistungen</h2>
        <dl class="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {#each features as feature}
                <div>
                    <dt>
                        <div class="flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                            <!-- Heroicon name: outline/globe-alt -->
                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{feature.svgPath}" />
                            </svg>
                        </div>
                        <p class="mt-5 text-lg leading-6 font-medium text-gray-900 dark:text-slate-100">{feature.title}</p>
                    </dt>
                    <dd class="mt-2 text-base text-gray-500 dark:text-slate-200">{feature.description}</dd>
                    <div class="w-full"><span on:click={() => navigate(feature.link)} class="ml-auto mr-4 table cursor-pointer text-gray-900 hover:text-black dark:text-slate-200 hover:dark:text-slate-100">Mehr erfahren</span></div>
                </div>
            {/each}
        </dl>
<!--        <div class="w-full">-->
<!--            <span class="mt-8 mx-auto table cursor-pointer border border-transparent rounded-md shadow px-5 py-3 inline-flex items-center text-base font-medium bg-primary-600 text-white hover:bg-primary-700 dark:text-slate-100" on:click={() => navigate('/leistungen')}>-->
<!--            Erfahren sie mehr über unsere Leistungen-->
<!--        </span>-->
<!--        </div>-->

    </div>
</div>