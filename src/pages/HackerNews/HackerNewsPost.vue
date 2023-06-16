<template>
    <Placeholder v-if="!item" />
    <Post v-if="item" :obj="item" />
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { extractor } from "/extractors/hacker-news.js";
import Post from '/components/SinglePost.vue';
import Placeholder from '/components/Placeholder.vue';

const router = useRouter();

const item = ref(null);
const ex = new extractor();

const id = router.currentRoute.value.params.id;

async function setup() {
    let response = await ex.get_post(id);
    if (!response) {
        console.log("Error", response);
        return;
    }

    item.value = {
        author: response.author,
        title: response.title,
        url: response.url,
        id: response.objectID,
        dt: response.created_at,
        points: response.points,
        comments: response.children,
    }
}

onBeforeMount(() => {
    if (!id) {
        router.push("/discover/hacker-news");
        return
    }
    setup();
})
</script>