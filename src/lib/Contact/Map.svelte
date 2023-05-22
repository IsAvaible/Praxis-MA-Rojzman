<script>
    import {fade} from "svelte/transition";
    import {quartIn} from "svelte/easing";

    import {googleMapsAllowedStore} from "../../scripts/stores/cookies/googleMapsAllowedStore";

    import LoadingWheel from "../Misc/LoadingWheel.svelte";
    import DSGVODialog from "../Legal/DSGVODialog.svelte";
</script>


<div>
    <div class="relative resize-y overflow-y-auto max-h-[60vh]" style="min-height: 250px; background-color: #e5e3df">
        <DSGVODialog text="Diese Webseite nutzt Google Maps um den Standort der Praxis anzuzeigen. Beim Laden der Karte werden eventuell Daten übertragen und Cookies gesetzt."
                     link="https://policies.google.com/privacy" buttonText="Karte laden" cookieStore={googleMapsAllowedStore} backgroundStyle="bg-hero-topography-700 absolute top-0 bottom-0" blurBackground={true}>
            <div class="absolute top-0 bottom-0 -z-10 w-full flex justify-center items-center">
                <LoadingWheel size={20} showAfter={500}/>
            </div>
            <iframe
                    in:fade={{duration: 700, easing:quartIn}}
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10249.586704123643!2d8.08309!3d50.0414!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x375b7096e22098db!2sMA%20Rojzman%20Fach%C3%A4rztin%20f%C3%BCr%20Allgemeinmedizin!5e0!3m2!1sen!2sde!4v1649773558366!5m2!1sen!2sde"
                    class="absolute top-0 bottom-0 w-full h-full"
                    allowfullscreen referrerpolicy="no-referrer" title="Google Maps Karte mit der Praxis als markierten Standort (Kammstr. 2, Kiedrich).">
            </iframe>
            <span id="triangle" class="absolute bottom-0 right-0 bg-white w-5 aspect-square"></span>
        </DSGVODialog>
    </div>
</div>




<style>
    #triangle {
        shape-outside: polygon(0 100%, 100% 0, 100% 100%);
        clip-path: polygon(0 100%, 100% 0, 100% 100%);
    }
</style>