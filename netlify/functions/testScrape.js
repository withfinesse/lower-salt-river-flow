const axios = require('axios');

exports.handler = async function (event, context) {
  try {
    const response = await axios.get('https://www.fs.usda.gov/recmain/tonto/recreation', { timeout: 15000 });
    return {
      statusCode: 200,
      body: response.data
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to scrape data', details: error.message })
    };
  }
};
