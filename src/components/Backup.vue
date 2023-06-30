<template>
    <div class="card border-0">
        <div class="card-body p-3">
            <div class="d-flex flex-column rounded theme-shadow">
                <h6 class="fw-bold m-0 px-3 pt-3">Backup Utility</h6>
                <div class="d-flex flex-column p-3">
                    <div class="d-flex justify-content-between">
                        <button type="button" class="btn btn-dark text-light p-2 flex-fill me-1" @click="save_backup">Export
                            backup</button>
                        <button type="button" class="btn btn-dark text-light p-2 flex-fill ms-1"
                            @click="prompt_backup">Import
                            backup</button>
                    </div>
                </div>
                <div v-if="img_visible">
                    <div class="d-flex flex-column p-3 pt-0">
                        <span class="text-muted mb-2">Save this image to your device.</span>
                        <div class="d-flex square">
                            <img :src="img_src" class="img-post rounded theme-shadow" @contextmenu="save_image">
                        </div>
                    </div>
                </div>
                <input type="file" id="upload" @change="load_backup" hidden>
                <div v-if="message_visible" class="p-3 pt-0">
                    <div class="bg-light border rounded p-3">
                        <span class="fw-bold text-muted">Backup imported successfully!</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onActivated, ref } from 'vue';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

const pos = 9424;
const img_src = ref(null);

const img_visible = ref(false);
const message_visible = ref(false);

async function save_image() {
    let photo = await Filesystem.writeFile({
        path: `endless_backup_${Date.now()}.png`,
        data: img_src.value,
        directory: Directory.External,
    });

    await Share.share({
        url: photo.uri,
    });
}

async function save_backup() {
    img_visible.value = false;
    message_visible.value = false;

    // Prepare our data
    let upvoted = JSON.parse(localStorage.getItem("upvoted"));
    let commented = JSON.parse(localStorage.getItem("commented"));

    let data = JSON.stringify({
        upvoted: upvoted,
        commented: commented,
    });

    // Convert data into Uint8Array
    let b_data = new TextEncoder().encode(data);

    // Read sample png file
    let b_sample = await fetch("/images/bitmap.png")
        .then(res => res.blob())
        .then(blob => blob.arrayBuffer())
        .then(buffer => new Uint8Array(buffer))
        .catch(err => null);

    // Combine sample, magic numbers and our data
    let combined = new Uint8Array(b_sample.length + b_data.length);
    combined.set(b_sample);
    combined.set(b_data, b_sample.length);

    // Convert to blob
    let blob = new Blob([combined], { type: "image/png" });

    // Convert to base64
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
        img_src.value = reader.result;
        img_visible.value = true;
    }
}

async function prompt_backup() {
    img_visible.value = false;
    message_visible.value = false;
    document.getElementById("upload").click();
}

async function load_backup(obj) {
    // Get file
    let file = obj.target.files[0];
    if (!file) return;

    // Read file as array buffer
    let buffer = await file.arrayBuffer();
    let arr = new Uint8Array(buffer);

    // Get our data after position
    let data = arr.slice(pos);

    // Convert to string
    let str = new TextDecoder().decode(data);

    // Parse data
    let parsed = JSON.parse(str);

    // Save data
    localStorage.setItem("upvoted", JSON.stringify(parsed.upvoted));
    localStorage.setItem("commented", JSON.stringify(parsed.commented));

    // Show message
    message_visible.value = true;
}

onActivated(() => {
    img_visible.value = false;
    message_visible.value = false;
})
</script>