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
import { extractor } from "/extractors/hacker-news.js";
import Post from '/components/ListPost.vue';

const page = ref(0);
const posts = ref([]);
const ex = new extractor();
const loaded = ref(false);

async function setup() {
    loaded.value = false;

    let response = await ex.get_posts(page.value);
    if (!response.length) {
        loaded.value = true;
        return
    }

    response.map(item => posts.value.push({
        author: item.author,
        title: item.title,
        url: item.url,
        id: item.objectID,
        dt: item.created_at,
        points: item.points,
        image: "/favicon.svg",
        page: "/discover/hacker-news/" + item.objectID,
    }));

    page.value++;
    loaded.value = true;
}

onBeforeMount(() => {
    setup();

    let view = document.querySelector('.content-view');
    view.addEventListener('scroll', () => {
        if (view.scrollTop + view.clientHeight >= view.scrollHeight - window.innerWidth && loaded.value) {
            setup();
        }
    })
})
</script>