export default function fadeScale(
    node, { delay = 0, duration = 200, easing = x => x, from = 0, to = 1 }
) {
    const o = +getComputedStyle(node).opacity;
    const transform = JSON.parse(getComputedStyle(node).transform.substring(6).replace('(', '[').replace(')', ']'));

    const s = transform[0];
    const translate = [transform[4], transform[5]];
    const is = to >= from ? to - from : from - to;

    return {
        delay,
        duration,
        css: t => {
            const eased = easing(t);
            const scaleValue = to >= from ? (eased * s * is) + from : (eased * s * is) + to;
            return `opacity: ${eased * o}; transform: translate(${translate[0]}px, ${translate[1]}px) scale(${scaleValue})`;
        }
    };
}
