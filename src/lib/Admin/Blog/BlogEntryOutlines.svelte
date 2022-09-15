<script>
    import {randInt} from "three/src/math/MathUtils.js";
</script>

<div class="w-full">
    <div class="h-3 bg-slate-200 rounded col-span-2 w-[80px]"></div>
    <div class="mt-3 block">
        <div class="h-4 bg-slate-400 rounded col-span-2" style="width: {randInt(25, 35)}rem"></div>
        {#each Array(3) as _}
            <div class="mt-2 h-2 bg-slate-200 rounded col-span-1" style="width: {randInt(40, 80)}rem"></div>
        {/each}
    </div>
</div>