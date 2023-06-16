// Name: Cumhuriyet
// Type: Extractor
// Description: www.cumhuriyet.com.tr/rss extractor

class extractor {
    async get_posts() {
        return await fetch("https://www.cumhuriyet.com.tr/rss")
            .then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
            .then(dom => [...dom.querySelectorAll("item")])
            .catch(err => []);
    }

    async get_post(id) {
        return await fetch(`https://www.cumhuriyet.com.tr/${id}`)
            .then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/html"))
            .then(dom => ({
                author: "Cumhuriyet",
                title: dom.head.querySelector("meta[property='og:title']").content,
                url: dom.head.querySelector("meta[property='og:url']").content,
                id: id,
                dt: null,
                points: 0,
                comments: []
            }))
            .catch(err => null);
    }
}

export { extractor }