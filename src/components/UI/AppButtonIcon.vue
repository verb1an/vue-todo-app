<template>
    <button type="button" class="button__icon">
        <slot v-bind="$attrs"></slot>
    </button>
</template>

<script>
export default {
    name: "app-button-icon"
}
</script>

<script setup>

</script>

<style lang="scss" scoped>
button {
    outline: none;
    background-color: transparent;
    border: 0;
    cursor: pointer;
}

.button__icon {
    width: 24px;
    height: 24px;

    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.5s ease-in;

    &:active {
        opacity: 0.5;
    }
}
</style>