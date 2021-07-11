const {MLBDATA} = require('../espn/data');
const {MLBLINES} = require('../bovada/data');

const MLBGAMES = {
  getData: async () => {
    const mlbGameData = await MLBDATA.getMLBScores();
    const mlbGameLines = await MLBLINES.getMLBLines();
    return {gameData: mlbGameData, gameLines: mlbGameLines};
  },
};

module.exports = {
  MLBGAMES: MLBGAMES,
};
