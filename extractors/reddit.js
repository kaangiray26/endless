const extractor = () => {
    async function get_posts(page = 1, request = null, args = null) {
        if (page == 1) {
            return await request.get({
                url: "https://reddit.com/.json"
            })
                .then(res => res.data.data.children)
                .then(posts => posts.map(post => ({
                    title: post.data.title,
                    author: post.data.author,
                    url: "https://www.reddit.com" + post.data.permalink,
                    id: post.data.permalink,
                    dt: post.data.created,
                    image: post.data.thumbnail || "/favicon.svg",
                    page: "/discover/reddit" + post.data.permalink,
                    fullname: post.data.name
                })))
                .catch(err => []);
        }

        return await request.get({
            url: `https://reddit.com/.json?after=${args.fullname}`
        })
            .then(res => res.data.data.children)
            .then(posts => posts.map(post => ({
                title: post.data.title,
                author: post.data.author,
                url: "https://www.reddit.com" + post.data.permalink,
                id: post.data.permalink,
                dt: post.data.created,
                image: post.data.thumbnail || "/favicon.svg",
                page: "/discover/reddit" + post.data.permalink,
                fullname: post.data.name
            })))
            .catch(err => []);
    }

    async function get_post(id, request = null, args = null) {
        return await request.get({
            url: "https://www.reddit.com/" + id + "/.json"
        })
            .then(res => res.data[0].data.children[0])
            .then(post => ({
                title: post.data.title,
                author: post.data.author,
                url: post.data.url,
                id: post.data.permalink,
                dt: post.data.created,
                image: post.data.thumbnail || "/favicon.svg",
                page: "/discover/reddit" + post.data.permalink,
            }))
            .catch(err => null);
    }

    return {
        get_posts: get_posts,
        get_post: get_post
    }
}