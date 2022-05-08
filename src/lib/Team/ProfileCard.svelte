<script lang="ts">
    import {scale} from "svelte/transition";
    import {sineInOut} from "svelte/easing"

    export let name;
    export let role;
    export let description;
    export let imgLink = "assets/DefaultProfilePicture.png";

    export let githubLink = undefined;
    export let twitterLink = undefined;
    export let instagramLink = undefined;
</script>

<div role="listitem" class="relative mt-16 md:w-2/5 lg:w-2/5 xl:w-1/3 xl:max-w-sm bg-white dark:bg-slate-800">
    <div class="rounded overflow-hidden shadow-md">
        <div class="absolute -mt-20 w-full flex justify-center">
            <div in:scale={{easing: sineInOut, start: 0.3, duration: 500}} class="h-32 w-32">
                <img src="{imgLink}" alt="Profilbild von {name}" class="rounded-full object-cover h-full w-full drop-shadow-xl bg-white" />
            </div>
        </div>
        <div class="px-6 mt-16">
            <h1 class="font-bold dark:text-slate-100 text-3xl text-center mb-1">{name}</h1>
            <p class="text-gray-800 dark:text-slate-100 text-sm text-center">{role}</p>
            <p class="text-center text-gray-600 dark:text-slate-200 text-base pt-3 font-normal">{description}</p>
            {#if [githubLink, twitterLink, instagramLink].findIndex(e => e !== undefined) !== -1}
                <div class="w-full flex justify-center pt-5 pb-5">
                    {#if githubLink !== undefined}
                        <a href={githubLink} target="_blank" class="mx-5">
                            <div aria-label="Github" role="img">
                                <img src="assets/githubLogo.svg" alt="github" />
                            </div>
                        </a>
                    {/if}
                    {#if twitterLink !== undefined}
                        <a href={twitterLink} target="_blank" class="mx-5">
                            <div aria-label="Twitter" role="img">
                                <img src="assets/twitterLogo.svg" alt="twitter" />
                            </div>
                        </a>
                    {/if}
                    {#if instagramLink !== undefined}
                        <a href={instagramLink} target="_blank" class="mx-5">
                            <div aria-label="Instagram" role="img">
                                <img src="assets/instagramLogo.svg" alt="instagram" />
                            </div>
                        </a>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>