<template>
    <div class="card border-0 theme-shadow rounded" aria-hidden="true">
        <div class="card-body p-0 placeholder-wave">
            <div class="border-bottom px-2 py-1">
                <span class="fw-bold placeholder w-50">Author</span>
            </div>
            <div class="px-2 py-1">
                <span class="placeholder w-100">Title</span>
            </div>
            <div class="p-1">
                <img class="img-fluid placeholder" src="/favicon.svg">
            </div>
            <div class="d-flex justify-content-around bg-light rounded">
                <button type="button" class="btn btn-light bi bi-heart" disabled></button>
                <button type="button" class="btn btn-light bi bi-chat" disabled></button>
                <button type="button" class="btn btn-light bi bi-bookmark" disabled></button>
                <button type="button" class="btn btn-light bi bi-share" disabled></button>
                <button type="button" class="btn btn-light bi bi-box-arrow-up-right" disabled></button>
            </div>
        </div>
    </div>
</template>