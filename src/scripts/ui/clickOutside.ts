/**
 * Dispatch event on click outside of node
 * Usage: <node use:clickOutside on:clickOutside={clickOutsideFunction}></node>
 * @param node The node to check for clicks outside of
 **/
export function clickOutside(node) {

    const dispatch = () => {
        node.dispatchEvent(
            new CustomEvent('clickOutside', node)
        )
    }

    const ckEditorVisible = () => {
        const dialog = [...document.querySelectorAll("dialog")].slice(-1)[0];  // Get the topmost dialog
        if (dialog) return dialog.querySelector('.ck-toolbar')
        else return document.querySelector('.ck-toolbar')
    }

    const handleClick = event => {
        if (node && !node.contains(event.target) && !event.defaultPrevented && !ckEditorVisible()) {
            dispatch()
        }
    }

    const handleKeyDown = event => {
        if (event.key == 'Escape') {
            handleEscape();
        }
    }

    const handleEscape = () => {
        // If the active element is not a textarea or input and there is no ck-editor in the dialog
        if (['textarea', 'input'].findIndex(e => e === document.activeElement.tagName.toLowerCase()) == -1 && !ckEditorVisible()) {
            dispatch()  // Dispatch the event
        }
    }

    document.addEventListener('mousedown', handleClick, true);
    document.addEventListener('keydown', handleKeyDown, true);

    return {
        destroy() {
            document.removeEventListener('mousedown', handleClick, true);
            document.removeEventListener('keydown', handleKeyDown, true);
        }
    }
}