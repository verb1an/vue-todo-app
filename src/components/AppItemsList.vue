<template>
    <div class="items__list component">
        <div class="list all">
            <h3 class="title">
                <span>All</span>
                <app-button-icon
                    class="button__add_item"
                    @click="$emit('item:add')"
                >
                    <span class="i-plus"></span>
                </app-button-icon>
            </h3>
            <ul>
                <li
                    v-for="item in items"
                    :key="item.val.id"
                    :item-id="item.val.id"
                >
                    <span class="i-square-shape"></span>
                    <span>
                        <app-todo-input
                            v-model="item.val.title"
                            class="default"
                        />
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "app-items-list",
};
</script>

<script setup>
import { defineProps, defineEmits } from "vue";
defineProps({
    items: { type: Array, required: true },
});
defineEmits(["item:add", "item:blur"]);
</script>

<style lang="scss" scoped>
@use "@/assets/scss/vars";
.items__list {
    position: fixed;
    top: 0;
    right: 0;
    margin: 15px 25px;
    border-radius: 16px;
    width: 300px;
    min-height: 100px;
    background-color: vars.$color-g-dark-05;
    z-index: 200;
    border: 1px solid vars.$color-g-white-004;
    .list {
        .title {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: vars.$color-g-white;
            font-size: 16px;
            padding: 20px;
            padding-bottom: 0;

            span {
                margin-right: 5px;
            }

            .button__add_item {
                color: vars.$color-g-white;
                font-size: 16px;
            }
        }

        ul {
            list-style: none;
            padding: 0;

            li {
                font-size: 14px;
                color: vars.$color-g-white;
                padding: 4px;
                width: 100%;
                cursor: pointer;
                transition: all 0.5s ease-in-out;
                padding: 10px 20px;
                display: flex;
                align-items: center;

                span:first-child {
                    margin-right: 5px;
                }

                span:last-child {
                    pointer-events: none;
                }

                &:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                }

                &.active {
                    background-color: rgba(255, 255, 255, 0.2);
                }
            }
        }
    }
}
</style>
