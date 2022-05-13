<script lang="ts">
import ProfileCard from "../lib/Team/ProfileCard.svelte";
import Footer from "../lib/Essentials/Footer.svelte";
import DarkModeGlow from "../lib/Misc/DarkModeGlow.svelte";
import {getTeamMembers} from "../supabase/database.ts";

let title = "Unser Team";
let subTitle = "Die Personen, welche ihren Aufenthalt in unserer Praxis zum bestmöglichen Erlebnis machen";

// imgLink info: Use https://compressimage.io/ with 70% quality, 500px and webp enabled for best results
let team: { role: string; name: string; description: string; twitterLink?: string; instagramLink?: string}[] = [
    {name: "Marie-Anne Rojzman", role: "Fachärztin für Allgemeinmedizin", description: "Ihre behandelnde Ärztin Frau Rojzman lässt sich Zeit für ihre Probleme und findet dank langjähriger Erfahrung eine passende Behandlung.", imgLink: "assets/MARojzman.webp", instagramLink: "https://www.instagram.com/marieannerojzman/", twitterLink: "/"},
    {name: "Lara Schäfer", role: "Medizinische Fachangestellte", description: "Lara sorgt als Mutter von zwei Kindern für eine angenehme Atmosphäre bereits beim Empfang. Scheuen sie sich nicht vor persönlichen Gesprächen!", imgLink: undefined, instagramLink: ""},
    {name: "Anja Tellez Nitzling", role: "Medizinische Fachangestellte", description: "Anja beehrt und zwar nur einmal die Woche macht an diesen Tagen jedoch eine umso bessere Arbeit.", imgLink: undefined, twitterLink: ""},
];
</script>

<Footer>
    <DarkModeGlow/>
    <div class="flex justify-center mx-auto py-8 lg:py-12">
        <div>
<!--            <h2 class="text-base font-semibold text-lg text-center tracking-wider text-indigo-600 uppercase pb-3">{title}</h2>-->
            <h1 class="text-gray-500 dark:text-slate-100 text-lg text-center font-normal pb-3 uppercase">{title}</h1>
            <p class="xl:text-4xl text-3xl text-center text-gray-800 dark:text-slate-200 font-extrabold pb-6 sm:w-4/6 w-5/6 mx-auto focus:outline-transparent">{subTitle}</p>
        </div>
    </div>
    {#await getTeamMembers() then team}
        <div class="bg-gray-100 bg-hero-leaf-600 dark:bg-slate-800 z-20 w-full px-10 pt-10 pb-10">
            <div class="container mx-auto">
                <div role="list" aria-label="Mitarbeiter" class="md:flex items-center flex-wrap sm:justify-around">
                    {#each team as member, index}
                        <ProfileCard {...member}/>
                        {#if index !== team.length - 1}
                            <div class="mb-32 sm:mb-24"></div>
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
    {/await}
    <div class="min-h-0 flex-grow flex overflow-y-clip"> <!-- White space is a design element. Me: -->
        <img src="assets/DarkModeGlowBg.png" alt="" class="w-full min-h-[20rem] dark:hidden justify-start opacity-30">
    </div>
</Footer>
