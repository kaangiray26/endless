const extractor = () => {
    async function get_posts(page = 1, request = null, args = null) {
        if (page > 1) {
            return [];
        }

        return await fetch("https://open.spotify.com/playlist/37i9dQZEVXbNG2KDcFcKOF")
            .then(res => res.text())
            .then(str => new DOMParser().parseFromString(str, "text/html"))
            .then(dom => dom.querySelector("script#initial-state"))
            .then(script => script.innerHTML)
            .then(b64 => atob(b64))
            .then(str => JSON.parse(str))
            .then(json => Object.values(json.entities.items)[0].content.items)
            .then(items => items.map(item => ({
                title: item.itemV2.data.name,
                author: item.itemV2.data.artists.items[0].profile.name,
                url: "https://open.spotify.com/track/" + item.itemV2.data.uri.split("spotify:track:").pop(),
                id: item.itemV2.data.uri,
                dt: null,
                image: item.itemV2.data.albumOfTrack.coverArt.sources[0].url,
                page: "/discover/spotify/" + item.itemV2.data.uri
            })))
            .catch(err => null);
    }

    async function get_post() {
        return null;
    }

    return {
        get_posts: get_posts,
        get_post: get_post
    }
}