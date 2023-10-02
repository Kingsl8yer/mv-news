const express = require("express");
const app = express();
const {
    handleCustomErrors,
    handlePsqlErrors,
    handleServerErrors,
  } = require('./errors');

const {
  getAllTopics,
  getAllEndpoints,
} = require("./controllers/topicsController");
const { getArticleById } = require("./controllers/articlesController");

app.get("/api/topics", getAllTopics);

app.get("/api", getAllEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "URL not found" });
});

//Error handling
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
