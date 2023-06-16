<template>
    <div class="card border-0 theme-shadow rounded">
        <div class="card-body p-0">
            <div class="border-bottom px-2 py-1">
                <span class="fw-bold">{{ obj.author }}</span>
            </div>
            <div class="px-2 py-1">
                <span>{{ obj.title }}</span>
            </div>
            <div>
                <img class="img-fluid" :src="image" @error="placeholder">
            </div>
            <div class="d-flex justify-content-between bg-dark">
                <span class="text-light font-monospace ms-2">{{ obj.points }} pts</span>
                <span class="text-light font-monospace me-2">{{ obj.comments.length }} cts</span>
            </div>
            <div class="d-flex justify-content-around bg-light rounded">
                <button type="button" class="btn btn-light bi bi-heart"></button>
                <button type="button" class="btn btn-light bi bi-chat" @click="comments"></button>
                <button type="button" class="btn btn-light bi bi-bookmark"></button>
                <button type="button" class="btn btn-light bi bi-share"></button>
                <button type="button" class="btn btn-light bi bi-box-arrow-up-right" @click="redirect"></button>
            </div>
        </div>
    </div>
    <div>
        <ul class="list-group">
            <div v-for="comment in obj.comments">
                <li v-if="comment.text" class="list-group-item">
                    <div class="d-flex flex-column">
                        <span class="fw-bold">{{ comment.author }}</span>
                        <span v-html="comment.text"></span>
                    </div>
                </li>
            </div>
        </ul>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { CapacitorHttp } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

const router = useRouter();

const image = ref("/favicon.svg");
const props = defineProps({
    obj: {
        type: Object,
        required: true
    }
})

async function get_preview() {
    let content = await CapacitorHttp.get({
        url: props.obj.url
    })
        .then(response => response.data)
        .catch(err => null);

    if (!content) {
        return
    }

    let document = new DOMParser().parseFromString(content, "text/html");
    let img = document.head.querySelector("meta[property='og:image']");

    if (img) {
        image.value = img.content;
    }
}

async function redirect() {
    Browser.open({
        url: props.obj.url
    });
}

async function comments() {
    router.push(props.obj.path);
}

async function placeholder(obj) {
    obj.target.src = "/favicon.svg";
}

onBeforeMount(() => {
    get_preview();
})
</script>