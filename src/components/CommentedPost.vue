<template>
    <div class="d-flex">
        <div class="d-flex square p-1">
            <img class="cover icon" :src="obj.image" @error="placeholder">
        </div>
        <div class="d-flex flex-fill align-items-center">
            <h6 class="text-break p-1 m-0">{{ obj.title }}</h6>
        </div>
    </div>
    <div class="d-flex p-theme border-top">
        <span v-html="obj.comment" class="text-break"></span>
    </div>
    <div class="d-flex justify-content-around bg-light rounded">
        <button type="button" class="btn btn-touch bi" :class="{ 'bi-heart-fill': is_upvoted, 'bi-heart': !is_upvoted }"
            @click="upvote"></button>
        <button type="button" class="btn btn-touch bi bi-chat" @click="comments"></button>
        <button type="button" class="btn btn-touch bi" :class="{ 'bi-bookmark-fill': is_saved, 'bi-bookmark': !is_saved }"
            @click="save"></button>
        <button type="button" class="btn btn-touch bi bi-share" @click="share"></button>
        <button type="button" class="btn btn-touch bi bi-trash-fill" @click="_remove_comments"></button>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { Share } from '@capacitor/share';
import { post_upvotes, remove_upvotes, remove_comments } from "/js/utils.js";

const router = useRouter();
const props = defineProps({
    obj: {
        type: Object,
        required: true
    }
})
const emit = defineEmits(["refresh"]);

const is_upvoted = ref(false);
const is_saved = ref(false);

const upvoting = ref(false);
const saving = ref(false);

async function placeholder(obj) {
    obj.target.src = "/favicon.svg";
}

async function comments() {
    router.push(props.obj.page);
}

async function check_upvoted() {
    let upvoted = JSON.parse(localStorage.getItem("upvoted"));

    if (upvoted.find(item => item.page === props.obj.page)) {
        is_upvoted.value = true;
    } else {
        is_upvoted.value = false;
    }
}

async function check_saved() {
    let saved = JSON.parse(localStorage.getItem("saved"));

    if (saved.find(item => item.page === props.obj.page)) {
        is_saved.value = true;
    } else {
        is_saved.value = false;
    }
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
    // Check if the user is already saving
    if (saving.value) {
        return
    }
    saving.value = true;

    let saved = JSON.parse(localStorage.getItem("saved"));
    if (saved.find(item => item.page == props.obj.page)) {
        // Remove element from the saved items
        saved = saved.filter(item => item.page != props.obj.page);
        localStorage.setItem("saved", JSON.stringify(saved));

        is_saved.value = false;
        saving.value = false;
        return
    }

    saved.push(props.obj);
    localStorage.setItem("saved", JSON.stringify(saved));

    is_saved.value = true;
    saving.value = false;
}

async function upvote() {
    // Check if the user is already upvoting
    if (upvoting.value) {
        return
    }
    upvoting.value = true;

    // Check if the user is already upvoted
    let upvoted = JSON.parse(localStorage.getItem("upvoted"));
    let upvote = upvoted.find(item => item.page === props.obj.page);

    // Remove upvote from the upvoted items
    if (upvote) {
        // Remove the upvote
        let response = await remove_upvotes(props.obj.page, upvote.identifier);
        if (!response.success) {
            upvoting.value = false;
            return
        }

        upvoted = upvoted.filter(item => item.page != props.obj.page && item.identifier != upvote.identifier);
        localStorage.setItem("upvoted", JSON.stringify(upvoted));

        is_upvoted.value = false;
        upvoting.value = false;
        return
    }

    // Post the upvote
    let response = await post_upvotes(props.obj.page);
    if (!response.success) {
        upvoting.value = false;
        return
    }

    // Save upvote locally
    props.obj.identifier = response.identifier;
    upvoted.push(props.obj)
    localStorage.setItem("upvoted", JSON.stringify(upvoted));

    is_upvoted.value = true;
    upvoting.value = false;
}

async function _remove_comments() {
    let response = await remove_comments(props.obj.page, props.obj.identifier);
    if (!response.success) {
        return
    }

    let commented = JSON.parse(localStorage.getItem("commented"));
    commented = commented.filter(item => item.page != props.obj.page && item.identifier != props.obj.identifier);
    localStorage.setItem("commented", JSON.stringify(commented));
    emit('refresh');
    return
}

onBeforeMount(() => {
    check_upvoted();
    check_saved();
})

onActivated(() => {
    check_upvoted();
    check_saved();
})
</script>