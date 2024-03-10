const pageScraper = require("./pageScraper");

async function scrapeAll(browserInstance, url, ownernames) {
  let browser;
  let scrapedData = {};
  const _ownernames = ownernames.split("\n");

  try {
    browser = await browserInstance;

    scrapedData = await pageScraper.scraper(browser, url, _ownernames);
    await browser.close();
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }

  const flattenedData = scrapedData.flat();
  console.log("scrapedData:", flattenedData);
  return flattenedData;
}

module.exports = (browserInstance, url, ownernames) =>
  scrapeAll(browserInstance, url, ownernames);
