<template>
    <div class="bg-dark">
        <ul class="nav nav-pills nav-fill">
            <li class="nav-item">
                <router-link to="/" class="nav-link text-white fw-bold" aria-current="page">
                    <span class="fs-5 bi me-1"
                        :class="{ 'bi-house-door-fill': path == '/', 'bi-house-door': path != '/' }"></span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/discover" class="nav-link text-white fw-bold" aria-current="page">
                    <span class="fs-5 bi me-1"
                        :class="{ 'bi bi-compass-fill': path.startsWith('/discover'), 'bi bi-compass': !path.startsWith('/discover') }"></span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/profile" class="nav-link text-white fw-bold" aria-current="page">
                    <span class="fs-5 bi bi-person-circle me-1"
                        :class="{ 'bi bi-person-fill': path.startsWith('/profile'), 'bi bi-person': !path.startsWith('/profile') }"></span>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { computed, onBeforeMount } from 'vue';
import { App } from '@capacitor/app';
import { useRouter } from 'vue-router';

const router = useRouter();
const path = computed(() => router.currentRoute.value.path);

App.addListener('backButton', () => {
    if (path.value == '/') {
        App.exitApp();
    } else {
        router.back();
    }
});
</script>