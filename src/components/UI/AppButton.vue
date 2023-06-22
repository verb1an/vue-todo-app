<template>
   <button class="btn component" v-bind="$attrs">
        <slot></slot>
   </button>
</template>

<script>
export default {
    name: "app-button"
}
</script>

<script setup>

</script>

<style lang="scss" scoped>
button.btn {
    outline: none;
    cursor: pointer;
    border: 0;
    background-color: transparent;
    transition: all 0.12s ease-in;

    &:active {
        transform: scale(0.95);
    }
}
</style>