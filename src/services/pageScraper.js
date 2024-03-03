const scraperObject = {
  url: "https://auditor.co.madison.oh.us/Search",
  async scraper(browser, ownername) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);

    await page.goto(this.url);
    await performSearch(page, ownername);

    let scrapedData = [];
    let index = 1;
    async function scrapeCurrentPage() {
      await page.waitForSelector(".table-responsive");
      scrapedData.push(await parseResults(page));
      //await takeScreenshot(page, "page" + index);
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

      await page.close();
      return scrapedData;
    }

    let results = await scrapeCurrentPage();
    return results;
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
      return Array.from(rows, (row) => {
        const columns = row.querySelectorAll(
          "td:nth-child(n+3):nth-child(-n+4)"
        );
        return Array.from(columns, (column) => column.innerText);
      });
    }
  );

  console.log(results);
  return results;
}

async function takeScreenshot(page, filename) {
  return await page.screenshot({
    path: filename + ".jpg",
    type: "jpeg",
    quality: 20,
  });
}

module.exports = scraperObject;
