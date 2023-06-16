<template>
    <Placeholder v-if="!loaded" />
    <div class="row row-cols-1 g-0 m-3 mb-0">
        <div v-for="item in posts" class="col-12 mb-3">
            <Post :obj="item" />
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { extractor } from "/extractors/cumhuriyet.js";
import Placeholder from '/components/Placeholder.vue';
import Post from '/components/ListPost.vue';

const posts = ref([]);
const ex = new extractor();
const loaded = ref(false);

async function setup() {
    let response = await ex.get_posts();
    if (!response.length) {
        return
    }

    response.map(item => posts.value.push({
        author: "Cumhuriyet",
        title: item.querySelector("title").innerHTML,
        url: item.querySelector("link").innerHTML,
        id: item.querySelector("link").innerHTML.split("-").pop(),
        dt: item.querySelector("pubDate").innerHTML,
        points: 0,
        page: "/discover/cumhuriyet/" + item.querySelector("link").innerHTML.split("-").pop(),
    }));
    loaded.value = true;
}

onBeforeMount(() => {
    setup();
})
</script>