<template>
    <div v-if="!item" class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0"
        aria-valuemax="100">
        <div class="progress-bar"></div>
    </div>
    <Post v-if="item" :obj="item" />
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { extractor } from "/extractors/cumhuriyet.js";
import Post from '/components/SinglePost.vue';

const router = useRouter();

const item = ref(null);
const ex = new extractor();

const id = router.currentRoute.value.params.id;

async function setup() {
    let response = await ex.get_post(id);
    if (!response) {
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