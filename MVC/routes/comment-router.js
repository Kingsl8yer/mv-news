const commentRouter = require("express").Router();
const {
  deleteCommentById,
  patchCommentById,
} = require("../controllers/commentsController");

commentRouter.route("/:comment_id").delete(deleteCommentById).patch(patchCommentById);

module.exports = commentRouter;
