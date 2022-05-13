<script lang="ts">
    import {Router, Route, Link, globalHistory} from "svelte-navigator";
    import { fade } from "svelte/transition";
    import {bannerPushContent} from "../../utilities/BannerPushContent";
    // import FlyoutMenu1 from "./FlyoutMenu1.svelte";
    import FlyoutMenu2 from "./FlyoutMenu2.svelte";
    import MobileMenu from "./MobileMenu.svelte";
    import Contact from "../../pages/Contact.svelte";
    import Home from "../../pages/Home.svelte";
    import Team from "../../pages/Team.svelte";
    import PrivacyPolicy from "../../pages/PrivacyPolicy.svelte";
    import OfficeHours from "./OfficeHoursPopUp.svelte";
    import NotFound from "../../pages/NotFound.svelte";
    import PrescriptionRequest from "../../pages/PrescriptionRequest.svelte";
    import SiteEnterPopUp from "../Essentials/SiteEnterPopUp.svelte";
    import Banner from "../Essentials/Banner.svelte";
    import Features from "../../pages/Features.svelte";
    import Admin from "../../pages/Admin/Admin.svelte";
    import Login from "../../pages/Admin/Login.svelte";
    import Sidebar from "../Admin/General/Sidebar.svelte";
    import AdminFeatures from "../../pages/Admin/Features.svelte";
    import AdminTeam from '../../pages/Admin/Team.svelte'
    import Footer from "../Essentials/Footer.svelte";
    import CookieBanner from "../Misc/CookieBanner.svelte";

    let bannerData = {
        mobileText: "Wir sind bis zum 26.04 im Urlaub!",
        desktopText: "Wir sind bis zum 26.04 im Urlaub!",
        active: true,
        navText: "Vertretung finden",
        navLink: "/vertretung",
        svgPath: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
    }

    let siteEnterPopUpData = {
        svgPath: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
        title: "Wir sind im Urlaub!",
        content: "Die Praxis ist deshalb bis zum 26.04 geschlossen. Falls sie während dieser Zeit medizinische Beratung benötigen, finden sie mithilfe des untenstehenden Knopf unsere Vertretungsmöglichkeiten.",
        active: false,
        buttonText: "Vertretung",
        buttonLink: "/vertretung"
    };

    let bannerOpen = bannerData.active;
    let bannerNoPushContentPaths = ["/"]; // These are the paths where the banner should not occupy screen space

    let pathname;
    const onNavigate = (history) => {
        pathname = history.location.pathname;
        bannerPushContent.set(!bannerNoPushContentPaths.includes(pathname))
    }

    // Scroll to top when the site is switched
    history.pushState = new Proxy(history.pushState, {
        apply (target, thisArg, argumentsList) {
            // scrollTo(0, 0) <-- order of operation can mather (ty, @t-lock)
            Reflect.apply(target, thisArg, argumentsList);
            if (history.state == undefined || history.state.scroll !== false) scrollTo(0, 0);
        }
    })

    globalHistory.listen(onNavigate);

    let flyout1Open = false;
    const toggleFlyout1 = () => {
        flyout2Open = false;
        flyout1Open = !flyout1Open;
    }

    let flyout2Open = false;
    const toggleFlyout2 = () => {
        flyout1Open = false;
        flyout2Open = !flyout2Open;
    }

    let mobileMenuOpen = false;
    const toggleMobileMenu = () => {
        mobileMenuOpen = !mobileMenuOpen;
    }

    let officeHoursPopUpOpen = false;
    const toggleOfficeHoursPopUp = () => {
        flyout1Open = false
        flyout2Open = false;
        officeHoursPopUpOpen = !officeHoursPopUpOpen;
    }
</script>

<Router a11y="{{onNavigate}}">
    <div class="sticky top-0 z-50 bg-white dark:bg-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
            <div class="flex justify-between items-center border-b-2 border-gray-100 dark:border-none py-6 md:justify-start md:space-x-10">
                <div class="flex justify-start lg:w-0 lg:flex-1">
                    <Link to="/">
                        <span class="sr-only">Homepage</span>
                        <div class="has-tooltip">
                            <img class="h-8 w-auto sm:h-10" src="assets/favicon.svg" alt="">
                            <div class="tooltip inline-block ml-12 absolute z-10 py-2 px-3 text-sm font-medium text-black rounded-lg shadow bg-white dark:text-slate-200 dark:bg-slate-700">
                                Startseite
                            </div>
                        </div>
                    </Link>

                </div>

                <div class="flex md:hidden space-x-10">
                    <h1 class="text-base font-medium text-gray-500 dark:text-slate-200"> Praxis M.A. Rojzman </h1>
                </div>
                <div class="-mr-2 -my-2 md:hidden">
                    <button on:click={toggleMobileMenu} type="button" class="bg-white dark:bg-transparent rounded-md p-2 inline-flex items-center justify-center text-gray-400 dark:text-slate-300 hover:text-gray-500 hover:bg-gray-100 dark:hover:text-slate-400 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500" aria-expanded="false">
                        <span class="sr-only">Open menu</span>
                        <!-- Heroicon name: outline/menu -->
                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    {#if mobileMenuOpen}
                        <div in:fade={{duration: 300}} out:fade={{duration: 300}}>
                            <MobileMenu on:toggleOfficeHoursPopUp={toggleOfficeHoursPopUp} on:hide={toggleMobileMenu}/>
                        </div>
                    {/if}
                </div>
                <nav class="hidden md:flex space-x-10">
<!--                    <div class="relative">-->
<!--                        &lt;!&ndash; Item active: "text-gray-900", Item inactive: "text-gray-500" &ndash;&gt;-->
<!--                        <button on:click={toggleFlyout1} type="button" class="text-gray-500 group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" aria-expanded="false">-->
<!--                            <span>Leistungen</span>-->
<!--                            &lt;!&ndash;-->
<!--                              Heroicon name: solid/chevron-down-->

<!--                              Item active: "text-gray-600", Item inactive: "text-gray-400"-->
<!--                            &ndash;&gt;-->
<!--                            <svg class="text-gray-400 ml-2 h-5 w-5 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">-->
<!--                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />-->
<!--                            </svg>-->
<!--                        </button>-->
<!--                        {#if flyout1Open}-->
<!--                            <div in:fade={{duration: 300}} out:fade={{duration: 300}}>-->
<!--                                <FlyoutMenu1 on:hide={toggleFlyout1}/>-->
<!--                            </div>-->
<!--                        {/if}-->
<!--                    </div>-->
                    <Link to="leistungen"><p class="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-slate-200 dark:hover:text-white"> Leistungen </p></Link>
                    <Link to="team"><p class="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-slate-200 dark:hover:text-white"> Unser Team </p></Link>
                    <Link to="aktuelles"><p class="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-slate-200 dark:hover:text-white"> Aktuelles </p></Link>

                    <div class="relative">
                        <!-- Item active: "text-gray-900", Item inactive: "text-gray-500" -->
                        <button on:click={toggleFlyout2} type="button" class="text-gray-500 group rounded-md inline-flex items-center font-medium hover:text-gray-900 dark:text-slate-200 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-transparent" aria-expanded="false">
                            <span>Mehr</span>
                            <!--
                              Heroicon name: solid/chevron-down

                              Item active: "text-gray-600", Item inactive: "text-gray-400"
                            -->
                            <svg class="text-gray-400 ml-2 h-5 w-5 group-hover:text-gray-500 dark:text-slate-200 dark:group-hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>
                        {#if flyout2Open}
                            <div in:fade={{duration: 300}} out:fade={{duration: 300}}>
                                <FlyoutMenu2 on:hide={toggleFlyout2}/>
                            </div>
                        {/if}
                    </div>
                </nav>
                <div class="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                    <p on:click={toggleOfficeHoursPopUp} class="cursor-pointer whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900 dark:text-slate-200 dark:hover:text-slate-400"> Sprechzeiten </p>
                    <Link to="kontakt"><span class="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"> Kontakt </span></Link>
                </div>
            </div>
            {#if officeHoursPopUpOpen}
                <div in:fade={{duration: 300}} out:fade={{duration: 300}}>
                    <OfficeHours on:hide={toggleOfficeHoursPopUp}/>
                </div>
            {/if}
        </div>
        {#if bannerOpen}
            <Banner {...bannerData} on:hide={() => bannerOpen = false}/>
        {/if}
        <SiteEnterPopUp {...siteEnterPopUpData}/>
    </div>
    <div id="#Routes">
        <Route path="/">
            <Home/>
        </Route>

        <Route path="team">
            <Team/>
        </Route>

        <Route path="leistungen/*">
            <Route path="/">
                <Features/>
            </Route>
            <Route path=":name">
                <Features/>
            </Route>
        </Route>

        <Route path="aktuelles/*">
            <Route path="/">
                <NotFound/>
            </Route>
            <Route path=":id" component={undefined}/>
        </Route>

        <Route path="kontakt">
            <Contact/>
        </Route>

        <Route path="rezeptanforderung">
            <PrescriptionRequest/>
        </Route>

        <Route path="vertretung">
            <NotFound/>
        </Route>

        <Route path="faq">
            <NotFound/>
        </Route>

        <Route path="datenschutzerklaerung">
            <PrivacyPolicy/>
        </Route>

        <Route path="impressum">
            <NotFound/>
        </Route>

        <Route path="admin/*">
            <Route path="/login"><Login/></Route>
            <Route path="/*">
                <Footer>
                    <Sidebar>
                        <Route path="/"><Admin/></Route>
                        <Route path="/leistungen"><AdminFeatures/></Route>
                        <Route path="/team"><AdminTeam/></Route>
                        <Route path="/*"><NotFound redirectTo="/admin" withFooter={false}/></Route>
                    </Sidebar>
                </Footer>
            </Route>
        </Route>

        <Route>
            <NotFound/>
        </Route>
    </div>
</Router>