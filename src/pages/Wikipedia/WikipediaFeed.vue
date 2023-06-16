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
import { extractor } from "/extractors/wikipedia.js";
import Placeholder from '/components/Placeholder.vue';
import Post from '/components/ListPost.vue';

const posts = ref([]);
const ex = new extractor();
const loaded = ref(false);

async function setup() {
    let response = await ex.get_posts();
    console.log("Response:", response);
    if (!response.length) {
        return
    }

    response.map(item => posts.value.push({
        author: "Wikipedia",
        title: item.title,
        url: "https://en.wikipedia.org/?curid=" + item.id,
        id: item.id,
        dt: null,
        points: 0,
        page: "/discover/wikipedia/" + item.objectID,
    }));
    loaded.value = true;
}

onBeforeMount(() => {
    setup();
})
</script>