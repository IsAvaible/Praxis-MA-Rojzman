import {defineConfig, loadEnv} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import legacy from '@vitejs/plugin-legacy'
// import { compression } from 'vite-plugin-compression2'

// https://vitejs.dev/config/
export default ({mode}) => {
    // Load environment variables from .env file
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};
    return defineConfig({
        plugins: [
            svelte(),
            legacy({
                targets: ['> 0.1%', 'not IE <= 11', 'not dead'],
            }),
        ],
    });
}
