const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

function countTableRows(text, target) {
  let table = '';
  let count = 0;
  for (const line of text.split(/\r?\n/)) {
    const columns = line.split('\t');
    if (columns[0] === '%T') table = columns[1];
    else if (columns[0] === '%R' && table === target) count += 1;
  }
  return count;
}

let browser;
(async () => {
  const baseUrl = process.env.PRIMAVERA_URL || 'http://127.0.0.1:4173/';
  browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('requestfailed', request => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText || ''}`));

  await page.goto(new URL('primavera-xer-analyzer.html', baseUrl).href, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelectorAll('#leftSchedule option').length === 5);
  const embeddedOptions = await page.locator('#leftSchedule option').count();
  const metricLabels = await page.locator('.metric h3').allTextContents();
  const milestoneCards = await page.locator('.metric').filter({ has: page.locator('h3', { hasText: /Project start|Ground floor|Project Finish|Data date/ }) }).allTextContents();
  const defaultNames = await page.locator('#overview .pill').allTextContents();

  await page.locator('#leftSchedule').selectOption('embedded-1');
  await page.locator('#rightSchedule').selectOption('embedded-1');
  await page.locator('#leftMode').selectOption('asis');
  await page.locator('#rightMode').selectOption('acepm');
  await page.locator('#compare').click();
  const controlledSummary = await page.locator('#overview').innerText();

  await page.locator('[data-pane="control24"]').click();
  const controlRows = await page.locator('#control24 tbody tr').count();
  const downloadButtons = await page.locator('#control24 .download').count();
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 10000 }),
    page.locator('#downloadA').click()
  ]);
  const downloadedText = fs.readFileSync(await download.path(), 'utf8');
  const originalText = fs.readFileSync(path.resolve(__dirname, '..', 'assets', 'xer', 'schedule-01.xer'), 'utf8');
  const downloadProof = {
    name: download.suggestedFilename(),
    taskDelta: countTableRows(downloadedText, 'TASK') - countTableRows(originalText, 'TASK'),
    relationshipDelta: countTableRows(downloadedText, 'TASKPRED') - countTableRows(originalText, 'TASKPRED')
  };

  await page.locator('#uploadXer').setInputFiles(path.resolve(__dirname, '..', 'assets', 'xer', 'schedule-03.xer'));
  await page.waitForFunction(() => document.querySelectorAll('#rightSchedule option').length === 6);
  const importedOptions = await page.locator('#rightSchedule option').count();
  const importedSelection = await page.locator('#rightSchedule option:checked').innerText();

  await page.locator('[data-pane="sourceapp"]').click();
  const sourceFrame = page.frameLocator('iframe[title="Supplied Primavera App"]');
  await sourceFrame.locator('body').waitFor();
  const sourceAppTextLength = (await sourceFrame.locator('body').innerText()).length;

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-pane="overview"]').click();
  const mobile = await page.locator('body').evaluate(node => ({
    clientWidth: node.clientWidth,
    scrollWidth: node.scrollWidth,
    metricColumns: getComputedStyle(node.querySelector('.metric-grid')).gridTemplateColumns
  }));
  await page.screenshot({ path: path.join(__dirname, 'primavera-analyzer-mobile.png'), fullPage: true });

  const report = {
    embeddedOptions,
    importedOptions,
    importedSelection,
    metricLabels,
    milestoneCards,
    defaultNames,
    controlRows,
    downloadButtons,
    downloadProof,
    controlled24Matched: /24 matches A\/B: 0\/24/.test(controlledSummary),
    controlledResult: /24 matched; 18 reset; 6 deleted/.test(controlledSummary),
    sourceAppTextLength,
    mobile,
    consoleErrors,
    pageErrors,
    failedRequests
  };
  console.log(JSON.stringify(report, null, 2));

  const requiredMetrics = [
    'Project start', 'Ground floor / works milestone', 'Project Finish milestone', 'Data date',
    'Relationships', 'Relationships with lag', 'Calendars', 'Progress %', 'Schedule % complete',
    'Activity % complete', 'Performance % complete', 'Budgeted total cost', 'Earned Value',
    'Resource assignments', 'Labor resources', 'Non-labor resources', 'Material resources'
  ];
  const checks = [
    embeddedOptions === 5,
    importedOptions === 6,
    importedSelection === 'schedule-03.xer',
    requiredMetrics.every(label => metricLabels.includes(label)),
    milestoneCards.length === 4 && milestoneCards.every(value => !/Not located|Not available/.test(value)),
    controlRows === 24,
    downloadButtons === 2,
    /_ACEPM_24_CONTROLLED\.xer$/i.test(downloadProof.name),
    downloadProof.taskDelta === 0,
    downloadProof.relationshipDelta === -6,
    report.controlled24Matched,
    report.controlledResult,
    sourceAppTextLength > 500,
    mobile.scrollWidth <= mobile.clientWidth + 2,
    consoleErrors.length === 0,
    pageErrors.length === 0,
    failedRequests.length === 0
  ];
  await browser.close();
  if (checks.some(check => !check)) process.exitCode = 1;
})().catch(async error => {
  console.error(error);
  if (browser) await browser.close();
  process.exitCode = 1;
});
