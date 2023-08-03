<template>
    <div class="arrows__wrapper">
        <svg>
            <defs>
                <marker
                    id="arrowhead"
                    markerWidth="5"
                    markerHeight="4"
                    refX="5"
                    refY="2"
                    orient="auto"
                    fill="#fff"
                >
                    <polygon points="0 0, 5 2, 0 4" />
                </marker>
            </defs>
        </svg>
        <svg
            id="area"
            ref="area"
            :class="arrowsList.arrowMode == true ? 'arrow__mode' : ''"
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

<style lang="scss">
#area {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    z-index: 0;

    g {
        fill: rgba(255, 255, 255, 0.7);
        transition: fill 0.12s ease-in;
        .line__main {
            stroke: rgba(255, 255, 255, 0.7);
            transition: fill 0.12s ease-in;
        }

        // &.focused {
        //     fill: red;
        //     .line__main {
        //         stroke: red;
        //     }
        // }

        &:hover {
            fill: red;
        }
    }

    &.arrow__mode {
        z-index: 100;
        pointer-events: none;
    }
}
</style>
