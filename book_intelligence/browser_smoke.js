const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const baseUrl = process.env.BOOK_SEARCH_URL || 'http://127.0.0.1:8765/';
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.locator('#press').click();
  await page.locator('#master.show').waitFor({ timeout: 12000 });
  await page.locator('.tb').filter({ hasText: /^Library$/ }).click();
  await page.locator('.sb').filter({ hasText: /^Book Intelligence$/ }).click();
  await page.locator('.bi-search-lab').waitFor();

  const input = page.locator('.bi-deep-input');
  await input.fill('con');
  await page.waitForTimeout(180);
  const conPartial = await page.locator('.bi-suggestion strong').allTextContents();
  await input.fill('concrete');
  await page.waitForTimeout(220);
  const concreteSuggestions = await page.locator('.bi-suggestion strong').allTextContents();
  await page.locator('.bi-suggestion').filter({ hasText: 'Concrete works' }).first().click();
  await page.waitForTimeout(180);
  const concreteSummary = await page.locator('.bi-search-summary').innerText();
  const concreteSources = await page.locator('.bi-search-result .bi-result-head strong').allTextContents();
  const concreteExact = await page.locator('.bi-search-result .bi-exact-copy').first().innerText();
  const concretePlain = await page.locator('.bi-search-result .bi-plain').first().innerText();

  await input.fill('schedule');
  await page.waitForTimeout(220);
  const scheduleSuggestions = await page.locator('.bi-suggestion strong').allTextContents();
  await page.locator('.bi-suggestion').filter({ hasText: 'Schedule planning' }).first().click();
  await page.waitForTimeout(180);
  const scheduleSummary = await page.locator('.bi-search-summary').innerText();
  const scheduleSources = await page.locator('.bi-search-result .bi-result-head strong').allTextContents();
  const exactBox = await page.locator('.bi-search-result .bi-exact').first().boundingBox();
  const plainBox = await page.locator('.bi-search-result .bi-plain').first().boundingBox();
  await page.locator('.bi-search-lab').screenshot({ path: path.join(__dirname, 'book-search-desktop.png') });

  const allSourceOptions = await page.locator('.bi-source-filter option').count();
  await page.locator('.bi-source-filter').selectOption('aace29');
  await page.waitForTimeout(120);
  const filteredSources = await page.locator('.bi-search-result .bi-result-head strong').allTextContents();

  await page.locator('#langToggleTop').click();
  await page.locator('.bi-deep-input').waitFor();
  const arabicPlaceholder = await page.locator('.bi-deep-input').getAttribute('placeholder');
  await page.locator('.bi-deep-input').fill('برن');
  await page.waitForTimeout(180);
  const arabicSuggestions = await page.locator('.bi-suggestion strong').allTextContents();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(120);
  const mobile = await page.locator('.bi-search-lab').evaluate(node => ({
    clientWidth: node.clientWidth,
    scrollWidth: node.scrollWidth,
    exactColumns: getComputedStyle(node.querySelector('.bi-result-grid') || node).gridTemplateColumns
  }));
  await page.locator('.bi-search-lab').screenshot({ path: path.join(__dirname, 'book-search-mobile.png') });

  const report = {
    baseUrl,
    conPartial,
    concreteSuggestions,
    concreteSummary,
    concreteSourceCount: new Set(concreteSources).size,
    concreteExact: concreteExact.slice(0, 180),
    concretePlain: concretePlain.slice(0, 180),
    scheduleSuggestions,
    scheduleSummary,
    scheduleSourceCount: new Set(scheduleSources).size,
    sideBySide: Boolean(exactBox && plainBox && plainBox.x > exactBox.x && Math.abs(plainBox.y - exactBox.y) < 2),
    allSourceOptions,
    sourceFilterOnlyAace29: filteredSources.length > 0 && filteredSources.every(value => value.includes('AACE 29R-03')),
    arabicPlaceholder,
    arabicSuggestions,
    mobile,
    consoleErrors,
    pageErrors
  };
  console.log(JSON.stringify(report, null, 2));

  const checks = [
    conPartial.some(value => /Concrete|Constructability/i.test(value)),
    concreteSuggestions.some(value => value === 'Concrete works'),
    concreteSuggestions.some(value => /Formwork|Curing|Shoring/i.test(value)),
    report.concreteSourceCount >= 6,
    concreteExact.length > 80,
    /Concrete|Formwork|Curing|Shoring|Safety/i.test(concretePlain),
    scheduleSuggestions.some(value => value === 'Schedule planning'),
    scheduleSuggestions.some(value => /delay|critical|logic|baseline|basis/i.test(value)),
    report.scheduleSourceCount >= 5,
    report.sideBySide,
    allSourceOptions === 9,
    report.sourceFilterOnlyAace29,
    /جرّب/.test(arabicPlaceholder || ''),
    arabicSuggestions.length > 0,
    mobile.scrollWidth <= mobile.clientWidth + 2,
    consoleErrors.length === 0,
    pageErrors.length === 0
  ];
  await browser.close();
  if (checks.some(check => !check)) process.exitCode = 1;
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
