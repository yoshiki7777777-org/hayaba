<template>
    <button role="button" :aria-label="icon" @click="$emit('click')">
        <font-awesome-icon :icon="icon" />
    </button>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlayCircle, faRedo, faBackspace } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faPlayCircle, faRedo, faBackspace);
const registeredIcons = Object.keys(library.definitions.fas);

export default {
    components: {
        FontAwesomeIcon
    },
    props: {
        icon: {
            type: String,
            required: true,
            validator(value) {
                return -1 < registeredIcons.indexOf(value);
            }
        }
    }
};
</script>

<style>
</style>
