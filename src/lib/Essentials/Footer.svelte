<script lang="ts">
    import {navigate} from "svelte-navigator";
    import confetti from "canvas-confetti";
    import disableScroll from "disable-scroll";

    let copyrightName = "Simon Conrad";
    let copyrightLink = "mailto:simon.felix.conrad@pm.me";
    let copyrightDate = 2023;

    const easterEgg = () => { // Display confetti when the user clicks the copyright text in the footer
        // https://www.kirilv.com/canvas-confetti/
        let smallScreen: boolean = window.innerWidth <= 768;
        confetti({
            particleCount: 100,
            angle: smallScreen ? 90 : 70,
            spread: 70,
            origin: { x: smallScreen ? 0.5 : 0.05, y: 1 }
        });
    }

    const scrollToTop = () => {
        disableScroll.on();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        disableScroll.off();
        window.setTimeout(() => window.document.getElementById('header-icon').focus(), 250)
    }
</script>

<!--This means that every page on the site is developed within the context of a flex container-->
<div class="flex flex-col h-screen justify-between overflow-x-clip rounded-[inherit]">
    <slot/>
    <footer class="w-full mt-auto p-4 bg-white dark:text-slate-400 dark:bg-slate-800 rounded-lg shadow flex flex-col items-center gap-y-2 md:flex-row md:justify-between md:p-6 z-10">
        <span class="text-sm text-gray-500 dark:text-gray-400 lg:flex-1 order-last md:order-first">
            © {copyrightDate} <a href={copyrightLink} target="_blank" referrerpolicy="strict-origin-when-cross-origin" on:click={easterEgg} class="hover:underline">{copyrightName}</a>
        </span>
        <div class="lg:flex-1 text-center hidden lg:inline">
            <button on:click={scrollToTop} class="text-sm text-center text-gray-500 dark:text-slate-400 hover:underline cursor-pointer">
                Zurück Nach Oben
            </button>
        </div>
        <ul class="flex flex-wrap justify-center lg:justify-end text-sm text-gray-500 dark:text-gray-400 lg:flex-1">
            <!--   Using the navigate() method is faster than the href attribute   -->
            <li>
                <a href="/datenschutz" on:click|preventDefault={() => navigate("/datenschutz")} class="mr-4 hover:underline md:mr-6 cursor-pointer">Datenschutzerklärung</a>
            </li>
            <li>
                <a href="/lizensierung" on:click|preventDefault={() => navigate("/lizensierung")}  class="mr-4 hover:underline md:mr-6 cursor-pointer">Lizensierung</a>
            </li>
            <li>
                <a href="/impressum" on:click|preventDefault={() => navigate("/impressum")} class="hover:underline cursor-pointer">Impressum</a>
            </li>
        </ul>
    </footer>
</div>

