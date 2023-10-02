const express = require("express");
const app = express();

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
app.use((err, req, res, next)=>{
    if(err.code === '22P02')
    res.status(400).send({msg: "Bad request"})
    next(err);
  })

app.use((err, req, res, next) => {
    if(err.status) res.status(err.status).send({msg: err.msg});
    else next(err);
});


module.exports = app;
