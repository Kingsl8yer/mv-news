const db = require("../../db/connection");
const { selectAllTopics } = require("./topicsModel");

exports.selectArticleById = (article_id) => {
  const sql = `SELECT articles.article_id, articles.title, articles.topic,
  articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url,
  COUNT(comments.comment_id) AS comment_count FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id;`;
  return db.query(sql, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    } else {
      return rows[0];
    }
  });
};

exports.selectAllArticles = (topic, sort_by, order) => {
  const topicsPromiseArray = selectAllTopics().then((topics) => {
    return topics.map((topic) => topic.slug);
  });

  const orderAux = ["asc", "desc"];
  const sort_byAux = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];

  let sql = `SELECT articles.article_id, articles.title, articles.topic, 
        articles.author, articles.created_at, articles.votes, articles.article_img_url, 
        COUNT(comments.comment_id) AS comment_count FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id`;

  return Promise.all([topicsPromiseArray]).then(([topics]) => {
    if (topic && !topics.includes(topic)) {
      return Promise.reject({ status: 404, msg: "Topic not found" });
    } else if (topic && topics.includes(topic)) {
      sql += ` WHERE articles.topic = '${topic}'`;
    }

    if (sort_by && !sort_byAux.includes(sort_by)) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    } else if (sort_by && sort_byAux.includes(sort_by)) {
      sql += ` GROUP BY articles.article_id ORDER BY ${sort_by}`;
    } else {
      sql += ` GROUP BY articles.article_id ORDER BY articles.created_at`;
    }

    if (order && !orderAux.includes(order)) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    } else if (order && orderAux.includes(order)) {
      sql += ` ${order.toUpperCase()}`;
    } else {
      sql += ` DESC;`;
    }

    return db.query(sql).then(({ rows }) => {
      return rows;
    });
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

exports.insertArticle = (title, body, topic, author, article_img_url) => {
    if (!title || !body || !topic || !author) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }
    const sql = `INSERT INTO articles (title, body, topic, author, article_img_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;`;
    return db
        .query(sql, [title, body, topic, author, article_img_url])
        .then(({ rows }) => {
        return rows[0];
        });
}

