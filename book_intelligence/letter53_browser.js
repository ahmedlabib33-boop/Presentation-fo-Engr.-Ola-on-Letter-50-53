const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const baseUrl = process.env.LETTER53_URL || 'http://127.0.0.1:4173/';
  const browser = await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  const consoleErrors=[]; const pageErrors=[];
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
  page.on('pageerror',e=>pageErrors.push(e.message));
  await page.goto(baseUrl,{waitUntil:'networkidle'});
  await page.locator('#press').click();
  await page.locator('#master.show').waitFor({timeout:12000});

  const tabs=await page.locator('#tabbar .tb').allTextContents();
  await page.locator('#tabbar .tb').filter({hasText:/^Letter 053$/}).click();
  await page.locator('.sb').filter({hasText:/^23-point register$/}).click();
  const pointRows=await page.locator('#host > .sec:not([hidden]) .pane:not([hidden]) tbody tr').count();
  await page.locator('.sb').filter({hasText:/^Question register$/}).click();
  const questionRows=await page.locator('#host > .sec:not([hidden]) .pane:not([hidden]) table').first().locator('tbody tr').count();
  const contradictionRows=await page.locator('#host > .sec:not([hidden]) .pane:not([hidden]) table').nth(1).locator('tbody tr').count();
  await page.locator('.sb').filter({hasText:/^Formal response$/}).click();
  const letterSections=await page.locator('#host > .sec:not([hidden]) .pane:not([hidden]) .letter-section').count();

  await page.locator('#tabbar .tb').filter({hasText:/^Requests$/}).click();
  await page.locator('.sb').filter({hasText:/^Actions A–L$/}).click();
  const actionRows=await page.locator('#host > .sec:not([hidden]) .pane:not([hidden]) tbody tr').count();

  await page.locator('#tabbar .tb').filter({hasText:/Evidence and Verification Register/}).click();
  const evidenceTables=page.locator('#host > .sec:not([hidden]) .evidence-register table, #host > .sec:not([hidden]) h3.s + p + .tw table');
  const principalRows=await page.locator('#host > .sec:not([hidden]) .evidence-register tbody tr').count();
  const allVisibleTables=page.locator('#host > .sec:not([hidden]) table');
  const relationshipRows=await allVisibleTables.nth(1).locator('tbody tr').count();
  const evidenceColumns=await allVisibleTables.first().locator('thead th').count();
  const filter=page.locator('input[aria-label="Filter evidence register"]');
  await filter.fill('Excluded — not relied upon');
  const filteredVisible=await page.locator('#host > .sec:not([hidden]) .evidence-register tbody tr:not([hidden])').count();
  await filter.fill('');
  await page.locator('#host > .sec:not([hidden]) > .pane').screenshot({path:path.join(__dirname,'letter53-evidence-desktop.png')});

  await page.locator('#tabbar .tb').filter({hasText:/^Primavera Analyzer$/}).click();
  const analyzerFrame=page.frameLocator('iframe[title^="Primavera Analyzer"]');
  await analyzerFrame.locator('#leftSchedule').waitFor();
  await analyzerFrame.locator('#leftSchedule option').nth(4).waitFor({state:'attached',timeout:30000});
  await analyzerFrame.locator('#control24 tbody tr').nth(23).waitFor({state:'attached',timeout:30000});
  const analyzerSchedules=await analyzerFrame.locator('#leftSchedule option').count();
  const analyzerControlRows=await analyzerFrame.locator('#control24 tbody tr').count();

  await page.locator('#tabbar .tb').filter({hasText:/Evidence and Verification Register/}).click();

  await page.setViewportSize({width:390,height:844});
  const mobile=await page.locator('#host > .sec:not([hidden]) > .pane').evaluate(node=>({clientWidth:node.clientWidth,scrollWidth:node.scrollWidth,tableScrollers:[...node.querySelectorAll('.tw')].map(x=>({client:x.clientWidth,scroll:x.scrollWidth}))}));
  await page.locator('#host > .sec:not([hidden]) > .pane').screenshot({path:path.join(__dirname,'letter53-evidence-mobile.png'),fullPage:true});
  await page.locator('#langToggleTop').click();
  const direction=await page.evaluate(()=>document.documentElement.dir);

  const report={tabs,pointRows,questionRows,contradictionRows,letterSections,actionRows,principalRows,relationshipRows,evidenceColumns,filteredVisible,analyzerSchedules,analyzerControlRows,mobile,direction,consoleErrors,pageErrors};
  console.log(JSON.stringify(report,null,2));
  const checks=[tabs.includes('Evidence and Verification Register'),tabs.includes('Primavera Analyzer'),pointRows===23,questionRows===8,contradictionRows===3,letterSections===16,actionRows===12,principalRows===18,relationshipRows===24,evidenceColumns===18,filteredVisible===1,analyzerSchedules===5,analyzerControlRows===24,mobile.scrollWidth<=mobile.clientWidth+2,mobile.tableScrollers.every(x=>x.scroll>=x.client),direction==='rtl',consoleErrors.length===0,pageErrors.length===0];
  await browser.close();
  if(checks.some(x=>!x))process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
