/**
 * Remove an item from an array.
 * @param arr The array to remove the item from
 * @param value The item to remove
 */
export function removeItem<T>(arr: Array<T>, value: T): Array<T> {
    const index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}