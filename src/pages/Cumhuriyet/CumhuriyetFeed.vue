<template>
    <div v-if="!loaded" class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0"
        aria-valuemax="100">
        <div class="progress-bar"></div>
    </div>
    <div class="row row-cols-1 g-0 m-3 mb-0">
        <div v-for="item in posts" class="col-12 mb-3">
            <Post :obj="item" />
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { extractor } from "/extractors/cumhuriyet.js";
import Post from '/components/ListPost.vue';

const posts = ref([]);
const ex = new extractor();
const loaded = ref(false);

async function setup() {
    loaded.value = false;

    let response = await ex.get_posts();
    if (!response.length) {
        loaded.value = true;
        return
    }

    response.map(item => posts.value.push({
        author: "Cumhuriyet",
        title: item.querySelector("title").innerHTML,
        url: item.querySelector("link").innerHTML,
        id: item.querySelector("link").innerHTML.split("-").pop(),
        dt: item.querySelector("pubDate").innerHTML,
        points: 0,
        image: "/favicon.svg",
        page: "/discover/cumhuriyet/" + item.querySelector("link").innerHTML.split("-").pop(),
    }));

    loaded.value = true;
}

onBeforeMount(() => {
    setup();
})
</script>