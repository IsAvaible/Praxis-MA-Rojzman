<script>
    import BannerConfigurator from "../../lib/Admin/Home/BannerConfigurator.svelte";
    import PageTitle from "../../lib/Admin/Navigation/PageTitle.svelte";
</script>

<div class="flex flex-col w-full px-6 pb-12">
    <PageTitle titleAccent="Banner" subTitle="Auf dieser Seite kann der Banner, welcher beim Betreten der Webseite erscheint konfiguriert werden."/>
    <BannerConfigurator/>
</div>