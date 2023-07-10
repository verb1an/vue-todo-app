<template>
    <Transition>
        <div v-if="content.item.show" class="component modal success">
            <div class="modal__header">
                <app-button-icon @click="$emit('modal:close')">
                    <span class="line"></span>
                    <span class="line"></span>
                </app-button-icon>
            </div>
            <div class="modal__body">
                <h3 class="message">
                    {{ content.item.message }}
                </h3>
                <div class="buttons">
                    <button
                        type="button"
                        data-type="yes"
                        @click="$emit('modal:success', content.item)"
                    >
                        <span class="i-trash-alt"></span>
                        <span>{{ content.item.btn.yes }}</span>
                    </button>
                    <button
                        type="button"
                        data-type="no"
                        @click="$emit('modal:close')"
                    >
                        <span>{{ content.item.btn.no }}</span>
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script>
export default {
    name: "app-modal-window-success",
};
</script>

<script setup>
import { defineProps } from "vue";
defineProps({
    content: { type: Object, required: false },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/vars";
.modal.success {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 400px;
    min-height: 150px;
    background: #1f2537;
    z-index: 500;
    border: vars.$color-g-white-004;
    color: vars.$color-g-white;
    padding: 20px;
    border-radius: 16px;
    border: 2px solid vars.$color-g-white-004;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
        rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    overflow: hidden;

    .modal__header {
        position: relative;
        height: 20px;
        button {
            position: absolute;
            width: 16px;
            height: 16px;
            top: 0;
            right: 0;

            span {
                display: block;
                width: 16px;
                height: 2px;
                background-color: vars.$color-g-white;
                position: absolute;
                top: 50%;
                left: 50%;

                &:first-child {
                    transform: translate(-50%, -50%) rotateZ(45deg);
                }
                &:last-child {
                    transform: translate(-50%, -50%) rotateZ(-45deg);
                }
            }
        }
    }

    .modal__body {
        .message {
            width: 100%;
        }
        .buttons {
            position: absolute;
            left: 0;
            bottom: 0;
            margin: 20px;
            display: flex;
            align-items: center;

            button {
                padding: 10px 20px;
                border-radius: 8px;
                color: vars.$color-g-white;
                text-transform: uppercase;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 1px;
                transition: all 0.05s ease-in-out;

                &:first-child {
                    background: linear-gradient(
                        135deg,
                        #fa4f58 0%,
                        #ff7f8c 100%
                    );
                    box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.08);
                    display: flex;
                    align-items: center;

                    span:first-child {
                        font-size: 18px;
                        margin-right: 2px;
                    }
                }

                &:active {
                    transform: scale(0.95);
                }
            }
        }
    }
}

.v-enter-active.modal.success,
.v-leave-active.modal.success {
    transition: all 0.2s ease-in-out;
    transition-delay: 0.1s;

    .modal__body {
        transition-delay: 0.2s;
    }
}

.v-enter-from.modal.success,
.v-leave-to.modal.success {
    width: 0;
    padding: 0;
    opacity: 0;

    .modal__body {
        opacity: 0;
    }
}
</style>
