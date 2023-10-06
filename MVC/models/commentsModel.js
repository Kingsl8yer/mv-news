const db = require("../../db/connection");

exports.eliminateCommentById = (comment_id) => {
  if(!comment_id) return Promise.reject({status: 400, msg: 'Bad request'});
  const query = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`;
    return db.query(query, [comment_id]).then((result) => {
        if (result.rows.length === 0) return Promise.reject({status: 404, msg: 'Comment not found'});
        else return result.rows[0];
    });
}

exports.updateCommentById = (comment_id, inc_votes) => {
  if(!comment_id || !inc_votes) return Promise.reject({status: 400, msg: 'Bad request'});
  const query = `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`;
      return db.query(query, [inc_votes, comment_id]).then((result) => {
          if (result.rows.length === 0) return Promise.reject({status: 404, msg: 'Comment not found'});
          else return result.rows[0];
      });
}