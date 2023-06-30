const extractor = () => {
    async function get_posts(page = 1, request = null, args = null) {
        return await fetch(`https://news.ycombinator.com/news?p=${page}`)
            .then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/html"))
            .then(dom => [...dom.querySelectorAll(".athing")])
            .then(posts => posts.map(post => ({
                title: post.querySelector(".titleline>a").innerText,
                author: post.nextSibling.querySelector(".hnuser") ? post.nextSibling.querySelector(".hnuser").innerText : null,
                url: post.querySelector(".titleline>a").href,
                id: post.id,
                dt: post.nextSibling.querySelector(".age").title,
                image: "/images/bitmap_dark.png",
                page: "/discover/hacker-news/" + post.id
            })))
            .catch(err => []);
    }

    async function get_post(id, request = null, args = null) {
        return await fetch(`https://news.ycombinator.com/item?id=${id}`)
            .then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/html"))
            .then(dom => ({
                title: dom.querySelector(".titleline > a").innerText,
                author: dom.querySelector(".hnuser").innerText,
                url: dom.querySelector(".titleline > a").href,
                id: id,
                dt: dom.querySelector(".age").title,
                image: "/images/bitmap_dark.png",
                page: "/discover/hacker-news/" + id
            }))
    }

    return {
        get_posts: get_posts,
        get_post: get_post
    }
}
