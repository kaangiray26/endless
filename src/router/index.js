import { createRouter, createWebHistory } from 'vue-router';
import Home from "/components/Home.vue"
import Discover from "/components/Discover.vue"
import Profile from "/components/Profile.vue"

import WikipediaFeed from "/pages/Wikipedia/WikipediaFeed.vue"
import WikipediaPost from "/pages/Wikipedia/WikipediaPost.vue"

import HackerNewsFeed from "/pages/HackerNews/HackerNewsFeed.vue"
import HackerNewsPost from "/pages/HackerNews/HackerNewsPost.vue"

import CumhuriyetFeed from "/pages/Cumhuriyet/CumhuriyetFeed.vue"
import CumhuriyetPost from "/pages/Cumhuriyet/CumhuriyetPost.vue"

import GamingOnLinuxFeed from "/pages/GamingOnLinux/GamingOnLinuxFeed.vue"
import GamingOnLinuxPost from "/pages/GamingOnLinux/GamingOnLinuxPost.vue"

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
                path: "wikipedia",
                children: [
                    {
                        path: "",
                        component: WikipediaFeed
                    },
                    {
                        path: ":id",
                        component: WikipediaPost
                    }
                ]
            },
            {
                path: "hacker-news",
                children: [
                    {
                        path: "",
                        component: HackerNewsFeed
                    },
                    {
                        path: ":id",
                        component: HackerNewsPost
                    }
                ]
            },
            {
                path: "cumhuriyet",
                children: [
                    {
                        path: "",
                        component: CumhuriyetFeed
                    },
                    {
                        path: ":id",
                        component: CumhuriyetPost
                    }
                ]
            },
            {
                path: "gaming-on-linux",
                children: [
                    {
                        path: "",
                        component: GamingOnLinuxFeed
                    },
                    {
                        path: ":id+",
                        component: GamingOnLinuxPost
                    }
                ]
            }
        ]
    },
    {
        path: "/profile",
        component: Profile
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router