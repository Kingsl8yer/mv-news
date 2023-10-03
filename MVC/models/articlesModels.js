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

exports.selectAllArticles = () => {
  const sql = `SELECT articles.article_id, articles.title, articles.topic, 
    articles.author, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id) AS comment_count FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`;
  return db.query(sql).then(({ rows }) => {
    return rows;
  });
};

exports.selectCommentsByArticleId = (article_id) => {
    const sql = `SELECT comment_id, votes, created_at, author, body, article_id FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;`;
    return db.query(sql, [article_id]).then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({status: 200, msg: 'Comments not found'});
        } else {
            return rows;
        }
    });
}