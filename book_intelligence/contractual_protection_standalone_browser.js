const { chromium } = require('playwright');
const os = require('os');
const path = require('path');

(async () => {
  const url = process.env.PROTECTION_URL || 'http://127.0.0.1:4173/samco-contractual-protection.html';
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  const pageErrors = [];
  const failedResponses = [];
  const requestedAssets = [];

  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('request', request => {
    const requestUrl = request.url();
    if (requestUrl !== url && !requestUrl.startsWith('data:') && requestUrl !== 'about:blank') {
      requestedAssets.push(requestUrl);
    }
  });
  page.on('response', response => {
    if (response.status() >= 400) failedResponses.push({status:response.status(),url:response.url()});
  });

  await page.goto(url, {waitUntil:'domcontentloaded'});
  const pane = page.locator('#host > .contractual-protection-sec:not([hidden]) > .pane');
  await pane.locator('.protection-story-root').waitFor({timeout:15000});

  const entryHidden = await page.locator('#entry').evaluate(node => node.hidden || getComputedStyle(node).display === 'none');
  const masterVisible = await page.locator('#master.show').isVisible();
  const title = await page.title();
  const removedBlocksEnglish = {
    defensiveLetterHeading: await pane.locator('h3.s').filter({hasText:/Rights-reserving defensive letter/i}).count(),
    addressee: await pane.locator('.protection-letter > .letter-addressee').count()
  };
  const sections = pane.locator('.protection-point');
  const sectionCount = await sections.count();
  const chainCounts = {};
  for (const className of [
    'protection-letter050',
    'protection-letter104',
    'protection-letter053',
    'protection-chain-question',
    'protection-chain-conclusion',
    'protection-samco-position',
    'protection-protected-conclusion'
  ]) {
    chainCounts[className] = await pane.locator(`.${className}`).count();
  }

  const point02 = await sections.nth(1).evaluate(node => ({
    position: node.querySelector('.protection-samco-position .protection-node-label')?.textContent.trim(),
    protected: node.querySelector('.protection-protected-conclusion .protection-node-label')?.textContent.trim()
  }));
  const arrows = await pane.locator('.protection-flow-arrow').count();
  const sourceBodies = pane.locator('.protection-evidence-body');
  const initiallyRetracted = await sourceBodies.evaluateAll(nodes => nodes.length === 12 && nodes.every(node => node.hidden));

  await pane.locator('.protection-sources-expand-all').click();
  const images = pane.locator('.protection-source-shot img');
  await images.evaluateAll(nodes => nodes.forEach(node => node.loading = 'eager'));
  await page.waitForFunction(() => {
    const nodes = [...document.querySelectorAll('#host > .contractual-protection-sec:not([hidden]) .protection-source-shot img')];
    return nodes.length > 0 && nodes.every(node => node.complete && node.naturalWidth > 0);
  }, null, {timeout:60000});

  const imageAudit = await images.evaluateAll(nodes => ({
    count: nodes.length,
    embedded: nodes.every(node => node.src.startsWith('data:image/')),
    decoded: nodes.every(node => node.complete && node.naturalWidth > 0 && node.naturalHeight > 0)
  }));
  const captions = await pane.locator('.protection-source-shot figcaption').allTextContents();
  const evidenceCoverage = {
    contract: captions.some(text => /Executed Contract/.test(text)),
    fidic: captions.some(text => /FIDIC 1999/.test(text)),
    aace29: captions.some(text => /AACE 29R-03/.test(text)),
    aace38: captions.some(text => /AACE 38R-06/.test(text)),
    aace48: captions.some(text => /AACE 48R-06/.test(text)),
    aci: captions.some(text => /ACI 347/.test(text)),
    ecp: captions.some(text => /ECP 203\/2018/.test(text)),
    osha: captions.some(text => /OSHA 1926\.703/.test(text)),
    schedules01to05: [1,2,3,4,5].every(number => captions.some(text => new RegExp(`Schedule 0?${number}\\b`).test(text))),
    letters050104053: captions.some(text => /Letter 050/.test(text)) && captions.some(text => /STR-104/.test(text)) && captions.some(text => /Letter 053/.test(text))
  };

  const firstImage = images.first();
  await firstImage.click();
  const lightbox = await page.locator('#lb.on #lbimg').evaluate(node => node.visible !== false && node.src.startsWith('data:image/') && node.naturalWidth > 0);
  await page.locator('#lb').click({position:{x:8,y:8}});

  const desktopWidth = await pane.evaluate(node => ({clientWidth:node.clientWidth,scrollWidth:node.scrollWidth}));
  await page.screenshot({path:path.join(os.tmpdir(),'samco-contractual-protection-desktop.png'),fullPage:false});

  await page.setViewportSize({width:390,height:844});
  await sections.nth(1).scrollIntoViewIfNeeded();
  const mobileWidth = await pane.evaluate(node => ({clientWidth:node.clientWidth,scrollWidth:node.scrollWidth}));
  await page.screenshot({path:path.join(os.tmpdir(),'samco-contractual-protection-mobile.png'),fullPage:false});

  await page.locator('#langToggleTop').click();
  await page.waitForFunction(() => document.documentElement.dir === 'rtl');
  const arabicPane = page.locator('#host > .contractual-protection-sec:not([hidden]) > .pane');
  await arabicPane.locator('.protection-sources-expand-all').click();
  const arabicAudit = await arabicPane.evaluate(node => ({
    dir: document.documentElement.dir,
    points: node.querySelectorAll('.protection-point').length,
    sources: node.querySelectorAll('.protection-source-shot').length,
    point02Position: node.querySelectorAll('.protection-point')[1]?.querySelector('.protection-samco-position .protection-node-label')?.textContent.trim(),
    point02Protected: node.querySelectorAll('.protection-point')[1]?.querySelector('.protection-protected-conclusion .protection-node-label')?.textContent.trim(),
    standaloneLabel: node.querySelector('.standalone-protection-label')?.textContent.trim(),
    addressee: node.querySelectorAll('.protection-letter > .letter-addressee').length
  }));

  const report = {
    url,
    title,
    entryHidden,
    masterVisible,
    removedBlocksEnglish,
    sectionCount,
    chainCounts,
    point02,
    arrows,
    initiallyRetracted,
    imageAudit,
    evidenceCoverage,
    lightbox,
    desktopWidth,
    mobileWidth,
    arabicAudit,
    requestedAssets,
    failedResponses,
    pageErrors
  };
  console.log(JSON.stringify(report, null, 2));

  const checks = [
    /SAMCO Contractual Protection/.test(title),
    entryHidden,
    masterVisible,
    removedBlocksEnglish.defensiveLetterHeading === 0,
    removedBlocksEnglish.addressee === 0,
    sectionCount === 12,
    Object.values(chainCounts).every(count => count === 12),
    point02.position === 'SAMCO position and record test 02',
    point02.protected === 'Protected point 02',
    arrows === 72,
    initiallyRetracted,
    imageAudit.count === 87,
    imageAudit.embedded,
    imageAudit.decoded,
    Object.values(evidenceCoverage).every(Boolean),
    lightbox,
    desktopWidth.scrollWidth <= desktopWidth.clientWidth + 2,
    mobileWidth.scrollWidth <= mobileWidth.clientWidth + 2,
    arabicAudit.dir === 'rtl',
    arabicAudit.points === 12,
    arabicAudit.sources === 87,
    /02$/.test(arabicAudit.point02Position || ''),
    /02$/.test(arabicAudit.point02Protected || ''),
    /الحماية التعاقدية/.test(arabicAudit.standaloneLabel || ''),
    arabicAudit.addressee === 0,
    requestedAssets.length === 0,
    failedResponses.length === 0,
    pageErrors.length === 0
  ];

  await browser.close();
  if (checks.some(check => !check)) process.exitCode = 1;
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
