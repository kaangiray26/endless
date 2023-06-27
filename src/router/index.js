import { createRouter, createWebHistory } from 'vue-router';
import Home from "/components/Home.vue"
import Discover from "/components/Discover.vue"

import Profile from "/components/Profile.vue"
import ProfileSaved from "/components/ProfileSaved.vue"
import ProfileUpvoted from "/components/ProfileUpvoted.vue"
import ProfileCommented from "/components/ProfileCommented.vue"

import WikipediaFeed from "/pages/Wikipedia/WikipediaFeed.vue"
import WikipediaPost from "/pages/Wikipedia/WikipediaPost.vue"

import HackerNewsFeed from "/pages/HackerNews/HackerNewsFeed.vue"
import HackerNewsPost from "/pages/HackerNews/HackerNewsPost.vue"

import CumhuriyetFeed from "/pages/Cumhuriyet/CumhuriyetFeed.vue"
import CumhuriyetPost from "/pages/Cumhuriyet/CumhuriyetPost.vue"

import GamingOnLinuxFeed from "/pages/GamingOnLinux/GamingOnLinuxFeed.vue"
import GamingOnLinuxPost from "/pages/GamingOnLinux/GamingOnLinuxPost.vue"

import DarknetDiariesFeed from "/pages/DarknetDiaries/DarknetDiariesFeed.vue"
import DarknetDiariesPost from "/pages/DarknetDiaries/DarknetDiariesPost.vue"

import SlashdotFeed from "/pages/Slashdot/SlashdotFeed.vue"
import SlashdotPost from "/pages/Slashdot/SlashdotPost.vue"

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
            },
            {
                "path": "darknet-diaries",
                children: [
                    {
                        path: "",
                        component: DarknetDiariesFeed
                    },
                    {
                        path: ":id",
                        component: DarknetDiariesPost
                    }
                ]
            },
            {
                path: "slashdot",
                children: [
                    {
                        path: "",
                        component: SlashdotFeed
                    },
                    {
                        path: ":id+",
                        component: SlashdotPost
                    }
                ]
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