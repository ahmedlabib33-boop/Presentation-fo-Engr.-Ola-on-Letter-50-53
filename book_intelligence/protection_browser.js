const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const baseUrl = process.env.LETTER53_URL || 'http://127.0.0.1:4173/';
  const browser = await chromium.launch({headless:true, executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  const pageErrors=[];
  const failedResponses=[];
  page.on('pageerror',error=>pageErrors.push(error.message));
  page.on('response',response=>{
    if(response.status()>=400 && !response.url().includes('/_vercel/insights/')) failedResponses.push({status:response.status(),url:response.url()});
  });

  console.log('open');
  await page.goto(baseUrl,{waitUntil:'domcontentloaded'});
  await page.locator('#press').click();
  await page.locator('#master.show').waitFor({timeout:12000});
  await page.locator('#tabbar .tb').filter({hasText:/^SAMCO Contractual Protection$/}).click();
  const pane=page.locator('#host > .contractual-protection-sec:not([hidden]) > .pane');
  const sections=pane.locator('.protection-letter > .letter-section');
  await sections.first().waitFor();

  console.log('test source expand and retract controls');
  const sourceBodies=pane.locator('.protection-evidence-body');
  const sourceToggles=pane.locator('.protection-evidence-toggle');
  const storyRoot=await pane.locator('.protection-story-root').textContent();
  const protectedPointLabels=await pane.locator('.protection-node-label').count();
  const initialRetracted=await sourceBodies.evaluateAll(nodes=>nodes.length===12&&nodes.every(node=>node.hidden));
  await pane.locator('.protection-story-root').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(__dirname,'protection-sources-retracted-desktop.png'),fullPage:false});
  await pane.locator('.protection-sources-expand-all').click();
  const expandedAll=await sourceBodies.evaluateAll(nodes=>nodes.length===12&&nodes.every(node=>!node.hidden));
  await sourceToggles.first().click();
  const individualRetracted=await sourceBodies.first().evaluate(node=>node.hidden)&&await sourceToggles.first().getAttribute('aria-expanded')==='false';
  await sourceToggles.first().click();
  const individualExpanded=await sourceBodies.first().evaluate(node=>!node.hidden)&&await sourceToggles.first().getAttribute('aria-expanded')==='true';
  await pane.locator('.protection-sources-retract-all').click();
  const retractedAll=await sourceBodies.evaluateAll(nodes=>nodes.length===12&&nodes.every(node=>node.hidden));
  await pane.locator('.protection-sources-expand-all').click();

  console.log('load evidence images');
  await pane.locator('.protection-source-shot img').evaluateAll(images=>images.forEach(image=>image.loading='eager'));
  await page.waitForFunction(()=>[...document.querySelectorAll('#host > .contractual-protection-sec:not([hidden]) .protection-source-shot img')].every(image=>image.complete && image.naturalWidth>0),null,{timeout:45000});

  const english=await sections.evaluateAll(nodes=>nodes.map(node=>({
    title:node.querySelector('h3')?.textContent.trim(),
    shots:node.querySelectorAll('.protection-source-shot').length,
    captions:node.querySelectorAll('.protection-source-shot figcaption').length,
    broken:[...node.querySelectorAll('.protection-source-shot img')].filter(image=>!image.complete||!image.naturalWidth).length
  })));
  const captions=await pane.locator('.protection-source-shot figcaption').allTextContents();
  const sources={
    contract:captions.some(text=>/Executed Contract/.test(text)),
    fidic:captions.some(text=>/FIDIC 1999/.test(text)),
    aace29:captions.some(text=>/AACE 29R-03/.test(text)),
    aace38:captions.some(text=>/AACE 38R-06/.test(text)),
    aace48:captions.some(text=>/AACE 48R-06/.test(text)),
    aci347:captions.some(text=>/ACI 347R-14/.test(text)),
    aci3472:captions.some(text=>/ACI 347\.2R-17/.test(text)),
    ecp203:captions.some(text=>/ECP 203\/2018/.test(text)),
    osha:captions.some(text=>/OSHA 1926\.703/.test(text)),
    schedules:[1,2,3,4,5].every(number=>captions.some(text=>new RegExp(`Schedule 0?${number}\\b`).test(text)))
  };

  console.log('test lightbox');
  const firstImage=pane.locator('.protection-source-shot img').first();
  await firstImage.click();
  const lightboxOpen=await page.locator('#lb.on #lbimg').isVisible();
  await page.locator('#lb').click({position:{x:10,y:10}});

  await sections.nth(1).scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(__dirname,'protection-point-2-desktop.png'),fullPage:false});
  await sections.nth(5).scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(__dirname,'protection-point-6-desktop.png'),fullPage:false});

  console.log('mobile and Arabic parity');
  await page.setViewportSize({width:390,height:844});
  await pane.locator('.protection-sources-retract-all').click();
  await sections.nth(5).scrollIntoViewIfNeeded();
  const mobile=await pane.evaluate(node=>({clientWidth:node.clientWidth,scrollWidth:node.scrollWidth}));
  await page.screenshot({path:path.join(__dirname,'protection-sources-retracted-mobile.png'),fullPage:false});
  await sourceToggles.nth(5).click();
  await page.screenshot({path:path.join(__dirname,'protection-point-6-mobile.png'),fullPage:false});
  await page.locator('#langToggleTop').click();
  const direction=await page.evaluate(()=>document.documentElement.dir);
  const arabicControls=await pane.locator('.protection-sources-toolbar').textContent();
  await pane.locator('.protection-sources-expand-all').click();
  const arabic=await sections.evaluateAll(nodes=>nodes.map(node=>({
    title:node.querySelector('h3')?.textContent.trim(),
    shots:node.querySelectorAll('.protection-source-shot').length,
    captions:node.querySelectorAll('.protection-source-shot figcaption').length,
    broken:[...node.querySelectorAll('.protection-source-shot img')].filter(image=>!image.complete||!image.naturalWidth).length
  })));

  const sourceControls={assessmentPattern:/Protection under review/.test(storyRoot)&&/SAMCO CONTRACTUAL POSITION/.test(storyRoot)&&protectedPointLabels===12,initialRetracted,expandedAll,individualRetracted,individualExpanded,retractedAll,arabicLabels:/توسيع (?:جميع )?المصادر/.test(arabicControls)&&/طي (?:جميع )?المصادر/.test(arabicControls)};
  const report={sections:english.length,totalShots:english.reduce((sum,point)=>sum+point.shots,0),perPoint:english.map(point=>point.shots),english,sourceControls,arabicParity:arabic.length===english.length&&arabic.every((point,index)=>point.shots===english[index].shots&&point.captions===point.shots&&point.broken===0),sources,lightboxOpen,mobile,direction,failedResponses,pageErrors};
  console.log(JSON.stringify(report,null,2));
  const checks=[english.length===12,english.every(point=>point.shots>=3&&point.captions===point.shots&&point.broken===0),Object.values(sourceControls).every(Boolean),report.arabicParity,Object.values(sources).every(Boolean),lightboxOpen,mobile.scrollWidth<=mobile.clientWidth+2,direction==='rtl',failedResponses.length===0,pageErrors.length===0];
  await browser.close();
  if(checks.some(check=>!check)) process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
