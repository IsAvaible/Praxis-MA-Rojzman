<script lang="ts">
    import {
        getBannerConfig,
        getConfigEntry,
        updateConfigEntry,
        supabase, updateBannerConfig, deleteBannerConfig, addBannerConfig
    } from "../../../scripts/database/database";
    import Alert from "../../Essentials/Alert.svelte";
    import LoadingWheel from "../../Misc/LoadingWheel.svelte";
    import {adminPreviewBannerDataStore} from "../../../scripts/stores/adminPreviewBannerDataStore";
    import SvgSelector from "../General/SvgSelector.svelte";
    import {delay} from "../../../scripts/misc/delay";
    import {slide} from "svelte/transition";
    import {scrollToHeader} from "../../../scripts/misc/scrollToHeader";
    import {onDestroy} from "svelte";

    let showConfigScreen = false;

    let selectedBannerConfig; // The name of the config that is selected the database
    let bannerConfig;
    let presetNames;
    const getInitialConfig = async () => {
        selectedBannerConfig = (await getConfigEntry("selected-banner-config", true)).data["name"] as string;

        bannerConfig = await getBannerConfig(selectedBannerConfig);
        const { data, error } = await supabase
            .from('Banner-Config')
            .select('name');
        if (error) throw error;

        presetNames = data.map((entry) => entry.name);
        if (bannerConfig.name === 'preset') {
            bannerConfig.name = 'Banner 1';
            presetNames.push(bannerConfig.name);
        }
        svgPaths = bannerConfig.svgPaths;
        return bannerConfig;
    }

    let svgSelectorState = false;
    let emptySvg = "M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5";
    let svgPaths;
    $: if (svgPaths) bannerConfig.svgPaths = svgPaths;

    let saveLoading = false;
    let deleteLoading = false;

    let previewBannerActive;
    const unsubscribe = adminPreviewBannerDataStore.subscribe((value) => {
        previewBannerActive = !!value;
    });
    onDestroy(unsubscribe);

    const togglePreviewBanner = () => {
        adminPreviewBannerDataStore.set(previewBannerActive ? null : bannerConfig);
        delay(100).then(() => {
            const bannerElement = document.getElementById("adminPreviewBanner");
            if (bannerElement && previewBannerActive) {
                scrollToHeader();
            }
        })

    }

    $: if (previewBannerActive) adminPreviewBannerDataStore.set(bannerConfig);


    const onConfigurationNameSelection = (event) => {
        const previousSelection = bannerConfig.name;
        delay(1).then(async () => {
            if (bannerConfig.name === '#new#') {
                const newName = prompt('Geben sie den Namen der neuen Konfiguration ein:');
                if (newName && !presetNames.includes(newName)) {
                    bannerConfig = await getBannerConfig('preset');
                    presetNames.push(newName);
                    presetNames = presetNames;
                    bannerConfig.name = newName;
                    svgPaths = bannerConfig.svgPaths;
                    await addBannerConfig(bannerConfig);
                    // await updateConfigEntry('selected-banner-config', {name: newName});
                } else {
                    bannerConfig.name = previousSelection;
                }
            } else if (bannerConfig.name != previousSelection) {
                bannerConfig = await getBannerConfig(bannerConfig.name);
                svgPaths = bannerConfig.svgPaths;
                // await updateConfigEntry('selected-banner-config', {name: bannerConfig.name});
            }
        })
    }

    const saveCurrentConfig = async () => {
        saveLoading = true;
        await updateBannerConfig(bannerConfig);
        await updateConfigEntry('selected-banner-config', {name: bannerConfig.name})
        selectedBannerConfig = bannerConfig.name;
        saveLoading = false;
    }

    const deleteCurrentConfig = async () => {
        if (confirm(`Wollen sie die Konfiguration "${bannerConfig.name}" wirklich löschen? Sie können stattdessen auch eine neue Konfiguration erstellen oder eine andere auswählen.`)) {
            deleteLoading = true;
            await deleteBannerConfig(bannerConfig.name);
            let isSelected = bannerConfig.name == selectedBannerConfig;
            presetNames = presetNames.filter((name) => name !== bannerConfig.name);
            if (presetNames.length > 1) { // Indexing position 1 to account for the preset which should always be present
                bannerConfig.name = presetNames[1]; // Select the first non-preset config
                bannerConfig = await getBannerConfig(presetNames[1]);
                console.log(bannerConfig.name);
            } else { // If there is only one config left (preset), create a new one
                bannerConfig = await getBannerConfig('preset');
                presetNames.push('Banner 1');
                bannerConfig.name = 'Banner 1';
                presetNames = presetNames;
            }
            if (isSelected) {
                await updateConfigEntry('selected-banner-config', {name: bannerConfig.name});
                selectedBannerConfig = bannerConfig.name;
            }
            deleteLoading = false;
        }
    }
</script>


<div class="flex items-center justify-between pt-6 pb-6">
    <div class="flex items-center">
        <div class="flex-shrink-0 h-10 w-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 dark:text-slate-200">
                <path d="M4 16l.01-.011M4 20l.01-.011M8 20l.01-.011M12 20l.01-.011M16 20l.01-.011M20 20l.01-.011M20 16l.01-.011M4 12V4h16v8H4z" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
        </div>
        <div class="ml-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-slate-300">
                Banner Konfiguration
            </h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-slate-200">
                Konfigurieren sie das Banner welches erscheint, wenn die Webseite betreten wird.
            </p>
        </div>
    </div>
    <div class="ml-3 h-7 flex items-center">
        <span on:click={() => showConfigScreen = !showConfigScreen} class="text-sm font-medium text-primary-600 dark:text-primary-500 hover:underline cursor-pointer">
            Konfigurieren
        </span>
    </div>
</div>


{#if svgSelectorState} <SvgSelector iframeHeight="420px" on:submit={(event) => {svgPaths = event.detail; svgSelectorState = false}} on:close={() => {svgSelectorState = false}}/>{/if}
<!-- Form that allows the admin to configure Banner.svelte (../../Essentials/Banner.svelte) -->
<!--<div class={showConfigScreen ? '' : 'hidden'}><Modal on:hide={() => showConfigScreen = false}>-->
{#if showConfigScreen}
    <div id="BannerConfigurator" out:slide|local>
<!--        <div class="w-full mb-2 pt-6 space-y-2">-->
<!--            <p class="font-semibold text-center text-gray-800 dark:text-slate-200 text-xl">Banner Konfigurieren</p>-->
<!--        </div>-->
        {#await getInitialConfig()}
            <div class="flex justify-center"><LoadingWheel size={20} showAfter={1000}/></div>
        {:then _}
            <!--  Form that allows editing all the values in bannerConfig -->
            <form in:slide on:submit|preventDefault>
                <div class="mb-4">
                    <label class="block text-gray-700 dark:text-slate-200 text-sm font-bold mb-2" for="nameSelector">
                        Konfiguration Auswählen:
                    </label>
                    <div class="flex">
                        <select on:change={onConfigurationNameSelection} bind:value={bannerConfig.name} class="shadow border rounded w-full py-2 px-3 text-gray-700 dark:bg-slate-800 dark:text-slate-200 dark:border-black leading-tight focus:outline-none focus:shadow-outline" id="nameSelector">
                            {#each presetNames as option}
                                {#if option !== "preset"}
                                    <option value={option} class="flex space-x-2 {selectedBannerConfig === option ? 'bg-primary-50' : ''}">
                                        {option}
                                        {#if selectedBannerConfig === option}
                                            <span class="text-primary-600 dark:text-primary-200">(Aktuell öffentlich ausgewählt)</span>
                                        {/if}
                                    </option>
                                {/if}
                            {/each}
                            <option value="#new#">[Neue Konfiguration anlegen]</option>
                        </select>
<!--                        <button on:click={deleteCurrentConfig} class="ml-2 has-tooltip text-red-500 hover:text-red-600">-->
<!--                            <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">-->
<!--                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />-->
<!--                            </svg>-->
<!--                            <span class="tooltip absolute -ml-24 mt-2 z-10 py-2 px-3 flex text-sm font-medium text-black rounded-lg shadow bg-white dark:text-slate-200 dark:bg-slate-700">-->
<!--                                Diese Konfiguration löschen-->
<!--                            </span>-->
<!--                        </button>-->
                    </div>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 dark:text-slate-200 text-sm font-bold mb-2" for="active">
                        Banner aktiv:
                    </label>
                    <input class="form-checkbox" id="active" type="checkbox" bind:checked={bannerConfig.active} />
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 dark:text-slate-200 text-sm font-bold mb-2" for="hideable">
                        Banner schließbar:
                    </label>
                    <input class="form-checkbox" id="hideable" type="checkbox" bind:checked={bannerConfig.hideable} />
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 dark:text-slate-200 text-sm font-bold mb-2">
                        Icon des Banners:
                    </label>
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
                <div class="mb-4">
                    <label class="block text-gray-700 dark:text-slate-200 text-sm font-bold mb-2" for="pulse-icon">
                        Pulsierendes Icon:
                    </label>
                    <input class="form-checkbox" id="pulse-icon" type="checkbox" bind:checked={bannerConfig.pulseIcon} />
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 dark:text-slate-200 text-sm font-bold mb-2" for="desktop-text">
                        Text auf großen Geräten (Computer):
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-slate-800 dark:text-slate-200 dark:border-black leading-tight focus:out or-none focus:shadow-outline" id="desktop-text" type="text" bind:value={bannerConfig.desktopText} />
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 dark:text-slate-200 text-sm font-bold mb-2" for="mobile-text">
                        Text auf kleinen Geräten (Handys):
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-slate-800 dark:text-slate-200 dark:border-black leading-tight focus:outline-none focus:shadow-outline" id="mobile-text" type="text" bind:value={bannerConfig.mobileText} />
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 dark:text-slate-200 text-sm font-bold mb-2" for="button-text">
                        Text des Knopfes (falls kein Knopf benötigt, freilassen):
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-slate-800 dark:text-slate-200 dark:border-black leading-tight focus:outline-none focus:shadow-outline" id="button-text" type="text" bind:value={bannerConfig.buttonText} />
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 dark:text-slate-200 text-sm font-bold mb-2" for="button-url">
                        URL des Knopfes:
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 dark:bg-slate-800 dark:text-slate-200 dark:border-black  leading-tight focus:outline-none focus:shadow-outline" id="button-url" type="text" bind:value={bannerConfig.buttonUrl} />
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 dark:text-slate-200 text-sm font-bold mb-2" for="active-until">
                        Am wievielten soll der Banner von selbst wieder verschwinden? (Zum Beispiel Rückkehr aus dem Urlaub):
                    </label>
                    <div class="flex">
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-slate-800 dark:text-slate-200 dark:border-black leading-tight focus:outline-none focus:shadow-outline" id="active-until" type="datetime-local" min={new Date().toISOString().split('.')[0].slice(0,-3)} value={bannerConfig.activeUntil} on:change={e => bannerConfig.activeUntil = new Date(e.target.value)} />
                        <button on:click={bannerConfig.activeUntil = undefined} class="ml-2 has-tooltip text-red-500 hover:text-red-600">
                            <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span class="tooltip absolute -ml-24 mt-2 z-10 py-2 px-3 flex text-sm font-medium text-black rounded-lg shadow bg-white dark:text-slate-200 dark:bg-slate-700">
                                Auslaufdatum löschen
                            </span>
                        </button>
                        {#if bannerConfig.activeUntil && bannerConfig.activeUntil < new Date()}
                            <span class="ml-2 text-red-500">
                                <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </span>
                        {/if}
                    </div>
                </div>
                <div class="flex items-center justify-between flex-col sm:flex-row gap-y-2 gap-x-1">
                    <button on:click={saveCurrentConfig} class="px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 flex space-x-2">
                        <span class="text-sm font-medium">{#if selectedBannerConfig = bannerConfig.name}Auswählen und {/if}Speichern</span>
                        {#if saveLoading}
                            <LoadingWheel size={5}/>
                        {/if}
                    </button>
                    <!--  Stylized button that toggles bannerActive  -->
                    <button on:click={togglePreviewBanner} class="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-primary-600 rounded-md shadow-sm text-base font-medium hover:text-white hover:bg-primary-400">
                        <span class="text-sm font-medium">Vorschau Banner {#if previewBannerActive} deaktivieren {:else} aktivieren{/if}</span>
                    </button>
                    <button on:click={deleteCurrentConfig} class="px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-500 hover:bg-gray-600 flex space-x-2">
                        <span class="text-sm font-medium">Löschen</span>
                        {#if deleteLoading}
                            <LoadingWheel size={5}/>
                        {/if}
                    </button>
                </div>
            </form>
        {:catch e}
            <Alert type={0} title="Error!" description={e.message}/>
        {/await}
    </div>
{/if}
<!--</Modal></div>-->
