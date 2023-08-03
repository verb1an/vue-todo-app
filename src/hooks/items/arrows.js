import { reactive, ref } from "vue";
import { getItemInDocById } from "../getItem";

export function useArrows(areaID, arrows = []) {
    const list = reactive([]);
    const area = ref(areaID);
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

        // ? Stop if we find doubled
        if (stop) {
            init("area");
            return;
        }

        const newID = Math.random() * 1000;
        list.push({
            id: newID,
            firstItem: items.firstItem,
            secondItem: items.secondItem,
            points: [],
        });

        init("area");
    };

    const removeArrow = (id) => {
        console.log(id);
    };

    const setArrow = (firstItem) => {
        const firstItemOffset = getItemInDocById(firstItem);
        if (!firstItemOffset) return;
        document.addEventListener("mousedown", completeSetArrow(firstItemOffset), false);
        arrowMode.value = true;
        document.addEventListener("mousemove", mouseMovelisterenerSetArrow(firstItemOffset), false);

        mouseMovelisterenerSetArrow(firstItemOffset);
    };

    const pushArrow = (arrow) => {
        console.log(arrow);
        const firstItemOffset = getItemInDocById(arrow.firstItem).getBoundingClientRect();
        const secondItemOffset = getItemInDocById(arrow.secondItem).getBoundingClientRect();
        const offsets = getItemsOffset(firstItemOffset, secondItemOffset);

        drawArrow(
            arrow.id,
            firstItemOffset.left + offsets.firstXOffset,
            firstItemOffset.top + offsets.firstYOffset,
            secondItemOffset.left + offsets.secondXOffset,
            secondItemOffset.top + offsets.secondYOffset
        );
    };

    const getItemsOffset = (firstItemOffset, secondItemOffset) => {
        let firstXOffset = firstItemOffset.width / 2;
        let firstYOffset = firstItemOffset.height / 2;
        let secondXOffset = secondItemOffset.width / 2;
        let secondYOffset = secondItemOffset.height / 2;

        if (firstItemOffset.bottom < secondItemOffset.top) {
            // ? First item on top
            firstYOffset = firstItemOffset.height;
            secondYOffset = 0;
        } else if (firstItemOffset.top > secondItemOffset.bottom) {
            // ? Second item on top
            firstYOffset = 0;
            secondYOffset = secondItemOffset.height;
        } else {
            // ? Both items same horizontal position
            if (firstItemOffset.right < secondItemOffset.left) {
                firstXOffset = firstItemOffset.width;
                secondXOffset = 0;
            } else if (firstItemOffset.left > secondItemOffset.right) {
                firstXOffset = 0;
                secondXOffset = secondItemOffset.width;
            } else {
                firstYOffset = 0;
                secondYOffset = 0;
            }
        }

        return { firstXOffset, firstYOffset, secondXOffset, secondYOffset };
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
            <g arrow-id='${id}' class="arrow__line">
               <line class="line__main" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="3" marker-end="url(#arrowhead)" />
           </g>
        `;
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
            arrowMode.value = false;
            clearArea();

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
        };

        return handler;
    };

    const clearArea = () => {
        area.value.innerHTML = "";
    };

    const init = (areaID) => {
        area.value = document.getElementById(areaID);
        clearArea();

        list.forEach((el) => {
            pushArrow(el);
        });
    };

    return {
        list,
        arrowMode,

        addNewArrow,
        removeArrow,
        setArrow,
        pushArrow,

        init,
    };
}
