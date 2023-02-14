import {getUser, signOut} from "./database";
import {navigate} from "svelte-navigator";
import {delay} from "../misc/delay";

/**
 * This function is used to validate the user's authentication.
 * It logs the user out if the last time they were authenticated was more than 3 hours ago.
 * If the user is not authenticated, they are redirected to the login page.
 */
export const validateAuthentication = async () => {
    let user = await getUser();
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

    } else if (!user) {
        navigate('admin/login', { replace: true });
    } else {
        return user;
    }
}