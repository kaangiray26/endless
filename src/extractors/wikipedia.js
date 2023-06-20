// Name: Wikipedia
// Type: Extractor
// Description: en.wikipedia.org extractor

import { CapacitorHttp } from '@capacitor/core';

class extractor {
    async get_posts() {
        return await CapacitorHttp.get({
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
                points: 0,
                image: "/favicon.svg",
                page: "/discover/wikipedia/" + post.id,
            })))
            .catch(err => []);
    }

    async get_post(id) {
        return await CapacitorHttp.get({
            url: `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=info&pageids=${id}`
        })
            .then(res => res.data)
            .then(data => data.query.pages[String(id)])
            .catch(err => null);
    }
}

export { extractor }
