const express = require('express');
const app = express();
// const {MLBDATA} = require('../espn/data');
const {MLBLINES} = require('../bovada/data');

app.get('/', async (req, res) => {
  // const data = await MLBDATA.getMLBScores();
  const data = await MLBLINES.getMLBLines();
  res.render('home/index', {
    data: data,
  });
});

module.exports = app;
