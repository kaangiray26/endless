const extractor = () => {
    async function get_posts(page = 1, request = null, args = null) {
        return await request.get({
            url: "https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=12&format=json"
        })
            .then(res => res.data)
            .then(data => data.query.random)
            .then(posts => posts.map(post => ({
                title: post.title,
                author: "Wikipedia",
                url: `https://en.m.wikipedia.org/?curid=${post.id}`,
                id: post.id,
                dt: null,
                image: "/favicon.svg",
                page: "/discover/wikipedia/" + post.id,
            })))
            .catch(err => []);
    }

    async function get_post(id, request = null, args = null) {
        return await request.get({
            url: `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=info&pageids=${id}`
        })
            .then(res => res.data)
            .then(data => data.query.pages[String(id)])
            .then(post => ({
                title: post.title,
                author: "Wikipedia",
                url: "https://en.wikipedia.org/?curid=" + id,
                id: id,
                dt: null,
                image: "/favicon.svg",
                page: "/discover/wikipedia/" + id,
            }))
            .catch(err => null);
    }

    return {
        get_posts: get_posts,
        get_post: get_post
    }
}