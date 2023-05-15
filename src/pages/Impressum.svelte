<script>
    import Footer from "../lib/Essentials/Footer.svelte";
    import DarkModeGlow from "../lib/Misc/DarkModeGlow.svelte";
    import ContactFields from "../lib/Contact/ContactFields.svelte";

    const email = 'Praxis(at)Allgemeinmedizin-kiedrich(dot)de';
    const laekEmail = 'laek(dot)hessen(at)laekh(dot)de';
</script>

<Footer>
    <DarkModeGlow/>
    <section class="container w-full font-medium p-10">
        <h1 class="text-3xl font-bold"><strong>Impressum</strong></h1>
        <p>&nbsp;</p>
        <ContactFields/>
        <p>Herausgeber: Marie-Anne Rojzman</p>
        <p>&nbsp;</p>
        <p>Zuständige Aufsichtsbehörde: <a href="kvhessen.de" class="text-gray-800 dark:text-slate-200 hover:text-black dark:hover:text-slate-100 underline">Kassenärztliche Vereinigung Hessen</a></p>
        <p>Zuständige Kammer: <a href="https://www.laekh.de/" class="text-gray-800 dark:text-slate-200 hover:text-black dark:hover:text-slate-100 underline">Landesärztekammer Hessen</a></p>
        <p>&nbsp;</p>
        <p>Berufsbezeichnung: Arzt (verliehen in der Bundesrepublik Deutschland)</p>
        <p>Berufsrechtliche Regelungen: <a href="https://www.laekh.de/fileadmin/user_upload/Aerzte/Rund_ums_Recht/Rechtsquellen/Berufsordnung.pdf" class="text-gray-800 dark:text-slate-200 hover:text-black dark:hover:text-slate-100 underline">Berufsordnung der Landesärztekammer Hessen</a></p>
        <p>&nbsp;</p>
        <p>Haftungshinweis: Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich. Bitte beachten Sie zusätzlich unsere rechtlichen Hinweise im Disclaimer.</p>
        <p>&nbsp;</p>
        <p>Die Nutzung des Bildmaterials dieser Internetpräsenz, ist nur mit ausdrücklicher Genehmigung möglich. Dies gilt sowohl für Texte, Grafiken und Fotografien dieser Präsenz.</p>
    </section>
</Footer>

