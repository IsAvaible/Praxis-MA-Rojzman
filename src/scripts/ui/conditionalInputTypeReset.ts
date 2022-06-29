// Changes the type of the input field back to 'text' to show the placeholder, if no value was set.
export function conditionalInputTypeReset(event) {
    if (event.target.value == '') {
        event.target.type = 'text';
    }
}