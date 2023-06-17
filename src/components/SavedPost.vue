<template>
    <div class="d-flex">
        <div class="d-flex square p-1 me-1">
            <img class="cover icon" :src="obj.image" @error="placeholder">
        </div>
        <div class="d-flex flex-fill align-items-center">
            <h6 class="m-0">{{ obj.title }}</h6>
        </div>
    </div>
    <div class="d-flex justify-content-around bg-light rounded">
        <button type="button" class="btn btn-touch bi bi-heart"></button>
        <button type="button" class="btn btn-touch bi bi-chat" @click="comments"></button>
        <button type="button" class="btn btn-touch bi" :class="{ 'bi-bookmark-fill': is_saved, 'bi-bookmark': !is_saved }"
            @click="save"></button>
        <button type="button" class="btn btn-touch bi bi-share" @click="share"></button>
        <button type="button" class="btn btn-touch bi bi-box-arrow-up-right" @click="redirect"></button>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, onActivated } from 'vue';
import { useRouter } from 'vue-router';
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

async function placeholder(obj) {
    obj.target.src = "/favicon.svg";
}

async function comments() {
    console.log("Opening:", props.obj.page);
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
})

onActivated(() => {
    check_saved();
})
</script>