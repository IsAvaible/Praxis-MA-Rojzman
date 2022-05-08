
<script lang="ts">
    import Footer from "../../lib/Essentials/Footer.svelte";
    import HCaptcha from "svelte-hcaptcha/src/HCaptcha.svelte";
    import {fade} from "svelte/transition";
    import {navigate} from "svelte-navigator";
    import {signIn, signUp} from "../../supabase/database.ts";
    import {longpress} from "../../utilities/longpress.ts";
    import {darkModeListener} from "../../utilities/DarkModeListener.ts";

    let email: string;
    let password: string;
    let doSignUp: boolean = false; // This can be set to true by long pressing the SignIn button and will switch its action.
    let formSubmitted: boolean = false;

    let failedAttempts: number = 0;
    let maxFailsBeforeCaptcha: number = 3;

    let darkMode: boolean;
    darkModeListener.subscribe((value) => darkMode = value);
    let captcha;
    let captchaSolved;
    $: captchaSolved = failedAttempts < maxFailsBeforeCaptcha;
    const handleError = () => {captcha.reset()}
    const handleSuccess = () => {captchaSolved = true}
</script>

<Footer>
    <div class="min-h-full flex">
        <div class="flex-1 flex flex-col justify-start py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div class="mx-auto w-full max-w-sm lg:w-96">
                <div>
                    <img class="h-12 w-auto" src="assets/favicon.svg" alt="Logo">
                    <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-slate-100">Admin</h2>
                    <p class="mt-2 text-sm text-gray-600 dark:text-slate-200">
                        Dieser Bereich ist den Adminstratoren der Seite vorbehalten.
                        <span on:click={() => navigate("/")} class="cursor-pointer text-primary-600 hover:text-primary-900">Hier Klicken</span>
                        um zurück zur Homepage zu gelangen.
                    </p>
                </div>

                <div class="mt-8">
                    <div class="mt-6">
                        <form on:submit|preventDefault={() => {formSubmitted = true}} class="space-y-6">
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-slate-300"> Email Addresse </label>
                                <div class="mt-1">
                                    <input bind:value={email} disabled={formSubmitted} id="email" name="email" type="email" autocomplete="email" required class="dark:text-slate-800 dark:placeholder-slate-700 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                                </div>
                            </div>

                            <div class="space-y-1 dark:text-black">
                                <label for="password" class="block text-sm font-medium text-gray-700 dark:text-slate-300"> Passwort </label>
                                <div class="mt-1">
                                    <input bind:value={password} disabled={formSubmitted} id="password" name="password" type="password" autocomplete="current-password" required class="dark:text-slate-800 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                                </div>
                            </div>

                            {#if failedAttempts >= maxFailsBeforeCaptcha}
                                <div class="mb-6 items-center w-full">
                                    <div class="m-auto table min-h-[78px]" in:fade={{duration: 400}}>
                                        {#key darkMode} <!-- This forces the component to update when the dark mode is changed -->
                                            <!-- Validation does not work on localhost! Use 127.0.0.1 for testing -->
                                            <HCaptcha
                                                    sitekey={import.meta.env.VITE_HCAPTCHA_KEY}
                                                    theme={darkMode ?  'dark' : 'light'}
                                                    bind:this={captcha}
                                                    on:error={handleError}
                                                    on:success={handleSuccess}
                                            />
                                        {/key}
                                    </div>
                                </div>
                            {/if}

                            <div>
                                <button use:longpress={1500} on:longpress='{() => doSignUp = true}' disabled={formSubmitted} type="submit" class="disabled:cursor-not-allowed disabled:bg-primary-500 disabled:hover:bg-primary-500 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                    {#if formSubmitted}
                                        <svg class="w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-primary-800" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                        </svg>
                                    {/if}
                                    <span class="{doSignUp&&!formSubmitted?'animate-pulse':''} align-middle">{doSignUp?'Registrieren':'Einloggen'}</span>
                                </button>
                            </div>

                            {#if formSubmitted}
                                {#await ((failedAttempts < maxFailsBeforeCaptcha) || captchaSolved ? (doSignUp ? signUp : signIn)(email, password) : Promise.reject()) then user}
                                    {#if !doSignUp}
                                        {navigate('/admin')}
                                    {:else}
                                        <p class="font-normal">Ein neues Konto wurde erfolgreich hinzugefügt. Bitte bestätigen sie die Anmeldung mit dem Link in ihrem Email Postfach.</p>
                                    {/if}
                                {:catch e}
                                    <div class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                                        <span class="font-medium">Error!</span> {captchaSolved ? e.message : 'Validate the captcha before submitting the form'}. <span class="hover:text-red-500 cursor-pointer font-medium" on:click={() => {failedAttempts++; if (captcha) {captcha.reset()}; email=''; password=''; doSignUp = false; formSubmitted = false}}>Click here to reset.</span>
                                    </div>
                                {/await}
                            {/if}
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="hidden lg:block relative w-0 flex-1">
            <img class="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80" alt="">
        </div>
    </div>
</Footer>