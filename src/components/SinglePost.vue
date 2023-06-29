<template>
    <div class="card border-0">
        <div class="card-body p-0">
            <div class="d-flex flex-column align-items-start p-3 pb-0">
                <small class="text-muted">{{ obj.author }}</small>
                <h6 class="text-break m-0">{{ obj.title }}</h6>
            </div>
            <div class="d-flex px-3 py-1">
                <small class="me-2">🚀 {{ points }} pts</small>
                <small>📝 {{ comments.length }} cts</small>
            </div>
            <div class="d-flex square p-3">
                <img class="img-post rounded theme-shadow" :src="obj.image" @error="placeholder">
            </div>
            <div class="d-flex justify-content-around rounded bg-light mx-3 mb-3">
                <button type="button" class="btn btn-touch bi"
                    :class="{ 'bi-heart-fill': is_upvoted, 'bi-heart': !is_upvoted }" @click="upvote"></button>
                <button type="button" class="btn btn-touch bi bi-chat"></button>
                <button type="button" class="btn btn-touch bi"
                    :class="{ 'bi-bookmark-fill': is_saved, 'bi-bookmark': !is_saved }" @click="save"></button>
                <button type="button" class="btn btn-touch bi bi-share" @click="share"></button>
                <button type="button" class="btn btn-touch bi bi-box-arrow-up-right" @click="redirect"></button>
            </div>
        </div>
    </div>
    <div class="d-flex flex-column">
        <div class="d-flex flex-column border">
            <div class="input-group">
                <textarea v-model="comment_text" class="form-control" aria-label="With textarea"
                    placeholder="Remember, be nice!" rows="5" cols="33" wrap="soft"></textarea>
            </div>
            <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-touch click-effect" @click="comment">Post</button>
            </div>
        </div>
        <ul class="list-group">
            <div v-for="comment in comments">
                <li class="list-group-item">
                    <div class="d-flex flex-column">
                        <span class="fw-bold">Anonymous</span>
                        <span v-html="comment.comment"></span>
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
import { get_upvotes, post_upvotes, remove_upvotes, get_comments, post_comments } from "/js/utils.js";

const router = useRouter();

const props = defineProps({
    obj: {
        type: Object,
        required: true
    }
})

const is_saved = ref(false);
const is_upvoted = ref(false);

const points = ref(0);
const offset = ref(0);
const comments = ref([]);
const comment_text = ref("");

const upvoting = ref(false);
const commenting = ref(false);
const saving = ref(false);

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
        if (!response || !response.success) {
            upvoting.value = false;
            return
        }

        upvoted = upvoted.filter(item => item.page != props.obj.page || item.identifier != upvote.identifier);
        localStorage.setItem("upvoted", JSON.stringify(upvoted));
        points.value -= 1;

        is_upvoted.value = false;
        upvoting.value = false;
        return
    }

    // Post the upvote
    let response = await post_upvotes(props.obj.page);
    if (!response || !response.success) {
        upvoting.value = false;
        return
    }

    // Save upvote locally
    props.obj.identifier = response.identifier;
    upvoted.push(props.obj)
    localStorage.setItem("upvoted", JSON.stringify(upvoted));
    points.value += 1;

    is_upvoted.value = true;
    upvoting.value = false;
}

async function save() {
    // Check if the user is already saving
    if (saving.value) {
        return
    }
    saving.value = true;

    // Check if the item is already saved
    let saved = JSON.parse(localStorage.getItem("saved"));

    // Remove element from the saved items
    if (saved.find(item => item.page == props.obj.page)) {
        saved = saved.filter(item => item.page != props.obj.page);
        localStorage.setItem("saved", JSON.stringify(saved));
        is_saved.value = false;
        saving.value = false;
        return
    }

    // Add element to the saved items
    saved.push(props.obj);
    localStorage.setItem("saved", JSON.stringify(saved));
    is_saved.value = true;
    saving.value = false;
}

async function _get_upvotes() {
    let response = await get_upvotes(props.obj.page);
    if (!response || !response.success) {
        return
    }

    points.value = parseInt(response.points);
}

async function _get_comments() {
    let response = await get_comments(props.obj.page, offset.value);
    if (!response || !response.success) {
        return
    }

    comments.value.push(...response.comments);
    offset.value += response.comments.length;
}

async function comment() {
    // Check if the user is already commenting
    if (commenting.value) {
        return
    }
    commenting.value = true;

    // Check if the comment is empty
    if (!comment_text.value.length) {
        commenting.value = false;
        return
    }

    // Post the comment
    let text = comment_text.value;
    let response = await post_comments(props.obj.page, text);
    if (!response || !response.success) {
        commenting.value = false;
        return
    }

    // Save comment locally
    let commented = JSON.parse(localStorage.getItem("commented"));
    props.obj.identifier = response.identifier;
    props.obj.comment = text;
    commented.push(props.obj);
    localStorage.setItem("commented", JSON.stringify(commented));

    // Show comment on the page
    comments.value.unshift({
        comment: text
    });

    // Reset the comment box
    comment_text.value = "";
    commenting.value = false;
}

onBeforeMount(() => {
    _get_upvotes();
    _get_comments();

    get_preview();
    check_upvoted();
    check_saved();
})

onActivated(() => {
    offset.value = 0;
    comments.value = [];

    _get_upvotes();
    _get_comments();
    check_upvoted();
    check_saved();
})
</script>