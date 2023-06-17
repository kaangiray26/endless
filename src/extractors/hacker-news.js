// Name: Hacker News
// Type: Extractor
// Description: news.ycombinator.com extractor

class extractor {
    async get_posts(page = 0) {
        return await fetch(`https://hn.algolia.com/api/v1/search?tags=front_page&attributesToRetrieve=objectID,author,created_at_i,points,title,url&hitsPerPage=12&page=${page}`)
            .then(res => res.json())
            .then(data => data.hits)
            .catch(err => []);
    }

    async get_post(id) {
        return await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            .then(res => res.json())
            .catch(err => null);
    }

    async get_comments(ids) {
        return await Promise.all(ids.map(id => this.get_comment(id)));
    }

    async get_comment(id) {
        return await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            .then(res => res.json())
            .then(data => ({
                author: data.by,
                text: data.text,
            }))
            .catch(err => null);
    }
}

export { extractor }
