/**
 * Changes the type of the input field back to 'text' to show the placeholder, if no value was set.
 * This used for input fields that do not support the placeholder attribute but may benefit from it.
 * @param event The event that triggered the function
 */
export function conditionalInputTypeReset(event) {
    if (event.target.value == '') {
        event.target.type = 'text';
    }
}