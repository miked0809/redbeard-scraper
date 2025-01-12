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
        await page.waitForSelector(
          "#MainContent_Grid1 table[mkr='dataTbl.hdn']"
        );

        const _scrapedPageData = await parseResults(page);
        scrapedPageData = [...scrapedPageData, _scrapedPageData];
        index++;

        let nextButtonExists = false;
        let nextButtonSelector = "#MainContent_cmdNext:not([disabled])";
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
  const ownernameArray = ownername.split(" ", 2);
  const lastname = ownernameArray[0];
  const firstname = ownernameArray[1];
  await page.type("#MainContent_txtLastName", lastname, {
    delay: process.env.TYPE_DELAY || 0,
  });
  if (firstname) {
    await page.type("#MainContent_txtFirstName", firstname, {
      delay: process.env.TYPE_DELAY || 0,
    });
  }
  await page.click("#MainContent_cmdSearch");
}

async function parseResults(page) {
  const results = await page.$$eval("table[mkr='dataTbl.hdn'] tr", (rows) => {
    return rows.map((row) => {
      const columns = row.querySelectorAll("td");
      return {
        name: columns[1].innerText,
        address: columns[2].innerText,
      };
    });
  });

  return results;
}

module.exports = scraperObject;
