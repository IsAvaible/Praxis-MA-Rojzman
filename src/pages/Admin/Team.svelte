<script lang="ts">
import LoadingWheel from "../../lib/Misc/LoadingWheel.svelte";
import EditableProfileCard from "../../lib/Admin/Team/EditableProfileCard.svelte";
import Alert from "../../lib/Essentials/Alert.svelte";
import PageTitle from "../../lib/Admin/Navigation/PageTitle.svelte";
import {getTeamMembers} from "../../scripts/database/database";
import {slide, fade} from "svelte/transition";
import {unsavedChangesStore} from "../../scripts/stores/unsavedChangesStore";

let refreshTeam = 0;
let addedTeamMembers = [];

let addingMember = false;
let id = '';
$: idValid = (!addedTeamMembers || addedTeamMembers.findIndex(m => m.id == id) === -1) && id === (id = id.match(/[a-z-_+]*/g)?.join(''));

const handleTeamMemberAdd = () => {
    if (addingMember) {
        if (idValid && id.length) {
            addedTeamMembers.push({id: id, newMember: true});
            addedTeamMembers = addedTeamMembers;
            addingMember = false;
            id = '';
        } else if (id.length) {
            idValid = false;
        } else {
            addingMember = false;
        }
    } else {
        addingMember = true;
    }
}

let editStates = [];
let anyEdit = false;
$: anyEdit = editStates.findIndex(v => v) != -1;

$: unsavedChangesStore.set(anyEdit || addingMember);
</script>

<div class="flex flex-col mx-2 sm:mx-auto w-full">
    <PageTitle titleAccent="Team" subTitle="Hier können neue Mitglieder dem Team hinzugefügt werden oder bisherige modifiziert oder gelöscht werden."/>
    {#key refreshTeam}
        {#await getTeamMembers(true)}
            <div class="w-full flex justify-center">
                <LoadingWheel size={25} showAfter={1000}/>
            </div>
        {:then teamMembers}
            <div class="bg-gray-100 bg-hero-leaf-600 dark:bg-slate-800 z-20 w-full px-10 pt-10 pb-16">
                <div class="container mx-auto">
                    <div role="list" aria-label="Mitarbeiter" class="md:flex items-center flex-wrap sm:justify-around">
                        {#each teamMembers as member, i}
                            <EditableProfileCard {...member} on:edited={event => editStates[i] = event.detail}/>
                        {:else}
                            <Alert type={1} title='Hinweis:' description='Es wurden noch keine Team Mitglieder angelegt.'/>
                        {/each}
                        <!-- Not really great way to prevent new members from resetting edits on old members -->
                        {#each addedTeamMembers as member, i}
                            <EditableProfileCard {...member} on:edited={event => editStates[i] = event.detail}/>
                        {/each}
                        <div role="listitem" class="relative mt-24 mx-2 sm:min-w-[300px] md:w-2/5 lg:w-2/5 xl:w-1/3 xl:max-w-sm bg-white dark:bg-slate-800">
                            <div class="rounded overflow-hidden shadow-md h-full">
                                <div class="px-6 w-full my-20 text-primary-500 group cursor-pointer">
                                    <div class="hover:text-primary-600">
                                        <svg on:click={() => handleTeamMemberAdd()} xmlns="http://www.w3.org/2000/svg" class="h-40 w-40 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d={addingMember ? (id ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z") : "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"}/>
                                        </svg>
                                        <p class="font-medium text-center text-xl">Mitglied Hinzufügen</p>
                                    </div>
                                    {#if addingMember}
                                        <div out:fade|local={{duration: 250}} class="w-full flex">
                                            <input bind:value={id} in:slide={{duration: 300}} out:slide|local={{duration: 300}} on:keydown={(e) => {if (e.keyCode === 10 || e.keyCode === 13) {e.preventDefault(); handleTeamMemberAdd()}}} on:keyup={e => {if (e.which === 27) {addingMember = false}}}
                                                   autocomplete="off" pattern="[a-z0-9-_+]+" required class="text-center mt-6 w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none {idValid?'focus:border-primary-500':'border-red-500'}" placeholder="Ein identifizierender Name (ID)" type="text" />
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {:catch e}
            <Alert type={0} title="Team konnte nicht geladen werden!" description="Error: {e.message}"/>
        {/await}
    {/key}
</div>

