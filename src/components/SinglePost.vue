<template>
    <div class="card border-0 theme-shadow rounded">
        <div class="card-body p-0">
            <div class="border-bottom px-2 py-1">
                <span class="fw-bold">{{ obj.author }}</span>
            </div>
            <div class="px-2 py-1">
                <span>{{ obj.title }}</span>
            </div>
            <div class="d-flex square">
                <img class="img-post" :src="obj.image" @error="placeholder">
            </div>
            <div class="d-flex justify-content-between bg-dark">
                <span class="text-light font-monospace ms-2">{{ obj.points }} pts</span>
                <span class="text-light font-monospace me-2">{{ obj.comments.length }} cts</span>
            </div>
            <div class="d-flex justify-content-around bg-light rounded">
                <button type="button" class="btn btn-touch bi bi-heart"></button>
                <button type="button" class="btn btn-touch bi bi-chat" @click="comments"></button>
                <button type="button" class="btn btn-touch bi"
                    :class="{ 'bi-bookmark-fill': is_saved, 'bi-bookmark': !is_saved }" @click="save"></button>
                <button type="button" class="btn btn-touch bi bi-share" @click="share"></button>
                <button type="button" class="btn btn-touch bi bi-box-arrow-up-right" @click="redirect"></button>
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
import { ref, onBeforeMount, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { CapacitorHttp } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';

const router = useRouter();

const is_saved = ref(false);
const props = defineProps({
    obj: {
        type: Object,
        required: true
    }
})

async function check_saved() {
    let saved = localStorage.getItem("saved");
    let data = saved ? JSON.parse(saved) : [];

    if (data.find(item => item.page === props.obj.page)) {
        is_saved.value = true;
    } else {
        is_saved.value = false;
    }
}

async function get_preview() {
    let content = await CapacitorHttp.get({
        url: props.obj.url
    })
        .then(response => response.data)
        .catch(err => null);

    if (!content) {
        props.obj.image = "/favicon.svg";
        return
    }

    let document = new DOMParser().parseFromString(content, "text/html");
    let img = document.head.querySelector("meta[property='og:image']");

    if (img) {
        props.obj.image = img.content;
    }
}

async function redirect() {
    Browser.open({
        url: props.obj.url
    });
}

async function comments() {
    router.push(props.obj.page);
}

async function placeholder(obj) {
    obj.target.src = "/favicon.svg";
}

async function share() {
    Share.share({
        title: props.obj.title,
        text: props.obj.title,
        url: props.obj.url,
        dialogTitle: "Share with friends"
    })
}

async function save() {
    let saved = localStorage.getItem("saved");
    let data = saved ? JSON.parse(saved) : [];

    if (data.find(item => item.page == props.obj.page)) {
        // Remove element from the saved items
        data = data.filter(item => item.page != props.obj.page);
        localStorage.setItem("saved", JSON.stringify(data));
        is_saved.value = false;
        return
    }

    data.push(props.obj);
    localStorage.setItem("saved", JSON.stringify(data));
    is_saved.value = true;
}

onBeforeMount(() => {
    console.log(props.obj.page)
    check_saved();
    get_preview();
})

onActivated(() => {
    check_saved();
})
</script>