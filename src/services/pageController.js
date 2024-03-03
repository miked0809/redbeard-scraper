const pageScraper = require("./pageScraper");
const fs = require("fs");

async function scrapeAll(browserInstance, ownername) {
  let browser;
  let scrapedData = {};

  try {
    browser = await browserInstance;

    scrapedData = await pageScraper.scraper(browser, ownername);
    await browser.close();
    writeToJson(scrapedData);
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }

  return scrapedData;
}

function writeToJson(scrapedData) {
  fs.writeFile(
    "data.json",
    JSON.stringify(scrapedData),
    "utf8",
    function (err) {
      if (err) {
        return console.log(err);
      }
      console.log(
        "The data has been scraped and saved successfully! View it at './data.json'"
      );
    }
  );
}

module.exports = (browserInstance, ownername) =>
  scrapeAll(browserInstance, ownername);
