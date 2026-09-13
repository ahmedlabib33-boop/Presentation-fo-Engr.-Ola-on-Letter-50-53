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

  await page.locator('#tabbar .tb').filter({hasText:/^SAMCO Contractual Protection$/}).click();
  const protectionPane=page.locator('#host > .contractual-protection-sec:not([hidden]) > .pane');
  const protectionSections=protectionPane.locator('.protection-letter > .letter-section');
  const protectionSectionCount=await protectionSections.count();
  await protectionPane.locator('.protection-source-shot img').evaluateAll(images=>images.forEach(image=>image.loading='eager'));
  await page.waitForFunction(()=>[...document.querySelectorAll('#host > .contractual-protection-sec:not([hidden]) .protection-source-shot img')].every(image=>image.complete && image.naturalWidth>0),null,{timeout:30000});
  const protectionEvidence=await protectionSections.evaluateAll(sections=>sections.map(section=>({
    title:section.querySelector('h3')?.textContent.trim(),
    shots:section.querySelectorAll('.protection-source-shot').length,
    captions:section.querySelectorAll('.protection-source-shot figcaption').length,
    broken:[...section.querySelectorAll('.protection-source-shot img')].filter(image=>!image.complete||!image.naturalWidth).length
  })));
  const protectionCaptions=await protectionPane.locator('.protection-source-shot figcaption').allTextContents();
  await page.screenshot({path:path.join(__dirname,'protection-evidence-desktop.png'),fullPage:false});

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
  await page.locator('#tabbar .tb').filter({hasText:/^SAMCO Contractual Protection$/}).click();
  const protectionMobile=await protectionPane.evaluate(node=>({clientWidth:node.clientWidth,scrollWidth:node.scrollWidth}));
  await page.screenshot({path:path.join(__dirname,'protection-evidence-mobile.png'),fullPage:false});
  await page.locator('#langToggleTop').click();
  const direction=await page.evaluate(()=>document.documentElement.dir);
  const arabicProtectionEvidence=await protectionSections.evaluateAll(sections=>sections.map(section=>({
    title:section.querySelector('h3')?.textContent.trim(),
    shots:section.querySelectorAll('.protection-source-shot').length,
    captions:section.querySelectorAll('.protection-source-shot figcaption').length,
    broken:[...section.querySelectorAll('.protection-source-shot img')].filter(image=>!image.complete||!image.naturalWidth).length
  })));

  const report={tabs,pointRows,questionRows,contradictionRows,letterSections,protectionSectionCount,protectionEvidence,arabicProtectionEvidence,protectionSources:{fidic:protectionCaptions.some(x=>/FIDIC/.test(x)),aace29:protectionCaptions.some(x=>/AACE 29R-03/.test(x)),aace38:protectionCaptions.some(x=>/AACE 38R-06/.test(x)),aace48:protectionCaptions.some(x=>/AACE 48R-06/.test(x)),aci347:protectionCaptions.some(x=>/ACI 347R-14/.test(x)),aci3472:protectionCaptions.some(x=>/ACI 347\.2R-17/.test(x)),ecp203:protectionCaptions.some(x=>/ECP 203\/2018/.test(x)),osha:protectionCaptions.some(x=>/OSHA 1926\.703/.test(x)),contract:protectionCaptions.some(x=>/Executed Contract/.test(x)),allFiveSchedules:[1,2,3,4,5].every(number=>protectionCaptions.some(x=>new RegExp(`Schedule 0?${number}\\b`).test(x)))},actionRows,principalRows,relationshipRows,evidenceColumns,filteredVisible,analyzerSchedules,analyzerControlRows,mobile,protectionMobile,direction,consoleErrors,pageErrors};
  console.log(JSON.stringify(report,null,2));
  const checks=[tabs.includes('Evidence and Verification Register'),tabs.includes('Primavera Analyzer'),tabs.includes('SAMCO Contractual Protection'),pointRows===23,questionRows===8,contradictionRows===3,letterSections===16,protectionSectionCount===12,protectionEvidence.every(point=>point.shots>=3&&point.shots===point.captions&&point.broken===0),arabicProtectionEvidence.length===12,arabicProtectionEvidence.every((point,index)=>point.shots===protectionEvidence[index].shots&&point.shots===point.captions&&point.broken===0),Object.values(report.protectionSources).every(Boolean),actionRows===12,principalRows===18,relationshipRows===24,evidenceColumns===18,filteredVisible===1,analyzerSchedules===5,analyzerControlRows===24,mobile.scrollWidth<=mobile.clientWidth+2,mobile.tableScrollers.every(x=>x.scroll>=x.client),protectionMobile.scrollWidth<=protectionMobile.clientWidth+2,direction==='rtl',consoleErrors.length===0,pageErrors.length===0];
  await browser.close();
  if(checks.some(x=>!x))process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
