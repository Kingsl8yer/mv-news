const userRouter = require("express").Router();
const { getAllUsers } = require("../controllers/usersController");


userRouter.route("/").get(getAllUsers);

module.exports = userRouter;