const extractor = () => {
    async function get_posts(page = 1, request = null, args = null) {
        if (page == 1) {
            let posts = [];
            let elems = [];

            let dom = await fetch("https://www.cumhuriyet.com.tr/gundem")
                .then(res => res.text())
                .then(str => new window.DOMParser().parseFromString(str, "text/html"))
                .catch(err => null);

            // Return if dom is null
            if (!dom) {
                return posts;
            }

            elems.push(...[...dom.querySelectorAll(".slider-manset img[src^='/Archive/2']")].slice(2));
            elems.push(...[...dom.querySelectorAll(".haber img[src^='/Archive/2']")]);

            posts = elems.map(post => ({
                title: post.title,
                author: "Cumhuriyet",
                url: "https://cumhuriyet.com.tr/" + post.attributes.src.value.split("/").slice(-2, -1)[0],
                id: post.attributes.src.value.split("/").slice(-2, -1)[0],
                dt: null,
                image: "https://cumhuriyet.com.tr" + post.attributes.src.value,
                page: "/discover/cumhuriyet/" + post.attributes.src.value.split("/").slice(-2, -1)[0],
                last_idhaber: post.closest(".haber") ? post.closest(".haber").attributes["data-idhaber"].value : null
            }));

            return posts;
        }

        return await fetch(`https://www.cumhuriyet.com.tr/bolum-haberleri/9999/${args.last_idhaber}`, {
            method: "POST",
        })
            .then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/html"))
            .then(dom => [...dom.querySelectorAll("img[src^='/Archive/2']")])
            .then(posts => posts.map(post => ({
                title: post.title,
                author: "Cumhuriyet",
                url: "https://cumhuriyet.com.tr/" + post.attributes.src.value.split("/").slice(-2, -1)[0],
                id: post.attributes.src.value.split("/").slice(-2, -1)[0],
                dt: null,
                image: "https://cumhuriyet.com.tr" + post.attributes.src.value,
                page: "/discover/cumhuriyet/" + post.attributes.src.value.split("/").slice(-2, -1)[0],
                last_idhaber: post.closest(".haber") ? post.closest(".haber").attributes["data-idhaber"].value : null
            })))
    }

    async function get_post(id, request = null, args = null) {
        return await fetch(`https://www.cumhuriyet.com.tr/${id}`)
            .then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/html"))
            .then(dom => ({
                author: "Cumhuriyet",
                title: dom.head.querySelector("meta[property='og:title']").content,
                url: dom.head.querySelector("meta[property='og:url']").content,
                id: id,
                dt: null,
                image: "/images/bitmap_dark.png",
                page: "/discover/cumhuriyet/" + id,
            }))
            .catch(err => null);
    }

    return {
        get_posts: get_posts,
        get_post: get_post
    }
}