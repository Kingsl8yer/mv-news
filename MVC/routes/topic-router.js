const topicRouter = require("express").Router();

const { getAllTopics } = require("../controllers/topicsController");

topicRouter.route("/").get(getAllTopics);

module.exports = topicRouter;