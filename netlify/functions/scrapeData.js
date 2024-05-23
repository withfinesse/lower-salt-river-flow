const axios = require('axios');
const cheerio = require('cheerio');

const SITE_URL = 'https://www.fs.usda.gov/recmain/tonto/recreation';

exports.handler = async function(event, context) {
  try {
    const response = await axios.get(SITE_URL);
    const $ = cheerio.load(response.data);

    const siteData = {};
    const sites = [
      'Blue Point Day Use Area',
      'Goldfield Day Use Area',
      'Granite Reef Day Use Area',
      'Pebble Beach Day Use Area',
      'Phon D Sutton Day Use Area',
      'Raccoon Bluff Day-Use Area',
      'Saguaro Lake Ranch',
      'Sheeps Crossing Day Use Area',
      'Water Users Day Use Area'
    ];

    sites.forEach(site => {
      const siteElement = $(`.entry-title:contains(${site})`).parent();
      const status = siteElement.find('.status').text().trim();
      const conditions = siteElement.find('.conditions').text().trim();

      siteData[site] = { status, conditions };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(siteData)
    };
  } catch (error) {
    console.error('Error fetching site data:', error);
    return {
      statusCode: 500,
      body: 'Error fetching site data'
    };
  }
};
