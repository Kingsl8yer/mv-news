const commentRouter = require("express").Router();
const { deleteCommentById } = require("../controllers/commentsController");

commentRouter.route("/:comment_id").delete(deleteCommentById);

module.exports = commentRouter;
