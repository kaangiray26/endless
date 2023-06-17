// Name: GamingOnLinux
// Type: Extractor
// Description: www.gamingonlinux.com/article_rss.php extractor

class extractor {
    async get_posts() {
        return await fetch("https://www.gamingonlinux.com/article_rss.php")
            .then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
            .then(dom => [...dom.querySelectorAll("item")])
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
                points: 0,
                image: "/favicon.svg",
                page: "/discover/gaming-on*linux/" + id,
                comments: []
            }))
            .catch(err => null);
    }
}

export { extractor }