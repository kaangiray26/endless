import path from "path";
import express from "express";
import cors from "cors";
import { fileURLToPath } from 'url';
import db from "./js/db.js";

// Path
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Express
const app = express()
const www = path.join(__dirname, "../www")

// Middleware
app.use(cors({ credentials: true, origin: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/about", express.static(www))

// Routes
app.get("/", db.get_specs)
app.get("/posts", db.posts)
app.post("/upvotes", db.upvotes)
app.post("/comments", db.comments)

// Error Handling
app.use((req, res, next) => {
    res.redirect("/")
})

app.listen(process.env.port, '0.0.0.0', () => {
    db.init();
    console.log("\x1b[32m%s\x1b[0m", `..: Server:    http://0.0.0.0:${process.env.port}/ :..`);
});
