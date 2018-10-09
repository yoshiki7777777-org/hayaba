<template>
     <img :src="requireImage(id)" @click="$emit('select', id)">
</template>

<script>

import {padStart} from "lodash"
import images from "@/images";

export default {
    props: {
        id:{
            required:true,
        }
    },
    methods:{
        padLeft(str){
            return padStart(str, 2, '0');
        },
        requireImage(imageId){
            return images[imageId];
        },
    }
}
</script>

<style lang="scss" scoped>
    img {
        width:10vw;
        margin-left:3vw;
    }
</style>
