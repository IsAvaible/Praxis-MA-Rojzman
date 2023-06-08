<script lang="ts">
    import {scale} from "svelte/transition";
    import {sineInOut} from "svelte/easing"
    import {prefersReducedMotionStore} from "../../scripts/stores/prefersReducedMotionStore";
    import TwitterIcon from "../Icons/TwitterIcon.svelte";
    import FlexIcon from "../Icons/FlexIcon.svelte";
    import InstagramIcon from "../Icons/InstagramIcon.svelte";

    export let id;
    export let name;
    export let role;
    export let description;
    export let imageUrl = "assets/DefaultProfilePicture.png";

    export let instagramUrl = undefined;
    export let twitterUrl = undefined;
    export let flexUrl = undefined;
</script>

<div id="profile-card-{id}" role="listitem" class="relative mt-24 sm:min-w-[300px] mx-2 md:w-2/5 lg:w-2/5 xl:w-1/3 xl:max-w-sm bg-white dark:bg-slate-800 rounded-lg">
    <div class="rounded-lg overflow-hidden shadow-md">
        <div class="absolute -mt-20 w-full flex justify-center">
            <div in:scale={{easing: sineInOut, start: 0.3 * ($prefersReducedMotionStore ? 0 : 1), duration: 500 * ($prefersReducedMotionStore ? 0 : 1)}} class="h-32 w-32">
                <img src="{imageUrl}" alt="Profilbild von {name}" class="rounded-full object-cover h-full w-full drop-shadow-xl bg-white text-center" />
            </div>
        </div>
        <div class="px-6 mt-16 rounded-lg">
            <h1 class="font-bold dark:text-slate-100 text-3xl text-center mb-1">{name}</h1>
            <p class="text-gray-800 dark:text-slate-100 text-sm text-center">{role}</p>
            <p class="text-center text-gray-600 dark:text-slate-200 text-base pt-3 font-normal">{description}</p>
            {#if [flexUrl, twitterUrl, instagramUrl].findIndex(e => e !== undefined) !== -1}
                <div class="w-full flex justify-center pt-5 pb-5">
                    {#if flexUrl}
                        <a href={flexUrl} target="_blank" referrerpolicy="strict-origin-when-cross-origin" class="mx-5 text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-300">
                            <div aria-label="Flex" role="img">
                                <FlexIcon/>
                            </div>
                        </a>
                    {/if}
                    {#if twitterUrl}
                        <a href={twitterUrl} target="_blank" referrerpolicy="strict-origin-when-cross-origin" class="mx-5 text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-300">
                            <div aria-label="Twitter" role="img">
                                <TwitterIcon/>
                            </div>
                        </a>
                    {/if}
                    {#if instagramUrl}
                        <a href={instagramUrl} target="_blank" referrerpolicy="strict-origin-when-cross-origin" class="mx-5 text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-300">
                            <div aria-label="Instagram" role="img">
                                <InstagramIcon/>
                            </div>
                        </a>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>