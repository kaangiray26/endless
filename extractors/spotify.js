// Uses https://github.com/kaangiray26/noauth to get the data from Spotify without authentication

const extractor = () => {
    async function auth() {
        let re = /<script id="session" data-testid="session" type="application\/json"\>({.*})<\/script>/;
        let response = await fetch("https://open.spotify.com/search")
            .then(res => res.text())
            .then(str => str.match(re)[1])
            .then(json => JSON.parse(json))
            .catch(err => null);

        if (!response) {
            return null;
        }

        return {
            accessToken: response.accessToken,
            clientId: response.clientId
        }
    }

    async function get_posts(page = 1, request = null, args = null) {
        return [];
    }

    async function get_post(id, request = null, args = null) {
        let credentials = await auth();

        if (id.startswith("albums")) {
            return await request.get({
                url: `https://api.spotify.com/v1/${id}`,
                headers: {
                    Authorization: `Bearer ${credentials.accessToken}`,
                }
            })
                .then(res => res.data)
                .then(item => ({
                    title: item.name,
                    author: item.artists[0].name,
                    url: item.external_urls.spotify,
                    id: item.type + "s/" + item.id,
                    dt: item.release_date,
                    image: item.images[0].url,
                    page: "/discover/spotify/" + item.type + "s/" + item.id,
                }))
        }

        if (id.startsWith("artists")) {
            return await request.get({
                url: `https://api.spotify.com/v1/${id}`,
                headers: {
                    Authorization: `Bearer ${credentials.accessToken}`,
                }
            })
                .then(res => res.data)
                .then(item => ({
                    title: "Artist",
                    author: item.name,
                    url: item.external_urls.spotify,
                    id: item.type + "s/" + item.id,
                    dt: null,
                    image: item.images[0].url,
                    page: "/discover/spotify/" + item.type + "s/" + item.id,
                }))
        }

        if (id.startsWith("playlists")) {
            return await request.get({
                url: `https://api.spotify.com/v1/${id}`,
                headers: {
                    Authorization: `Bearer ${credentials.accessToken}`,
                }
            })
                .then(res => res.data)
                .then(item => ({
                    title: item.name,
                    author: item.owner.display_name,
                    url: item.external_urls.spotify,
                    id: item.type + "s/" + item.id,
                    dt: null,
                    image: item.images[0].url,
                    page: "/discover/spotify/" + item.type + "s/" + item.id,
                }))
        }

        if (id.startsWith("tracks")) {
            return await request.get({
                url: `https://api.spotify.com/v1/${id}`,
                headers: {
                    Authorization: `Bearer ${credentials.accessToken}`,
                }
            })
                .then(res => res.data)
                .then(item => ({
                    title: item.name,
                    author: item.artists[0].name,
                    url: item.external_urls.spotify,
                    id: item.type + "s/" + item.id,
                    dt: item.release_date,
                    image: item.images[0].url,
                    page: "/discover/spotify/" + item.type + "s/" + item.id,
                }))
        }
    }

    return {
        get_posts: get_posts,
        get_post: get_post
    }
}