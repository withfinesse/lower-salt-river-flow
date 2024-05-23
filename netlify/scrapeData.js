const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async function (event, context) {
    try {
        const url = 'https://www.fs.usda.gov/recmain/tonto/recreation';
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const siteData = [];

        $('div.recreation-area').each((i, elem) => {
            const name = $(elem).find('h2').text();
            const status = $(elem).find('.status').text();
            const conditions = $(elem).find('.conditions').text();
            siteData.push({ name, status, conditions });
        });

        return {
            statusCode: 200,
            body: JSON.stringify(siteData),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
