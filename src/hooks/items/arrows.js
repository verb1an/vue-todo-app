import { reactive, ref } from "vue";
import { getItemInDocById } from "../getItem";

export function useArrows(arrows = []) {
    const list = reactive([]);
    const area = ref(null);
    const arrowMode = ref(false);

    arrows.forEach((el) => {
        list.push(el);
    });

    const addNewArrow = (items) => {
        // ? Check array on doubled arrows
        const stop = list.find((el) => {
            if (el.firstItem == items.firstItem && el.secondItem == items.secondItem) {
                return "true";
            } else {
                return false;
            }
        });

        if (stop) return; // ? Stop if we find doubled

        list.push({
            id: Math.random() * 1000,
            firstItem: items.firstItem,
            secondItem: items.secondItem,
            points: [],
        });
    };

    const setArrow = (firstItem) => {
        const firstItemOffset = getItemInDocById(firstItem);
        if (!firstItemOffset) return;
        document.addEventListener("mousedown", completeSetArrow(firstItemOffset), false);
        arrowMode.value = true;
        document.addEventListener("mousemove", mouseMovelisterenerSetArrow(firstItemOffset), false);

        mouseMovelisterenerSetArrow(firstItemOffset);
    };

    const removeArrow = (id) => {
        console.log(id);
    };

    const clearArea = () => {
        area.value.innerHTML = "";
    };

    const drawArrow = (id, x1, y1, x2, y2) => {
        const arrowItem = area.value.querySelector(`g[arrow-id='${id}']`) ?? null;

        if (arrowItem) {
            arrowItem.querySelector(".line__main").setAttribute("x1", x1);
            arrowItem.querySelector(".line__main").setAttribute("y1", y1);
            arrowItem.querySelector(".line__main").setAttribute("x2", x2);
            arrowItem.querySelector(".line__main").setAttribute("y2", y2);

            return;
        }

        area.value.innerHTML += `
            <g arrow-id='0' class="arrow__line">
               <defs>
                   <marker id="arrowhead" markerWidth="5" markerHeight="4" refX="5" refY="2" orient="auto" fill="#fff">
                       <polygon points="0 0, 5 2, 0 4" />
                   </marker>
               </defs>
               <line class="line__main" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="3" stroke="#fff" marker-end="url(#arrowhead)" />
           </g>
        `;
    };

    const init = (areaID) => {
        area.value = document.getElementById(areaID);
        clearArea();
    };

    const mouseMovelisterenerSetArrow = (firstItemOffset) => {
        let handler = function (event) {
            if (arrowMode.value == false) {
                document.removeEventListener("mousemove", handler, false);
                return;
            }
            const itemOffset = firstItemOffset.getBoundingClientRect();
            let xPos = itemOffset.width / 2;
            let yPos = itemOffset.height / 2;
            let pageX = event.pageX;
            let pageY = event.pageY;

            if (itemOffset.top - pageY >= 100) {
                yPos = 0;
            } else if (pageY - itemOffset.bottom >= 100) {
                yPos = itemOffset.height;
            } else {
                if (pageX >= itemOffset.right) {
                    xPos = itemOffset.width;
                    yPos = itemOffset.height / 2;
                } else if (pageX <= itemOffset.left) {
                    xPos = 0;
                    yPos = itemOffset.height / 2;
                } else {
                    xPos = itemOffset.width / 2;
                    yPos = 0;
                }
            }

            drawArrow(0, itemOffset.left + xPos, itemOffset.top + yPos, pageX, pageY);
        };

        return handler;
    };

    const completeSetArrow = (firstItem) => {
        let handler = function (event) {
            if (
                (event.target.closest(".todo__item") &&
                    event.target.closest(".todo__item").getAttribute("todo-id") == firstItem.getAttribute("todo-id")) ||
                event.which == 2
            ) {
                return;
            }

            if (event.target.closest(".todo__item") !== null && event.which == 1) {
                addNewArrow({
                    firstItem: firstItem.getAttribute("todo-id"),
                    secondItem: event.target.closest(".todo__item").getAttribute("todo-id"),
                });
            }

            document.removeEventListener("mousedown", handler, false);
            removeSetterArrows();
        };

        return handler;
    };

    const removeSetterArrows = () => {
        arrowMode.value = false;
        clearArea();
    };

    return {
        list,
        arrowMode,

        addNewArrow,
        removeArrow,
        setArrow,
        removeSetterArrows,

        init,
    };
}
