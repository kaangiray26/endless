const extractor = () => {
    async function get_posts(page = 1, request = null, args = null) {
        return await fetch("https://www.quantamagazine.org/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                operationName: "getPostPageArchive",
                query: "query getPostPageArchive($slug: String, $offset: Int, $type: String) {\n    response: getPostPageArchive(slug: $slug, offset: $offset, type: $type) {\n      data {\n        ... on Post {\n          id\n          title\n          excerpt\n          link\n          slug\n          disqus\n          date\n          authors {\n            name\n          }\n          acf {\n            featured_image_default {\n              ...ImageFields\n            }\n          }\n        }\n      }\n    }\n  }\n\n  fragment ImageFields on Image {\n    alt\n    caption\n    url\n    width\n    height\n  }\n",
                variables: {
                    offset: String(page),
                    type: "archive"
                }
            })
        })
            .then(res => res.json())
            .then(json => json.data.response.data)
            .then(posts => posts.map(post => ({
                title: post.title,
                author: post.authors[0].name,
                url: post.link,
                id: post.id,
                dt: post.date,
                image: post.acf.featured_image_default.url,
                page: "/discover/quanta-magazine/" + post.slug,
            })))
            .catch(err => null);
    }

    async function get_post(id) {
        return await fetch("https://www.quantamagazine.org/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                operationName: "getPostPageArchive",
                query: "query getPostPageArchive($slug: String, $offset: Int) {\n  response: getPostPageArchive(slug: $slug, offset: $offset) {\n    data {\n      ... on Post {\n        id\n        date\n        status\n        title\n        content\n        excerpt\n        link\n        slug\n        disqus\n        authors {\n          name\n        }\n        acf {\n          featured_image_default {\n            ...ImageFields\n          }\n        }\n      }\n    }\n  }\n}\nfragment ImageFields on Image {\n  alt\n  caption\n  url\n  width\n  height\n}\n",
                variables: {
                    slug: id,
                }
            })
        })
            .then(res => res.json())
            .then(json => json.data.response.data.pop())
            .then(post => ({
                title: post.title,
                author: post.authors[0].name,
                url: post.link,
                id: post.id,
                dt: post.date,
                image: post.acf.featured_image_default.url,
                page: "/discover/quanta-magazine/" + post.slug,
            }))
            .catch(err => null);
    }

    return {
        get_posts: get_posts,
        get_post: get_post
    }
}