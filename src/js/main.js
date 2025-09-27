import { createApp } from 'vue'
import App from '/components/App.vue'
import router from '/router'
import { reload_extractors } from "/js/utils.js"

// Import our custom CSS
import '/scss/styles.scss'
import '/assets/styles.css'

const server = "https://home.buzl.uk"

// Setup application settings
if (!localStorage.getItem("server")) {
    localStorage.setItem("server", JSON.stringify(server));
}

if (!localStorage.getItem("pages")) {
    localStorage.setItem("pages", JSON.stringify([]));
}

if (!localStorage.getItem("saved")) {
    localStorage.setItem("saved", JSON.stringify([]));
}

if (!localStorage.getItem("upvoted")) {
    localStorage.setItem("upvoted", JSON.stringify([]));
}

if (!localStorage.getItem("commented")) {
    localStorage.setItem("commented", JSON.stringify([]));
}

if (!localStorage.getItem("sort")) {
    localStorage.setItem("sort", JSON.stringify("hot"));
}

reload_extractors().then(() => {
    createApp(App).use(router).mount('#app');
})