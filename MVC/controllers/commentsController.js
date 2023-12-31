const {
  eliminateCommentById,
  updateCommentById,
} = require("../models/commentsModel");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  eliminateCommentById(comment_id)
    .then((comment) => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
    const {comment_id} = req.params;
    const {inc_votes} = req.body;
    updateCommentById(comment_id, inc_votes).then((comment) => {
        res.status(200).send({comment});
    }).catch(next);
}
