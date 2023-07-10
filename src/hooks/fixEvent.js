export function fixEvent(ev) {
    const e = ev || event || window.event;

    if (e.pageX == null && e.clientX != null) {
        let html = document.documentElement;
        let body = document.body;

        e.pageX =
            event.clientX +
            ((html && html.scrollLeft) || (body && body.scrollLeft) || 0) -
            (html.clientLeft || 0);
        e.pageY =
            event.clientY +
            ((html && html.scrollTop) || (body && body.scrollTop) || 0) -
            (html.clientTop || 0);
    }

    if (!e.which && e.button) {
        e.which = e.button & 1 ? 1 : e.button & 2 ? 3 : e.button & 4 ? 2 : 0;
    }

    return e;
}
