const console = require('console');
const {cheerio, getHTML} = require('../html/dom-html');

const MLBLINES = {
  getMLBLines: async () => {
    console.log('Grab Bovada');
    const url = 'https://www.bovada.lv/sports/baseball';
    const html = await getHTML(url);
    const games = getGames(html, '.happening-now-bucket');

    return games;
  },
};

/**
 * Grab the games from Bovada
 * @param {string} html
 * @param {string} gamesRowQuery
 * @return {array} games
 */
function getGames(html, gamesRowQuery) {
  const dom = cheerio.load(html);
  const domGamesRowElements = dom(gamesRowQuery);
  let gameData;
  const games = [];

  if (gamesRowQuery != '') {
    // lets find the correct section (MLB)
    const domEventsElements = domGamesRowElements.find('.grouped-events');

    for (let j = 0; j < domEventsElements.length; j++) {
      const event = domEventsElements.eq(j);
      const eventTitle = event.find('h4 a').text().replace(' ', '');

      if (eventTitle.includes('MLB')) {
        // this is each game row
        const domMultiMarkets = event.find('sp-multi-markets');
        const domEventSection = domMultiMarkets.find('section section');

        for (let k = 0; k < domEventSection.length; k++) {
          gameData = parseGameData(domEventSection, k);
          games.push(gameData);
        }
        // console.log(games);
      }

      break;
    }
  }

  return games;
}

/**
 *
 * @param {dom} domEventSection
 * @param {int} index
 * @return {Object} gameData
 */
function parseGameData(domEventSection, index) {
  const gameData = {};
  const compName = domEventSection.eq(index).find('.competitor-name .name');
  const marketLine = domEventSection.eq(index).find('.market-line');
  const twoWay = domEventSection.eq(index).find('sp-two-way-vertical');
  const betPrice = twoWay.eq(1).find('sp-outcome .bet-price');
  const totalOutcome = domEventSection.eq(index).find('sp-total-outcome');
  const score = domEventSection.eq(index).find('.score-nr');
  const gameTime = domEventSection.eq(index).find('.gs').eq(0).text();
  const team1 = compName.eq(0).text();
  const team2 = compName.eq(1).text();
  gameData.team1 = team1;
  gameData.team2 = team2;
  gameData.gameTime = gameTime;
  gameData.marketLine = {
    team1: marketLine.eq(0).text(),
    team2: marketLine.eq(1).text(),
  };
  gameData.betPrice = {
    team1: betPrice.eq(0).text().replace(/ /g, ''),
    team2: betPrice.eq(1).text().replace(/ /g, ''),
  };
  gameData.totalOutcome = {
    team1: totalOutcome.eq(0).find('.both-handicaps').text(),
    team2: totalOutcome.eq(1).find('.both-handicaps').text(),
  };
  gameData.score = {
    team1: score.eq(0).text(),
    team2: score.eq(1).text(),
  };

  return gameData;
}

module.exports = {
  MLBLINES: MLBLINES,
};
