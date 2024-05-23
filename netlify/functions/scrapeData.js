const puppeteer = require('puppeteer');

exports.handler = async function (event, context) {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://www.fs.usda.gov/recmain/tonto/recreation', { waitUntil: 'networkidle2', timeout: 15000 });
    
    const siteData = await page.evaluate(() => {
      const data = {};
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

      document.querySelectorAll('.item-list').forEach((element) => {
        const name = element.querySelector('.title')?.innerText.trim();
        const status = element.querySelector('.status')?.innerText.trim();
        const conditions = element.querySelector('.conditions')?.innerText.trim();

        if (sites.includes(name)) {
          data[name] = {
            status,
            conditions
          };
        }
      });
      return data;
    });

    return {
      statusCode: 200,
      body: JSON.stringify(siteData)
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to scrape data', details: error.message })
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
