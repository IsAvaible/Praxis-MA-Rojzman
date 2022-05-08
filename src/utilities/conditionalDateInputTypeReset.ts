// Changes the type of the date input field back to 'text' (to show the placeholder), if no value was set.
export function conditionalDateInputTypeReset(event) {
    if (event.target.value == '') {
        event.target.type = 'text';
    }
}