import { CountyUrl } from "@/services/constants";

const scraperObject = {
  async scraper(page, county, ownernamesArray) {
    const url = CountyUrl[county];
    let scrapedData = [];

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
        await page.waitForSelector("table#searchResults, table#Owner");

        const pageTitle = await page.title();
        const isSingleResult = pageTitle === "Franklin County Auditor";

        const _scrapedPageData = isSingleResult
          ? await parseSingleResult(page)
          : await parseResults(page);
        scrapedPageData = [...scrapedPageData, _scrapedPageData];
        index++;

        // NOTE: it's difficult to determine if there are more pages, so we'll just scrape the first page

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
  await page.select("#selPageSize", "50");
  await page.type("#inpOwner", ownername, { delay: 150 });
  await page.click("button#btSearch");
}

async function parseResults(page) {
  const results = await page.$$eval("table#searchResults tbody tr", (rows) => {
    return rows.map((row) => {
      const columns = row.querySelectorAll("td");
      return {
        name: columns[4].innerText,
        name2: columns[5].innerText,
        address: columns[3].innerText,
      };
    });
  });

  return results;
}

async function parseSingleResult(page) {
  const results = await page.$$eval("table#Owner tbody tr", (rows) => {
    let column = {
      name: rows[0].querySelectorAll("td")[1].innerText,
      name2: rows[1].querySelectorAll("td")[1].innerText,
      address: rows[6].querySelectorAll("td")[1].innerText,
    };
    return column;
  });

  return results;
}

module.exports = scraperObject;
