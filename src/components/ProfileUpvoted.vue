<template>
    <div class="d-flex flex-column">
        <div class="d-flex align-items-center bg-light py-1">
            <h5 class="bi bi-heart-fill m-0 ms-1"></h5>
            <h5 class="m-0 ms-1">Upvoted</h5>
        </div>
    </div>
    <ul class="list-group list-group-flush border-0">
        <li v-for="post in upvoted" class="list-group-item border rounded p-0 mt-2">
            <Post :key="post" :obj="post" @refresh="refresh" />
        </li>
    </ul>
</template>

<script setup>
import { ref, onActivated } from 'vue';
import Post from '/components/UpvotedSavedPost.vue';

const upvoted = ref([]);

async function refresh() {
    upvoted.value = JSON.parse(localStorage.getItem("upvoted"));
}

onActivated(() => {
    upvoted.value = JSON.parse(localStorage.getItem("upvoted"));
});
</script>