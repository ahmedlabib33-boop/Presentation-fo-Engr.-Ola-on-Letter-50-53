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
  const letter050Count=await pane.locator('.protection-letter050').count();
  const letter104Count=await pane.locator('.protection-letter104').count();
  const letter053Count=await pane.locator('.protection-letter053').count();
  const questionCount=await pane.locator('.protection-chain-question').count();
  const chainConclusionCount=await pane.locator('.protection-chain-conclusion').count();
  const positionCount=await pane.locator('.protection-samco-position').count();
  const conclusionCount=await pane.locator('.protection-protected-conclusion').count();
  const preservedPoint02Labels=await sections.nth(1).evaluate(node=>/SAMCO position and record test 02/i.test(node.querySelector('.protection-samco-position')?.textContent||'')&&/Protected point 02/i.test(node.querySelector('.protection-protected-conclusion')?.textContent||''));
  const correspondenceCompleteness=await pane.locator('.protection-correspondence-card').evaluateAll(nodes=>nodes.length===36&&nodes.every(node=>node.querySelector('strong')?.textContent.trim()&&node.querySelector('.protection-correspondence-source')?.textContent.trim()));
  const englishAcepmSourcePolicy=await pane.locator('.protection-letter050,.protection-letter053').evaluateAll(nodes=>nodes.length===24&&nodes.every(node=>{
    const body=node.querySelector('strong')?.textContent||'';
    const source=node.querySelector('.protection-correspondence-source')?.textContent||'';
    const expected=node.classList.contains('protection-letter050')?/Engineer Letter 050/:/Engineer Letter 053/;
    return expected.test(source)&&!/(SAMCO|STR-104|Contract|FIDIC|AACE|XER|EV-|Letter 055|action register)/i.test(source)&&!/(STR-104|Contract|FIDIC|AACE|XER|Letter 055|action register)/i.test(body);
  }));
  const english104SourcePolicy=await pane.locator('.protection-letter104').evaluateAll(nodes=>nodes.length===12&&nodes.every(node=>/SAMCO STR-104/.test(node.querySelector('.protection-correspondence-source')?.textContent||'')));
  const framedPoints=await pane.locator('.protection-point').evaluateAll(nodes=>nodes.length===12&&nodes.every((node,index)=>{
    const style=getComputedStyle(node);const arrow=getComputedStyle(node,'::after');
    return style.borderTopStyle==='solid'&&parseFloat(style.borderTopWidth)>0&&(index===nodes.length-1||arrow.content.includes('↓'));
  }));
  const sideFlowArrows=await pane.locator('.protection-flow-arrow').evaluateAll(nodes=>nodes.length===72&&nodes.every(node=>getComputedStyle(node,'::after').content.includes('↓')));
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
  const arabicAcepmSourcePolicy=await pane.locator('.protection-letter050,.protection-letter053').evaluateAll(nodes=>nodes.length===24&&nodes.every(node=>{
    const body=node.querySelector('strong')?.textContent||'';
    const source=node.querySelector('.protection-correspondence-source')?.textContent||'';
    const expected=node.classList.contains('protection-letter050')?/050/:/053/;
    return /خطاب المهندس/.test(source)&&expected.test(source)&&!/(سامكو|STR-104|العقد|FIDIC|AACE|XER|EV-|055|سجل الإجراءات)/i.test(source)&&!/(STR-104|العقد|FIDIC|AACE|XER|055|سجل الإجراءات)/i.test(body);
  }));
  const arabic104SourcePolicy=await pane.locator('.protection-letter104').evaluateAll(nodes=>nodes.length===12&&nodes.every(node=>/خطاب سامكو STR-104/.test(node.querySelector('.protection-correspondence-source')?.textContent||'')));
  await pane.locator('.protection-sources-expand-all').click();
  const arabicChartParity=await pane.locator('.protection-point').evaluateAll(nodes=>nodes.length===12&&nodes.every(node=>node.querySelector('.protection-letter050 strong')?.textContent.trim()&&node.querySelector('.protection-letter104 strong')?.textContent.trim()&&node.querySelector('.protection-letter053 strong')?.textContent.trim()&&node.querySelector('.protection-chain-question strong')?.textContent.trim()&&node.querySelector('.protection-chain-conclusion p')?.textContent.trim()&&node.querySelector('.protection-samco-position')&&node.querySelector('.protection-protected-conclusion')));
  const arabic=await sections.evaluateAll(nodes=>nodes.map(node=>({
    title:node.querySelector('h3')?.textContent.trim(),
    shots:node.querySelectorAll('.protection-source-shot').length,
    captions:node.querySelectorAll('.protection-source-shot figcaption').length,
    broken:[...node.querySelectorAll('.protection-source-shot img')].filter(image=>!image.complete||!image.naturalWidth).length
  })));

  const sourceControls={assessmentPattern:/Protection under review/.test(storyRoot)&&/SAMCO CONTRACTUAL POSITION/.test(storyRoot)&&letter050Count===12&&letter104Count===12&&letter053Count===12&&questionCount===12&&chainConclusionCount===12&&positionCount===12&&conclusionCount===12&&correspondenceCompleteness,preservedPoint02Labels,correspondenceChainSources:englishAcepmSourcePolicy&&english104SourcePolicy&&arabicAcepmSourcePolicy&&arabic104SourcePolicy,framedPoints,sideFlowArrows,initialRetracted,expandedAll,individualRetracted,individualExpanded,retractedAll,arabicLabels:/توسيع (?:جميع )?المصادر/.test(arabicControls)&&/طي (?:جميع )?المصادر/.test(arabicControls)};
  const report={sections:english.length,totalShots:english.reduce((sum,point)=>sum+point.shots,0),perPoint:english.map(point=>point.shots),english,sourceControls,arabicChartParity,arabicParity:arabic.length===english.length&&arabic.every((point,index)=>point.shots===english[index].shots&&point.captions===point.shots&&point.broken===0),sources,lightboxOpen,mobile,direction,failedResponses,pageErrors};
  console.log(JSON.stringify(report,null,2));
  const checks=[english.length===12,english.every(point=>point.shots>=3&&point.captions===point.shots&&point.broken===0),Object.values(sourceControls).every(Boolean),arabicChartParity,report.arabicParity,Object.values(sources).every(Boolean),lightboxOpen,mobile.scrollWidth<=mobile.clientWidth+2,direction==='rtl',failedResponses.length===0,pageErrors.length===0];
  await browser.close();
  if(checks.some(check=>!check)) process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
