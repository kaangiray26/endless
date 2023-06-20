<template>
    <div v-if="!item" class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0"
        aria-valuemax="100">
        <div class="progress-bar"></div>
    </div>
    <Post v-if="item" :obj="item" />
</template>

<script setup>
import { ref, onBeforeMount, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { extractor } from "/extractors/hacker-news.js";
import Post from '/components/SinglePost.vue';

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

    get_comments(response.kids)

    item.value = {
        author: response.by,
        title: response.title,
        url: response.url,
        id: response.id,
        dt: response.time,
        points: response.score,
        image: "/favicon.svg",
        page: "/discover/hacker-news/" + response.id,
        comments: [],
    }
}

async function get_comments(ids) {
    let comments = await ex.get_comments(ids);
    if (!comments) {
        console.log("Error", comments);
        return;
    }
    item.value.comments = comments;
}

onBeforeMount(() => {
    if (!id) {
        router.push("/discover/hacker-news");
        return
    }
    setup();
})

onActivated(() => {
    document.querySelector('.content-view').scrollTop = 0;
})
</script>