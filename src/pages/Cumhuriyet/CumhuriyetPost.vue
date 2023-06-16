<template>
    <Placeholder v-if="!item" />
    <Post v-if="item" :obj="item" />
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { extractor } from "/extractors/cumhuriyet.js";
import Post from '/components/SinglePost.vue';
import Placeholder from '/components/Placeholder.vue';

const router = useRouter();

const item = ref(null);
const ex = new extractor();

const id = router.currentRoute.value.params.id;

async function setup() {
    let response = await ex.get_post(id);
    console.log("Response:", response);
    if (!response) {
        console.log("Error", response);
        return;
    }

    item.value = response;
}

onBeforeMount(() => {
    if (!id) {
        router.push("/discover/cumhuriyet");
        return
    }
    setup();
})
</script>