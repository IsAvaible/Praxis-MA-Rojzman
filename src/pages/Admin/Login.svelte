
<script lang="ts">
    import Footer from "../../lib/Essentials/Footer.svelte";
    import HCaptcha, {CaptchaTheme} from "svelte-hcaptcha/src/HCaptcha.svelte";
    import {fade} from "svelte/transition";
    import {Link, navigate} from "svelte-navigator";
    import {signIn, signUp} from "../../scripts/database/database";
    import {longpress} from "../../scripts/ui/longpress";
    import {darkModeStore} from "../../scripts/stores/darkModeStore";
    import LoadingWheel from "../../lib/Misc/LoadingWheel.svelte";

    let email: string;
    let password: string;
    let doSignUp: boolean = false; // This can be set to true by long pressing the SignIn button and will switch its action.
    let formSubmitted: boolean = false;

    let failedAttempts: number = 0;
    let maxFailsBeforeCaptcha: number = 3;

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
                        <Link to="/" class="cursor-pointer text-primary-600 hover:text-primary-900 hover:underline focus:underline focus:outline-none">Hier Klicken</Link>
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
                                        {#key $darkModeStore} <!-- This forces the component to update when the dark mode is changed -->
                                            <!-- Validation does not work on localhost! Use 127.0.0.1 for testing -->
                                            <HCaptcha
                                                    sitekey={import.meta.env.VITE_HCAPTCHA_KEY}
                                                    theme={$darkModeStore ?  CaptchaTheme.Dark : CaptchaTheme.Light}
                                                    bind:this={captcha}
                                                    on:error={handleError}
                                                    on:success={handleSuccess}
                                            />
                                        {/key}
                                    </div>
                                </div>
                            {/if}

                            <div>
                                <button use:longpress={1500} on:longpress={() => doSignUp = true} disabled={formSubmitted} type="submit" class="disabled:cursor-not-allowed disabled:bg-primary-500 disabled:hover:bg-primary-500 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                    {#if formSubmitted}
                                        <LoadingWheel/>
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
                                        <span class="font-medium">Error!</span> {captchaSolved ? e.message : 'Validate the captcha before submitting the form'}. <button class="hover:text-red-500 cursor-pointer font-medium" on:click={() => {failedAttempts+=(e.message==="Request Failed"?0:1); if (captcha) {captcha.reset()}; email=''; password=''; doSignUp = false; formSubmitted = false}}>Click here to reset.</button>
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