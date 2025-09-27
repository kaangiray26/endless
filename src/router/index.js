import { createRouter, createWebHistory } from 'vue-router';

import Home from "/components/Home.vue"
import Discover from "/components/Discover.vue"
import Backup from "/components/Backup.vue"

import Feed from "/pages/Feed.vue"
import Post from "/pages/Post.vue"

import Profile from "/components/Profile.vue"
import ProfileSaved from "/components/ProfileSaved.vue"
import ProfileUpvoted from "/components/ProfileUpvoted.vue"
import ProfileCommented from "/components/ProfileCommented.vue"

const routes = [
    {
        path: "/",
        component: Home,
    },
    {
        path: "/discover",
        children: [
            {
                path: "",
                component: Discover
            },
            {
                path: ":domain",
                component: Feed
            },
            {
                path: ":domain/:id+",
                component: Post
            }
        ]
    },
    {
        path: "/profile",
        component: Profile,
        children: [
            {
                path: "saved",
                component: ProfileSaved
            },
            {
                path: "upvoted",
                component: ProfileUpvoted
            },
            {
                path: "commented",
                component: ProfileCommented
            }
        ]
    },
    {
        path: "/backup",
        component: Backup
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    let pages = JSON.parse(localStorage.getItem("pages"));
    pages = pages.slice(-1);

    pages.push({
        path: from.path,
        scroll: document.querySelector('.content-view').scrollTop
    })
    localStorage.setItem("pages", JSON.stringify(pages));
    next();
});

export default router