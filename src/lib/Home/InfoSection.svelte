<script type="ts">
    import {navigate} from "svelte-navigator";
</script>


<div class="lg:grid lg:grid-cols-2 lg:gap-4">
    <div class="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
        <div class="lg:self-center flex flex-col">
            <h2 class="text-3xl font-extrabold text-primary-600 sm:text-4xl">
                <span class="block">Liebe Patientinnen und Patienten</span>
            </h2>
            <p class="mt-4 text-lg leading-6 text-gray-500 dark:text-slate-200">Mein <a on:click|preventDefault={() => navigate('/team')} href="/team" class="underline text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-600">Team</a> und ich freuen uns, daß Sie auf unsere Homepage aufmerksam geworden sind und möchten Sie einladen,  sich hier über unsere Leistungen und Sprechzeiten zu informieren.</p>
            <p class="mt-4 text-lg leading-6 text-gray-500 dark:text-slate-200">Durch einen freundlichen Empfang und einen vertrauensvollen Umgang mit unseren Patienten vermitteln wir Ihnen das Gefühl, daß Sie in unserer Praxis  gut aufgehoben sind.</p>
            <p class="mt-4 text-lg leading-6 text-gray-500 dark:text-slate-200">Mein Ziel als Hausärztin ist es, für Sie Ansprechpartner und Begleiter in allen Gesundheitsfragen zu sein.</p>
            <p class="mt-4 text-lg leading-6 text-gray-500 dark:text-slate-200">Wir freuen uns auf Ihren Besuch!</p>
            <a href="/kontakt" class="mt-8 self-center lg:self-start cursor-pointer border border-transparent rounded-md shadow px-5 py-3 inline-flex items-center text-base font-medium bg-primary-600 text-white hover:bg-primary-700 dark:text-slate-100"
                  on:click|preventDefault={() => navigate('/kontakt')}
            >Kontaktieren Sie uns!</a>
        </div>
    </div>
    <div class="-mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1 ">
        <div class="gradient-mask-b-90">
            <img class="rounded-md transform translate-x-6 translate-y-6 object-cover object-left-top sm:translate-x-16 lg:translate-y-20" src="https://tailwindui.com/img/component-images/full-width-with-sidebar.jpg" alt="App screenshot">
        </div>
    </div>
<!--    <div class="-mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1 hidden lg:flex items-center justify-center py-20">-->
<!--        <div class="gradient-mask-b-90 h-full w-full filter grayscale">-->
<!--            <img src="https://lh3.googleusercontent.com/p/AF1QipMclVg0MzvaoCeYfrRQMYGxWi5io36AWkrkN0fq=s1360-w1360-h1020" alt="Bild von Frau Rojzman und einer Patientin" class="w-full h-full object-cover rounded-lg">-->
<!--        </div>-->
<!--        <div class="w-[50rem] hidden 2xl:block">-->
<!--            <OfficeHours/>-->
<!--        </div>-->

<!--    </div>-->
</div>

