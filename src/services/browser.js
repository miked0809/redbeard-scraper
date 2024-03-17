const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

async function startBrowser() {
  let browser;
  try {
    console.log("Opening the browser......");
    browser = await puppeteer.launch({
      headless: process.env.HEADLESS === "true" ? true : false,
      defaultViewport: null,
      args: [
        "--disable-notifications",
        "--no-sandbox",
        "--window-size=1280,720",
        "--disable-dev-shm-usage",
      ],
      ignoreHTTPSErrors: true,
      ignoreDefaultArgs: ["--disable-extensions"],
    });
  } catch (err) {
    console.log("Could not create a browser instance => : ", err);
  }
  return browser;
}

module.exports = {
  startBrowser,
};
