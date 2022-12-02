<script>
    import {conditionalInputTypeReset} from "../../scripts/ui/conditionalInputTypeReset";
</script>

<div class="w-full lg:w-1/2 xl:w-5/12 px-4">
    <div class="contact-form bg-white dark:bg-slate-800 relative rounded-lg p-8 sm:p-12 shadow-lg">
        <form>
            <div class="mb-6">
                <input placeholder="Gewünschtes Datum und Uhrzeit (*)" type="text" id="datetime" min={new Date().toISOString().split('.')[0].slice(0,-3)} onfocus="(this.type='datetime-local')" on:blur={conditionalInputTypeReset} class="w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none focus:border-primary-500" />
            </div>
            <div class="mb-6">
                <input class="w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none focus:border-primary-500" placeholder="Ihr Name" type="text" id="name" />
            </div>
            <div class="mb-6">
                <input class="w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none focus:border-primary-500" placeholder="Ihre Email Adresse" type="email" />
            </div>
            <div class="mb-6">
                <input class="w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 outline-none focus-visible:shadow-none focus:border-primary-500" placeholder="Ihre Telefonnummer" type="text" />
            </div>
            <div class="mb-6">
                <textarea
                        class="w-full dark:bg-slate-900 rounded-md py-3 px-[14px] font-normal border border-[f0f0f0] dark:border-slate-900 resize-none outline-none focus-visible:shadow-none focus:border-primary-500"
                        placeholder="Ihre Nachricht"
                        rows="6"
                ></textarea>
            </div>
            <div>
                <button class="w-full font-medium text-white bg-primary-600 rounded-md border border-primary dark:border-none p-3 transition hover:bg-primary-700" type="submit">
                    Absenden
                </button>
            </div>
        </form>
        <div>
            <span class="absolute -top-10 -right-9 z-[-1]">
                <svg fill="none" height="100" viewBox="0 0 100 100" width="100" xmlns="http://www.w3.org/2000/svg">
                    <path clip-rule="evenodd" d="M0 100C0 44.7715 0 0 0 0C55.2285 0 100 44.7715 100 100C100 100 100 100 0 100Z" fill-rule="evenodd" />
                </svg>
            </span>
        </div>
    </div>
</div>

<style lang="scss">
  .contact-form {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
</style>