const {MLBDATA} = require('../espn/data');
const {MLBLINES} = require('../bovada/data');
const console = require('console');

const MLBGAMES = {
  getData: async () => {
    const mlbGameLines = await MLBLINES.getMLBLines();
    const mlbGameData = await MLBDATA.getMLBGames();
    const foundGames = await findGames(mlbGameData, mlbGameLines);
    console.log(foundGames);
    return {gameLines: foundGames};
  },
};

/**
 *
 * @param {object} mlbGameData
 * @param {object} mlbGameLines
 * @return {object}
 */
async function findGames(mlbGameData, mlbGameLines) {
  for (let j = 0; j < mlbGameLines.length; j++) {
    // split up team name into an array
    const teamToFind = mlbGameLines[j].team1.split(' ');
    console.log(teamToFind);
    const compare = teamToFind[teamToFind.length - 1];
    const compare1 = teamToFind[0] + ' ' + teamToFind[1];

    // ex: Chicago White Sox
    if (teamToFind.length == 3) {
      const compare2 = teamToFind[1] + ' ' + teamToFind[2];

      for (let i = 0; i < mlbGameData.length; i++) {
        // if we found it
        if (mlbGameData[i].team1 == compare1 ||
          mlbGameData[i].team1 == compare2 ||
          mlbGameData[i].team1 == compare) {
          console.log('Found it length 3');
          const gameData = await MLBDATA.getMLBGameData(mlbGameData[i].link);
          mlbGameLines[j].gameData = gameData;
        }
      }
    } else {
      for (let i = 0; i < mlbGameData.length; i++) {
        // if we found it
        if (mlbGameData[i].team1 == compare1 ||
          mlbGameData[i].team1 == compare) {
          console.log('Found it length 2');
          const gameData = await MLBDATA.getMLBGameData(mlbGameData[i].link);
          mlbGameLines[j].gameData = gameData;
        }
      }
    }
    // break;
  }

  return mlbGameLines;
}

module.exports = {
  MLBGAMES: MLBGAMES,
};
