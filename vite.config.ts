import {defineConfig, loadEnv} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import legacy from '@vitejs/plugin-legacy'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';

// https://vitejs.dev/config/
export default ({mode}) => {
    // Load environment variables from .env file
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};
    return defineConfig({
        plugins: [
            legacy({
                targets: ['> 0.1%', 'not IE <= 11'],
                ignoreBrowserslistConfig: true,
            }),
            svelte(),
            chunkSplitPlugin({customSplitting: {
                'admin': [/src\/pages\/Admin/, /src\/lib\/Admin/],
                'db': [/src\/scripts\/database/],
            }}),
        ],
    });
}
