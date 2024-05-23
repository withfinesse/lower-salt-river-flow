const axios = require('axios');

exports.handler = async function (event, context) {
  try {
    const response = await axios.get('https://www.fs.usda.gov/recmain/tonto/recreation', { timeout: 5000 });
    return {
      statusCode: 200,
      body: response.data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to scrape data' })
    };
  }
};
