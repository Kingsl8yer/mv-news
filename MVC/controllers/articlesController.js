const {
  selectArticleById,
  selectAllArticles,
  selectCommentsByArticleId,
  insertCommentByArticleId,
  updateArticleById,
  insertArticle,
} = require("../models/articlesModels");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { topic, sort_by, order, limit = 10, p = 1 } = req.query;
  const promise1 = selectAllArticles(topic, sort_by, order, limit, p);
  const promise2 = selectAllArticles(topic, sort_by, order);
  Promise.all([promise1, promise2])
    .then(([articles, articles2]) => {
      res.status(200).send({ articles, total_count: articles2.length });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id} = req.params;
  const {limit = 10, p = 1} = req.query;

  const promise = [selectArticleById(article_id)];
  if (article_id) {
    promise.push(selectCommentsByArticleId(article_id, limit, p));
    promise.push(selectCommentsByArticleId(article_id));
  }
  Promise.all(promise)
    .then(([article, comments, comments2]) => {
      res.status(200).send({ comments, total_count: comments2.length });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  const promises = [selectArticleById(article_id)];
  if (article_id)
    promises.push(insertCommentByArticleId(article_id, username, body));
  Promise.all(promises)
    .then(([article, comment]) => {
      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const promises = [selectArticleById(article_id)];
  if (article_id) promises.push(updateArticleById(article_id, inc_votes));
  Promise.all(promises)
    .then(([article, updatedArticle]) => {
      res.status(200).send(updatedArticle);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticle = (req, res, next) => {
  const {
    title,
    body,
    topic,
    author,
    article_img_url = "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
  } = req.body;
  const promise1 = insertArticle(title, body, topic, author, article_img_url);
  Promise.all([promise1])
    .then(([article]) => {
      selectArticleById(article.article_id).then((article) => {
        res.status(201).send(article);
      });
    })
    .catch(next);
};
