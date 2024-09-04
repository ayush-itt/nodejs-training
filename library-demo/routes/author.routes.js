const express = require("express");
const router = express.Router();
let authors = require("../data/authors.json");

router.get("/", (req, res) => {
    res.json(authors);
});

router.get("/:id", (req, res) => {
    const author = authors.find((a) => a.id === parseInt(req.params.id));

    if (!author) {
        return res.status(404).json({ message: "Author not found" });
    }

    res.json(author);
});

router.post("/", (req, res) => {
    const newAuthor = {
        id: authors.length + 1,
        name: req.body.name.trim(),
    };

    authors.push(newAuthor);
    res.status(201).json(newAuthor);
});

module.exports = router;
