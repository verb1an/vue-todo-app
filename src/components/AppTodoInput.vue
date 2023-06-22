<template>
    <div class="component input" v-bind="$attr">
        <input
            type="text"
            class="input__item"
            :value="modelValue"
            :placeholder="placeholder"
            @input="returnValue"
            @change="returnValue"
            @blur="removeFocusedClasses"
        />
    </div>
</template>

<script>
export default {
    name: "app-todo-input",
};
</script>

<script setup>
import { defineEmits, defineProps } from "vue";

defineProps({
    modelValue: { type: String, required: false, default: "" },
    placeholder: { type: String, required: false, default: "" },
});

const emit = defineEmits(["input", "update:modelValue"]);

function returnValue(event) {
    emit("update:modelValue", event.target.value);
}

function removeFocusedClasses(event) {
    event.target.classList.forEach((el, index) => {
        if(el.includes("focused")) {
            event.target.classList.remove(el)
        }
    });
}

</script>

<style lang="scss" scoped>
@use "@/assets/scss/vars";
.component.input {
    input {
        background-color: transparent;
        border: none;
        outline: none;
    }

    &.title {
        margin-bottom: 10px;

        input {
            font-size: 18px;
            font-weight: 600;
            color: vars.$color-g-white;
            letter-spacing: 1px;

            &::placeholder {
                color: vars.$color-g-white;
            }
        }
    }

    &.default {
        input {
            font-size: 14px;
            font-weight: 500;
            color: vars.$color-g-white;
        }
    }

    input.focused-bdline {
        border: 1px solid rgba(255, 255, 255, .4);
    }
}
</style>
