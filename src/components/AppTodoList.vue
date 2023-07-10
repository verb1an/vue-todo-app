<template>
    <div class="todo__items_list">
        <div
            v-for="checkItem in content"
            :key="checkItem.id"
            :text-todo-id="checkItem.id"
            :data-status="checkItem.status"
            @keydown="setKeyListeneres"
            class="list__item"
        >
            <span
                class="i-check"
                @click="$emit('item:changeStatus', checkItem.id)"
            ></span>
            <app-todo-text
                v-model="checkItem.text"
                class="todo__input"
                :focus="checkItem.focus"
                :status="checkItem.status"
                style="cols: 18"
                @input:blur="$emit('input:blur')"
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

defineProps({
    content: { type: Array, required: true },
});

const emit = defineEmits([
    "item:changeStatus",
    "item:addCheckItem",
    "item:removeCheckItem",
    "input:blur",
]);

function setKeyListeneres(event) {
    switch (event.keyCode) {
        case 13:
            if (event.target.selectionStart < event.target.value.length) return;
            event.preventDefault();
            emit(
                "item:addCheckItem",
                event.target.closest(".list__item").getAttribute("text-todo-id")
            );
            break;
        case 8:
            if (!event.target.value == "") break;
            event.preventDefault();
            if (event.target.closest(".list__item").previousSibling.tagName)
                event.target
                    .closest(".list__item")
                    .previousSibling.querySelector("textarea")
                    .focus();
            emit(
                "item:removeCheckItem",
                event.target.closest(".list__item").getAttribute("text-todo-id")
            );
            break;
    }
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
