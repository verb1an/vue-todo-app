import { ref } from "vue";
import { fixEvent } from "./fixEvent";

export function useDragObject() {
    const val = ref(null);
    let offsetItemX = ref(0);
    let offsetItemY = ref(0);

    const setDragObject = (event) => {
        event = fixEvent(event);

        if (event.which !== 1) return;
        val.value = event.target.closest(".todo__item");
        offsetItemX.value =
            event.pageX - val.value.getBoundingClientRect().left;
        offsetItemY.value = event.pageY - val.value.getBoundingClientRect().top;
        val.value.classList.add("drag");
        document.body.onselectstart = function () {
            return false;
        };
    };

    const removeDragObject = () => {
        if (val.value) {
            val.value.classList.remove("drag");
            val.value = null;
            document.body.onselectstart = function () {};

            offsetItemX.value = 0;
            offsetItemY.value = 0;
        }
    };

    return {
        val,
        setDragObject,
        removeDragObject,

        offsetItemX,
        offsetItemY,
    };
}
