const express = require("express");
const app = express();
app.use(express.json());
const {
    handleCustomErrors,
    handlePsqlErrors,
    handleServerErrors,
  } = require('./errors');

const {
  getAllTopics,
  getAllEndpoints,
} = require("./controllers/topicsController");
const { getArticleById, getAllArticles, getCommentsByArticleId,postCommentByArticleId, patchArticleById } = require("./controllers/articlesController");

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api", getAllEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);


app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "URL not found" });
});

//Error handling
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);


module.exports = app;
