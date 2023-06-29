<template>
    <div class="d-flex justify-content-evenly mt-3">
        <button type="button" class="btn btn-touch click-effect" :class="{ 'bg-dark text-light': sort == 'hot' }"
            @click="set_sort('hot')">Hot</button>
        <button type="button" class="btn btn-touch click-effect" :class="{ 'bg-dark text-light': sort == 'new' }"
            @click="set_sort('new')">New</button>
        <button type="button" class="btn btn-touch click-effect" :class="{ 'bg-dark text-light': sort == 'top' }"
            @click="set_sort('top')">Top</button>
        <button type="button" class="btn btn-touch click-effect" :class="{ 'bg-dark text-light': sort == 'controversial' }"
            @click="set_sort('controversial')">Controversial</button>
    </div>
    <div class="row row-cols-1 g-0 m-3 mt-0">
        <ul class="list-group list-group-flush border-0 pt-0">
            <Post :obj="item" />
            <li v-for="post in posts" class="list-group-item border rounded p-0 mt-3">
                <div class="d-flex flex-column p-theme">
                    <h6 class="text-break m-0">{{ post.post }}</h6>
                    <small class="text-muted">{{ get_details(post) }}</small>
                </div>
                <div class="d-flex justify-content-around bg-light rounded">
                    <button type="button" class="btn btn-touch bi bi-heart invisible"></button>
                    <button type="button" class="btn btn-touch bi bi-chat invisible"></button>
                    <button type="button" class="btn btn-touch bi bi-bookmark invisible"></button>
                    <button type="button" class="btn btn-touch bi bi-share invisible"></button>
                    <button type="button" class="btn btn-touch bi bi-box-arrow-up-right" @click="comments(post)"></button>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { get_latest } from "/js/utils.js";
import Post from "/components/SingleShortPost.vue";

const router = useRouter();

const posts = ref([]);
const sort = ref(null);

const item = {
    title: "Upvote and comment on posts to fill this feed!",
    author: "kaangiray26",
    url: "https://gist.github.com/kaangiray26/7be9145c92d228cbbec67d4b7089188a",
    id: "7be9145c92d228cbbec67d4b7089188a",
    dt: 1687982255,
    image: "https://raw.githubusercontent.com/kaangiray26/endless/main/src/public/favicon.png",
    page: "/discover/gist/7be9145c92d228cbbec67d4b7089188a",
}

async function setup() {
    let response = await get_latest(sort.value);
    if (!response) {
        return
    }

    posts.value = response;
}

async function set_sort(type) {
    sort.value = type;
    localStorage.setItem('sort', JSON.stringify(type));
    setup();
}

async function comments(obj) {
    router.push(obj.post);
}

function format_date(dt) {
    let date = new Date(dt);

    let date_string = date.toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    let time_string = date.toLocaleString("en-GB", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    })

    return `${date_string} ${time_string}`
}

function get_details(post) {
    if (sort.value == 'hot') {
        return `${post.count} pts`
    }

    if (sort.value == 'new') {
        return format_date(post.last_created_at)
    }

    if (sort.value == 'top') {
        return `${post.count} pts`
    }

    if (sort.value == 'controversial') {
        return `${post.count} comments`
    }
}

onBeforeMount(() => {
    sort.value = JSON.parse(localStorage.getItem('sort'));
    setup();
})
</script>