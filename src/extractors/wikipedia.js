// Name: Wikipedia
// Type: Extractor
// Description: en.wikipedia.org extractor

class extractor {
    async get_posts() {
        console.log("Getting wikipedia posts...");
        return await fetch("https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=12&format=json")
            .then(res => res.json());
    }

    async get_post(id) {
        return await fetch(`https://hn.algolia.com/api/v1/items/${id}`)
            .then(res => res.json())
            .catch(err => null);
    }
}

export { extractor }
