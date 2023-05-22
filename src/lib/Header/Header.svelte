<script lang="ts">
    import {globalHistory, Link, Route, Router} from "svelte-navigator";
    import {fade} from "svelte/transition";
    import {bannerPushContentStore} from "../../scripts/stores/bannerPushContentStore";
    // import FlyoutMenu1 from "./FlyoutMenu1.svelte";
    import FlyoutMenu2 from "./FlyoutMenu2.svelte";
    import MobileMenu from "./MobileMenu.svelte";
    import Contact from "../../pages/Contact.svelte";
    import Home from "../../pages/Home.svelte";
    import Team from "../../pages/Team.svelte";
    import OfficeHoursPopUp from "./OfficeHoursPopUp.svelte";
    import NotFound from "../../pages/NotFound.svelte";
    import PrescriptionRequest from "../../pages/PrescriptionRequest.svelte";
    import SiteEnterPopUp from "../Essentials/SiteEnterPopUp.svelte";
    import Banner from "../Essentials/Banner.svelte";
    import Features from "../../pages/Features.svelte";
    import CookieBanner from "../Misc/CookieBanner.svelte";
    import {deviceOnlineStore} from "../../scripts/stores/deviceOnlineStore";
    import {delay} from "../../scripts/misc/delay";
    import Blog from "../../pages/Blog.svelte";
    import {unsavedChangesStore} from "../../scripts/stores/unsavedChangesStore";
    import {adminPreviewBannerDataStore} from "../../scripts/stores/adminPreviewBannerDataStore";
    import Icon from "./Icon.svelte";
    import {onDestroy, onMount} from "svelte";
    import {getBannerConfig, getConfigEntry} from "../../scripts/database/database";
    import disableScroll from "disable-scroll";
    import {cookieState, siteCookieStore} from "../../scripts/stores/cookies/siteCookieStore";
    import LazyRoute from "./LazyRoute.svelte";
    import PrivacyPolicy from "../../pages/PrivacyPolicy.svelte";
    import Impressum from "../../pages/Impressum.svelte";
    import PageTitle from "../Admin/Navigation/PageTitle.svelte";
    import LoadingWheel from "../Misc/LoadingWheel.svelte";
    import Footer from "../Essentials/Footer.svelte";
    import MetaTitle from "../SEO/MetaTitle.svelte";
    import MetaTag from "../SEO/MetaTag.svelte";

    let siteEnterPopUpData = {
        svgPaths: ["M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"],
        title: "Wir sind im Urlaub!",
        content: "Die Praxis ist deshalb bis zum 26.04 geschlossen. Falls sie während dieser Zeit medizinische Beratung benötigen, finden sie mithilfe des untenstehenden Knopf unsere Vertretungsmöglichkeiten.",
        active: false,
        buttonText: "Vertretung",
        buttonLink: "/vertretung"
    };

    let offlineBannerData = {
        mobileText: "Internetverbindung unterbrochen.",
        desktopText: "Ihr Gerät ist seit einigen Sekunden nicht mehr mit dem Internet verbunden.",
        active: true,
        buttonText: "Neu Laden",
        buttonAction: () => window.location.reload(),
        svgPaths: ["M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"],
        hideable: false,
        animateIn: true,
        pulseIcon: true,
        name: 'offline'
    }

    let bannerNoPushContentPaths = ["/"]; // These are the paths where the banner should not occupy screen space

    let pathname;
    let lastPageKey;
    const onNavigate = (history) => {
        if (pathname !== history.location.pathname) {
            pathname = history.location.pathname;
            bannerPushContentStore.set(!bannerNoPushContentPaths.includes(pathname));
        }
    }

    globalHistory.listen(onNavigate);

    const onRouterNavigate = (history, location) => {
        const viewName = history.meta.name;
        const { pathname } = location;
        return `Navigiert zu ${viewName} in ${pathname}`;
    }

    // Scroll to top when the site is switched
    history.pushState = new Proxy(history.pushState, {
        apply (target, thisArg, argumentsList) {
            // This will execute *before* the navigation (and may prevent it by returning early)
            if ($unsavedChangesStore) {
                if (confirm('Auf dieser Seite liegen noch ungespeicherte Änderungen vor! Wollen sie die Seite trotzdem verlassen?')) {
                    unsavedChangesStore.set(false);
                } else {
                    return false;
                }
            }
            // Render the new site
            Reflect.apply(target, thisArg, argumentsList);
            // This will execute *after* the navigation
            if (history.state == undefined || history.state.scroll !== false) {
                disableScroll.on();
                scrollTo(0, 0);
                disableScroll.off();
            }
            lastPageKey = history.state._key;
            adminPreviewBannerDataStore.set(null);
        }
    })

    // Prevent refresh when there are unsaved changes
    window.onbeforeunload = () => {
        if ($unsavedChangesStore) {
            return 'Auf dieser Seite liegen noch ungespeicherte Änderungen vor! Wollen sie die Seite trotzdem verlassen?';
        }
    }

    // Revert browser back and forward buttons when there are unsaved changes
    window.onpopstate = event => {
        if ($unsavedChangesStore) {
            if (confirm('Auf dieser Seite liegen noch ungespeicherte Änderungen vor! Wollen sie die Seite trotzdem verlassen?')) {
                return
            } else {
                unsavedChangesStore.set(false); // To prevent a confirm dialog showing up before forwarding
                if (lastPageKey != event.state._key) { // Don't ask why the if statement works this way
                    window.history.forward();
                } else {
                    window.history.back();
                }
                delay(1).then(() =>  unsavedChangesStore.set(true)); // I #love JS
            }
        }
    }

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

    // Automatically close the mobile or flyout menu when the resolution switched between the thresholds (mobile and desktop)
    let smallScreenWidth = window.innerWidth < 768;
    window.onresize = () => {
        if (smallScreenWidth && window.innerWidth >= 768) {
            smallScreenWidth = false;
            // flyout2Open = mobileMenuOpen;
            mobileMenuOpen = false;
        } else if (!smallScreenWidth && window.innerWidth < 768) {
            smallScreenWidth = true;
            // mobileMenuOpen = flyout2Open;
            flyout2Open = false;
        }
    }

    let officeHoursPopUpOpen = false;
    const toggleOfficeHoursPopUp = () => {
        flyout1Open = false
        flyout2Open = false;
        officeHoursPopUpOpen = !officeHoursPopUpOpen;
    }

    let bannerData;
    let bannerOpen;
    onMount(async () => {
        let selectedBannerName = (await getConfigEntry("selected-banner-config", true)).data["name"] as string
        bannerData = await getBannerConfig(selectedBannerName);
        bannerOpen = bannerData.active && (!bannerData.activeUntil || new Date(bannerData.activeUntil) > new Date());
    });

    let adminPreviewBannerActive = false;
    let adminPreviewBannerData;
    const adminPreviewBannerUnsubscribe = adminPreviewBannerDataStore.subscribe((data) => {
        if (data) {
            adminPreviewBannerData = data;
        }
        adminPreviewBannerActive = !!data;
    });

    let offline = false;
    let offlineBannerOpen = false;
    const deviceOnlineUnsubscribe = deviceOnlineStore.subscribe(online => {
        offline = !online;
        if (online) {offlineBannerOpen = false}
        else {delay(3000).then(() => {if (offline) offlineBannerOpen = true})}
    })

    onDestroy(() => {
        adminPreviewBannerUnsubscribe();
        deviceOnlineUnsubscribe();
    })

    const AdminSection = () => import("./LazyAdminSection.svelte");
</script>

<Router a11y="{{onRouterNavigate}}">
    <div class="sticky top-0 z-50 bg-white dark:bg-slate-800" id="header">
        <div class="mx-auto px-4 sm:px-6 max-w-7xl">
            <div class="flex justify-between items-center border-b-2 border-gray-100 dark:border-none py-6 md:justify-start md:space-x-10">
                <!-- This is located here, so that it appears first in the tab order -->
                {#if $siteCookieStore === cookieState.UNSET}
                    <CookieBanner/>
                {/if}
                <div class="flex justify-start lg:w-0 lg:flex-1 {mobileMenuOpen ? '' : ''}">
                    <Icon/>
                </div>

                <div class="flex md:hidden space-x-10">
                    <h1 class="text-base font-medium text-gray-500 dark:text-slate-200 text-center {mobileMenuOpen ? '' : ''}"> Praxis M.A. Rojzman </h1>
                </div>
                <div class="-mr-2 -my-2 md:hidden">
                    <button on:click={toggleMobileMenu} type="button" class="bg-white dark:bg-transparent rounded-md p-2 inline-flex items-center justify-center text-gray-400 dark:text-slate-300 hover:text-gray-500 hover:bg-gray-100 dark:hover:text-slate-400 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500" aria-expanded="false">
                        <span class="sr-only">Menu öffnen</span>
                        <!-- Heroicon name: outline/menu -->
                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    {#if mobileMenuOpen}
                        <div in:fade={{duration: 300}} out:fade|local={{duration: 300}}>
                            <MobileMenu on:toggleOfficeHoursPopUp={toggleOfficeHoursPopUp} on:hide={toggleMobileMenu}/>
                        </div>
                    {/if}
                </div>
                <nav class="hidden md:flex md:items-center space-x-10">
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
                    <Link to="leistungen" class="text-base font-medium text-center {pathname === '/leistungen' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-slate-200'} hover:text-gray-900 dark:hover:text-white"> Leistungen </Link>
                    <Link to="team" class="text-base font-medium text-center {pathname === '/team' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-slate-200'} hover:text-gray-900 dark:hover:text-white"> Unser Team </Link>
                    <Link to="aktuelles" class="text-base font-medium text-center {pathname === '/aktuelles' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-slate-200'} hover:text-gray-900 dark:hover:text-white"> Aktuelles </Link>

                    <div class="relative">
                        <!-- Item active: "text-gray-900", Item inactive: "text-gray-500" -->
                        <button on:click={toggleFlyout2} type="button" class="text-gray-500 group rounded-md inline-flex items-center font-medium hover:text-gray-900 dark:text-slate-200 dark:hover:text-white dark:focus:ring-offset-transparent" aria-expanded="false">
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
                            <div out:fade|local={{duration: 300}}>
                                <FlyoutMenu2 on:hide={() => {toggleFlyout2(); flyout2Open = false}}/>
                            </div>
                        {/if}
                    </div>
                </nav>
                <div class="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                    <button on:click={toggleOfficeHoursPopUp} class="cursor-pointer whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900 dark:text-slate-200 dark:hover:text-slate-100"> Sprechzeiten </button>
                    <Link to="kontakt" class="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"> Kontakt </Link>
                </div>
            </div>
            {#if officeHoursPopUpOpen}
                <OfficeHoursPopUp on:hide={toggleOfficeHoursPopUp}/>
            {/if}
        </div>
        {#if offlineBannerOpen}
            <Banner {...offlineBannerData} id="offline-banner"/>
        {/if}
        {#if bannerOpen}
            <Banner {...bannerData} on:hide={() => bannerOpen = false} id="banner"/>
        {/if}
        {#if adminPreviewBannerActive}
            <Banner {...adminPreviewBannerData} active={true} animateIn={true} on:hide={() => {adminPreviewBannerDataStore.set(null)}} id="admin-preview-banner"/>
        {/if}
        <SiteEnterPopUp {...siteEnterPopUpData}/>
    </div>
    <div id="#Routes">
        <!-- TODO: Add og:image meta tag -->
        <Route path="/">
            <MetaTitle title="Praxis M.A. Rojzman - Kiedrich"/>
            <MetaTag name="description" content="Hausarztpraxis im Herzen von Kiedrich. Bei uns fühlen sie sich wie zu hause! Kommen sie vorbei!"/>
            <MetaTag name="keywords" content="Hausarztpraxis, Kiedrich, Arzt, Doktor, Praxis, Rojzman"/>
            <Home/>
        </Route>

        <Route path="team">
            <MetaTitle title="Team - Praxis M.A. Rojzman"/>
            <MetaTag name="description" content="Erfahren Sie mehr über unser Team."/>
            <MetaTag name="keywords" content="Team, Praxis, Rojzman, Mitarbeiter"/>
            <Team/>
        </Route>

        <Route path="leistungen/*">
            <MetaTitle title="Leistungen - Praxis M.A. Rojzman"/>
            <MetaTag name="description" content="Wir bieten eine Vielzahl von Leistungen an, um Ihre Gesundheit zu erhalten und zu verbessern."/>
            <MetaTag name="keywords" content="Leistungen, Gesundheit, Praxis, Rojzman"/>
            <Route path="/">
                <Features/>
            </Route>
            <Route path=":name">
                <Features/>
            </Route>
        </Route>

        <Route path="aktuelles/*">
            <MetaTitle title="Aktuelles - Praxis M.A. Rojzman"/>
            <MetaTag name="description" content="Bleiben Sie auf dem Laufenden über Neuigkeiten und Aktuelles aus der Praxis."/>
            <MetaTag name="keywords" content="Aktuelles, Neuigkeiten, Blog, Praxis, Rojzman"/>
            <Route path="/">
                <Blog/>
            </Route>
            <Route path=":id">
                <Blog/>
            </Route>
            <Route path="/*/*">
                <NotFound/>
            </Route>
        </Route>

        <Route path="kontakt">
            <MetaTitle title="Kontakt - Praxis M.A. Rojzman"/>
            <MetaTag name="description" content="Kontaktieren Sie uns, um einen Termin zu vereinbaren oder Fragen zu unseren Leistungen zu stellen."/>
            <MetaTag name="keywords" content="Kontakt, Termin, Praxis, Rojzman"/>
            <Contact/>
        </Route>

        <Route path="rezeptanforderung">
            <MetaTitle title="Rezeptanforderung - Praxis M.A. Rojzman"/>
            <MetaTag name="description" content="Beantragen Sie ein Rezept online bei der Praxis M.A. Rojzman - Kiedrich."/>
            <MetaTag name="keywords" content="Rezeptanforderung, Online, Praxis, Rojzman"/>
            <PrescriptionRequest/>
        </Route>

        <Route path="vertretung">
            <MetaTitle title="Vertretung - Praxis M.A. Rojzman"/>
            <MetaTag name="description" content="Erfahren Sie mehr über unsere Vertretungsregelungen und werfen Sie einen Blick auf unsere Partnerpraxen."/>
            <MetaTag name="keywords" content="Vertretung, Partnerpraxen, Praxis, Rojzman"/>
            <NotFound/>
        </Route>

        <Route path="datenschutz">
            <MetaTitle title="Datenschutz - Praxis M.A. Rojzman"/>
            <MetaTag name="description" content="Erfahren Sie mehr über unsere Datenschutzrichtlinien und wie wir Ihre Daten schützen."/>
            <MetaTag name="keywords" content="Datenschutz, Richtlinien, Praxis, Rojzman"/>
            <PrivacyPolicy/>
        </Route>

        <Route path="impressum">
            <MetaTitle title="Impressum - Praxis M.A. Rojzman"/>
            <MetaTag name="description" content="Hier finden sie das Impressum der Praxis."/>
            <MetaTag name="keywords" content="Impressum, Praxis, Rojzman"/>
            <Impressum/>
        </Route>

        <LazyRoute path="admin/*" component={AdminSection}>
            <MetaTitle title="Admin Sektion - Praxis M.A. Rojzman"/>
            <Footer>
                <div in:fade={{duration: 200}} class="w-full h-full -mt-20 flex items-center justify-center flex-col gap-y-3 text-white">
                    <PageTitle title="Admin Sektion" subTitle="Die Admin Sektion wird geladen..."/>
                    <LoadingWheel size={20}/>
                </div>
            </Footer>
        </LazyRoute>

        <Route>
            <MetaTitle title="404 - Praxis M.A. Rojzman"/>
            <MetaTag name="description" content="noindex"/>
            <NotFound/>
        </Route>
    </div>
</Router>