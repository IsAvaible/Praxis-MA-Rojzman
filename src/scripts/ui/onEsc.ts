/**
 * Dispatch an event when the escape key is pressed anywhere in the document except in input and textarea fields
 * Usage: <node use:keyEsc on:keyEsc={escFunction}></node>
 * @param node The node to dispatch the event on
 * */
export function keyEsc(node) {

    const dispatch = () => {
        node.dispatchEvent(
            new CustomEvent('keyEsc', node)
        )
    }

    const handleEscape = () => {
        if (['textarea', 'input'].findIndex(e => e === document.activeElement.tagName.toLowerCase()) == -1) dispatch()
    }

    document.onkeyup = (e) => {
        if (e.key == 'Escape') handleEscape()
    }
}