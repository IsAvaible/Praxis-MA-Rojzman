/**
 * Dispatch event on click outside of node
 * @param node The node to check for clicks outside of
 **/
export function clickOutside(node) {

    const dispatch = () => {
        node.dispatchEvent(
            new CustomEvent('clickOutside', node)
        )
    }

    const handleClick = event => {
        if (node && !node.contains(event.target) && !event.defaultPrevented && !document.querySelector('.ck-toolbar')) {
            dispatch()
        }
    }

    const handleEscape = () => {
        if (['textarea', 'input'].findIndex(e => e === document.activeElement.tagName.toLowerCase()) == -1 && !document.querySelector('.ck-toolbar')) dispatch()
    }

    document.addEventListener('mousedown', handleClick, true);
    document.onkeyup = (e) => {if (e.key == 'Escape') handleEscape()}

    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    }
}