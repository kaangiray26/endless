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
                url: "https://www.koreaboo.com/news" + item.querySelector("a").pathname,
                id: item.querySelector("a").pathname,
                dt: item.querySelector("time").dateTime,
                image: item.querySelector("img").src,
                page: "/discover/koreaboo" + item.querySelector("a").pathname
            })))
    }

    async function get_post(id, request = null, args = null) {
        //
    }

    return {
        get_posts: get_posts,
        get_post: get_post
    }
}