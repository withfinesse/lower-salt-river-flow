const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async function(event, context) {
    try {
        const response = await axios.get('https://www.fs.usda.gov/recmain/tonto/recreation');
        const html = response.data;
        const $ = cheerio.load(html);

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

        const siteData = {};

        sites.forEach(site => {
            const siteElement = $(`.rec-area-name:contains(${site})`).closest('.rec-area-item');
            const status = siteElement.find('.rec-status').text().trim();
            const conditions = siteElement.find('.rec-condition').text().trim();
            siteData[site] = { status, conditions };
        });

        return {
            statusCode: 200,
            body: JSON.stringify(siteData)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
