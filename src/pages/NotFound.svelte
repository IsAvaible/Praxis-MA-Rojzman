<script lang="ts">
    import {Link} from "svelte-navigator";
    import Footer from "../lib/Essentials/Footer.svelte";
    import ConditionalWrapper from "../lib/Misc/ConditionalWrapper.svelte";

    export let redirectTo: string = '/';
export let withFooter: boolean = true;
</script>

<!-- ====== Error 404 Section Start -->
<ConditionalWrapper condition={withFooter} component={Footer}>
    <ConditionalWrapper condition={!withFooter} class={"flex flex-col min-w-full justify-between overflow-x-clip rounded-[inherit]"}>
        <section class="h-full bg-primary-500 items-center flex relative z-10">
            <div class="w-full mx-1">
                <div class="flex -mx-4">
                    <div class="w-full px-4">
                        <div class="mx-auto max-w-[400px] text-center">
                            <h2
                                    class="
                          font-bold
                          text-white
                          mb-2
                          text-[50px]
                          sm:text-[80px]
                          md:text-[100px]
                          leading-none
                          focus:outline-none
                          "
                            >
                                404
                            </h2>
                            <h3
                                    class="text-white font-semibold text-[22px] leading-tight mb-3"
                            >
                                Diese Seite kann nicht gefunden werden
                            </h3>
                            <p class="text-lg text-white mb-8">
                                Bitte überprüfen Sie die URL in der Adressleiste und versuchen Sie es erneut
                            </p>
                            <Link to={redirectTo}
                                    class="cursor-pointer
                          text-base
                          font-semibold
                          text-white
                          inline-block
                          text-center
                          border border-white
                          rounded-lg
                          px-8
                          py-3
                          hover:bg-white hover:text-primary-600
                          transition
                          "
                            >
                                Zurück zur Startseite
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div
                    class="
              absolute
              -z-10
              w-full
              h-full
              top-0
              left-0
              flex
              justify-between
              items-center
              space-x-5
              md:space-x-8
              lg:space-x-14
              "
            >
                <div
                        class="w-1/3 h-full bg-gradient-to-t from-[#FFFFFF14] to-[#C4C4C400]"
                ></div>
                <div class="w-1/3 h-full flex">
                    <div
                            class="
                    w-1/2
                    h-full
                    bg-gradient-to-b
                    from-[#FFFFFF14]
                    to-[#C4C4C400]
                    "
                    ></div>
                    <div
                            class="
                    w-1/2
                    h-full
                    bg-gradient-to-t
                    from-[#FFFFFF14]
                    to-[#C4C4C400]
                    "
                    ></div>
                </div>
                <div
                        class="w-1/3 h-full bg-gradient-to-b from-[#FFFFFF14] to-[#C4C4C400]"
                ></div>
            </div>
        </section>
    </ConditionalWrapper>
</ConditionalWrapper>
<!-- ====== Error 404 Section End -->