import { reactive } from "vue";

export function useCheckList(checkList = {}) {
    const list = reactive([]);

    checkList.forEach((el) => {
        list.push(el);
    });

    const addNewCheckList = () => {
        list.push([
            {
                id: Math.random() * 1000,
                text: "",
                status: false,
            },
        ]);
        list.push("");
    };

    const removeCheckList = (listCount) => {
        if (typeof list[listCount - 1] == "string") {
            if (typeof list[listCount + 1] == "string") {
                list[listCount - 1] += list[listCount + 1];
                list.splice(listCount + 1, 1);
            }
        } else {
            if (typeof list[listCount + 1] !== "string") {
                list.splice(listCount - 1, 0, "");
            }
        }

        list.splice(listCount, 1);
    };

    const addNewCheckItem = (target, listCount) => {
        const newId = Math.random() * 1000;
        list[listCount].forEach((el, index) => {
            if (el.id == target) {
                list[listCount].splice(index + 1, 0, {
                    id: newId,
                    text: "",
                    status: false,
                    focus: true,
                });
            }
        });
    };

    const removeCheckItem = (target, listCount) => {
        list[listCount].splice(
            list[listCount].findIndex((el) => el.id == target),
            1
        );

        if (!list[listCount].length) {
            removeCheckList(listCount);
        }
    };

    const changeCheckItemStatus = (target, listCount) => {
        list[listCount].forEach((el) => {
            if (el.id == target) el.status = !el.status;
        });
    };

    const removeFocus = (listCount) => {
        if (!list[listCount]) return;
        list[listCount].forEach((el) => (el.focus = false));
    };

    return {
        list,

        addNewCheckList,

        addNewCheckItem,
        removeCheckItem,
        changeCheckItemStatus,
        removeFocus,
    };
}
