import { reactive } from "vue";
import { useTodoItem } from "./todoItem";

export function useTodoItemList(todoList) {
    const list = reactive([]);

    todoList.forEach((el) => {
        list.push(useTodoItem(el));
    });

    const setToTopItem = (event) => {
        const item = list.find(
            (el) =>
                el.val.id ==
                event.target.closest(".todo__item").getAttribute("todo-id")
        );
        item.val.position.z = 100;

        let missArr = [];
        list.forEach((el, i) => {
            missArr.push({
                index: i,
                z: el.val.position.z,
            });
        });
        missArr = missArr.sort((prev, next) => prev.z - next.z);
        missArr.forEach((el, i) => {
            el.z = i + 10;
            list[el.index].val.position.z = el.z;
        });
    };

    const addNewItem = () => {
        list.push(
            useTodoItem({
                id: Math.random() * 1000,
                title: "Title",
                text: ["Пустая строка"],
                position: {
                    x: window.innerWidth / 2 - 200,
                    y: window.innerHeight / 2 - 200,
                    z: 100,
                },
                menuToggle: false,
                lock: false,
            })
        );
    };

    const removeItem = (id) => {
        list.forEach((el, index) => {
            if (el.val.id == id) {
                list.splice(index, 1);
                return;
            }
        });
    };

    return {
        list,

        setToTopItem,

        addNewItem,
        removeItem,
    };
}
