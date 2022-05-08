<script>
    import {fade} from "svelte/transition";
    import {quartIn} from "svelte/easing"
</script>

<div class="bg-[#e8eaed]">
    <iframe
            in:fade={{duration: 1000, easing:quartIn}}
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10249.586704123643!2d8.08309!3d50.0414!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x375b7096e22098db!2sMA%20Rojzman%20Fach%C3%A4rztin%20f%C3%BCr%20Allgemeinmedizin!5e0!3m2!1sen!2sde!4v1649773558366!5m2!1sen!2sde"
            class="w-full h-[450px] z-10"
            allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Google Maps Karte mit der Praxis als markierten Standort (Kammstr. 2, Kiedrich).">
    </iframe>
</div>