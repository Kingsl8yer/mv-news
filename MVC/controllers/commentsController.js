const {eliminateCommentById} = require('../models/commentsModel');

exports.deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params;
    eliminateCommentById(comment_id).then((comment) => {
        res.status(204).send({comment});
    }).catch(next);
}