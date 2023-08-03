<template>
    <main
        class="main"
        @mousemove="mouseMove"
        @mouseup="dragObject.removeDragObject"
    >
        <div class="wrapper">
            <app-item
                v-for="todo in todoList.list"
                :key="todo.val.id"
                :todo="todo"
                @mouseup="todoList.setToTopItem"
                @item:setDragObject="
                    () => {
                        dragObject.setDragObject();
                        todo.val.menuToggle = false;
                    }
                "
                @modal:removeMessage="
                    (value) => {
                        successItem.modalShow(value);
                    }
                "
                @arrow:add="
                    () => {
                        arrows.setArrow(todo.val.id);
                        todo.val.menuToggle = false;
                    }
                "
            ></app-item>

            <app-arrows :arrowsList="arrows"></app-arrows>

            <div
                v-if="todoList.length < 1"
                class="items__none"
            >
                <h3>Привет)) Как у тебя дела?</h3>
                <app-button
                    type="button"
                    class="items__none_button"
                    @click="todoList.addNewItem"
                >
                    <span class="i-plus"></span>
                    <span>Нажми на меня</span>
                </app-button>
            </div>
        </div>

        <app-items-list
            v-if="todoList.list.length > 0"
            :items="todoList.list"
            @item:hover="hoverFocusedItem"
            @item:blur="blurFocusedItem"
            @item:add="todoList.addNewItem"
        />
        <app-modal-window-success
            :content="successItem"
            @modal:close="successItem.modalJustClose"
            @modal:success="modalAction"
        />

        <div class="textAreaHeightResize"></div>
    </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getItemInDocById } from "@/hooks/getItem";
import { fixEvent } from "./hooks/fixEvent";
import { useTodoItemList } from "./hooks/items/todoItemList";
import { useDragObject } from "./hooks/dragObject";
import { useModalSuccess } from "./hooks/modal/modalSuccess";
import { useArrows } from "./hooks/items/arrows";

const todoList = useTodoItemList([
    {
        id: Math.random() * 1000,
        title: "Title",
        text: [
            "Пустая строка",
            [
                {
                    id: Math.random() * 1000,
                    text: "asbsds",
                    status: false,
                },
            ],
        ],
        position: {
            x: window.innerWidth / 2 - 200,
            y: window.innerHeight / 2 - 200,
            z: 100,
        },
        menuToggle: false,
        lock: false,
        arrows: [],
    },
    {
        id: Math.random() * 1000,
        title: "Title",
        text: [
            "Пустая строка",
            [
                {
                    id: Math.random() * 1000,
                    text: "asbsds",
                    status: false,
                },
            ],
        ],
        position: {
            x: window.innerWidth / 2 - 200,
            y: window.innerHeight / 2 - 200,
            z: 100,
        },
        menuToggle: false,
        lock: false,
        arrows: [],
    },
]);
const arrows = useArrows([]);

const successItem = useModalSuccess({});

let dragObject = useDragObject(null);
// <!-- ? item movement -->

const mouseX = ref(0);
const mouseY = ref(0);

const offsetItemX = dragObject.offsetItemX;
const offsetItemY = dragObject.offsetItemY;

function mouseMove(event) {
    event = fixEvent(event);
    mouseX.value = event.pageX;
    mouseY.value = event.pageY;

    if (dragObject.val.value) {
        const item = todoList.list.find((el) => el.val.id == dragObject.val.value.getAttribute("todo-id"));
        if (item.val.lock) return;

        let xPos = mouseX.value - offsetItemX.value;
        let yPos = mouseY.value - offsetItemY.value;

        if (
            mouseY.value + dragObject.val.value.getBoundingClientRect().height / 3 < window.innerHeight &&
            mouseY.value > 20
        ) {
            item.setItemPos(xPos, yPos);
        } else {
            item.setItemPos(xPos, null);
        }

        if (arrows.list.length > 0) {
            arrows.list.forEach((el) => {
                if (item.val.id == el.firstItem || item.val.id == el.secondItem) {
                    arrows.pushArrow(el);
                }
            });
        }
    }
}

function modalAction(content) {
    if (content.func.type == "item:remove") {
        todoList.removeItem(content.func.action);
    }
    successItem.modalJustClose();
}

// <!-- ? Items list function -->

function hoverFocusedItem(id) {
    getItemInDocById(id).classList.add("hover");
}

function blurFocusedItem() {
    document.querySelectorAll(".todo__item").forEach((el) => el.classList.remove("hover"));
}
onMounted(() => {
    // window.oncontextmenu = function () {
    //     return false;
    // };
});
</script>

<style lang="scss">
@use "@/assets/scss/theme/theme_main";
</style>
