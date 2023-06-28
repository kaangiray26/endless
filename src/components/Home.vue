<template>
    <div class="row row-cols-1 g-0 m-3 mt-0">
        <div class="col-12 mt-3">
            <div class="card border-0 theme-shadow rounded">
                <div class="card-body p-0">
                    <div class="border-bottom px-2 py-1">
                        <span class="fw-bold">endless</span>
                    </div>
                    <div class="px-2 py-1">
                        <span>Follow some sites to fill your feed!</span>
                    </div>
                    <div class="d-flex square">
                        <img class="img-post rounded-bottom" src="/images/feed.jpg">
                    </div>
                </div>
            </div>
        </div>
        <div v-if="last_upvote" class="col-12 mt-3">
            <div class="card border-0 theme-shadow rounded">
                <div class="card-body p-0">
                    <div class="d-flex align-items-center px-2 py-1">
                        <span class="fw-bold me-2">Last upvote</span>
                        <small class="text-muted">{{ format_date(last_upvote.created_at) }}</small>
                    </div>
                    <div class="px-2">
                        <span class="bi bi-card-text me-1"></span>
                        <span>{{ last_upvote.post }}</span>
                    </div>
                    <div class="d-flex justify-content-end bg-light rounded">
                        <button type="button" class="btn btn-touch click-effect bi bi-chat"
                            @click="open_post(last_upvote)"></button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="last_comment" class="col-12 mt-3">
            <div class="card border-0 theme-shadow rounded">
                <div class="card-body p-0">
                    <div class="d-flex align-items-center px-2 py-1">
                        <span class="fw-bold me-2">Last comment</span>
                        <small class="text-muted">{{ format_date(last_comment.created_at) }}</small>
                    </div>
                    <div class="px-2">
                        <span class="bi bi-card-text me-1"></span>
                        <span>{{ last_comment.post }}</span>
                    </div>
                    <div class="d-flex p-theme border-top">
                        <span v-html="last_comment.comment" class="text-break"></span>
                    </div>
                    <div class="d-flex justify-content-end bg-light rounded">
                        <button type="button" class="btn btn-touch click-effect bi bi-chat"
                            @click="open_post(last_comment)"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { get_latest } from "/js/utils.js";

const router = useRouter();

const last_upvote = ref(null);
const last_comment = ref(null);

async function setup() {
    let response = await get_latest();
    if (!response) {
        return
    }

    last_upvote.value = response.last_added_upvote;
    last_comment.value = response.last_added_comment;
}

async function open_post(item) {
    router.push(item.post)
}

function format_date(dt) {
    let date = new Date(dt);

    let date_string = date.toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    let time_string = date.toLocaleString("en-GB", {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
    })

    return `${date_string} ${time_string}`

}

onBeforeMount(() => {
    setup();
})
</script>