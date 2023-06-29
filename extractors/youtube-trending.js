const extractor = () => {
    async function get_posts(page = 1, request = null, args = null) {
        return await fetch("https://m.youtube.com/feed/trending", {
            headers: {
                UserAgent: "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36"
            }
        })
            .then(response => response.text())
            .then(str => new DOMParser().parseFromString(str, "text/html"))
            .then(dom => [...dom.querySelectorAll("script")])
            .then(scripts => scripts.filter(script => script.text.startsWith('var ytInitialData')).pop())
            .then(script => JSON.parse(new Function(script.innerHTML + "return ytInitialData")()))
            .then(data => data.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents)
            .then(items => items.map(item => ({
                title: item.itemSectionRenderer.contents[0].videoWithContextRenderer.headline.runs[0].text,
                author: item.itemSectionRenderer.contents[0].videoWithContextRenderer.shortBylineText.runs[0].text,
                url: "https://m.youtube.com/watch?v=" + item.itemSectionRenderer.contents[0].videoWithContextRenderer.navigationEndpoint.watchEndpoint.videoId,
                id: item.itemSectionRenderer.contents[0].videoWithContextRenderer.navigationEndpoint.watchEndpoint.videoId,
                dt: null,
                image: item.itemSectionRenderer.contents[0].videoWithContextRenderer.thumbnail.thumbnails.slice(-1)[0].url,
                page: "/discover/youtube/" + item.itemSectionRenderer.contents[0].videoWithContextRenderer.navigationEndpoint.watchEndpoint.videoId,
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