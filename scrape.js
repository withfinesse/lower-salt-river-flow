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

    $('.rec-area-card').each((index, element) => {
      const siteName = $(element).find('.rec-area-name').text().trim();
      const status = $(element).find('.rec-area-status').text().trim();
      const conditions = $(element).find('.rec-area-conditions').text().trim();
      sites[siteName] = { status, conditions };
    });

    fs.writeFileSync('siteData.json', JSON.stringify(sites, null, 2));
  } catch (error) {
    console.error('Error scraping data:', error);
  }
}

scrapeData();
