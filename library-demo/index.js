const express = require("express");
require("dotenv").config({ path: ".env" });

const authorRoute = require("./routes/author.routes");
const booksRoute = require("./routes/books.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to Library Demo!" });
});

app.use("/authors", authorRoute);
app.use("/books", booksRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
