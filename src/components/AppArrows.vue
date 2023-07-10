<template>
    <div class="arrows__wrapper">
        <svg
            id="area"
            ref="area"
            :class="arrowsList.arrowMode ? 'arrow__mode' : ''"
        ></svg>
    </div>
</template>

<script>
export default {
    name: "app-arrows",
};
</script>

<script setup>
import { onMounted, ref, defineProps } from "vue";

const props = defineProps({
    arrowsList: { type: Object, required: true },
});

const area = ref(null);

onMounted(() => {
    area.value.setAttribute("viewbox", `0 0 ${window.innerWidth} ${window.innerHeight}`);

    props.arrowsList.init(area.value.getAttribute("id"));
});
</script>

<style lang="scss" scoped>
#area {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    z-index: 0;

    g {
        cursor: pointer;
        fill: rgba(255, 255, 255, 0.7);
        transition: fill 0.12s ease-in;
        .line__main {
            stroke: rgba(255, 255, 255, 0.7);
            transition: fill 0.12s ease-in;
        }

        &.focused {
            fill: red;
            .line__main {
                stroke: red;
            }
        }
    }

    &.arrow__mode {
        z-index: 100;
        pointer-events: none;
    }
}
</style>
