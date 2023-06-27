<template>
    <div class="input-group">
        <input v-model="text" type="text" class="form-control input-plain rounded-0" placeholder="Search"
            aria-label="Search" @input="search">
    </div>
    <div v-if="!loaded" class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0"
        aria-valuemax="100">
        <div class="progress-bar"></div>
    </div>
    <ul class="list-group list-group-flush border-0 p-3 pt-0">
        <Post :obj="item" v-for="item in posts" />
    </ul>
    <div v-if="!scroll_loaded" class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0"
        aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar"></div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { CapacitorHttp } from '@capacitor/core';
import { extractors } from "https://"
import Fuse from 'fuse.js';
import Post from '/components/SingleShortPost.vue';

const router = useRouter()

const text = ref("");
const fuse = ref(null);
const backup = ref(null);

const ex = ref(null);
const posts = ref([]);
const page = ref(1);

const loaded = ref(false);
const scroll_loaded = ref(true);
const finished = ref(false);

async function search() {
    let query = text.value;
    if (query.length == 0) {
        posts.value = backup.value;
        return;
    }

    // Backup posts if not already backed up
    if (!backup.value) {
        backup.value = posts.value;
    }

    // Search posts for query
    fuse.value.setCollection(posts.value);
    let result = fuse.value.search(query);
    posts.value = result.map(item => item.item);
}

async function setup() {
    loaded.value = false;

    let response = await ex.value.get_posts(1, CapacitorHttp);
    if (!response.length) {
        loaded.value = true;
        scroll_loaded.value = true;
        finished.value = true;
        return
    }

    // Add the posts to the posts array
    posts.value.push(...response);
    page.value++;

    loaded.value = true;
}

async function scroll() {
    scroll_loaded.value = false;

    let response = await ex.value.get_posts(page.value, CapacitorHttp, posts.value.slice(-1)[0]);
    if (!response.length) {
        loaded.value = true;
        scroll_loaded.value = true;
        finished.value = true;
        return
    }

    // Add the posts to the posts array
    posts.value.push(...response);
    page.value++;

    scroll_loaded.value = true;
}

onBeforeMount(() => {
    // Set the extractor
    ex.value = extractors[router.currentRoute.value.params.domain];

    // Run setup
    setup();

    // Add the scroll event listener
    let view = document.querySelector('.content-view');
    view.addEventListener('scroll', () => {
        if (view.scrollTop + view.clientHeight >= view.scrollHeight - window.innerWidth && scroll_loaded.value && !finished.value) {
            scroll();
        }
    })

    fuse.value = new Fuse(posts.value, {
        keys: ['title']
    });
})

onActivated(() => {
    let pages = JSON.parse(localStorage.getItem("pages"));
    let this_page = pages.find(page => page.path == window.location.pathname);
    if (this_page) {
        document.querySelector('.content-view').scrollTop = parseInt(this_page.scroll);
    }
})
</script>