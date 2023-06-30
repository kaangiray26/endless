const extractor = () => {
    async function get_posts(page = 1, request = null, args = null) {
        let posts = [];
        let elems = [];

        if (page == 1) {
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

        let dom = await fetch(`https://darknetdiaries.com/episode/page${page}/`)
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

    async function get_post(id, request = null, args = null) {
        return await fetch(`https://darknetdiaries.com/episode/${id}`)
            .then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/html"))
            .then(dom => ({
                author: "Jack Rhysider",
                title: dom.head.querySelector("meta[property='og:title']").content,
                url: dom.head.querySelector("meta[property='og:url']").content,
                id: id,
                dt: null,
                image: "/images/bitmap_dark.png",
                page: "/discover/darknet-diaries/" + id,
            }))
            .catch(err => null);
    }

    return {
        get_posts: get_posts,
        get_post: get_post
    }
}