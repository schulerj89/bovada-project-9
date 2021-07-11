const {cheerio, getHTML} = require('../html/dom-html');

const MLBDATA = {
  getMLBGames: async () => {
    const url = 'https://www.espn.com/mlb/scoreboard';
    const html = await getHTML(url);
    const games = getGames(html, '#events article.scoreboard');

    return games;
  },
  getMLBGameData: async (link) => {
    const url = link;
    const html = await getHTML(url);
    const query = '#accordion__parent [data-type="batting"]';
    const gameData = getGameData(html, query);

    return gameData;
  },
};

/**
 * Get the player stats for each team
 * @param {dom} html
 * @param {string} query
 * @return {object} gameData
 */
function getGameData(html, query) {
  const dom = cheerio.load(html);
  const domAthleteElements = dom(query);
  const gameData = {};
  let players = [];
  let player;
  let playerName;
  let playerStats;
  let teamKey;
  let index = 0;

  for (let i = 0; i < domAthleteElements.length; i++) {
    const domAthletes = domAthleteElements.eq(i).find('.athletes');
    index = index+1;
    teamKey = 'team'+index;
    players = [];

    for (let j = 0; j < domAthletes.length; j++) {
      playerName = domAthletes.eq(j).find('a > span.name').text();
      playerStats = domAthletes.eq(j).find('.batting-stats-h-ab').text();
      player = {};

      if (playerName == '') {
        continue;
      }

      player.name = playerName;
      player.stats = playerStats;

      players.push(player);
    }

    gameData[teamKey] = players;
  }

  return gameData;
}

/**
 * Grab the games from ESPN
 * @param {string} html
 * @param {string} gamesRowQuery
 * @return {array} games
 */
function getGames(html, gamesRowQuery) {
  const dom = cheerio.load(html);
  const domGamesRowElements = dom(gamesRowQuery);
  let game;
  const espnURL = 'https://espn.com';
  const games = [];


  if (gamesRowQuery != '') {
    for (let i = 0; i < domGamesRowElements.length; i++) {
      game = {};
      const teams = domGamesRowElements.eq(i).find('.sb-team-short');
      const gameLink = domGamesRowElements.eq(i).find('.sb-actions a');
      game.team1 = teams.eq(0).text();
      game.team2 = teams.eq(1).text();
      game.link = espnURL + gameLink.eq(0).attr('href');
      games.push(game);
    }
  }

  return games;
}

module.exports = {
  MLBDATA: MLBDATA,
};
