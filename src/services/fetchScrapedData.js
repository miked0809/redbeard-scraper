import { promises as fs } from "fs";

export async function fetchScrapedData() {
  console.log("fetchScrapedData()...");
  try {
    const file = await fs.readFile("data.json", "utf8");
    const data = JSON.parse(file);
    console.log("data:", data);
    return JSON.parse(file);
  } catch (e) {
    console.error("error reading data.json file", e);
    return {};
  }
}
