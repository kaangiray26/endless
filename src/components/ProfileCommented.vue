<template>
    <div class="d-flex flex-column">
        <div class="d-flex align-items-center bg-light py-1">
            <h5 class="bi bi-chat-fill m-0 ms-1"></h5>
            <h5 class="m-0 ms-1">Commented</h5>
        </div>
    </div>
    <ul class="list-group list-group-flush border-0">
        <li v-for="post in commented" class="list-group-item border rounded p-0 mt-2">
            <Post :key="post" :obj="post" @refresh="refresh" />
        </li>
    </ul>
</template>

<script setup>
import { ref, onActivated } from 'vue';
import Post from '/components/CommentedPost.vue';

const commented = ref([]);

async function refresh() {
    commented.value = JSON.parse(localStorage.getItem("commented"));
}

onActivated(() => {
    commented.value = JSON.parse(localStorage.getItem("commented"));
})
</script>