<script lang="ts">
    import ProfileCard from "../lib/Team/ProfileCard.svelte";
    import Footer from "../lib/Essentials/Footer.svelte";
    import {getTeamMembers} from "../scripts/database/database";
    import Alert from "../lib/Essentials/Alert.svelte";
    import LoadingWheel from "../lib/Misc/LoadingWheel.svelte";

    let title = "Unser Team";
let subTitle = "Die Personen, welche ihren Aufenthalt in unserer Praxis zum bestmöglichen Erlebnis machen";
</script>

<Footer>
    <div class="flex justify-center mx-auto py-8 lg:py-12">
        <div>
<!--            <h2 class="text-base font-semibold text-lg text-center tracking-wider text-indigo-600 uppercase pb-3">{title}</h2>-->
            <h1 class="text-gray-500 dark:text-slate-100 text-lg text-center font-normal pb-3 uppercase focus:outline-transparent">{title}</h1>
            <p class="xl:text-4xl text-3xl text-center text-gray-800 dark:text-slate-200 font-extrabold pb-6 sm:w-4/6 w-5/6 mx-auto focus:outline-transparent">{subTitle}</p>
        </div>
    </div>
    <div class="bg-gray-100 bg-hero-leaf-600 dark:bg-slate-800 z-20 w-full px-10 pt-10 pb-10">
        {#await getTeamMembers()}
            <div class="w-full mb-12 flex justify-center items-center" style="min-height: 500px">
                <LoadingWheel size={25} showAfter={1000}/>
            </div>
        {:then team}
            <div class="container mx-auto">
                <div role="list" aria-label="Mitarbeiter" class="md:flex items-center flex-wrap sm:justify-between">
                    {#each team as member, index}
                        <ProfileCard {...member}/>
                    {/each}
                </div>
            </div>
        {:catch e}
            <div class="w-full h-full flex items-center justify-center">
                <Alert type={1} title="Team konnte nicht geladen werden." description="Wir konnten die angeforderten Daten nicht laden, überprüfen sie bitte ihre Internetverbindung."/>
            </div>
        {/await}
    </div>
    <div class="min-h-0 flex-grow flex overflow-y-clip">
        <img src="assets/DarkModeGlowBg.png" alt="" class="w-full min-h-[20rem] justify-start opacity-30">
    </div>
</Footer>
