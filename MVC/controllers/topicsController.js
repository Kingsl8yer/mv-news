const { selectAllTopics } = require("../models/topicsModel");
const endPoints = require("../../endpoints.json");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getAllEndpoints = (req, res, next) => {
  res.status(200).send({endPoints: endPoints});
};
