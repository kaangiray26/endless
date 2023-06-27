<template>
    <div class="d-flex flex-column m-3">
        <div class="px-2">
            <h5>Discover new pages</h5>
        </div>
        <div class="input-group">
            <input v-model="text" type="text" class="form-control input-plain" placeholder="Search" aria-label="Search"
                @input="search">
        </div>
        <ul class="list-group list-group-flush border-0">
            <li v-for="extractor in extractors" class="list-group-item border rounded clickable click-effect p-0 mt-2"
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
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Fuse from 'fuse.js';
import { list } from "https://cdn.jsdelivr.net/gh/kaangiray26/endless@latest/src/js/extractors.min.js"

const router = useRouter();
const extractors = ref(list);

const text = ref("");
const fuse = ref(null);

async function redirect(path) {
    router.push(path);
}

async function effect(obj) {
    obj.target.classList.add("opacity-75");
}

async function search() {
    let query = text.value;
    if (query.length == 0) {
        extractors.value = list;
        return;
    }

    let result = fuse.value.search(query);
    extractors.value = result.map(item => item.item);
}

onMounted(() => {
    fuse.value = new Fuse(extractors.value, {
        keys: ['name']
    });
})
</script>