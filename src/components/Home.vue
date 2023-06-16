<template>
    <div class="row row-cols-1 g-0 m-3 mb-0">
        <div v-for="i in 10" class="col-12 mb-3">
            <Post />
        </div>
    </div>
</template>

<script setup>
import Post from "./DefaultPost.vue"
</script>