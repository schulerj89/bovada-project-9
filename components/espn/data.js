const {cheerio, getHTML} = require('../html/dom-html');

const MLBDATA = {
  getMLBScores: async () => {
    const url = 'https://www.espn.com/mlb/scoreboard';
    const html = await getHTML(url);
    const games = getGames(html, '#events article.scoreboard');

    return games;
  },
};

/**
 * Grab the games from ESPN
 * @param {string} html
 * @param {string} gamesRowQuery
 */
function getGames(html, gamesRowQuery) {
  const dom = cheerio.load(html);
  const domGamesRowElements = dom(gamesRowQuery);

  if (gamesRowQuery != '') {
    for (let i = 0; i < domGamesRowElements.length; i++) {
      // console.log(domGamesRowElements.eq(i).find('#teams').text());
      break;
    }
  }
}

module.exports = {
  MLBDATA: MLBDATA,
};
