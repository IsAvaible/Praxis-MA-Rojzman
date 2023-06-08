<script>
    import {Route} from "svelte-navigator";
    import NotFound from "../../pages/NotFound.svelte";
    import Footer from "../Essentials/Footer.svelte";
    import AdminHome from "../../pages/Admin/Admin.svelte";
    import AdminLogin from "../../pages/Admin/Login.svelte";
    import AdminSidebar from "../Admin/Navigation/Sidebar.svelte";
    import AdminFeatures from "../../pages/Admin/Features.svelte";
    import AdminBlog from '../../pages/Admin/Blog.svelte';
    import AdminTeam from '../../pages/Admin/Team.svelte';
    import AdminBanner from '../../pages/Admin/BannerConfigurationPage.svelte';
    import MetaTitle from "../SEO/MetaTitle.svelte";
    import MetaTag from "../SEO/MetaTag.svelte";
</script>

<MetaTag name="robots" content="noindex"/>
<Route path="/login">
    <MetaTitle title="Admin Login - Praxis M.A. Rojzman"/>
    <AdminLogin/>
</Route>
<Route path="/*">
    <Footer>
        <AdminSidebar>
            <Route path="/">
                <MetaTitle title="Admin Sektion - Praxis M.A. Rojzman"/>
                <AdminHome/>
            </Route>
            <Route path="/leistungen">
                <MetaTitle title="Admin Leistungen - Praxis M.A. Rojzman"/>
                <AdminFeatures/>
            </Route>
            <Route path="/aktuelles">
                <MetaTitle title="Admin Aktuelles - Praxis M.A. Rojzman"/>
                <AdminBlog/>
            </Route>
            <Route path="/team">
                <MetaTitle title="Admin Team - Praxis M.A. Rojzman"/>
                <AdminTeam/>
            </Route>
            <Route path="/sprechzeiten">
                <MetaTitle title="Admin Sprechzeiten - Praxis M.A. Rojzman"/>
                Hier ist nichts :)
            </Route>
            <Route path="/banner">
                <MetaTitle title="Admin Banner - Praxis M.A. Rojzman"/>
                <AdminBanner/>
            </Route>
            <Route path="/*">
                <MetaTitle title="404 - Praxis M.A. Rojzman"/>
                <NotFound redirectTo="/admin" withFooter={false}/>
            </Route>
        </AdminSidebar>
    </Footer>
</Route>