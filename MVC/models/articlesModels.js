const db = require("../../db/connection");

exports.selectArticleById = (article_id) => {
  const sql = "SELECT * FROM articles WHERE article_id = $1";
  return db.query(sql, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    } else {
      return rows[0];
    }
  });
};

exports.selectAllArticles = (topic) => {
  const arrTopics = ["mitch", "cats", "paper"];

  let sql = `SELECT articles.article_id, articles.title, articles.topic, 
    articles.author, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id) AS comment_count FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`;

  if (topic && !arrTopics.includes(topic)) {
    return Promise.reject({ status: 404, msg: "Topic not found" });
  } else if (topic && arrTopics.includes(topic)) {
    sql = `SELECT articles.article_id, articles.title, articles.topic, 
            articles.author, articles.created_at, articles.votes, articles.article_img_url, 
            COUNT(comments.comment_id) AS comment_count FROM articles
            LEFT JOIN comments ON articles.article_id = comments.article_id
            WHERE articles.topic = '${topic}'
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC ;`;
  }

  return db.query(sql).then(({ rows }) => {
    if (rows.length === 0 && topic) {
      return Promise.reject({ status: 200, msg: "No articles found" });
    }
    return rows;
  });
};

exports.selectCommentsByArticleId = (article_id) => {
  const sql = `SELECT comment_id, votes, created_at, author, body, article_id FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;`;
  return db.query(sql, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 200, msg: "Comments not found" });
    } else {
      return rows;
    }
  });
};

exports.insertCommentByArticleId = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  const sql = `INSERT INTO comments (author, body, article_id)
        VALUES ($1, $2, $3)
        RETURNING *;`;
  return db.query(sql, [username, body, article_id]).then(({ rows }) => {
    return rows[0];
  });
};

exports.updateArticleById = (article_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  const sql = `UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`;
  return db.query(sql, [inc_votes, article_id]).then(({ rows }) => {
    return rows[0];
  });
};
