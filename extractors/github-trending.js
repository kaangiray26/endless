const extractor = () => {
    async function get_posts(page = 1, request = null, args = null) {
        if (page == 1) {
            return await fetch("https://github.com/trending?since=daily")
                .then(res => res.text())
                .then(str => new DOMParser().parseFromString(str, "text/html"))
                .then(dom => [...dom.querySelectorAll("article")])
                .then(items => items.map(item => ({
                    title: [...item.querySelector("h2 a").childNodes].slice(-1)[0].textContent.trim(),
                    author: [...item.querySelector("h2 a").childNodes].slice(-2)[0].innerText,
                    url: "https://github.com" + item.querySelector("h2 a").pathname,
                    id: item.querySelector("h2 a").pathname,
                    dt: null,
                    image: "/images/bitmap_dark.png",
                    page: "/discover/github" + item.querySelector("h2 a").pathname
                })))
        }
        return [];
    }

    async function get_post(id, request = null, args = null) {
        return null;
    }

    return {
        get_posts: get_posts,
        get_post: get_post
    }
}