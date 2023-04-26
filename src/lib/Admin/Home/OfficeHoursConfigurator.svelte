<script lang="ts">
    import {
        addTimePeriod,
        calculateDateDistance,
        calculateEndTime,
        deleteTimePeriod,
        getOfficeHourByWeekday,
        updateOfficeHour,
        updateOfficeHourComment,
        updateTimePeriod
    } from "../../../scripts/database/database";
    import {formatHHMM, numberToWeekdayDE} from "../../../scripts/misc/dateFormat";
    import Alert from "../../Essentials/Alert.svelte";
    import LoadingWheel from "../../Misc/LoadingWheel.svelte";
    import {officeHoursChangedStore} from "../../../scripts/stores/officeHoursChangedStore";

    let selectedWeekday: number = 0;
    let expandedTimePeriodId: number = -1;
    let currentTimePeriods: any[];
    let editingComment: boolean = false;
    let oldComment, editedComment: string;
    const selectWeekday = (weekday: number) => {
        selectedWeekday = weekday;
        editingComment = false;
        expandedTimePeriodId = undefined;
        oldComment = undefined;
        editedComment = undefined;
        expandedTimePeriodId = -1;
        currentTimePeriods = undefined;
    }

    const onAddTimePeriod = () => {
        let newStartTime: Date;
        if (currentTimePeriods.length > 0) {
            const lastTimePeriod = currentTimePeriods[currentTimePeriods.length - 1];
            newStartTime = calculateEndTime(lastTimePeriod.startTime, lastTimePeriod.duration);
        } else {
            newStartTime = new Date('1970-01-01T08:00:00');
        }
        officeHoursChangedStore.set(true);
        addTimePeriod(newStartTime, 60).then(timePeriod => {
            currentTimePeriods.push(timePeriod);
            currentTimePeriods = currentTimePeriods;
            updateOfficeHour(selectedWeekday, currentTimePeriods, oldComment);
        });
    }

    const onDeleteTimePeriod = (timePeriodId: number) => {
        deleteTimePeriod(timePeriodId);
        currentTimePeriods = currentTimePeriods.filter(timePeriod => timePeriod.id !== timePeriodId);
        officeHoursChangedStore.set(true);
        updateOfficeHour(selectedWeekday, currentTimePeriods, oldComment);
    }

    const expandTimePeriod = (id: number) => {
        expandedTimePeriodId = expandedTimePeriodId === id ? -1 : id;
    }

    const onStartTimeInputChange = (e, id, index) => {
        let val = new Date("1970-01-01T"+e.target.value);
        if (val.toString() === "Invalid Date") {
            return;
        }
        currentTimePeriods[index].duration = currentTimePeriods[index].duration + calculateDateDistance(val, currentTimePeriods[index].startTime);
        currentTimePeriods[index].startTime = val;
        officeHoursChangedStore.set(true);
        updateTimePeriod(id, currentTimePeriods[index].startTime, currentTimePeriods[index].duration);
    }

    const onEndTimeInputChange = (e, id, index) => {
        let val = new Date("1970-01-01T"+e.target.value);
        if (val.toString() === "Invalid Date") {
            return;
        }
        currentTimePeriods[index].duration = calculateDateDistance(currentTimePeriods[index].startTime, val);
        officeHoursChangedStore.set(true);
        updateTimePeriod(id, currentTimePeriods[index].startTime, currentTimePeriods[index].duration)
    }

    const editComment = () => {
        officeHoursChangedStore.set(true);
        updateOfficeHourComment(selectedWeekday, editedComment);
        oldComment = editedComment;
        editingComment = false;
    }

    const onEditCommentButton = () => {
        if (editingComment && editedComment == oldComment) {
            editingComment = false;
        } else if (editingComment) {
            editedComment = oldComment;
        } else {
            editingComment = true;
        }
    }

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

<div class="w-full my-6 pt-6 space-y-2">
    <p class="font-semibold text-center text-gray-800 dark:text-slate-200 text-xl">Sprechzeiten Konfigurieren</p>
    <p class="font-light text-center text-gray-800 dark:text-slate-200 pb-3">
        Unterhalb können sie die Sprechzeiten bearbeiten. Wählen sie hierfür einfach einen der Zeitabschnitte aus oder fügen sie einen neuen hinzu und
        editieren sie die Start- und/oder Endzeit. Jedem Wochentag kann zudem ein Kommentar angehängt werden. Um diesen
        zu bearbeiten, klicken sie bitte den Knopf auf der rechten Seite.&#13;&#10;Alle ihre Änderungen werden sofort auf der Webseite übernommen.
    </p>
    <div class="w-full grid lg:grid-cols-7 rounded-md shadow lg:divide-x divide-y lg:divide-y-0 dark:divide-slate-300 dark:shadow-slate-600 max-h-44 overflow-y-scroll lg:overflow-y-auto">
        {#each [...Array(7).keys()] as weekday}
            <button on:click={() => selectWeekday(weekday)} class="{weekday === selectedWeekday ? 'bg-gray-100 dark:bg-slate-800' : 'hover:bg-gray-50 dark:hover:bg-slate-800'} hover:shadow-gray-300 text-center py-3 font-semibold text-gray-700 dark:text-slate-300 dark:bg-slate-900">
                {numberToWeekdayDE(weekday)}
            </button>
        {/each}
    </div>
    <div class="w-full flex flex-col xl:flex-row space-y-2 xl:space-y-0 xl:space-x-2 bg-primary-300 p-2 rounded-md">
        <div class="flex-grow flex space-x-2 justify-center xl:justify-start min-h-[3rem]">
            {#await getOfficeHourByWeekday(selectedWeekday)}
                <div class="w-full flex justify-center items-center"><LoadingWheel size={9}/></div>
            {:then {weekday, timePeriods, comment}}
                <!-- Store the comment fetched in the await statement, if oldComment and editedComment are unset -->
                {#if oldComment === undefined && editedComment === undefined}
                    {(() => {oldComment = comment; editedComment = comment; return ''})()}
                {/if}
                {#if currentTimePeriods === undefined}
                    {currentTimePeriods = timePeriods.sort(compareTimePeriods)}
                    {(() => {currentTimePeriods = timePeriods; return ''})()}
                {/if}
                {#if !editingComment}
                    {#key expandedTimePeriodId}
                        <div class="flex flex-wrap justify-center -mt-2 -ml-2">
                            {#each currentTimePeriods as {id, startTime, duration}, index}
                                <!--If the div body is clicked (not the children) set the expandedTimePeriodId to -1-->
                                <div class="flex mt-2 ml-2 items-center parent-node">
                                    {#if id !== expandedTimePeriodId}
                                        <button on:click={() => expandTimePeriod(id)} class="bg-white text-lg min-h-[3rem] dark:bg-slate-800 active:ring-2 active:ring-primary-400 hover:bg-gray-50 dark:hover:bg-slate-900 rounded-md h-full px-2">
                                            <span class="font-bold">{index + 1}.</span>
                                            <span>{[startTime, calculateEndTime(startTime, duration)].map(formatHHMM).join(' - ')}</span>
                                        </button>
                                    {:else}
                                        <!-- Two input type time elements that allow editing the startTime and endTime -->
                                        <div on:click={e => {if (id === expandedTimePeriodId && e.target.matches('.parent-node')) expandedTimePeriodId = -1}} class="bg-white text-lg dark:bg-slate-900 rounded-md h-full px-2 flex items-center parent-node flex-wrap justify-center">
                                            <span class="font-bold mr-1 has-tooltip pointer-events-none">{index + 1}.</span>
                                            <!-- timePeriods is a list of TimePeriod objects when the value is changed a new timePeriod is added to the time-->
                                            <input type="time" class="cursor-pointer p-1 bg-transparent" value={formatHHMM(startTime)} on:change={e => onStartTimeInputChange(e, id, index)} />
                                            <span class="mx-2 cursor-default">-</span>
                                            <input type="time" class="cursor-pointer p-1 bg-transparent" value={formatHHMM(calculateEndTime(startTime, duration))} on:change={e => onEndTimeInputChange(e, id, index)} />
                                            <!-- A button which allows deleting the current time period -->
                                            <button on:click={() => onDeleteTimePeriod(id)} class="ml-2 has-tooltip text-red-500 hover:text-red-600">
                                                <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                <span class="tooltip absolute -ml-16 mt-2 z-10 py-2 px-3 flex text-sm font-medium text-black rounded-lg shadow bg-white dark:text-slate-200 dark:bg-slate-700">
                                                    Zeitspanne Löschen
                                                </span>
                                            </button>
                                        </div>
                                    {/if}
                                </div>
                            {:else}
                            <span class="mt-2 ml-2">
                                <Alert type="1" title="Keine Zeitabschnitte" description="Sie können neue Zeitabschnitte mithilfe des [+]-Knopf hinzufügen"/>
                            </span>
                            {/each}
                        </div>
                    {/key}
                {:else}
                    <input bind:value={editedComment} class="w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none focus:border-primary-500" placeholder="Kommentar" type="text" id="comment" />
                {/if}
            {:catch e}
                <div class="w-full flex justify-center items-center">
                    <Alert type="0" title="Fehler" description="Beim Laden der Daten ist ein Fehler aufgetreten"/>
                </div>
            {/await}
        </div>
        <div class="flex space-x-2 justify-center">
            <div>
                <button on:click={!editingComment?onAddTimePeriod:editComment} type="button" class="h-12 flex justify-center items-center has-tooltip align-middle p-2 aspect-[1] rounded-md bg-white dark:bg-slate-900 dark:hover:bg-black text-primary-600 dark:text-primary-400 active:ring-2 active:ring-primary-400 hover:bg-gray-50">
                    <span class="sr-only">{!editingComment ? 'Zeitspanne hinzufügen' : 'Kommentar speichern'}</span>
                    <svg class="h-7 w-full" stroke-width="2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d={!editingComment ? "M12 4.5v15m7.5-7.5h-15" : "M4.5 12.75l6 6 9-13.5"}/>
                    </svg>
                    <span class="tooltip absolute mt-24 -ml-2 z-10 py-2 px-3 flex text-sm font-medium text-black rounded-lg shadow bg-white dark:text-slate-200 dark:bg-slate-700">
                        {!editingComment ? 'Zeitspanne hinzufügen' : 'Kommentar speichern'}
                    </span>
                </button>
            </div>
            <div>
                <button on:click={onEditCommentButton} type="button" class="h-12 relative flex justify-center items-center align-middle has-tooltip p-2 aspect-[1] rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-black focus:dark:ring-white dark:bg-slate-900 dark:hover:bg-black text-primary-600 dark:text-primary-400 active:ring-2 active:ring-primary-400 {editingComment ? 'ring-2 ring-inset ring-primary-500' : ''} hover:bg-gray-50">
                    <span class="sr-only">Komentar bearbeiten</span>
                    <svg class="h-7 w-full" stroke-width="2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d={!editingComment || editedComment === oldComment ? "M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" : "M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"}/>
                    </svg>
                    <span class="tooltip absolute mt-28 -ml-2 z-10 py-2 px-3 flex text-sm font-medium text-black rounded-lg shadow bg-white dark:text-slate-200 dark:bg-slate-700">
                        {!editingComment ? 'Kommentar bearbeiten' : (editedComment === oldComment ? 'Zeitspannen bearbeiten' : 'Kommentar zurücksetzen')}
                    </span>
                    {#if oldComment && (!editingComment || editedComment !== oldComment)}<span class="absolute right-0 top-0 h-2 w-2 mr-1 mt-1 justify-center inline-flex rounded-full bg-primary-500 opacity-100"></span>{/if}
                </button>
            </div>
        </div>
    </div>
</div>

