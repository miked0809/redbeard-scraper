"use server";

import browserObject from "@/services/browser";
import scraperController from "@/services/pageController";

export async function invokeScraper(url, ownernames) {
  console.log("invokeScraper(" + url + ", " + ownernames + ")");

  let browserInstance = browserObject.startBrowser();
  return scraperController(browserInstance, url, ownernames);
}
