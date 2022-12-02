<script lang="ts">
    import Map from "../lib/Contact/Map.svelte";
    import Footer from "../lib/Essentials/Footer.svelte";
    import ContactForm from "../lib/Contact/ContactForm.svelte";

    // These numbers should be queried from the database. For now, we just hardcode the feature.
    let phoneNumberShort = "06123 / 9997088";
    let phoneNumberFull = "+4961239997085";
    let faxNumberShort = "06123 / 9997085";
    let faxNumberFull = "+4961239997085";
</script>

<Footer>
    <Map/>
    <!-- ====== Contact Section Start -->
    <div class="px-10 pt-10 pb-3 relative z-10 dark:bg-slate-900">
        <div class="">
            <div class="flex flex-wrap lg:justify-between -mx-4">
                <div class="w-full lg:w-1/2 xl:w-6/12 px-4">
                    <div class="max-w-[670px] mb-12 lg:mb-0">
                        <h2 class="dark:text-slate-100 text-center mb-6 font-bold text-[32px] sm:text-left sm:text-[40px] lg:text-[36px] xl:text-[40px] focus:outline-none">
                            Kontaktieren Sie uns
                        </h2>
                        <p class="dark:text-slate-200 text-center sm:text-left text-body-color leading-relaxed mb-9">
                            Wir freuen uns, Sie zu sehen! Vereinbaren Sie unkompliziert einen Termin per Anruf, oder nutzen Sie das <span class="hidden lg:inline">nebenstehende </span>Online Formular<span class="lg:hidden">&nbsp;unten</span>.
                        </p>
                        {#each [
                            {title: 'Unsere Adresse', linkText: 'Kammstr. 2, 65399 Kiedrich, Hessen DE', href: 'https://goo.gl/maps/sk8AD42LZAhWAvYD7', svgPaths: ['M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z'], viewBox: '20', target: '_blank'},
                            {title: 'Telefonnummer', linkText: phoneNumberShort, href: `tel:${phoneNumberFull}`, svgPaths: ['M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'], viewBox: '24', target: ''},
                            {title: 'Fax', linkText: faxNumberShort, href: `tel:${faxNumberFull}`, svgPaths: ['M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z'], viewBox: '20', target: ''}]
                                as {title, linkText, href, svgPaths, viewBox, target}}

                            <div class="flex mb-8 w-full">
                                <a href={href} target={target} class="max-w-[60px] sm:max-w-[70px] w-full h-[60px] sm:h-[70px] flex items-center justify-center mr-6 overflow-hidden bg-primary-300 hover:bg-opacity-10 bg-opacity-5 text-primary-500 rounded">
                                    <svg class="fill-current overflow-visible" height="24" width="24" viewBox="0 0 {viewBox} {viewBox}" >
                                        {#each svgPaths as path}
                                            <path fill-rule="evenodd" d={path}/>
                                        {/each}
                                    </svg>
                                </a>
                                <div class="w-full">
                                    <h4 class="font-bold dark:text-slate-100 text-xl mb-1">{title}</h4>
                                    <a href={href} target="_blank" class="font-medium text-gray-600 hover:text-black dark:text-slate-300 dark:hover:text-slate-100">
                                        {linkText}
                                    </a>
                                </div>
                            </div>
                        {/each}
                        <div class="flex mb-8 w-full">
                            <div class="max-w-[60px] sm:max-w-[70px] w-full h-[60px] sm:h-[70px] flex items-center justify-center mr-6 overflow-hidden bg-amber-300 bg-opacity-5 text-amber-500 rounded">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="24" viewBox="0 0 20 20" width="24">
                                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="w-full">
                                <h4 class="font-bold dark:text-slate-100 text-xl mb-1">
                                    Im Notfall
                                </h4>
                                <p class="text-gray-600 font-medium dark:text-slate-300">Bei akutem Behandlungsbedarf außerhalb von Praxiszeiten empfehlen wir
                                    die Kontaktierung des <a href="https://www.116117.de/de/index.php" class="hover:text-black dark:hover:text-slate-100">ärztlichen Bereitschaftsdienstes</a>
                                    (<a href="tel:116117" class="text-gray-800 dark:text-slate-200 hover:text-black dark:hover:text-slate-100 underline">116 117</a>) oder in schwereren Fällen
                                    des <a href="https://www.aok.de/pk/magazin/familie/eltern/im-notfall-116-117-anrufen-oder-besser-den-notruf-112/" target="_blank" class="hover:text-black dark:hover:text-slate-100">Notdienstes</a>
                                    (<a href="tel:112" class="text-gray-800 dark:text-slate-200 hover:text-black dark:hover:text-slate-100 underline">112</a>). </p>
                            </div>
                        </div>
                    </div>
                </div>
                <ContactForm/>
                <a href="https://g.page/r/CduYIOKWcFs3EBE/review" target="_blank" class="mt-5 p-3 flex w-full md:hidden items-start rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 shadow-md hover:shadow-2xl">
                    <!-- Heroicon name: outline/shield-check -->
                    <svg class="flex-shrink-0 h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <div class="ml-4">
                        <p class="text-base font-medium text-gray-900 dark:text-slate-200">Hatten ihnen unser Service gefallen?</p>
                        <p class="mt-1 text-sm text-gray-500 dark:text-slate-200">Klicken sie hier um uns auf Google Maps zu bewerten. Wir bedanken uns!</p>
                    </div>
                </a>
            </div>
        </div>
    </div>
    <!-- ====== Contact Section End -->
</Footer>