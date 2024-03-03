"use server";

import browserObject from "@/services/browser";
import scraperController from "@/services/pageController";

export async function invokeScraper(ownername) {
  console.log("invokeScraper(" + ownername + ")");

  let browserInstance = browserObject.startBrowser();
  return scraperController(browserInstance, ownername);
}
