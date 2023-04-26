<script lang="ts">
    export let showIcons: boolean = true;

    // TODO: These numbers should be queried from the database. For now, we just hardcode the feature.
    let phoneNumberShort = "06123 / 9997088";
    let phoneNumberFull = "+4961239997085";
    let faxNumberShort = "06123 / 9997085";
    let faxNumberFull = "+4961239997085";
</script>


{#each [
    {title: 'Unsere Adresse', linkText: 'Kammstr. 2, 65399 Kiedrich, Hessen DE', href: 'https://goo.gl/maps/sk8AD42LZAhWAvYD7', svgPaths: ['M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z'], viewBox: '20', target: '_blank'},
    {title: 'Telefonnummer', linkText: phoneNumberShort, href: `tel:${phoneNumberFull}`, svgPaths: ['M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'], viewBox: '24', target: ''},
    {title: 'Fax', linkText: faxNumberShort, href: `tel:${faxNumberFull}`, svgPaths: ['M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z'], viewBox: '20', target: ''}]
        as {title, linkText, href, svgPaths, viewBox, target}}

    <div class="flex mb-8 w-full">
        {#if showIcons}
            <a href={href} target={target} class="max-w-[60px] sm:max-w-[70px] w-full h-[60px] sm:h-[70px] flex items-center justify-center mr-6 overflow-hidden bg-primary-300 hover:bg-opacity-10 dark:hover:bg-opacity-20 bg-opacity-5 text-primary-500 text-primary-400 rounded">
                <svg class="fill-current overflow-visible" height="24" width="24" viewBox="0 0 {viewBox} {viewBox}" >
                    {#each svgPaths as path}
                        <path fill-rule="evenodd" d={path}/>
                    {/each}
                </svg>
                <span class="sr-only">{title}</span>
            </a>
        {/if}
        <div class="w-full">
            <h3 class="font-bold dark:text-slate-100 text-xl mb-1">{title}</h3>
            <a href={href} target="_blank" rel="noreferrer" class="font-medium text-gray-600 hover:text-black dark:text-slate-300 dark:hover:text-slate-100">
                {linkText}
            </a>
        </div>
    </div>
{/each}