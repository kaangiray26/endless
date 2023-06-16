// Name: Hacker News
// Type: Extractor
// Description: news.ycombinator.com extractor

class extractor {
    async get_posts() {
        return await fetch("https://hn.algolia.com/api/v1/search?tags=front_page&attributesToRetrieve=objectID,author,created_at_i,points,title,url&hitsPerPage=12")
            .then(res => res.json())
            .then(data => data.hits)
            .catch(err => []);
    }

    async get_post(id) {
        return await fetch(`https://hn.algolia.com/api/v1/items/${id}`)
            .then(res => res.json())
            .catch(err => null);
    }
}

export { extractor }
