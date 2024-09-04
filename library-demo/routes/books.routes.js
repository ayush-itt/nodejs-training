const express = require("express");
const router = express.Router();
let books = require("../data/books.json");

router.get("/", (req, res) => {
    res.json(books);
});

router.get("/:id", (req, res) => {
    const book = books.find((a) => a.id === parseInt(req.params.id));

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
});

module.exports = router;
