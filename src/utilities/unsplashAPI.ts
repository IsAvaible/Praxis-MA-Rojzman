import {createApi} from "unsplash-js";

export const unsplash = createApi({
    accessKey: import.meta.env.VITE_UNSPLASH_KEY.toString(),
    // `fetch` options to be sent with every request
    headers: { },
});

