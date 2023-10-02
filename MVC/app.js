const express = require('express');
const app = express();

const {getAllTopics} = require('./controllers/topicsController');



app.get('/api/topics', getAllTopics);

app.all('/*', (req, res, next) => {
    res.status(404).send({msg: 'URL not found'});
});


module.exports = app;
