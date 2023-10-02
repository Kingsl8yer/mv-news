const { selectAllTopics } = require("../models/topicsModel");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getAllEndpoints = (req, res, next) => {
  res.status(200).send({
    endpoints: {
      "GET /api/topics": {
        description: "serves an array of all topics",
        queries: [],
        exampleResponse: {
          topics: [
            {
              slug: "basketball",
              description: "Stephen Curry is the best!",
            },
            {
              slug: "coding",
              description: "Hola mundo!",
            },
          ],
        },
      },
    },
  });
};
