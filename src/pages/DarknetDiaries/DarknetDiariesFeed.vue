<template>
    <div v-if="!loaded" class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0"
        aria-valuemax="100">
        <div class="progress-bar"></div>
    </div>
    <ul class="list-group list-group-flush border-0 p-3 pt-0">
        <Post :obj="item" v-for="item in posts" />
    </ul>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { extractor } from "/extractors/darknet-diaries.js";
import Post from '/components/SingleShortPost.vue';

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

    response.map(item => {
        let episode = 0;
        if (!episode && item.querySelector("link")) {
            episode = item.querySelector("link").innerHTML.split("/")[4];
        }

        if (!episode && item.querySelector("episode")) {
            episode = item.querySelector("episode").innerHTML;
        }

        posts.value.push({
            author: "Darknet Diaries",
            title: item.querySelector("title").innerHTML,
            url: item.querySelector("link").innerHTML,
            id: episode,
            dt: item.querySelector("pubDate").innerHTML,
            points: 0,
            image: item.querySelector("image").attributes.href.value,
            page: "/discover/darknet-diaries/" + episode
        })
    });

    loaded.value = true;
}

onBeforeMount(() => {
    setup();
})
</script>