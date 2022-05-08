<script lang="ts">
import ProfileCard from "../../lib/Team/ProfileCard.svelte";
import Alert from "../../lib/Essentials/Alert.svelte";
import PageTitle from "../../lib/Admin/PageTitle.svelte";
import {getTeamMembers} from "../../supabase/database.ts";
import {fade} from "svelte/transition";

let refreshTeam = 0;
let selectIndex = -1;
</script>

<div class="flex flex-col mx-2 sm:mx-auto w-full">
    <PageTitle titleAccent="Team" subTitle="Hier können neue Mitglieder dem Team hinzugefügt werden oder bisherige modifiziert oder gelöscht werden."/>
    {#key refreshTeam}
        {#await getTeamMembers(true) then teamMembers}
            {#if teamMembers.length > 0}
                <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 py-5">
                    {#each teamMembers as member, i}
                        <div in:fade={{duration: 500}} on:click={() => selectIndex = selectIndex === i ? -1 : i} class="mx-4 cursor-pointer h-full my-auto rounded-lg p-1 {selectedFeature.index===i?'bg-primary-300':''}">
                            {#if selectedFeature.index === i}<span class="float-right h-3 w-3 mr-1 mt-1 justify-center inline-flex h-full w-full rounded-full bg-primary-500 opacity-100"></span>{/if}
                            <ProfileCard {...member}/>
                        </div>
                    {/each}
                </div>
            {:else}
                <Alert type={1} title='Information:' description='Es wurden noch keine Team Mitglieder angelegt.'/>
            {/if}
        {:catch e}
            <Alert type={0} title="Team konnten nicht geladen werden!" description="Error: {e.message}"/>
        {/await}
    {/key}
</div>

