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
        let credentials = await auth();

        return await request.get({
            url: `https://api.spotify.com/v1/browse/new-releases?limit=12&offset=${(page - 1) * 12}`,
            headers: {
                Authorization: `Bearer ${credentials.accessToken}`,
            }
        })
            .then(res => res.data)
            .then(data => JSON.parse(data))
            .then(json => json.albums.items)
            .then(items => items.map(item => ({
                title: item.name,
                author: item.artists[0].name,
                url: item.external_urls.spotify,
                id: item.type + "s/" + item.id,
                dt: item.release_date,
                image: item.images[0].url,
                page: "/discover/spotify/" + item.type + "s/" + item.id,
            })))
            .catch(err => []);
    }

    async function get_post() {
        return null;
    }

    return {
        get_posts: get_posts,
        get_post: get_post
    }
}