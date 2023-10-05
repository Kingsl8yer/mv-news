const db = require("../../db/connection");

exports.selectAllUsers = () => {
  const query = `SELECT username, name, avatar_url  FROM users;`;
  return db.query(query).then(({ rows }) => {
    return rows;
  });
};

exports.selectUserByUsername = (username) => {
  const query = `SELECT username, name, avatar_url FROM users WHERE username = $1;`;
  return db.query(query, [username]).then(({ rows }) => {
      if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "User Not Found" });
      } else {
      return rows[0];
      }
  });
}