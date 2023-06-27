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
import { CapacitorHttp } from '@capacitor/core';
import { extractors } from "https://kaangiray26.github.io/endless/src/js/extractors.min.js";
import Post from '/components/SinglePost.vue';

const router = useRouter();

const ex = ref(null);
const item = ref(null);

async function setup() {
    let response = await ex.value.get_post(router.currentRoute.value.params.id.join("/"));
    if (!response) {
        return;
    }

    item.value = response;
}

onBeforeMount(() => {
    // Set the extractor
    ex.value = extractors[router.currentRoute.value.params.domain];

    // Run setup
    setup();
});

onActivated(() => {
    let pages = JSON.parse(localStorage.getItem("pages"));
    let this_page = pages.find(page => page.path == window.location.pathname);
    if (this_page) {
        document.querySelector('.content-view').scrollTop = parseInt(this_page.scroll);
    }
});
</script>