import {getRealSessionUser, signOut} from "./database";
import {navigate} from "svelte-navigator";
import {delay} from "../misc/delay";
import {DEMO_USER, isDemoModeStore} from "../stores/demoModeStore";

/**
 * This function is used to validate the user's authentication.
 * It logs the user out if the last time they were authenticated was more than 3 hours ago.
 * If the user is not authenticated, they enter the public Portfolio Demo (Sandbox) mode.
 */
export const validateAuthentication = async () => {
    let user = await getRealSessionUser();
    // @ts-ignore
    if (user && Math.abs(Date.now() - new Date(user.last_sign_in_at)) / (1000 * 60 * 60) > 3) {
        try {
            await signOut();
        } catch (e) {
            console.error(e);
        }

        console.log('The user was automatically logged out because the last authentication was more than 3 hours ago.');
        user = null;
        delay(1).then(() => navigate('admin/login', { replace: true }));
        return null;
    } else if (!user) {
        isDemoModeStore.set(true);
        return DEMO_USER;
    } else {
        isDemoModeStore.set(false);
        return user;
    }
}
