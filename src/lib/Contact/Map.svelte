<script>
    import {googleMapsAllowedStore} from "../../scripts/stores/googleMapsAllowedStore";

    import {fade} from "svelte/transition";
    import {quartIn} from "svelte/easing";
    import LoadingWheel from "../Misc/LoadingWheel.svelte";

    let googleMapsAllowed = false;
    googleMapsAllowedStore.subscribe(value => googleMapsAllowed = value);
    let alwaysAllow = true;
</script>

<div class="relative" style="min-height: 250px; background-color: #e5e3df">
    {#if !googleMapsAllowed}
        <div class="w-full h-full bg-hero-topography-700">
            <div class="w-full h-full flex flex-col justify-center items-center backdrop-blur-sm gap-1 p-4">
                <!-- DSGVO google maps confirmation dialog -->
                <p class="text-md text-gray-800 text-center">Diese Webseite nutzt Google Maps um den Standort der Praxis anzuzeigen. Durch das Laden der Karte akzeptieren sie Datenschutzerklärung von Google.</p>
                <a href="https://policies.google.com/privacy" rel="noreferrer" target="_blank" class="text-primary-600 hover:underline">Mehr erfahren</a>
                <button on:click={() => {if (alwaysAllow) {googleMapsAllowedStore.set(true)} else {googleMapsAllowed = true}}} class="bg-white text-gray-800 font-bold mt-2 px-4 py-2 rounded-md shadow-lg hover:shadow-md transition-shadow duration-300">Karte laden</button>
                <div class="flex items-center gap-1">
                    <input type="checkbox" class="my-auto hover:cursor-pointer h-full" bind:checked={alwaysAllow}/>
                    <p class="text-gray-800">Immer zulassen</p>
                </div>

            </div>
        </div>
    {:else}
        <div class="absolute top-0 bottom-0 w-full flex justify-center items-center">
            <LoadingWheel size={20} showAfter={500}/>
        </div>
        <iframe
                in:fade={{duration: 700, easing:quartIn}}
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10249.586704123643!2d8.08309!3d50.0414!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x375b7096e22098db!2sMA%20Rojzman%20Fach%C3%A4rztin%20f%C3%BCr%20Allgemeinmedizin!5e0!3m2!1sen!2sde!4v1649773558366!5m2!1sen!2sde"
                class="w-full h-full z-10 relative"
                allowfullscreen referrerpolicy="no-referrer" title="Google Maps Karte mit der Praxis als markierten Standort (Kammstr. 2, Kiedrich).">
        </iframe>
    {/if}
</div>