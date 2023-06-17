<template>
    <div class="d-flex flex-column m-3">
        <div class="px-2">
            <h5>Discover new pages</h5>
        </div>
        <ul class="list-group theme-shadow">
            <li v-for="extractor in extractors" class="list-group-item list-group-item-action clickable click-effect p-0"
                @click="redirect(extractor.path)" @touchstart="effect">
                <div class="d-flex align-items-center list-div p-1">
                    <div class="d-flex me-2">
                        <img class="icon rounded-5 p-1" :src="extractor.image">
                    </div>
                    <div>
                        <h6 class="m-0">{{ extractor.name }}</h6>
                    </div>
                </div>
            </li>
        </ul>
        <router-view></router-view>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import list from '/extractors/list.json'

const router = useRouter();
const extractors = list.extractors;

async function redirect(path) {
    router.push(path);
}

async function effect(obj) {
    obj.target.classList.add("opacity-75");
}
</script>