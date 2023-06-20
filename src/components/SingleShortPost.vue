<template>
    <li class="list-group-item border rounded clickable click-effect p-0 mt-3">
        <div class="d-flex">
            <div class="d-flex square p-1 me-1">
                <img ref="target" class="cover icon" :src="obj.image" @error="placeholder" loading="lazy">
            </div>
            <div class="d-flex flex-fill align-items-center">
                <h6 class="m-0">{{ obj.title }}</h6>
            </div>
        </div>
        <div class="d-flex justify-content-around bg-light rounded">
            <button type="button" class="btn btn-touch bi bi-heart"></button>
            <button type="button" class="btn btn-touch bi bi-chat" @click="comments"></button>
            <button type="button" class="btn btn-touch bi"
                :class="{ 'bi-bookmark-fill': is_saved, 'bi-bookmark': !is_saved }" @click="save"></button>
            <button type="button" class="btn btn-touch bi bi-share" @click="share"></button>
            <button type="button" class="btn btn-touch bi bi-box-arrow-up-right" @click="redirect"></button>
        </div>
    </li>
</template>

<script setup>
import { ref, onBeforeMount, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { useIntersectionObserver } from '@vueuse/core'
import { CapacitorHttp } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';

const router = useRouter();

const target = ref(null);
const is_saved = ref(false);
const img_loaded = ref(false);

const props = defineProps({
    obj: {
        type: Object,
        required: true
    }
})

async function placeholder(obj) {
    obj.target.src = "/favicon.svg";
}

async function comments() {
    router.push(props.obj.page);
}

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
    img_loaded.value = true;

    console.log("IMAGE:", props.obj.image);

    // If the image is already loaded, return
    if (props.obj.image != "/favicon.svg") {
        return
    }

    props.obj.image = await CapacitorHttp.get({
        url: props.obj.url
    })
        .then(res => res.data)
        .then(str => new DOMParser().parseFromString(str, "text/html"))
        .then(dom => dom.head.querySelector("meta[property='og:image']").content)
        .catch(err => "/favicon.svg");
}

async function redirect() {
    Browser.open({
        url: props.obj.url
    });
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
    check_saved();

    useIntersectionObserver(target, ([{ isIntersecting }]) => {
        if (!img_loaded.value && isIntersecting) {
            get_preview();
        }
    }, {
        threshold: 0.5
    })
})

onActivated(() => {
    check_saved();
})
</script>