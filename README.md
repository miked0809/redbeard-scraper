## Installation:

- install VS Code
- Clone repo from [Github](https://github.com/miked0809/redbeard-scraper.git) - you can use Github Desktop client
- From terminal:
  - `$ npm install`
  - `$ npm run dev`
- open [http://localhost:3000](http://localhost:3000)

## Deploy updates:

- hosted Mac Mini
- from Mac laptop:
  - commit changes via VS Code GitHub plugin (VS Code won't let me push changes due to login issue)
  - using Github Desktop, push changes to repo
- from Mac Mini (connect via Chromebook or Mac Screen Sharing at Mac-Mini-103.lan), connect to Mac Mini
  - fetch and pull changes using Github Desktop
  - stop server running in /mikedickson/DEV/redbeard-scraper/ (Ctrl-C)
  - `$ npm run build`
  - `$ npm start`
- open [http://miked.duckdns.org:3000](http://miked.duckdns.org:3000)

## .env.local

This file allows for setting environment variables used by the app for configuration without code changes

- HEADLESS (true|false) - set to true for PROD mode, can be set to false for debugging in DEV mode
- TYPE_DELAY (ms) - how much time puppeteer delays in between typing characters; default: 0 (instant)

## What the app does

This app allows a user to enter name or list of names and choose a county auditor website to grab property address information for those names.

Once the user submits the name(s) and choose a county, the app will use [puppeteer](https://pptr.dev/) (which is typically used for automated testing) to navigate to the chosen county website and perform property owner searches using the name(s) provided. Once the search has been executed, puppeteer will scrape the data and display it for the redbeard user. Basically, this app saves time by peforming property owner searches automatically and recursively as opposed to the redbeard user having to execute an owner search manually and one-by-one.

## How it works

Implemented using NextJS/React. Once the user submits the form (/app/home/\_form.jsx), the invokeScraper() function is called, which triggers puppeteer to execute the search and scrape the data

### Frontend

#### /src/app/home/\_form.jsx

This is the main page of the website. It contains two form fields (county, owner name) which the user fills out to initiate the property owner search. Once the search is executed, if there is data to display, it will display the ScrapedDataDisplay component defined in \_scrapedDataDisplay.jsx

#### /src/app/home/\_invokeScraper.js

NextJS server component which is triggered by submitting the webpage form. This component contains the invokeScraper() function which instantiates the browser object to be used by the scraper, and makes a backend call to start the scraping process

#### /src/app/home/\_scrapedDataDisplay.jsx

This component displays the search results (receives the scraped data from the backend process, parses it and displays it in table format)

####

### Backend

#### /src/services/browser.js

startBrowser() function uses puppeteer to set up the browser object and launch the browser. The browser can be started headless by setting HEADLESS=true in .env.local (default is false; should be set true for production)

#### /src/services/pageController.js

The file is essentially the central controller. It accepts the selected county and entered owner name(s) that the user wants to search for and calls the county-specific scraper logic. The county-specific scraper will return the search results to this file, which will then flatten it and return it to invokeScraper() and ultimately back to the webpage for display.

#### /src/services/pageScraper[*].js

There is a pageScraper\*.js file for each supported county (e.g., pageScraperDelaware.js, pageScraperFranklin.js, etc.). Each of these files is responsible for navgating to it's own county-specific website, executing the search, scraping the search results and returning it to pageController.js.

Each county auditor website is different; therefore the scraping process varies somewhat per county website, as does the search results presentation, hence the need for different scraping logic for each county.

The general flow for all county scrapers is to use puppeteer to:

- receive the list of owner name(s) to search for
- navigate to the county website's property search page
- enter the first owner name into the county's "owner name" search field
  - click the search button
  - scrape the results and store in the scrapedPageData object
    - go to next page of results (if multiple pages exist)
    - scrape the next page of results and add to the scrapedPageData object
    - do this until all result pages have been stored
- repeat for each owner name passed into the county scraper
- once all owners have been searched, return the scraped data to pageController.js

#### /src/services/constants.js

This file holds a list of hard-coded county auditor property search webpages used by the scraper (each county url is different). The pageScraper\*.js files reference these constants to obtain the website to navigate to

## TODO:

- add authentication (next-auth with Okta?)
- use SSL
- make responsive so it runs on mobile devices
- host on external server (difficult/impossible to host on Vercel due to puppeteer)
