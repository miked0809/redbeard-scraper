"use server";

import browserObject from "@/services/browser";
import scraperController from "@/services/pageController";

export async function invokeScraper(url, ownername) {
  console.log("invokeScraper(" + url + ", " + ownername + ")");

  let browserInstance = browserObject.startBrowser();
  return scraperController(browserInstance, url, ownername);
}
