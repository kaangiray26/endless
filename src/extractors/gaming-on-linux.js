// Name: GamingOnLinux
// Type: Extractor
// Description: www.gamingonlinux.com/article_rss.php extractor

class extractor {
    async get_posts(page = 1) {
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

    async get_post(id) {
        return await fetch(`https://www.gamingonlinux.com/${id}`)
            .then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/html"))
            .then(dom => ({
                author: "GamingOnLinux",
                title: dom.head.querySelector("meta[property='og:title']").content,
                url: dom.head.querySelector("meta[property='og:url']").content,
                id: id,
                dt: null,
                image: "/favicon.svg",
                page: "/discover/gaming-on-linux" + id,
            }))
            .catch(err => null);
    }
}

export { extractor }