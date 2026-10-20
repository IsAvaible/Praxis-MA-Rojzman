import {writable} from "svelte/store";
import type {User} from "@supabase/gotrue-js";

// Tracks whether the admin section is currently being viewed in public Portfolio Demo (Sandbox) mode.
export const isDemoModeStore = writable<boolean>(false);

export const DEMO_USER = {
    id: 'demo-guest',
    app_metadata: {},
    user_metadata: { name: 'Portfolio Gast' },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    email: 'gast@portfolio-demo.de',
    name: 'Portfolio Gast (Demo)'
} as unknown as User & { name: string };
