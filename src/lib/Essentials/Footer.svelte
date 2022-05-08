<script lang="ts">
    import { navigate } from "svelte-navigator";

    let copyrightName = "Simon Conrad";
    let copyrightLink = "mailto:simon.felix.conrad@pm.me";
    let copyrightDate = 2022;
</script>

<div class="flex flex-col h-screen justify-between overflow-x-clip rounded-[inherit]">
    <slot/>
    <footer class="w-full mt-auto p-4 bg-white dark:text-slate-400 dark:bg-slate-800 rounded-lg shadow md:flex md:items-center md:justify-between md:p-6">
        <span class="text-sm text-gray-500 dark:text-gray-400 lg:flex-1">
            © {copyrightDate} <a href={copyrightLink} class="hover:underline">{copyrightName}</a>
        </span>
        <div class="lg:flex-1 text-center hidden lg:inline">
            <span on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })} class="text-sm text-center text-gray-500 dark:text-slate-400 hover:underline cursor-pointer">
                Zurück nach Oben
            </span>
        </div>
        <ul class="flex flex-wrap lg:justify-end mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0 lg:flex-1">
            <li>
                <span on:click={() => navigate("/datenschutzerklaerung")} class="mr-4 hover:underline md:mr-6 cursor-pointer">Datenschutzerklärung</span>
            </li>
            <li>
                <span class="mr-4 hover:underline md:mr-6 cursor-pointer">Lizensierung</span>
            </li>
            <li>
                <span on:click={() => navigate("/impressum")} class="hover:underline cursor-pointer">Impressum</span>
            </li>
        </ul>
    </footer>
</div>

