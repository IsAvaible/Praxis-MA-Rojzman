/**
 * When the user clicks and holds on an element until the specified threshold is exceeded, this function will be called.
 * Usage: <node use:longpress on:longpress={longpressFunction}></node>
 * @param node The node to listen for long presses on
 * @param threshold The threshold in milliseconds to wait before calling the function
 */
export function longpress(node: HTMLElement, threshold: number = 500) {
    const handle_mousedown = () => {
        const timeout = setTimeout(() => {
            node.dispatchEvent(new CustomEvent('longpress'));
        }, threshold);

        const cancel = () => {
            clearTimeout(timeout);
            node.removeEventListener('mousemove', cancel);
            node.removeEventListener('mouseup', cancel);
        };

        node.addEventListener('mouseleave', cancel);
        node.addEventListener('mouseup', cancel);
    }

    node.addEventListener('mousedown', handle_mousedown);

    // Adds support for touch devices
    const handle_touchstart = () => {
        const timeout = setTimeout(() => {
            node.dispatchEvent(new CustomEvent('longpress'));
        }, threshold);

        const cancel = () => {
            clearTimeout(timeout);
            node.removeEventListener('touchmove', cancel);
            node.removeEventListener('touchend', cancel);
        };

        node.addEventListener('touchend', cancel);
        node.addEventListener('touchmove', cancel);
    }

    node.addEventListener('touchstart', handle_touchstart);

    return {
        destroy() {
            node.removeEventListener('mousedown', handle_mousedown);
        }
    };
}