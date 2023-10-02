const db = require('../../db/connection');

exports.selectArticleById = (article_id) => {
    const sql = 'SELECT * FROM articles WHERE article_id = $1';
    return db.query(sql, [article_id]).then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Article not found'});
        } else {
            return rows;
        }
    });
}