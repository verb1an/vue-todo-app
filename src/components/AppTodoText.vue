<template>
    <div
        class="component text"
        v-bind="$attrs"
        :style="`height:${todoTextHeight}px;`"
    >
        <textarea
            type="text"
            class="text__item"
            :value="modelValue"
            :ttr="modelValue"
            :maxlength="maxLength"
            @input="returnValue"
            @change="returnValue"
            @blur="$emit('input:blur')"
            ref="item"
            :style="`overflow-y: ${
                todoTextHeight >= 200 ? 'scroll' : 'hidden'
            }`"
        ></textarea>
    </div>
</template>

<script>
export default {
    name: "app-todo-text",
};
</script>

<script setup>
import { defineEmits, defineProps, onMounted, ref, useAttrs } from "vue";

const props = defineProps({
    modelValue: { type: String, required: false, default: "" },
    placeholder: { type: String, required: false, default: "" },
    focus: { type: Boolean, required: false, default: false },
    maxLength: { type: Number, required: false, default: 512 },
});
const emit = defineEmits([
    "input",
    "update:modelValue",
    "input:addInput",
    "input:blur",
]);
const attrs = useAttrs();

const item = ref(null);
const todoTextHeight = ref(20);

function returnValue(event) {
    textAreaHeightResizeFunction(
        event.target.value.replaceAll("\n", "</br>"),
        event.target.getBoundingClientRect().width,
        getComputedStyle(event.target).fontSize
    );
    emit("update:modelValue", event.target.value);
}

function textAreaHeightResizeFunction(value, width, font) {
    const blockForInfo = document.createElement("div");

    blockForInfo.className = "textAreaHeightResize";
    document.querySelector("main").append(blockForInfo);

    blockForInfo.innerHTML = "";
    blockForInfo.innerHTML = value;

    blockForInfo.style = `width: ${width}px; word-wrap: break-word; font-size: ${font};`;

    let newHeight = blockForInfo.getBoundingClientRect().height + 5;
    if (attrs.class == "default") newHeight += 19; // <!-- ? Default text first line-break padding -->

    if (newHeight < 20) newHeight = 20;
    else if (newHeight > 200) newHeight = 200;

    todoTextHeight.value = newHeight;

    blockForInfo.remove();
}

onMounted(() => {
    textAreaHeightResizeFunction(
        props.modelValue.replaceAll("\n", "</br>"),
        item.value.getBoundingClientRect().width
    );
    if (props.focus == true) {
        item.value.focus();
    }
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/vars";
.component.text {
    textarea {
        background-color: transparent;
        border: none;
        outline: none;
        resize: none;

        font-size: 14px;
        font-weight: 400;
        color: vars.$color-g-white;
        transition: 1s;
        line-height: 18px;

        width: 100%;
        height: 100%;
    }

    &.default {
        textarea {
            &::placeholder {
                color: vars.$color-g-white;
            }
        }

        &[status="true"] {
            textarea {
                text-decoration: line-through;
            }
        }
    }
}
</style>
