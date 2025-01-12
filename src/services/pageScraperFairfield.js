import { CountyUrl } from "@/services/constants";

const scraperObject = {
  async scraper(page, county, ownernamesArray) {
    const url = CountyUrl[county];
    let scrapedData = [];

    async function scrapeOwner(page, url, ownername) {
      console.log(`Navigating to ${url}...`);
      await page.goto(url);

      await agreeToTerms(page);

      await performSearch(page, ownername);

      let scrapedPageData = [];
      let index = 1;

      async function scrapeCurrentPage() {
        if (!ownername || ownername.length === 0) {
          return scrapedPageData;
        }

        const foundElement = await page.waitForSelector(
          "#ctlBodyPane_ctl00_lblName, #ctlBodyPane_noDataList_pnlNoResults"
        );
        const foundElementText = await page.evaluate(
          (el) => el.innerText,
          foundElement
        );

        const isSingleResult = foundElementText === "Summary";

        const _scrapedPageData = isSingleResult
          ? await parseSingleResult(page)
          : await parseResults(page);
        scrapedPageData = [...scrapedPageData, _scrapedPageData];
        index++;

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

async function agreeToTerms(page) {
  try {
    await page.waitForSelector(".modal-dialog .modal-footer .btn-primary", {
      timeout: 1000,
    });
    await page.click(".modal-dialog .modal-footer .btn-primary");
  } catch (err) {
    return;
  }
}

async function performSearch(page, ownername) {
  await page.type("#ctlBodyPane_ctl00_ctl01_txtName", ownername, {
    delay: process.env.TYPE_DELAY || 0,
  });
  await page.click("#ctlBodyPane_ctl00_ctl01_btnSearch");
}

async function parseResults(page) {
  const results = await page.$$eval(
    "#ctlBodyPane_ctl00_ctl01_gvwParcelResults tbody tr",
    (rows) => {
      return rows.map((row) => {
        const columns = row.querySelectorAll("td");
        return {
          name: columns[2].innerText,
          address: columns[3].innerText + ", " + columns[4].innerText,
        };
      });
    }
  );

  return results;
}

async function parseSingleResult(page) {
  const name1Elem = await page.waitForSelector(
    "#ctlBodyPane_ctl01_ctl01_sprLnkOwnerName1_lnkUpmSearchLinkSuppressed_lblSearch"
  );
  let name = await page.evaluate((el) => el.innerText, name1Elem);

  try {
    const name2Elem = await page.waitForSelector(
      "#ctlBodyPane_ctl01_ctl01_sprLblOwnerName2_lblSuppressed",
      { timeout: 500 }
    );
    name = name + (await page.evaluate((el) => el.innerText, name2Elem));
  } catch (err) {
    // do nothing, move on...
  }

  const addressElem = await page.waitForSelector(
    "#ctlBodyPane_ctl00_ctl01_dynamicSummary_rptrDynamicColumns_ctl01_pnlSingleValue"
  );
  const address = await page.evaluate((el) => el.innerText, addressElem);

  const results = [
    {
      name: name,
      address: address,
    },
  ];

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
