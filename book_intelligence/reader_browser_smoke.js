const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const baseUrl = process.env.BOOK_READER_URL || 'http://127.0.0.1:8765/';
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('requestfailed', request => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText || ''}`));

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.locator('#press').click();
  await page.locator('#master.show').waitFor({ timeout: 12000 });
  await page.locator('.tb').filter({ hasText: /^Library$/ }).click();
  await page.locator('.sb').filter({ hasText: /^Read the Books$/ }).click();
  await page.locator('.br-shell').waitFor();
  await page.locator('.br-search-status').filter({ hasText: /Ready to read and search/ }).waitFor({ timeout: 20000 });

  const bookCount = await page.locator('.br-book').count();
  const pageTotalAace29 = await page.locator('.br-page-control span').innerText();
  const originalAace29 = await page.locator('.br-original').getAttribute('href');
  const canvasVisible = await page.locator('.br-canvas').isVisible();
  const search = page.locator('.br-search-input');

  await search.fill('sch');
  await page.waitForTimeout(80);
  const broadPredictions = await page.locator('.br-prediction strong').allTextContents();
  await search.fill('schedule d');
  await page.waitForTimeout(80);
  const refinedPredictions = await page.locator('.br-prediction strong').allTextContents();
  await search.fill('scheduke');
  await page.waitForTimeout(80);
  const correctedPredictions = await page.locator('.br-prediction').evaluateAll(nodes => nodes.map(node => ({
    label: node.querySelector('strong')?.textContent || '',
    kind: node.querySelector('small')?.textContent || ''
  })));

  await search.fill('schedule delay analysis');
  await page.locator('.br-search-form').evaluate(form => form.requestSubmit());
  await page.locator('.br-result').first().waitFor({ timeout: 10000 });
  const searchStatus = await page.locator('.br-search-status').innerText();
  const resultCount = await page.locator('.br-result').count();
  const sourceWording = await page.locator('.br-result-text').first().innerText();
  const plainExplanation = await page.locator('.br-result-plain').first().innerText();
  const targetPage = Number(await page.locator('.br-result').first().getAttribute('data-page'));
  await page.locator('.br-result').first().click();
  await page.waitForTimeout(350);
  const jumpedPage = Number(await page.locator('.br-page-control input').inputValue());

  await search.fill('"forensic schedule analysis"');
  await page.locator('.br-search-form').evaluate(form => form.requestSubmit());
  await page.locator('.br-result').first().waitFor({ timeout: 10000 });
  const exactBadge = await page.locator('.br-result-meta em').first().innerText();

  await page.locator('.br-book').filter({ hasText: 'ACI 347R-14' }).click();
  await page.locator('.br-search-status').filter({ hasText: /Ready to read and search/ }).waitFor({ timeout: 20000 });
  const aciPageTotal = await page.locator('.br-page-control span').innerText();
  await search.fill('form');
  await page.waitForTimeout(90);
  const aciPredictions = await page.locator('.br-prediction strong').allTextContents();

  await page.locator('.br-book').filter({ hasText: 'ECP 203/2018' }).click();
  await page.locator('.br-search-status').filter({ hasText: /Ready to read and search/ }).waitFor({ timeout: 25000 });
  const ecpPageTotal = await page.locator('.br-page-control span').innerText();
  const ecpMeta = await page.locator('.br-reader-identity p').innerText();

  await page.locator('.br-book').filter({ hasText: 'OSHA 1926.703' }).click();
  await page.locator('.br-search-status').filter({ hasText: /Ready to read and search/ }).waitFor({ timeout: 10000 });
  const textVisible = await page.locator('.br-text-view').isVisible();
  const canvasHiddenForText = await page.locator('.br-canvas').isHidden();
  const textStartsWithSource = /1926\.703|requirements for cast-in-place concrete/i.test((await page.locator('.br-text-view').innerText()).slice(0, 500));
  await search.fill('formwork');
  await page.locator('.br-search-form').evaluate(form => form.requestSubmit());
  await page.locator('.br-result').first().waitFor({ timeout: 10000 });
  const oshaResult = await page.locator('.br-result-text').first().innerText();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(250);
  const mobile = await page.locator('.br-shell').evaluate(node => ({
    clientWidth: node.clientWidth,
    scrollWidth: node.scrollWidth,
    layoutColumns: getComputedStyle(node.querySelector('.br-layout')).gridTemplateColumns,
    resultsColumns: getComputedStyle(node.querySelector('.br-results')).gridTemplateColumns
  }));
  await page.locator('.br-shell').screenshot({ path: path.join(__dirname, 'book-reader-mobile.png') });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.waitForTimeout(200);
  await page.locator('.br-shell').screenshot({ path: path.join(__dirname, 'book-reader-desktop.png') });

  const report = {
    baseUrl, bookCount, pageTotalAace29, originalAace29, canvasVisible,
    broadPredictions, refinedPredictions, correctedPredictions,
    searchStatus, resultCount, sourceWording: sourceWording.slice(0, 180),
    plainExplanation: plainExplanation.slice(0, 180), targetPage, jumpedPage, exactBadge,
    aciPageTotal, aciPredictions, ecpPageTotal, ecpMeta, textVisible, canvasHiddenForText, textStartsWithSource,
    oshaResult: oshaResult.slice(0, 180), mobile, consoleErrors, pageErrors, failedRequests
  };
  console.log(JSON.stringify(report, null, 2));

  const checks = [
    bookCount === 8,
    /135/.test(pageTotalAace29),
    /books\/aace29\.pdf$/.test(originalAace29 || ''),
    canvasVisible,
    broadPredictions.some(label => /^Schedule$/i.test(label)),
    refinedPredictions.length > 0 && refinedPredictions[0].toLowerCase().startsWith('schedule d'),
    correctedPredictions.some(item => /schedule/i.test(item.label) && /spelling/i.test(item.kind)),
    /ms/.test(searchStatus), resultCount > 0,
    /schedule|delay|analysis/i.test(sourceWording), plainExplanation.length > 20,
    targetPage === jumpedPage,
    /Exact phrase/.test(exactBadge),
    /11/.test(aciPageTotal), aciPredictions.some(label => /formwork/i.test(label)),
    /225/.test(ecpPageTotal), /OCR/.test(ecpMeta),
    textVisible, canvasHiddenForText, textStartsWithSource, /formwork/i.test(oshaResult),
    mobile.scrollWidth <= mobile.clientWidth + 2,
    consoleErrors.length === 0, pageErrors.length === 0, failedRequests.length === 0
  ];
  report.checks = checks;
  await browser.close();
  if (checks.some(check => !check)) process.exitCode = 1;
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
