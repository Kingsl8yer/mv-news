const db = require("../../db/connection");

exports.selectAllUsers = () => {
  const query = `SELECT username, name, avatar_url  FROM users;`;
  return db.query(query).then(({ rows }) => {
    return rows;
  });
};
