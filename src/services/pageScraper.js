const scraperObject = {
  async scraper(browser, url, ownernamesArray) {
    let page = await browser.newPage();
    let scrapedData = [];

    // fight the headless browser issue
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
    );

    async function scrapeOwner(page, url, ownername) {
      console.log(`Navigating to ${url}...`);

      await page.goto(url);
      await performSearch(page, ownername);

      let scrapedPageData = [];
      let index = 1;

      async function scrapeCurrentPage() {
        if (!ownername || ownername.length === 0) {
          return scrapedPageData;
        }
        await page.waitForSelector(".table-responsive");
        const _scrapedPageData = await parseResults(page);
        scrapedPageData = [...scrapedPageData, _scrapedPageData];
        index++;

        let nextButtonExists = false;
        let nextButtonSelector =
          "button[title='Next Parcel Search Results Page']";
        try {
          await page.$eval(nextButtonSelector, (button) => button.textContent);
          nextButtonExists = true;
        } catch (err) {
          nextButtonExists = false;
        }

        if (nextButtonExists) {
          await page.click(nextButtonSelector);
          return scrapeCurrentPage();
        }

        return scrapedPageData;
      }

      scrapedData.push(await scrapeCurrentPage());

      if (ownernamesArray.length > 0) {
        return await scrapeOwner(page, url, ownernamesArray.shift());
      }

      await page.close();
      return scrapedData.flat();
    }

    return await scrapeOwner(page, url, ownernamesArray.shift());
  },
};

async function performSearch(page, ownername) {
  await page.type("#searchValues_OwnerName", ownername, { delay: 150 });
  await page.click("button[value='OwnerSingleLine']");
}

async function parseResults(page) {
  const results = await page.$$eval(
    ".table-responsive table tbody tr",
    (rows) => {
      return rows.map((row) => {
        const columns = row.querySelectorAll(
          "td:nth-child(n+3):nth-child(-n+4)"
        );
        return {
          name: columns[0].innerText,
          address: columns[1].innerText,
        };
      });
    }
  );

  return results;
}

module.exports = scraperObject;
