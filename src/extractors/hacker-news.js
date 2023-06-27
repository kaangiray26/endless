// Name: Hacker News
// Type: Extractor
// Description: news.ycombinator.com extractor

class extractor {
    async get_posts(page = 1) {
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
                points: post.nextSibling.querySelector(".score") ? post.nextSibling.querySelector(".score").innerText.split(" ")[0] : null,
                image: "/favicon.svg",
                page: "/discover/hacker-news/" + post.id
            })))
            .catch(err => []);
    }

    async get_post(id) {
        return await fetch(`https://news.ycombinator.com/item?id=${id}`)
            .then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/html"))
            .then(dom => ({
                title: dom.querySelector(".titleline > a").innerText,
                author: dom.querySelector(".hnuser").innerText,
                url: dom.querySelector(".titleline > a").href,
                id: id,
                dt: dom.querySelector(".age").title,
                image: "/favicon.svg",
                page: "/discover/hacker-news/" + id
            }))
    }

    async get_comments(ids) {
        return await Promise.all(ids.map(id => this.get_comment(id)));
    }

    async get_comment(id) {
        return await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            .then(res => res.json())
            .then(data => ({
                author: data.by,
                text: data.text,
            }))
            .catch(err => null);
    }
}

export { extractor }
