<script lang="ts">
    // import {fade} from "svelte/transition";
    // import { inview } from 'svelte-inview';
    import {Link} from "svelte-navigator";

    import Title from "../lib/Home/Title.svelte";
    import Footer from "../lib/Essentials/Footer.svelte";
    import InfoSection from "../lib/Home/InfoSection.svelte";
    import FeatureSection from "../lib/Home/HomeFeaturesReference.svelte";
    import BlogSection from "../lib/Home/HomeBlogReference.svelte";
    import OfficeHours from "../lib/Misc/OfficeHours.svelte";
    import Lazy from "../lib/Misc/Lazy.svelte";

    const CanvasComponent = () => import('../lib/Home/CanvasComponent.svelte');
</script>


<Footer>
    <Lazy component={CanvasComponent}>
        <div class="min-h-[70vh]"></div>
    </Lazy>
    <Title/>
    <div class="z-10 mx-4 md:mx-10 pt-2 mb-10 px-4 sm:px-6 lg:px-8 2xl:max-w-[80%] 2xl:mx-auto rounded-lg shadow-2xl shadow-gray-300 dark:shadow-black bg-white dark:bg-slate-900">
        <InfoSection/>
        <div>
            <FeatureSection/>
            <BlogSection/>
            <div class="-mx-4 sm:-mx-6 lg:-mx-8 bg-primary-100 dark:bg-primary-800 rounded-b-lg">
                <div class="mb-0 pointer-events-none overflow-hidden">
                    <svg class="overflow-hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 30" x="0" y="0">
                        <polygon class="text-white dark:text-slate-900 fill-current" points="0 0 0 30 1000 0"></polygon>
                    </svg>
                </div>
                <div class="mx-auto bg-slate flex justify-center mt-0">
                    <div class="flex p-5 lg:p-7 mb-5 flex-wrap justify-center items-center">
                        <div class="overflow-x-auto">
                            <OfficeHours/>
                        </div>
                        <div class="my-auto grid grid-cols-1 md:ml-3 w-56">
                            <a href="https://goo.gl/maps/sk8AD42LZAhWAvYD7" target="_blank" rel="noreferrer" class="hidden md:flex mx-auto mb-2 font-medium text-gray-800 dark:text-slate-100 hover:underline">
                                <p>Kammstr. 2, 65399 Kiedrich</p>
                            </a>
                            <Link to="/kontakt" class="w-full inline-flex justify-center rounded-md focus:outline-1
                            px-8 py-4 bg-primary-600 shadow-md shadow-gray-400 dark:shadow-none font-medium
                            text-white text-center hover:bg-primary-700 sm:w-auto sm:text-base">Kontaktieren sie uns!</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</Footer>
