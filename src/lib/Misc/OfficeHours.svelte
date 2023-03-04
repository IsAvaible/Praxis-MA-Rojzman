<script lang="ts">
    import {calculateEndTime, getOfficeHours} from "../../scripts/database/database";
    import {formatHHMM} from "../../scripts/misc/dateFormat";
    import {officeHoursChangedStore} from "../../scripts/stores/officeHoursChangedStore";
    import LoadingWheel from "./LoadingWheel.svelte";
    import Alert from "../Essentials/Alert.svelte";

    let weekdays: string[] = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

    // If the office hours were changed by the admin, the cache is not used and the office hours are reloaded

    const compareTimePeriods = (a, b) => {
        if (a.startTime > b.startTime) {
            return 1;
        } else if (a.startTime.getTime() === b.startTime.getTime()) {
            return a.duration - b.duration;
        } else {
            return -1;
        }
    }
</script>

<div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
    <div class="sm:flex sm:items-start">
        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-500 sm:mx-0 sm:h-10 sm:w-10">
            <!-- Heroicon name: outline/clock -->
            <svg class="h-6 w-6 text-primary-600 dark:text-primary-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-slate-100" id="modal-title">Unsere Sprech- und Praxiszeiten</h3>
            <div class="mt-2">
                <!-- Use noCache if the office hours are opened while the user is in the admin section -->
                {#await getOfficeHours($officeHoursChangedStore)}
                    <div class="flex w-full my-28 justify-center items-center">
                        <LoadingWheel showAfter={1000} size={20}/>
                    </div>
                {:then officeHours}
                    {(() => {officeHoursChangedStore.set(false); return ''})()}
                    {#each officeHours as day}
                        {#if day.timePeriods.length > 0}
                            <p class="font-medium text-md text-gray-600 dark:text-slate-200">
                                {weekdays[day.weekday]}
                                {#if day.comment}<span class="text-sm text-gray-500 dark:text-slate-300"> - {day.comment}</span>{/if}
                            </p>
                            {#each day.timePeriods.sort(compareTimePeriods) as period}
                                <p class="font-light text-md text-gray-500 dark:text-slate-200">{formatHHMM(period.startTime)} - {formatHHMM(calculateEndTime(period.startTime, period.duration))}</p>
                            {/each}
                        {/if}
                    {/each}
                {:catch e}
                    <div class="w-[20rem] overflow-hidden">
                        <Alert type={1} title="Sprechzeiten konnten nicht geladen werden." description="Wir konnten die angeforderten Daten nicht laden. Überprüfen sie bitte ihre Internetverbindung."/>
                    </div>
                {/await}
            </div>
        </div>
    </div>
</div>