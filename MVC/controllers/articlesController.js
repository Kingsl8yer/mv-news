const {selectArticleById, selectAllArticles, selectCommentsByArticleId,
    insertCommentByArticleId } = require('../models/articlesModels');

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    selectArticleById(article_id)
    .then(article => {
        res.status(200).send({article});
    })
    .catch(next);
}

exports.getAllArticles = (req, res, next) => {
    selectAllArticles()
    .then(articles => {
        res.status(200).send({articles});
    })
    .catch(next);
}

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;

    const promises = [selectArticleById(article_id)];
    if (article_id) promises.push(selectCommentsByArticleId(article_id));
    Promise.all(promises)
    .then(([article, comments]) => {
        res.status(200).send(comments);
    })
    .catch((err) => {
        next(err);
    });
}

exports.postCommentByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    const {username, body} = req.body;
    const promises = [selectArticleById(article_id)];
    if (article_id) promises.push(insertCommentByArticleId(article_id, username, body));
    Promise.all(promises)
    .then(([article, comment]) => {
        res.status(201).send(comment);
    })
    .catch((err) => {
        next(err);
    })
}
