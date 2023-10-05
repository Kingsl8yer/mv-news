const express = require("express");
const app = express();

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors");
const apiRouter = require("./routes/api-router");

app.use(express.json());
app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "URL not found" });
});

//Error handling
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
