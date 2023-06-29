const extractor = () => {
    async function get_posts(page = 1, request = null, args = null) {
        return await fetch("https://m.youtube.com/feed/trending")
            .then(response => response.text())
            .then(str => new DOMParser().parseFromString(str, "text/html"))
            .then(dom => [...dom.querySelectorAll("ytm-item-section-renderer")])
            .then(items => items.map(item => ({
                title: item.querySelector(".media-item-headline").innerText,
                author: item.querySelector(".media-item-metadata .ytm-badge-and-byline-item-byline").innerText,
                url: "https://youtube.com/watch?v=" + item.querySelector("a").search.slice(3),
                id: item.querySelector("a").search.slice(3),
                dt: null,
                image: item.querySelector("img").src,
                page: "/discover/youtube/" + item.querySelector("a").search.slice(3),
            })))
            .catch(err => []);
    }

    async function get_post(id, request = null, args = null) {
        return null
    }

    return {
        get_posts: get_posts,
        get_post: get_post
    }
}