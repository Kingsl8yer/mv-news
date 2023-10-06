const articleRouter = require("express").Router();

const {
    getArticleById,
    getAllArticles,
    getCommentsByArticleId,
    postCommentByArticleId,
    patchArticleById,
    postArticle
} = require("../controllers/articlesController");

articleRouter.route("/").get(getAllArticles).post(postArticle);

articleRouter.route("/:article_id").get(getArticleById).patch(patchArticleById);

articleRouter.route("/:article_id/comments").get(getCommentsByArticleId).post(postCommentByArticleId);

module.exports = articleRouter;