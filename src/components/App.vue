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
import Toolbar from "./Toolbar.vue";

const router = useRouter();

async function reload() {
    router.go();
}

async function get_access() {
    let response = await fetch("https://open.spotify.com/search")
        .then(res => res.text())
        .then(str => new DOMParser().parseFromString(str, "text/html"))
        .then(dom => dom.querySelector("script#session"))
        .then(script => script.innerHTML)
        .then(json => JSON.parse(json))
        .catch(err => {
            console.log(err);
            return null;
        });

    if (!response) {
        console.log("Failed to get access token");
        return;
    }

    let action = await fetch("https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n", {
        headers: {
            Authorization: `Bearer ${response.accessToken}`
        }
    })
        .then(res => res.json())
        .catch(err => {
            console.log(err);
            return null;
        });

    console.log(action);
}

get_access();
</script>