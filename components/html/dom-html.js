const createBrowserless = require('browserless');
const cheerio = require('cheerio');

/**
 * Get HTML from provided URL
 * @param {string} url
 */
async function getHTML(url) {
  // First, create a browserless factory
  // that it will keep a singleton process running
  const browserlessFactory = createBrowserless();

  // After that, you can create as many browser context
  // as you need. Tßhe browser contexts won't share cookies/cache
  // with other browser contexts.
  const browserless = await browserlessFactory.createContext();

  const html = await browserless.html(url);

  // After your task is done, destroy your browser context
  await browserless.destroyContext();

  // At the end, gracefully shutdown the browser process
  await browserlessFactory.close();

  return html;
}

module.exports = {
  cheerio: cheerio,
  getHTML: getHTML,
};
