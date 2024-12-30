const pageScraperMadison = require("./pageScraperMadison");
const pageScraperDelaware = require("./pageScraperDelaware");
const pageScraperUnion = require("./pageScraperUnion");
const pageScraperFairfield = require("./pageScraperFairfield");
const pageScraperFranklin = require("./pageScraperFranklin");

async function scrapeAll(browserInstance, county, ownernames) {
  let browser;
  let scrapedData = {};
  const _ownernames = ownernames.split("\n");

  try {
    browser = await browserInstance;

    let page = (await browser.pages())[0]; // Instead of using browser.newPage()

    // fight the headless browser issue
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5643.204 Safari/537.36"
    );

    try {
      switch (county) {
        case "Delaware":
          scrapedData = await pageScraperDelaware.scraper(
            page,
            county,
            _ownernames
          );
          break;
        case "Fairfield":
          scrapedData = await pageScraperFairfield.scraper(
            page,
            county,
            _ownernames
          );
          break;
        case "Franklin":
          scrapedData = await pageScraperFranklin.scraper(
            page,
            county,
            _ownernames
          );
          break;
        case "Madison":
          scrapedData = await pageScraperMadison.scraper(
            page,
            county,
            _ownernames
          );
          break;

        case "Union":
          scrapedData = await pageScraperUnion.scraper(
            page,
            county,
            _ownernames
          );
          break;
        default:
          throw new Error(county + " County is not supported yet");
      }
    } catch (err) {
      console.log("Problem scraping data => : ", err);
    }

    await browser.close();
  } catch (err) {
    console.error("Could not resolve the browser instance => ", err);
    throw new Error("Could not resolve the browser instance");
  }

  const flattenedData = scrapedData.flat();
  console.log("scrapedData:", flattenedData);
  return flattenedData;
}

module.exports = (browserInstance, county, ownernames) =>
  scrapeAll(browserInstance, county, ownernames);
