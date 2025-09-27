const extractor = () => {
    async function get_posts(page = 1, request = null, args = null) {
        return await fetch(`https://www.gamingonlinux.com/all-articles/page=${page}`)
            .then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/html"))
            .then(dom => [...dom.querySelectorAll(".article")])
            .then(posts => posts.map(post => ({
                title: post.querySelector(".title").textContent,
                author: post.querySelector(".p-author").textContent,
                url: post.querySelector(".u-url").href,
                id: post.querySelector(".u-url").pathname,
                dt: post.querySelector("time").dateTime,
                image: post.querySelector("img").src,
                page: "/discover/gaming-on-linux" + post.querySelector(".u-url").pathname,
            })))
            .catch(err => []);
    }

    async function get_post(id, request = null, args = null) {
        return await fetch(`https://www.gamingonlinux.com/${id}`)
            .then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/html"))
            .then(dom => ({
                author: "GamingOnLinux",
                title: dom.head.querySelector("meta[property='og:title']").content,
                url: dom.head.querySelector("meta[property='og:url']").content,
                id: id,
                dt: null,
                image: "/images/bitmap_dark.png",
                page: "/discover/gaming-on-linux/" + id,
            }))
            .catch(err => null);
    }

    return {
        get_posts: get_posts,
        get_post: get_post
    }
}