<template>
    <div class="vw-100 complete-view d-flex flex-column">
        <div class="content-view">
            <div class="d-flex justify-content-end bg-dark">
                <button type="button" class="btn btn-dark bi bi-arrow-clockwise" @click="reload"></button>
            </div>
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component" :key="router.currentRoute.value.path"></component>
                </keep-alive>
            </router-view>
        </div>
        <Toolbar />
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { CapacitorHttp } from '@capacitor/core';
import Toolbar from "./Toolbar.vue";

const router = useRouter();

async function reload() {
    router.go();
}

async function test() {
    let response = await CapacitorHttp.get({ url: "https://reddit.com/.json" })
        .then(res => res.data.data.children)
        .then(posts => posts.map(post => ({
            title: post.data.title,
            author: post.data.author,
            url: "https://redd.it/" + post.data.id,
            id: post.data.id,
            dt: post.data.created,
            image: "/favicon.svg",
            page: "/discover/reddit/" + post.data.id,
        })))

    console.log(response);
}

test();
</script>