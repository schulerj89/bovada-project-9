const console = require('console');
const express = require('express');
const app = express();
const {MLBGAMES} = require('../games/data');

module.exports = (io) => {
  app.get('/', async (req, res) => {
    console.log('Getting Games From Server');
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
        console.log('Getting Games From Client');
        const data = await MLBGAMES.getData();
        console.log('We are done');
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
