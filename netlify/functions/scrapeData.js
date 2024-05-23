const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async function (event, context) {
  try {
    const response = await axios.get('https://www.fs.usda.gov/recmain/tonto/recreation');
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

    $('.item-list').each((index, element) => {
      const name = $(element).find('.title').text().trim();
      const status = $(element).find('.status').text().trim();
      const conditions = $(element).find('.conditions').text().trim();

      if (sites.includes(name)) {
        siteData[name] = {
          status,
          conditions
        };
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(siteData)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to scrape data' })
    };
  }
};
