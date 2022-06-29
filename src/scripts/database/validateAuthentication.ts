import {getUser, signOut} from "./database";
import {navigate} from "svelte-navigator";

export const validateAuthentication = () => {
    let user = getUser();
    // @ts-ignore
    if (user && Math.abs(Date.now() - new Date(user.last_sign_in_at)) / (1000 * 60 * 60) > 3) {
        signOut().then(() => {
            console.log('The user was automatically logged out because the last login was more than 3 hours ago.');
            navigate('admin/login', { replace: true })
        }).catch(console.error);
    } else if (!user) {
        navigate('admin/login', { replace: true });
    } else {
        return user
    }
}