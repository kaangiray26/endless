// utils.js

function get_server() {
    return JSON.parse(localStorage.getItem("server"));
}

async function get_comments(id, offset = 0) {
    let server = get_server();
    return await fetch(server + "/comments", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "id": id,
            "action": "get",
            "offset": offset
        }),
    })
        .then(res => res.json())
        .catch(err => null);
}

async function post_comments(id, comment) {
    let server = get_server();
    return await fetch(server + "/comments", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "id": id,
            "action": "add",
            "comment": comment
        })
    })
        .then(res => res.json())
        .catch(err => null);
}

async function get_upvotes(id) {
    let server = get_server();
    return await fetch(server + "/upvotes", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "id": id,
            "action": "get"
        }),
    })
        .then(res => res.json())
        .catch(err => null);
}

async function post_upvotes(id) {
    let server = get_server();
    return await fetch(server + "/upvotes", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "id": id,
            "action": "add"
        })
    })
        .then(res => res.json())
        .catch(err => null);
}

async function remove_upvotes(id, identifier) {
    let server = get_server();
    return await fetch(server + "/upvotes", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "id": id,
            "identifier": identifier,
            "action": "remove"
        })
    })
        .then(res => res.json())
        .catch(err => null);
}

async function remove_comments(id, identifier) {
    let server = get_server();
    return await fetch(server + "/comments", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "id": id,
            "identifier": identifier,
            "action": "remove"
        })
    })
        .then(res => res.json())
        .catch(err => null);
}

async function reload_extractors() {
    if (!localStorage.getItem("list")) {
        let response = fetch("https://kaangiray26.github.io/endless/list.json")
            .then(res => res.json())
            .catch(err => null);
        if (response) {
            localStorage.setItem("list", JSON.stringify(response));
        }
    }
}

export { get_server, get_upvotes, post_upvotes, remove_upvotes, get_comments, post_comments, remove_comments, reload_extractors }