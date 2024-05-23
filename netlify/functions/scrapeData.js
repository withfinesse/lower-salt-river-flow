const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async function(event, context) {
  const url = "https://www.fs.usda.gov/recmain/tonto/recreation";
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const sites = [
      "Blue Point Day Use Area",
      "Goldfield Day Use Area",
      "Granite Reef Day Use Area",
      "Pebble Beach Day Use Area",
      "Phon D Sutton Day Use Area",
      "Raccoon Bluff Day-Use Area",
      "Saguaro Lake Ranch",
      "Sheeps Crossing Day Use Area",
      "Water Users Day Use Area"
    ];

    let siteData = {};

    sites.forEach(site => {
      const siteInfo = $(`a:contains(${site})`).closest('div');  // Adjust the selector according to the actual HTML structure
      const status = siteInfo.find('.status').text().trim();
      const conditions = siteInfo.find('.conditions').text().trim();
      siteData[site] = { status, conditions };
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

