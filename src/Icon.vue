<template>
    <img :src="requireImage(id)" @click="$emit('select', id)">
</template>

<script>
import images from "@/images";

export default {
    props: {
        id: {
            required: true
        }
    },
    methods: {
        requireImage(imageId) {
            return images[imageId];
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
