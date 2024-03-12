import { CountyUrl } from "@/services/constants";

const scraperObject = {
  async scraper(page, county, ownernamesArray) {
    throw new Error(county + " County is not supported yet");
    Promise.reject();
  },
};

module.exports = scraperObject;
