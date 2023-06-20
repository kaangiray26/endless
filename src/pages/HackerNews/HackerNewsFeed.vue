<template>
    <div v-if="!loaded" class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0"
        aria-valuemax="100">
        <div class="progress-bar"></div>
    </div>
    <ul class="list-group list-group-flush border-0 p-3 pt-0">
        <Post v-for="item in posts" :obj="item" />
    </ul>
    <div v-if="!scroll_loaded" class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0"
        aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar"></div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, onActivated } from 'vue';
import { extractor } from "/extractors/hacker-news.js";
import Post from '/components/SingleShortPost.vue';

const ex = new extractor();

const posts = ref([]);
const page = ref(1);

const loaded = ref(false);
const scroll_loaded = ref(true);
const finished = ref(false);

async function load() {
    let response = await ex.get_posts(page.value);
    if (!response.length) {
        loaded.value = true;
        scroll_loaded.value = true;
        finished.value = true;
        return
    }

    // Add the posts to the posts array
    posts.value.push(...response);
    page.value++;
}

async function setup() {
    loaded.value = false;
    await load();
    loaded.value = true;
}

async function scroll() {
    scroll_loaded.value = false;
    await load();
    scroll_loaded.value = true;
}

onBeforeMount(() => {
    setup();

    let view = document.querySelector('.content-view');
    view.addEventListener('scroll', () => {
        if (view.scrollTop + view.clientHeight >= view.scrollHeight - window.innerWidth && scroll_loaded.value && !finished.value) {
            scroll();
        }
    })
})

onActivated(() => {
    let scroll = localStorage.getItem(window.location.pathname);
    if (scroll) {
        document.querySelector('.content-view').scrollTop = parseInt(scroll);
    }
})
</script>