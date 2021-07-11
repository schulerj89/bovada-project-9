const console = require('console');
const express = require('express');
const app = express();
const {MLBGAMES} = require('../games/data');

module.exports = (io) => {
  app.get('/', async (req, res) => {
    const gamedata = await MLBGAMES.getData();
    console.log(gamedata.gameLines);
    res.render('home/index', {
      gamedata: gamedata.gameData,
      gamelines: gamedata.gameLines,
    });

    // Whenever someone connects this gets executed
    io.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('UpdateGames', async () => {
        const data = await MLBGAMES.getData();
        console.log('I heard ya!');
        io.sockets.emit('UpdateStats', {gamelines: data.gameLines});
      });

      // Whenever someone disconnects this piece of code executed
      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  });

  return app;
};
