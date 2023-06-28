// db.js
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import pgPromise from 'pg-promise';
import { fileURLToPath } from 'url';

// Path
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Use environment settings to connect to database.
const pgp = pgPromise();

const db = pgp({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
});

async function init() {
    // Create tables if they don't exist.
    db.tx('create-tables', async (t) => {
        return t.batch([
            // upvotes
            t.none("CREATE TABLE IF NOT EXISTS upvotes(id SERIAL PRIMARY KEY, post TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW(), identifier TEXT NOT NULL, UNIQUE(post, identifier))"),

            // comments
            t.none("CREATE TABLE IF NOT EXISTS comments(id SERIAL PRIMARY KEY, post TEXT NOT NULL, comment TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW(), identifier TEXT NOT NULL, UNIQUE(post, identifier))"),
        ])
    }).then(() => {
        console.log("\x1b[32m%s\x1b[0m", "..: Database:  Connected :..");
    })
}

async function get_specs(req, res, next) {
    let dt = new Date();
    let upposts_count = await db.one("SELECT COUNT(*) FROM upvotes");
    let comments_count = await db.one("SELECT COUNT(*) FROM comments");

    let last_added_upvote = await db.oneOrNone("SELECT post, created_at FROM upvotes ORDER BY created_at DESC LIMIT 1");
    let last_added_comment = await db.oneOrNone("SELECT post, comment, created_at FROM comments ORDER BY created_at DESC LIMIT 1");

    let specs = {
        "name": "Endless Server",
        "github": "https://github.com/kaangiray26/endless",
        "version": process.env.version,
        "uptime": process.uptime(),
        "time": dt.toUTCString(),
        "upvotes_count": upposts_count.count,
        "comments_count": comments_count.count,
        "last_added_upvote": last_added_upvote,
        "last_added_comment": last_added_comment
    }

    res.status(200).json(specs);
}

async function posts(req, res, next) {
    if (!req.query.sort) {
        res.status(400).json({
            "success": false,
            "error": "No sort provided."
        })
        return;
    }

    if (req.query.sort == "top") {
        db.task(async t => {
            let posts = await t.manyOrNone("SELECT post, COUNT(*) FROM upvotes GROUP BY post ORDER BY COUNT(*) DESC LIMIT 10");

            res.status(200).json({
                "success": true,
                "posts": posts
            })
        }).catch(error => {
            res.status(500).json({
                "success": false,
                "error": error
            })
        })
        return
    }

    if (req.query.sort == "new") {
        db.task(async t => {
            let posts = await t.manyOrNone("SELECT post, MAX(created_at) AS last_created_at FROM (SELECT post, created_at FROM upvotes UNION ALL SELECT post, created_at FROM comments) AS combined GROUP BY post ORDER BY last_created_at DESC LIMIT 10;");

            res.status(200).json({
                "success": true,
                "posts": posts
            })
        }).catch(error => {
            res.status(500).json({
                "success": false,
                "error": error
            })
        })
        return
    }

    if (req.query.sort == "controversial") {
        db.task(async t => {
            let posts = await t.manyOrNone("SELECT post, COUNT(*) FROM comments GROUP BY post ORDER BY COUNT(*) DESC LIMIT 10");

            res.status(200).json({
                "success": true,
                "posts": posts
            })
        }).catch(error => {
            res.status(500).json({
                "success": false,
                "error": error
            })
        })
        return
    }

    if (req.query.sort == "hot") {
        db.task(async t => {
            let posts = await t.manyOrNone("SELECT post, COUNT(*) FROM upvotes WHERE created_at >= NOW() - INTERVAL '1 day' GROUP BY post ORDER BY COUNT(*) DESC LIMIT 10");

            res.status(200).json({
                "success": true,
                "posts": posts
            })
        }).catch(error => {
            res.status(500).json({
                "success": false,
                "error": error
            })
        })
        return
    }
}

async function upvotes(req, res, next) {
    if (!req.body.action) {
        res.status(400).json({
            "success": false,
            "error": "No action provided."
        })
        return;
    }

    if (!req.body.id) {
        res.status(400).json({
            "success": false,
            "error": "No ID provided."
        })
        return;
    }

    if (req.body.action == "get") {
        db.task(async t => {
            let upvotes = await t.one("SELECT COUNT(*) FROM upvotes WHERE post = $1", [req.body.id]);

            res.status(200).json({
                "success": true,
                "points": upvotes.count
            })
        }).catch(error => {
            res.status(500).json({
                "success": false,
                "error": error
            })
        })
        return
    }

    if (req.body.action == "add") {
        let identifier = uuidv4();
        db.task(async t => {
            await t.none("INSERT INTO upvotes(post, identifier) VALUES($1,$2)", [req.body.id, identifier]);

            res.status(200).json({
                "success": true,
                "identifier": identifier
            })
        }).catch(error => {
            res.status(500).json({
                "success": false,
                "error": error
            })
        })
        return
    }

    if (req.body.action == "remove") {
        if (!req.body.identifier) {
            res.status(400).json({
                "success": false,
                "error": "No identifier provided."
            })
            return
        }

        db.task(async t => {
            let upvote = await t.oneOrNone("DELETE FROM upvotes WHERE post = $1 AND identifier = $2 RETURNING id", [req.body.id, req.body.identifier]);
            if (!upvote) {
                res.status(400).json({
                    "success": false,
                    "error": "Upvote not found."
                })
                return
            }

            res.status(200).json({
                "success": true
            })
        }).catch(error => {
            res.status(500).json({
                "success": false,
                "error": error
            })
        })
        return
    }
}

async function comments(req, res, next) {
    if (!req.body.action) {
        res.status(400).json({
            "success": false,
            "error": "No action provided."
        })
        return;
    }

    if (!req.body.id) {
        res.status(400).json({
            "success": false,
            "error": "No ID provided."
        })
        return;
    }

    if (req.body.action == "get") {
        let offset = req.body.offset || 0;

        db.task(async t => {
            let comments = await t.manyOrNone("SELECT comment, created_at FROM comments WHERE post = $1 ORDER BY created_at DESC LIMIT 12 OFFSET $2", [req.body.id, offset]);

            res.status(200).json({
                "success": true,
                "comments": comments,
                "offset": offset
            })
        }).catch(error => {
            res.status(500).json({
                "success": false,
                "error": error
            })
        })
        return
    }

    if (req.body.action == "add") {
        if (!req.body.comment.length) {
            res.status(400).json({
                "success": false,
                "error": "No comment provided."
            })
            return
        }

        let identifier = uuidv4();
        db.task(async t => {
            await t.none("INSERT INTO comments(post, comment, identifier) VALUES($1, $2, $3)", [req.body.id, req.body.comment, identifier]);

            res.status(200).json({
                "success": true,
                "identifier": identifier
            })
        }).catch(error => {
            res.status(500).json({
                "success": false,
                "error": error
            })
        })
        return
    }

    if (req.body.action == "remove") {
        if (!req.body.identifier) {
            res.status(400).json({
                "success": false,
                "error": "No identifier provided."
            })
            return
        }

        db.task(async t => {
            let upvote = await t.oneOrNone("DELETE FROM comments WHERE post = $1 AND identifier = $2 RETURNING id", [req.body.id, req.body.identifier]);
            if (!upvote) {
                res.status(400).json({
                    "success": false,
                    "error": "Comment not found."
                })
                return
            }

            res.status(200).json({
                "success": true
            })
        })
        return
    }
}

const exports = {
    init,
    get_specs,
    upvotes,
    comments,
    posts
}

export default exports;