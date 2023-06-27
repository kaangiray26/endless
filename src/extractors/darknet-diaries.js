// Name: Darknet Diaries
// Type: Extractor
// Description: feeds.megaphone.fm/darknetdiaries extractor

class extractor {
    async get_posts() {
        let posts = [];
        let elems = [];

        let dom = await fetch("https://darknetdiaries.com/episode/")
            .then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/html"))
            .catch(err => null);

        // Return if dom is null
        if (!dom) {
            return posts;
        }

        elems.push(...[...dom.querySelectorAll(".post")]);

        posts = elems.map(post => ({
            title: post.querySelector(".post__title").textContent,
            author: "Darknet Diaries",
            url: "https://darknetdiaries.com" + post.querySelector(".post__title>a").pathname,
            id: post.querySelector(".post__title>a").pathname.split("/")[2],
            dt: null,
            points: 0,
            image: "https://darknetdiaries.com" + post.querySelector(".post__image").style.backgroundImage.slice(5, -2),
            page: "/discover/darknet-diaries/" + post.querySelector(".post__title>a").pathname.split("/")[2]
        }))

        return posts;
    }

    async get_more_posts(id) {
        let posts = [];
        let elems = [];

        let dom = await fetch(`https://darknetdiaries.com/episode/page${id}/`)
            .then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/html"))
            .catch(err => null);

        // Return if dom is null
        if (!dom) {
            return posts;
        }

        elems.push(...[...dom.querySelectorAll(".post")]);

        posts = elems.map(post => ({
            title: post.querySelector(".post__title").textContent,
            author: "Darknet Diaries",
            url: "https://darknetdiaries.com" + post.querySelector(".post__title>a").pathname,
            id: post.querySelector(".post__title>a").pathname.split("/")[2],
            dt: null,
            image: "https://darknetdiaries.com" + post.querySelector(".post__image").style.backgroundImage.slice(5, -2),
            page: "/discover/darknet-diaries/" + post.querySelector(".post__title>a").pathname.split("/")[2]
        }))

        return posts;
    }

    async get_post(id) {
        return await fetch(`https://darknetdiaries.com/episode/${id}`)
            .then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/html"))
            .then(dom => ({
                author: "Jack Rhysider",
                title: dom.head.querySelector("meta[property='og:title']").content,
                url: dom.head.querySelector("meta[property='og:url']").content,
                id: id,
                dt: null,
                image: "/favicon.svg",
                page: "/discover/darknet-diaries/" + id,
            }))
            .catch(err => null);
    }
}

export { extractor }