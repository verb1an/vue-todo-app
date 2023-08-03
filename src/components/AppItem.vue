<template>
    <div
        :todo-id="todo.val.id"
        :style="`top: ${todo.val.position.y}px; left: ${todo.val.position.x}px; z-index: ${todo.val.position.z};`"
        class="todo__item component"
        :class="todo.val.lock ? 'lock' : ''"
        :menu-toggle="todo.val.menuToggle ? 'open' : 'hide'"
    >
        <div class="todo__item_wrapper">
            <div class="todo__item_head">
                <span
                    class="draggble"
                    @mousedown="$emit('item:setDragObject')"
                ></span>

                <app-button
                    type="button"
                    class="menu__toggle"
                    @click="todo.setItemMenuPos"
                >
                    <span class="line"></span>
                    <span class="line"></span>
                    <span class="line"></span>
                </app-button>

                <div
                    class="todo__item_menu"
                    :menu-toggle="todo.val.menuToggle ? 'open' : 'hide'"
                >
                    <ul class="list">
                        <li class="list__item">
                            <app-button
                                type="button"
                                @click="$emit('arrow:add')"
                            >
                                <!-- @click="arrowModeSetter" -->
                                <span
                                    class="i-expand-from-corner"
                                    style="transform: translateY(-2px)"
                                ></span>
                            </app-button>
                        </li>
                        <li class="list__item">
                            <app-button type="button">
                                <span class="i-file"></span>
                            </app-button>
                        </li>
                        <li class="list__item">
                            <app-button
                                type="button"
                                @click="todo.setLockItem"
                            >
                                <span class="i-lock"></span>
                            </app-button>
                        </li>
                        <li class="list__item">
                            <app-button
                                type="button"
                                @click="todo.val.text.addNewCheckList"
                            >
                                <span class="i-list-ul"></span>
                            </app-button>
                        </li>
                        <li class="list__item">
                            <app-button
                                type="button"
                                @click="$emit('modal:removeMessage', removeItemMessage)"
                            >
                                <span class="i-trash-alt"></span>
                            </app-button>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="todo__item_body">
                <div class="title">
                    <app-todo-input
                        :modelValue="todo.val.title"
                        :placeholder="'Title'"
                        class="title"
                    />
                </div>

                <div class="text">
                    <div
                        v-for="n in todo.val.text.list.length"
                        :key="n"
                        class="text__item"
                    >
                        <app-todo-text
                            v-if="typeof todo.val.text.list[n - 1] == 'string'"
                            :modelValue="todo.val.text.list[n - 1]"
                            :placeholder="'Напишите что-нибудь...'"
                            class="default"
                        />
                        <app-todo-list
                            v-else
                            :content="todo.val.text.list[n - 1]"
                            @item:changeStatus="(value) => todo.val.text.changeCheckItemStatus(value, n - 1)"
                            @item:addCheckItem="(value) => todo.val.text.addNewCheckItem(value, n - 1)"
                            @item:removeCheckItem="(value) => todo.val.text.removeCheckItem(value, n - 1)"
                            @input:blur="() => todo.val.text.removeFocus(n - 1)"
                        />
                        <!-- @todo:changeStatus="changeStatusTodoItem"
                            @todo:addItem="addNewTodoItem"
                            @todo:removeItem="removeTodoItem"
                            @input:blur="removeFocusTodoItemInput" -->
                    </div>
                </div>
            </div>
        </div>

        <span
            v-if="todo.val.lock"
            class="locked__status i-lock"
        ></span>
    </div>
</template>

<script>
export default {
    name: "app-item",
};
</script>

<script setup>
import { defineProps, ref } from "vue";
const props = defineProps({
    todo: {
        type: Object,
        required: true,
    },
});

const removeItemMessage = ref({
    show: true,
    message: "Удалить этот пин?",
    func: {
        type: "item:remove",
        action: props.todo.val.id,
    },
    btn: {
        yes: "Удалить",
        no: "Отмена",
    },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/theme/_theme_item.scss";
</style>
