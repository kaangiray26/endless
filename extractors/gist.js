const extractor = () => {
    async function get_posts(page = 1, request = null, args = null) {
        return [];
    }

    async function get_post(id, request = null, args = null) {
        return await fetch("https://api.github.com/gists/" + id)
            .then(res => res.json())
            .then(data => ({
                title: data.description,
                author: data.owner.login,
                url: "https://gist.github.com/" + data.owner.login + "/" + id,
                id: id,
                dt: data.created_at,
                image: "/favicon.svg",
                page: "/discover/gist/" + id
            }))
            .catch(err => null);
    }

    return {
        get_posts: get_posts,
        get_post: get_post
    }
}