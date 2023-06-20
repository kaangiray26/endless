<template>
    <div class="d-flex flex-column m-3">
        <div class="d-flex flex-column">
            <div class="d-flex justify-content-between align-items-center bg-light">
                <h5 class="m-0 mx-1">Saved posts</h5>
                <div class="d-flex">
                    <!-- <button type="button" class="btn btn-touch bi bi-download mx-1" @click="download"></button> -->
                    <button type="button" class="btn btn-touch bi bi-trash-fill mx-1" @click="clear_saved"></button>
                </div>
            </div>
        </div>
        <ul class="list-group list-group-flush border-0">
            <li v-for="post in saved_posts" class="list-group-item border rounded clickable click-effect p-0 mt-2">
                <Post :obj="post" />
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onActivated } from 'vue';
import Post from '/components/SavedPost.vue';
import { Browser } from '@capacitor/browser';

const saved_posts = ref([]);

async function clear_saved() {
    localStorage.removeItem("saved");
    saved_posts.value = [];
}

async function download() {
    let reader = new FileReader();
    reader.onload = () => {
        Browser.open({
            url: reader.result
        });
    }

    reader.readAsDataURL(new Blob([localStorage.getItem("saved")], { type: "application/json" }));
}

onActivated(() => {
    let posts = localStorage.getItem("saved");
    if (posts) {
        saved_posts.value = JSON.parse(posts);
    }

    let scroll = localStorage.getItem(window.location.pathname);
    if (scroll) {
        document.querySelector('.content-view').scrollTop = parseInt(scroll);
    }
});
</script>