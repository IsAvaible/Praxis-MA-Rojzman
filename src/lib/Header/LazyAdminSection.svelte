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
</script>

<Route path="/login"><AdminLogin/></Route>
<Route path="/*">
    <Footer>
        <AdminSidebar>
            <Route path="/"><AdminHome/></Route>
            <Route path="/leistungen"><AdminFeatures/></Route>
            <Route path="/aktuelles"><AdminBlog/></Route>
            <Route path="/team"><AdminTeam/></Route>
            <Route path="/*"><NotFound redirectTo="/admin" withFooter={false}/></Route>
        </AdminSidebar>
    </Footer>
</Route>