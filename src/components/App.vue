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
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import Toolbar from "./Toolbar.vue";

const router = useRouter();

async function reload() {
    router.go();
}

async function check() {
    let list = JSON.parse(localStorage.getItem('list'));
    if (list.length) {
        return
    }

    let response = await fetch("https://kaangiray26.github.io/endless/list.json")
        .then(res => res.json())
        .catch(err => null);
    if (!response) {
        return
    }

    localStorage.setItem('list', JSON.stringify(response));
}

onBeforeMount(() => {
    check();
})
</script>