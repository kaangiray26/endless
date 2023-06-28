<template>
    <div class="d-flex flex-column m-3">
        <div class="d-flex align-items-center bg-light py-1">
            <h5 class="bi bi-person-fill m-0 ms-1"></h5>
            <h5 class="m-0 ms-1">Profile</h5>
        </div>
        <div class="input-group mt-2">
            <span class="input-group-text bi bi-server" id="basic-addon1"></span>
            <input type="text" class="form-control" placeholder="https://endless.buzl.uk" aria-label="Server"
                aria-describedby="basic-addon1" :value="get_server()">
        </div>
        <div class="input-group mt-2">
            <span class="input-group-text" :class="{ 'bi bi-circle': !reloaded, 'bi bi-circle-fill': reloaded }"
                id="basic-addon2"></span>
            <button type="button" class="btn btn-dark flex-fill" :class="{ 'text-dark': reloading }" :disabled="reloading"
                @click="reload_extractors">Reload extractors</button>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-3">
            <router-link to="/profile/saved" class="btn btn-touch click-effect"
                :class="{ 'bg-dark text-light': path == '/profile/saved' }">Saved</router-link>
            <router-link to="/profile/upvoted" class="btn btn-touch click-effect"
                :class="{ 'bg-dark text-light': path == '/profile/upvoted' }">Upvoted</router-link>
            <router-link to="/profile/commented" class="btn btn-touch click-effect"
                :class="{ 'bg-dark text-light': path == '/profile/commented' }">Commented</router-link>
        </div>
        <hr>
        <router-view></router-view>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { get_server } from "/js/utils.js";

const router = useRouter();

const path = computed(() => router.currentRoute.value.path);
const reloading = ref(false);
const reloaded = ref(false);

async function reload_extractors() {
    if (reloading.value) return;
    reloading.value = true;
    reloaded.value = false;

    let response = await fetch("https://kaangiray26.github.io/endless/list.json")
        .then(res => res.json())
        .catch(err => null);
    if (!response) {
        reloading.value = true;
        return
    }
    localStorage.setItem('list', JSON.stringify(response));

    reloading.value = false;
    reloaded.value = true;
}
</script>