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
            .then(data => data.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents.slice(0, -1))
            .then(items => items.map(item => item.itemSectionRenderer.contents[0]))
            .then(items => items.filter(item => item.videoWithContextRenderer))
            .then(items => items.map(item => ({
                title: item.videoWithContextRenderer.headline.runs[0].text,
                author: item.videoWithContextRenderer.shortBylineText.runs[0].text,
                url: "https://m.youtube.com/watch?v=" + item.videoWithContextRenderer.navigationEndpoint.watchEndpoint.videoId,
                id: item.videoWithContextRenderer.navigationEndpoint.watchEndpoint.videoId,
                dt: null,
                image: item.videoWithContextRenderer.thumbnail.thumbnails.slice(-1)[0].url,
                page: "/discover/youtube/" + item.videoWithContextRenderer.navigationEndpoint.watchEndpoint.videoId,
            })))
    }

    async function get_post(id, request = null, args = null) {
        return null
    }

    return {
        get_posts: get_posts,
        get_post: get_post
    }
}