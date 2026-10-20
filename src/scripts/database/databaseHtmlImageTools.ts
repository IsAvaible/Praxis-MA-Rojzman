import {deleteFiles} from "./database";
import {escapeString} from "../misc/escapeString";
import groupBy from 'just-group-by';

/**
 * Finds all image tags sources that use images stored in the database.
 *
 * @param html The HTML string to parse.
 * @returns An array of keys of the images used in the HTML string.
 */
export const findImagesInHtml = (html: string): string[] => {
    if (html === null || html === undefined) {
        return [];
    }
    return Array.from(
        html.matchAll(
            new RegExp(escapeString(`src="${(import.meta.env.VITE_SUPABASE_URL || '').toString()}/storage/`) + '.+?\/public\/(.+?)\/(.+)"', 'g')
        ), m=>m[1] + "/" + m[2]
    )
}


/**
 * Deletes all uploaded images from a HTML string produced by the editor.
 *
 * @param html The HTML string to delete images from.
 */
export const deleteImagesFromHTML = async (html: string) => {
    if (html === null || html === undefined) return; // If the HTML string is null or undefined, do nothing
    let imageKeys = findImagesInHtml(html); // Find all images in the HTML string
    if (imageKeys.length == 0) return; // No images to delete
    let imageKeyGroups = groupBy(
        imageKeys.map(key => { // Split each key into an object with the bucket and the path
        let match = key.match(/(^.*?)\/(.*)/); // Using regex capture groups to split the key
        return {bucket: match[1], path: match[2]}}),
        key => key.bucket  // Group the image keys by bucket
    );
    for (let bucket in imageKeyGroups) { // Delete all images in each bucket
        await deleteFiles(bucket, imageKeyGroups[bucket].map(key => key.path));
    }
}


export const publicUrlToKey = (url: string): {bucket: string, path: string} => {
    let match = url.match(RegExp(escapeString((import.meta.env.VITE_SUPABASE_URL || '').toString() + '/storage/') + '.+?\/public\/(.+?)\/(.+)'));
    return {bucket: match[1], path: match[2]};
}