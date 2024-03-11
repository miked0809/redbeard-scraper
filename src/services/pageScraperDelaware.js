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
        const foundElement = await page.waitForSelector(
          "#dnn_ctr581_ModuleContent table.ui-widget-content:first-child, #dnn_ctr769_ModuleContent #tabs-1 > table.ui-widget-content, #dnn_ctr769_ModuleContent #tabs-1 .noresults"
        ); // single=581, multiple=769
        const elemClassName = await page.evaluate(
          (el) => el.className,
          foundElement
        );
        const pageTitle = await page.title();
        const isSingleResult = pageTitle === "Property Info";

        if (elemClassName === "no-result") {
          return scrapedPageData;
        }

        const _scrapedPageData = isSingleResult
          ? await parseSingleResult(page)
          : await parseResults(page);
        scrapedPageData = [...scrapedPageData, _scrapedPageData];
        index++;

        let nextButtonExists = false;
        let nextButtonSelector = "a.ui-corner-right[aria-disabled='false']";
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
  await page.type("#owner", ownername, { delay: 150 });
  await page.click("button[name='btnSearch']");
}

async function parseResults(page) {
  const results = await page.$$eval(
    "#tabs-1 > table.ui-widget-content table.searchResult tr",
    (rows) => {
      return rows.map((row) => {
        const columns = row.querySelectorAll("td");
        return {
          name: columns[0].innerText,
          address: columns[2].innerText,
        };
      });
    }
  );

  return results;
}

async function parseSingleResult(page) {
  const results = await page.$$eval(
    "#dnn_ctr581_ModuleContent table.ui-widget-content:first-child table.ui-corner-all tbody tr",
    (rows) => {
      let column = {
        name: rows[1].querySelectorAll("td")[1].innerText,
        address: rows[2].querySelectorAll("td")[1].innerText,
      };
      return column;
    }
  );

  return results;
}

module.exports = scraperObject;
