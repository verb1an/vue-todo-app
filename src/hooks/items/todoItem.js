import { reactive } from "vue";
import { useCheckList } from "./checkList";

export function useTodoItem(todoItem = {}) {
    const val = reactive({});

    for (const [key, value] of Object.entries(todoItem)) {
        if (key == "text") {
            val[key] = useCheckList(value);
            continue;
        }
        val[key] = value;
    }

    const setItemPos = (xPos, yPos) => {
        if (xPos) val.position.x = xPos;
        if (yPos) val.position.y = yPos;
    };

    const setItemMenuPos = (event) => {
        let menuType = "menu";
        const item = event.target.closest(".todo__item");
        val.menuToggle = !val.menuToggle;

        if (window.innerWidth - item.getBoundingClientRect().right < 180) {
            menuType += "-left";
        } else {
            menuType += "-right";
        }
        if (item.getBoundingClientRect().top < 120) {
            menuType += "-bottom";
        } else {
            menuType += "-top";
        }

        item.setAttribute("menu-type", menuType);

        const listener = (event) => {
            if (!event.target.closest(".todo__item")) {
                if (event.target.closest(".component")) {
                    val.menuToggle = false;
                    document.removeEventListener("click", listener, false);
                }
            } else {
                if (
                    event.target
                        .closest(".todo__item")
                        .getAttribute("todo-id") !==
                    item.getAttribute("todo-id")
                ) {
                    val.menuToggle = false;
                    document.removeEventListener("click", listener, false);
                }
            }
        };

        document.addEventListener("click", listener, false);
    };

    const setLockItem = () => {
        val.lock = !val.lock;
        val.menuToggle = false;
    };

    const showDeleteDiolog = () => {
        return {
            show: true,
            message: "Удалить этот пин?",
            func: {
                type: "item:delete",
                id: val.id,
            },
            btn: {
                yes: "Удалить",
                no: "Отмена",
            },
        };
    };

    return {
        val,

        setItemPos,
        setItemMenuPos,
        setLockItem,
        showDeleteDiolog,
    };
}
