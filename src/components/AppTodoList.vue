<template>
    <div class="todo__items_list">
        <div
            v-for="todoItem in content"
            :key="todoItem.id"
            :text-todo-id="todoItem.id"
            :data-status="todoItem.status"
            @keydown="addNewItem"
            class="list__item"
        >
            <span class="i-check" @click="changeStatus"></span>
            <app-todo-text
                v-model="todoItem.text"
                class="todo__input"
                :focus="todoItem.focus"
                :status="todoItem.status"
                @input:blur="removeFocus"
                style="cols: 18"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: "app-todo-list",
};
</script>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
    content: { type: Array, required: true },
    itemId: { type: Number, required: true },
    listCount: { type: Number, required: true },
});

const emit = defineEmits(["todo:changeStatus", "todo:addItem", "todo:removeItem", "input:blur"]);

function changeStatus(event) {
    emit("todo:changeStatus", {
        itemId: props.itemId,
        listCount: props.listCount,
        todoId: Number(event.target.closest(".list__item").getAttribute("text-todo-id")),
    });
}

function addNewItem(event) {
    if (event.keyCode === 13) {
        if (event.target.selectionStart < event.target.value.length) return;

        event.preventDefault();
        emit("todo:addItem", {
            itemId: props.itemId,
            listCount: props.listCount,
            todoId: Number(event.target.closest(".list__item").getAttribute("text-todo-id")),
        });
    } else if (event.keyCode === 8 && event.target.value == "") {
        event.preventDefault();
        // <!-- ? Set focus on previous element -->
        const targetItem = event.target.closest(".list__item");

        if (targetItem.previousSibling.tagName) {
            event.preventDefault();
            targetItem.previousSibling.querySelector("textarea").focus();
        }

        emit("todo:removeItem", {
            itemId: props.itemId,
            listCount: props.listCount,
            todoId: Number(targetItem.getAttribute("text-todo-id")),
        });
    }
}

function removeFocus(target) {
    emit("input:blur", {
        itemId: props.itemId,
        listCount: props.listCount,
        todoId: Number(target.closest(".list__item").getAttribute("text-todo-id")),
    });
}
</script>

<style lang="scss" scoped>
@use "@/assets/scss/vars";
.todo__items_list {
    display: flex;
    flex-direction: column;
    .list__item {
        cursor: pointer;
        display: flex;
        align-items: flex-start;
        margin-bottom: 5px;

        .todo__input {
            position: relative;
            &::after {
                content: "";
                position: absolute;
                top: 50%;
                left: 0;
                transform: translate(0, -50%);

                width: 0;
                height: 1px;
                background-color: vars.$color-g-white;
                transition: width 0.12s ease-in-out;
            }
        }

        span {
            width: 20px;
            height: 20px;
            font-size: 18px;
            border: 1px solid vars.$color-g-white;
            color: transparent;
            border-radius: 50%;
            margin-right: 10px;

            display: flex;
            align-items: center;
            justify-content: center;
            padding-top: 2px;
            transition: background-color 0.12s ease-in-out;
        }
        &[data-status="true"] {
            span {
                color: vars.$color-g-dark;
                background-color: vars.$color-g-white;
            }
        }
    }
}
</style>
