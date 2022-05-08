<script lang="ts">
    export let officeHours: { weekday: number; timePeriods: { start: Date; end: Date }[] }[] = [
        {weekday: 0, timePeriods: [{start: new Date(), end: new Date()}, {start: new Date(), end: new Date()}]},
        {weekday: 1, timePeriods: [{start: new Date(), end: new Date()}]},
        {weekday: 2, timePeriods: [{start: new Date(), end: new Date()}]},
        {weekday: 3, timePeriods: [{start: new Date(), end: new Date()}, {start: new Date(), end: new Date()}]},
        {weekday: 4, timePeriods: [{start: new Date(), end: new Date()}]}
    ];
    let weekdays: string[] = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
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
                {#each officeHours as day}
                    <p class="font-medium text-md text-gray-500 dark:text-slate-200">{weekdays[day.weekday]}</p>
                    {#each day.timePeriods as period}
                        <p class="font-light text-md text-gray-500 dark:text-slate-200">{period.start.toLocaleTimeString('de-DE').substring(0, 5)} - {period.start.toLocaleTimeString('de-DE').substring(0, 5)}</p>
                    {/each}
                {/each}
            </div>
        </div>
    </div>
</div>