<script lang="ts">
    export let id: string;
    export let title: string = 'Flüchtlingshilfe in Zeiten des Ukrainekriegs';
    export let content: string = '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto assumenda autem cumque dolores eos error, eum, id itaque iure maxime minima molestiae pariatur provident rerum saepe? Enim eum inventore laborum!</p>';
    export let createdAt: Date = new Date();
    export let readingTime: number;


</script>

<div>
    <p class="text-sm text-gray-500 dark:text-slate-300">
        <time datetime={createdAt.toISOString()}>{createdAt.toLocaleDateString()}</time>
    </p>
    <div class="mt-2 block">
        <p class="text-xl font-semibold text-gray-900 dark:text-slate-100">{title}</p>
        <p class="mt-3 text-base dark:text-slate-200">{@html content}</p>
    </div>
</div>

