<script lang="ts">
    import ActionsTimeline from "../../lib/Admin/Home/AdminActionsTimeline.svelte";
    import OfficeHoursConfigurator from "../../lib/Admin/Home/OfficeHoursConfigurator.svelte";
    import PageTitle from "../../lib/Admin/Navigation/PageTitle.svelte";
    import AllowRegistrationConfigurator from "../../lib/Admin/Home/AllowRegistrationConfigurator.svelte";
    import RainbowHeaderIconAnimationConfigurator
        from "../../lib/Admin/Home/RainbowHeaderIconAnimationConfigurator.svelte";
    // import DeveloperContact from "../../lib/Admin/Home/DeveloperContact.svelte";
</script>


<div class="flex flex-col w-full px-6">
    <PageTitle titleAccent="Home" subTitle="In dieser Sektion können die Inhalte der Webseite angepasst werden. In der Seitenleiste sind die Konfigurationsmöglichkeit nach Themengebieten eingeteilt. Nach drei Stunden wird der Admin Account automatisch abgemeldet."/>
    <div class="flex flex-col divide-y divide-gray-200 w-full">
        <ActionsTimeline/>
        <OfficeHoursConfigurator/>
        <div>
            <RainbowHeaderIconAnimationConfigurator/>
            <AllowRegistrationConfigurator/>
        </div>
<!--        <DeveloperContact/>-->
    </div>
</div>


