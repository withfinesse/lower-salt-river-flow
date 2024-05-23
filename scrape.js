const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeData() {
  try {
    const url = 'https://www.fs.usda.gov/recmain/tonto/recreation';
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    let sites = {};

    // Adjust selectors based on the actual HTML structure of the target site
    $('.recreation-area-card').each((index, element) => {
      const siteName = $(element).find('.recreation-area-card__title').text().trim();
      const status = $(element).find('.recreation-area-card__status').text().trim();
      const conditions = $(element).find('.recreation-area-card__conditions').text().trim();
      sites[siteName] = { status, conditions };
    });

    fs.writeFileSync('siteData.json', JSON.stringify(sites, null, 2));
    console.log('Data scraped successfully');
  } catch (error) {
    console.error('Error scraping data:', error);
  }
}

scrapeData();
