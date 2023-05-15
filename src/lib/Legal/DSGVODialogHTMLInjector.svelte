<script lang="ts">
    import InjectableHTMLTag from "../Misc/InjectableHTMLTag.svelte";
    import DSGVODialog from "./DSGVODialog.svelte";
    import {externalContentAllowedStore} from "../../scripts/stores/cookies/externalContentAllowedStore";
    import {urlRegex} from "../../scripts/misc/urlRegex";
    import {youtubeAllowedStore} from "../../scripts/stores/cookies/youtubeAllowedStore";


    /**
 * The HTML that should be wrapped.
 */
export let html: string;

const parseWrappedContent = (wrappedContent: string) => {
    const url = wrappedContent.match(urlRegex)[0];
    if (['youtu.be', 'youtube'].some(domain => url.match(domain))) {
        return {text: `Hier ist ein Youtube-Video eingebettet. Beim Laden des Videos könnten personenbezogene Daten an Google übertragen werden.`, link: 'https://policies.google.com/privacy', cookieStore: youtubeAllowedStore};
    }
    else{
        return {text: `Dieser Teil der Webseite bettet Inhalte von einer anderen Webseite (${url??'Unbekannt'}) ein. Beim Laden der Inhalte könnten personenbezogene Daten an den Anbieter der Inhalte übertragen werden.`, cookieStore: externalContentAllowedStore, };
    }

}
</script>

<!--
    @component
    A component that wraps content from other websites and displays a dialog that informs the user about the data transfer.
    Uses the InjectableHTMLTag component to inject a DSGVO dialog into the HTML.
-->

<InjectableHTMLTag html={html} rules={[
        {regex: RegExp('(<figure class=\"media".*?<\/figure>)', 'gi'), component: DSGVODialog,
        props: {backgroundStyle: 'bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg'},
        predicateProp: parseWrappedContent}
    ]}
/>