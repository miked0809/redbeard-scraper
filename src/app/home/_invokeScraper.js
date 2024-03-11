"use server";

import browserObject from "@/services/browser";
import scraperController from "@/services/pageController";

export async function invokeScraper(county, ownernames) {
  console.log("invokeScraper(" + county + ", " + ownernames + ")");

  let browserInstance = browserObject.startBrowser();
  return scraperController(browserInstance, county, ownernames);
}
