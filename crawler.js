const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless mode
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  const page = await browser.newPage();
  await page.goto('https://cloud.eais.go.kr/');

  // Input login credentials
  await page.type('input[name="id"]', 'alwls2488');
  await page.type('input[name="pw"]', 'apxktmxk0!23');
  await page.click('button[type="submit"]');

  // Wait for the login to complete
  await page.waitForNavigation();

  // Click on "issurance of building ledger"
  await page.click('a[title="건축물대장발급"]');

  // Wait for the next page to load
  await page.waitForNavigation();

  // Input address
  const address = '경기도 고양시 일산동구 강석로 152 강촌마을아파트 제701동 제2층 제202호 [마두동 796]';

  await page.type('input[name="site"]', address);
  await page.click('button[type="submit"]');

  // Wait for the search results
  await page.waitForSelector('.search_result');

  // Click on the first search result to view the PDF
  const [resultLink] = await page.$$('.search_result a');
  if (resultLink) {
    await resultLink.click();

    // Wait for the PDF to load
    await page.waitForSelector('iframe');
    const pdfFrame = await page.$('iframe');
    const pdfUrl = await pdfFrame.evaluate(frame => frame.src);

    // Download the PDF
    const pdfBuffer = await page.goto(pdfUrl);
    fs.writeFileSync('output.pdf', pdfBuffer);

    console.log('PDF downloaded successfully.');
  } else {
    console.log('No search results found.');
  }

  await browser.close();
})();
