const pageScraper = require("./pageScraper");
const fs = require("fs");

async function scrapeAll(browserInstance, url, ownername) {
  let browser;
  let scrapedData = {};

  try {
    browser = await browserInstance;

    scrapedData = await pageScraper.scraper(browser, url, ownername);
    await browser.close();
    writeToJson(scrapedData);
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }

  const flattenedData = scrapedData.flat();
  console.log("scrapedData:", flattenedData);
  return flattenedData;
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

module.exports = (browserInstance, url, ownername) =>
  scrapeAll(browserInstance, url, ownername);
