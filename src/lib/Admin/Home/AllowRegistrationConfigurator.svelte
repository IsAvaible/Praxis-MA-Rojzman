<div class="flex items-center justify-between pt-6 pb-6">
    <div class="flex items-center">
        <div class="flex-shrink-0 h-10 w-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </div>
        <div class="ml-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-slate-200">
                Registrierung
            </h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-slate-300">
                Erlaube Registrierungen im Login Bereich der Webseite, durch langes Drücken auf den Login Button.
            </p>
        </div>
    </div>
    <!--  Stylized button link to the Supabase auth settings page -->
    <div class="ml-3 h-7 flex items-center">
        <a href="https://app.supabase.com/project/{import.meta.env.VITE_SUPABASE_PROJECT_REFERENCE_ID}/settings/auth" target="_blank" referrerpolicy="strict-origin-when-cross-origin" class="text-sm font-medium text-primary-600 dark:text-primary-500 hover:underline flex space-x-1 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h6" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 3h-6m6 0l-9 9m9-9v6" />
            </svg>
            <span>Konfigurieren</span>
        </a>
    </div>
</div>
