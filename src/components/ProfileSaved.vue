<template>
    <div class="d-flex flex-column">
        <div class="d-flex align-items-center bg-light py-1">
            <h5 class="bi bi-bookmark-fill m-0 ms-1"></h5>
            <h5 class="m-0 ms-1">Saved posts</h5>
        </div>
    </div>
    <ul class="list-group list-group-flush border-0">
        <li v-for="post in saved" class="list-group-item border rounded p-0 mt-2">
            <Post :key="post" :obj="post" @refresh="refresh" />
        </li>
    </ul>
</template>

<script setup>
import { ref, onActivated } from 'vue';
import { Browser } from '@capacitor/browser';
import Post from '/components/UpvotedSavedPost.vue';

const saved = ref([]);

async function download() {
    let reader = new FileReader();
    reader.onload = () => {
        Browser.open({
            url: reader.result
        });
    }

    reader.readAsDataURL(new Blob([localStorage.getItem("saved")], { type: "application/json" }));
}

async function refresh() {
    saved.value = JSON.parse(localStorage.getItem("saved"));
}

onActivated(() => {
    saved.value = JSON.parse(localStorage.getItem("saved"));
});
</script>