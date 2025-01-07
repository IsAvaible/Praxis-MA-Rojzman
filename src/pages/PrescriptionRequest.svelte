<script lang="ts">
    import {darkModeStore} from "../scripts/stores/darkModeStore";
    import {conditionalInputTypeReset} from "../scripts/ui/conditionalInputTypeReset";
    import Footer from "../lib/Essentials/Footer.svelte";
    import {fade, slide} from "svelte/transition";
    import HCaptcha, {CaptchaTheme} from "svelte-hcaptcha/src/HCaptcha.svelte";
    import {removeItem} from "../scripts/misc/arrayRemoveItem";
    import {onMount} from "svelte";
    import PageTitle from "../lib/Admin/Navigation/PageTitle.svelte";

    onMount(() => scrollTo(0, 0)); // The HCaptcha is messing up the scroll

let currentId: number = 1; // The id is used by svelte to identify each input field
let recipes = [
    {id: 0, value: ''},
];

const addRecipe = () => {
    if (recipes.length < 5) {
        recipes.push({id: currentId++, value: ''}); // The currentId is used and incremented by one afterwards
    }
    recipes = recipes;
}

const removeRecipe = (recipe) => {
    recipes = removeItem(recipes, recipe)
}

let captcha;
let solved = false;
let requiredInputValue: boolean;
$: requiredInputValue = solved || undefined;
const handleError = () => {captcha.reset()}
const handleSuccess = () => {solved = true}

let request: {name: string, surname: string, birthday: Date, email: string, phoneNumber: string, recipes: string[]} =
    {name: undefined, surname: undefined, birthday: undefined, email: undefined, phoneNumber: undefined, recipes: recipes.map(e => e.value)};
</script>

<Footer>
    <div class="bg w-full sm:px-4 flex justify-center bg-primary-300 dark:bg-primary-600 flex-grow">
        <div class="sm: flex-1"></div>
        <div class="contact-form bg-white dark:bg-slate-800 sm:rounded-lg p-10 flex-grow shadow-lg self-center sm:my-5">
            <PageTitle title="Rezeptanforderung" subTitle="Hier können Sie ein Folgerezept für eine bestehende Dauermedikation beantragen, welche wir anschliessend vorbereiten und zur Abholung bereit legen.
                Wir können auf diesem Weg keine Rezepte für akute Erkrankungen ausstellen, da eine persönliche Vorstellung und Untersuchung unumgänglich sind."/>
            <form>
                <div class="mb-6">
                    <input bind:value={request.name} required class="w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none focus:border-primary-500" placeholder="Ihr Vorname (*)" type="text" id="forename" />
                </div>
                <div class="mb-6">
                    <input bind:value={request.surname} required class="w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none focus:border-primary-500" placeholder="Ihr Nachname (*)" type="text" id="name" />
                </div>
                <div class="mb-6">
                    <input bind:value={request.birthday} required class="w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none focus:border-primary-500" placeholder="Ihr Geburtsdatum (*)" type="text" id="date" onfocus="(this.type='date')" on:blur={conditionalInputTypeReset} />
                </div>
                <div class="mb-6">
                    <input bind:value={request.email} required class="w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none focus:border-primary-500" placeholder="Ihre Email Adresse (*)" type="email" />
                </div>
                <div class="mb-6">
                    <input bind:value={request.phoneNumber} class="w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none focus:border-primary-500" placeholder="Ihre Telefonnummer" type="text" />
                </div>
                {#each recipes as recipe, n (recipe.id)}
                    <div in:fade={{duration: (n!==0?1:0)*100}} out:fade|local={{duration: 250}}> <!-- The first recipe does not have entering animations (prevent instant rescaling on site enter) -->
                        <div class="mb-6 flex" in:slide={{duration: (n!==0?1:0)*300}} out:slide|local={{duration: 300}}>
                            <input
                                    class="flex-grow dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 resize-none outline-none focus-visible:shadow-none focus:border-primary"
                                    placeholder="Das {n+1}. gewünschte Präperat"
                                    required={n===0}
                                    bind:value={recipe.value}
                            />
                            <div class="ml-1 sm:ml-3">
                                {#if n === 0} <!-- The first recipe features a button that allows adding up to four more recipes -->
                                    <button on:click={addRecipe} type="button" class="has-tooltip h-full justify-center align-middle p-2 aspect-[1] rounded-md border dark:bg-slate-900 border-[f0f0f0] dark:border-none dark:hover:bg-slate-900 focus:outline-none active:ring-2 active:ring-primary-200 dark:active:ring-slate-200">
                                        <span class="sr-only">Weiteres Präperat hinzufügen</span>
                                        <!-- Heroicon name: outline/document-dublicate -->
                                        <svg class="h-6 w-full text-gray-500 sm:hover:text-gray-800 dark:text-slate-400 sm:dark:hover:text-slate-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                        </svg>

                                        <span class="tooltip absolute -ml-24 mt-6 z-10 py-2 px-3 flex text-sm font-medium text-black rounded-lg shadow bg-white dark:text-slate-100 dark:bg-slate-700">
                                            Weiteres Präperat hinzufügen
                                        </span>
                                    </button>
                                {:else} <!-- Any other recipe can be deleted with the button on its right  -->
                                    <button on:click={() => removeRecipe(recipe)} type="button" class="has-tooltip h-full justify-center align-middle p-2 aspect-[1] rounded-md border dark:bg-slate-900 border-[f0f0f0] dark:border-none dark:hover:bg-slate-900 focus:outline-none active:ring-2 active:ring-primary-200 dark:active:ring-slate-200">
                                        <span class="sr-only">Dieses Präperat löschen</span>
                                        <!-- Heroicon name: outline/document-remove -->
                                        <svg class="h-6 w-full text-gray-500 sm:hover:text-gray-800 dark:text-slate-400 sm:dark:hover:text-slate-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                        </svg>

                                        <span class="tooltip absolute -ml-20 mt-6 z-10 py-2 px-3 flex text-sm font-medium text-black rounded-lg shadow bg-white dark:text-slate-100 dark:bg-slate-700">
                                            Dieses Präperat löschen
                                        </span>
                                    </button>
                                {/if}
                            </div>
                        </div>
                    </div>
                {/each}
                <div class="mb-6 items-center w-full">
                    <div class="m-auto table min-h-[78px]" in:fade={{duration: 400}}>
                        {#key $darkModeStore} <!-- This forces the component to update when the dark mode is changed -->
                            <!-- Validation does not work on localhost! Use 127.0.0.1 for testing -->
                            <HCaptcha
                                    sitekey={import.meta.env.VITE_HCAPTCHA_KEY}
                                    theme={$darkModeStore ? CaptchaTheme.DARK : CaptchaTheme.LIGHT}
                                    reCaptchaCompat={false}
                                    bind:this={captcha}
                                    on:error={handleError}
                                    on:success={handleSuccess}
                            ></HCaptcha>
                            <input type="checkbox" bind:value={solved} required class="relative top-0 opacity-0 pointer-events-none">
                        {/key}
                    </div>
                </div>
                <div>
                    <button class="w-full font-medium text-white bg-primary-600 rounded-md border border-primary dark:border-none p-3 transition hover:bg-primary-700" type="submit">
                        Absenden
                    </button>
                </div>
            </form>
        </div>
        <div class="sm: flex-1"></div>
    </div>
</Footer>


<style lang="scss">
    .bg {
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
</style>