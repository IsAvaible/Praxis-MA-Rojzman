<script lang="ts">
import LoadingWheel from "../../lib/Misc/LoadingWheel.svelte";
import EditableProfileCard from "../../lib/Admin/Team/EditableProfileCard.svelte";
import Alert from "../../lib/Essentials/Alert.svelte";
import PageTitle from "../../lib/Admin/General/PageTitle.svelte";
import {getTeamMembers} from "../../supabase/database.ts";
import {slide, fade} from "svelte/transition";

let refreshTeam = 0;
let teamMembersLocal;

let addingMember = false;
let idName = '';
$: nameValid = (!teamMembersLocal || teamMembersLocal.findIndex(m => m.idName == idName) === -1) && idName === (idName = idName.match(/[a-z\d-_+]*/g)?.join(''));

const handleTeamMemberAdd = (teamMembers) => {
  if (addingMember && nameValid && idName.length) {
      teamMembers.push({idName: idName, newMember: true});
      teamMembersLocal = teamMembers;
      addingMember = false;
      idName = '';
  } else if (addingMember) {
      nameValid = false;
  } else {
      addingMember = true;
  }
}
</script>

<div class="flex flex-col mx-2 sm:mx-auto w-full">
    <PageTitle titleAccent="Team" subTitle="Hier können neue Mitglieder dem Team hinzugefügt werden oder bisherige modifiziert oder gelöscht werden."/>
    {#key refreshTeam}
        {#await getTeamMembers(true)}
            <div class="w-full flex justify-center">
                <LoadingWheel size={25} showAfter={1000}/>
            </div>
        {:then teamMembers}
            {#if true}
                <div class="bg-gray-100 bg-hero-leaf-600 dark:bg-slate-800 z-20 w-full px-10 pt-10 pb-10">
                    <div class="container mx-auto">
                        <div role="list" aria-label="Mitarbeiter" class="md:flex items-center flex-wrap sm:justify-around">
                            {#each teamMembersLocal ? teamMembers : teamMembers as member, i}
                                <EditableProfileCard {...member}/>
                            {/each}
                            <div role="listitem" class="relative mt-16 mx-2 sm:min-w-[300px] md:w-2/5 lg:w-2/5 xl:w-1/3 xl:max-w-sm bg-white dark:bg-slate-800">
                                <div class="rounded overflow-hidden shadow-md h-full">
                                    <div class="px-6 w-full my-20 text-primary-500 hover:text-primary-600 group cursor-pointer">
                                        <svg on:click={() => handleTeamMemberAdd(teamMembers)} xmlns="http://www.w3.org/2000/svg" class="h-40 w-40 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d= {addingMember ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"}/>
                                        </svg>
                                        <p class="font-medium text-center text-xl">Mitglied Hinzufügen</p>
                                        {#if addingMember}
                                            <div out:fade={{duration: 250}} class="w-full" on:keydown>
                                                <input bind:value={idName} in:slide={{duration: 300}} out:slide={{duration: 300}} on:keydown={(e) => {if (e.keyCode === 10 || e.keyCode === 13) {e.preventDefault(); handleTeamMemberAdd(teamMembers)}}} on:keyup={e => {if (e.which === 27) {addingMember = false}}}
                                                       autocomplete="off" pattern="[a-z0-9-_+]+" required class="text-center mt-6 w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none {nameValid?'focus:border-primary-500':'border-red-500'}"  placeholder="Ein identifizierender Name (ID)" type="text" />
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {:else}
                <Alert type={1} title='Information:' description='Es wurden noch keine Team Mitglieder angelegt.'/>
            {/if}
        {:catch e}
            <Alert type={0} title="Team konnten nicht geladen werden!" description="Error: {e.message}"/>
        {/await}
    {/key}
</div>

