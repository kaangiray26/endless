// This is for my girlfriend, she loves kpop <3

const extractor = () => {
    async function get_posts(page = 1, request = null, args = null) {
        let url = "https://www.koreaboo.com/news/"
        if (page >= 1) {
            url = "https://www.koreaboo.com/news/page/" + page + "/"
        }
        return await fetch(url)
            .then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/html"))
            .then(dom => [...dom.querySelectorAll("article")])
            .then(items => items.map(item => ({
                title: item.querySelector(".ap-chron-medium-title").innerText,
                author: "Koreaboo",
                url: "https://www.koreaboo.com" + item.querySelector("a").pathname,
                id: item.querySelector("a").pathname,
                dt: item.querySelector("time").dateTime,
                image: item.querySelector("img").dataset.srcset.split(",").slice(-1)[0].split(" ")[0],
                page: "/discover/koreaboo" + item.querySelector("a").pathname
            })))
            .catch(err => []);
    }

    async function get_post(id, request = null, args = null) {
        return await fetch("https://www.koreaboo.com" + id)
            .then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/html"))
            .then(dom => dom.querySelector("article"))
            .then(item => ({
                title: item.querySelector("h1").innerText,
                author: "Koreaboo",
                url: "https://www.koreaboo.com" + id,
                id: id,
                dt: item.querySelector("time").dateTime,
                image: item.querySelector("img").src,
                page: "/discover/koreaboo" + id
            }))
            .catch(err => null)
    }

    return {
        get_posts: get_posts,
        get_post: get_post
    }
}