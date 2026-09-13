const {chromium}=require('playwright');
const path=require('path');

(async()=>{
  const baseUrl=process.env.IFC_MOVEMENT_URL||'http://127.0.0.1:8765/';
  const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const context=await browser.newContext({viewport:{width:1280,height:900}});
  const page=await context.newPage();
  const consoleErrors=[],pageErrors=[],failedRequests=[];
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
  page.on('pageerror',error=>pageErrors.push(error.message));
  page.on('requestfailed',request=>{if(!request.url().startsWith('chrome-extension://'))failedRequests.push(`${request.url()} ${request.failure()?.errorText||''}`);});

  await page.goto(baseUrl,{waitUntil:'networkidle'});
  await page.locator('#press').click();
  await page.locator('#master.show').waitFor({timeout:12000});
  await page.locator('.tb').filter({hasText:/^Event 2 - IFC$/}).click();
  await page.locator('.sb').filter({hasText:/^What happened$/}).click();

  const chart=page.locator('.chart').filter({hasText:'Event 2 window and before / after schedule scenarios'});
  const timeline=chart.locator('.e2-event-desktop');
  const timelineProof=await timeline.evaluate(node=>{
    const svg=node.querySelector('svg');
    const rect=svg.querySelector('rect');
    const labels=['Revised IFC package','Contractor notifies','RFI 1','Notice of claim','Modified package','RFI closed'];
    const nodes=[...svg.querySelectorAll('text')].filter(text=>labels.includes(text.textContent));
    const boxes=nodes.map(text=>({label:text.textContent,...text.getBBox()}));
    const overlaps=[];
    for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
      const a=boxes[i],b=boxes[j];
      if(a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y)overlaps.push([a.label,b.label]);
    }
    return {
      clientWidth:node.clientWidth,
      svgWidth:svg.getBoundingClientRect().width,
      eventBandRatio:Number(rect.getAttribute('width'))/Number(svg.viewBox.baseVal.width),
      viewBox:[svg.viewBox.baseVal.width,svg.viewBox.baseVal.height],
      boxes,overlaps
    };
  });
  const scenarioProof=await chart.locator('.scenario-row').evaluateAll(rows=>rows.map(row=>({
    source:row.querySelector('.scenario-source')?.textContent.trim(),
    scenario:row.querySelector('.scenario-identity b')?.textContent.trim(),
    bars:[...row.querySelectorAll('.float-line')].map(line=>({label:line.querySelector('.float-label')?.textContent.trim(),value:line.querySelector('.float-value')?.textContent.trim(),width:line.querySelector('.float-fill')?.getBoundingClientRect().width})),
    finish:[...row.querySelectorAll('.finish-dates span')].map(node=>node.textContent.replace(/\s+/g,' ').trim()),
    columns:[...row.children].map(node=>node.getBoundingClientRect().x)
  })));
  await chart.screenshot({path:path.join(__dirname,'ifc-comparison-desktop.png')});

  const section=page.locator('.schedule-movement');
  const table=section.locator('table');
  await table.waitFor();
  const headers=await table.locator('thead th .st-sort-label').allTextContents();
  const rows=await table.locator('tbody tr').evaluateAll(items=>items.map(row=>[...row.cells].map(cell=>(cell.textContent||'').replace(/\s+/g,' ').trim())));
  const tableProof={
    heading:await section.locator('h3').innerText(),
    source:await section.locator('.ev').innerText(),
    headers,rows,
    smartKey:await table.getAttribute('data-smart-table'),
    toolbar:await section.locator('.st-toolbar').count()
  };

  const sourceBundle=page.locator('details.schedule-source-bundle');
  await sourceBundle.evaluate(node=>{node.open=true;});
  const pdfCards=sourceBundle.locator('details.pdf-source-card');
  const pdfTitles=await pdfCards.locator('.pdf-source-copy b').allTextContents();
  const pdfLinks=await pdfCards.locator('a.pdf-open').evaluateAll(items=>items.map(item=>item.getAttribute('href')));
  const pdfResponses=[];
  for(const href of pdfLinks){
    const response=await page.request.get(new URL(href,baseUrl).href);
    pdfResponses.push({href,status:response.status(),type:response.headers()['content-type']||'',bytes:(await response.body()).length});
  }
  const firstEmbeddedSrc=await pdfCards.first().locator('.pdf-source-frame').getAttribute('data-src');

  await page.screenshot({path:path.join(__dirname,'ifc-movement-desktop.png'),fullPage:true});
  await page.setViewportSize({width:652,height:844});
  await chart.scrollIntoViewIfNeeded();
  const narrow=await chart.evaluate(node=>({
    desktop:getComputedStyle(node.querySelector('.e2-event-desktop')).display,
    mobileTimeline:getComputedStyle(node.querySelector('.e2-event-mobile')).display,
    columns:getComputedStyle(node.querySelector('.scenario-row')).gridTemplateColumns,
    pageOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
    bounds:[...node.querySelectorAll('.scenario-row')].map(row=>{const r=row.getBoundingClientRect();return {left:r.left,right:r.right};})
  }));
  await chart.screenshot({path:path.join(__dirname,'ifc-comparison-652px.png')});
  await page.setViewportSize({width:390,height:844});
  await chart.scrollIntoViewIfNeeded();
  const mobile=await chart.evaluate(node=>{
    const rows=[...node.querySelectorAll('.scenario-row')];
    const bounds=rows.map(row=>{const r=row.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width,rail:row.querySelector('.finish-rail')?.getBoundingClientRect().width};});
    const desktop=getComputedStyle(node.querySelector('.e2-event-desktop')).display;
    const mobileTimeline=getComputedStyle(node.querySelector('.e2-event-mobile')).display;
    const pdfGrid=getComputedStyle(document.querySelector('.pdf-source-grid')).gridTemplateColumns;
    return {desktop,mobileTimeline,pdfGrid,bounds,pageOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
  });
  await chart.screenshot({path:path.join(__dirname,'ifc-comparison-mobile-full.png')});
  await page.locator('.pdf-source-grid').screenshot({path:path.join(__dirname,'ifc-source-cards-mobile.png')});
  await page.screenshot({path:path.join(__dirname,'ifc-movement-mobile.png'),fullPage:false});

  const expectedHeaders=['Comparison / Source','Schedule Scenario','Total Float — Before','Total Float — After','TF Movement','Project Finish — Before','Project Finish — After','Project Finish Movement'];
  const expectedRows=[
    ['02 − 01','Prospective time impact analysis','-87 d','-158 d','-71 d','6-Jul-27','15-Sep-27','+71 d delay'],
    ['03 − 01','Actual durations, original logic kept (24 relationships)','-87 d','-124 d','-37 d','6-Jul-27','12-Aug-27','+37 d delay'],
    ['05 − 04','Actual durations, 24 relationships removed','-73 d','-108 d','-35 d','22-Jun-27','27-Jul-27','+35 d delay'],
    ['ACEPM Letter 50','Engineer’s Event 02 assessment','-87 d','-99 d','-12 d','6-Jul-27','18-Jul-27','+12 d delay']
  ];
  const report={baseUrl,timelineProof,scenarioProof,tableProof,pdfTitles,pdfResponses,firstEmbeddedSrc,narrow,mobile,consoleErrors,pageErrors,failedRequests};
  console.log(JSON.stringify(report,null,2));
  const checks=[
    scenarioProof.length===4,
    scenarioProof.every(row=>row.bars.length===2&&row.bars[1].width>row.bars[0].width),
    scenarioProof.map(row=>row.finish[1]).join('|')==='+71 d delay|+37 d delay|+35 d delay|+12 d delay',
    scenarioProof.every(row=>row.columns[0]<row.columns[1]&&row.columns[1]<row.columns[2]),
    timelineProof.svgWidth>=timelineProof.clientWidth-2,
    timelineProof.eventBandRatio>.8,
    timelineProof.overlaps.length===0,
    JSON.stringify(headers)===JSON.stringify(expectedHeaders),
    JSON.stringify(rows)===JSON.stringify(expectedRows),
    Boolean(tableProof.smartKey),tableProof.toolbar===1,
    /Sheet1, cells A1:H5/.test(tableProof.source),
    pdfCards&&pdfTitles.length===5,pdfResponses.every(item=>item.status===200&&/pdf/i.test(item.type)&&item.bytes>70000),
    /01-prospective-before-fragnet\.pdf/.test(firstEmbeddedSrc||''),
    narrow.desktop==='none',narrow.mobileTimeline!=='none',narrow.columns.split(' ').length===1,narrow.pageOverflow<=1,
    narrow.bounds.every(box=>box.left>=0&&box.right<=652),
    mobile.desktop==='none',mobile.mobileTimeline!=='none',mobile.pageOverflow<=1,
    mobile.bounds.length===4&&mobile.bounds.every(box=>box.left>=0&&box.right<=390&&box.rail>250),
    !mobile.pdfGrid.includes(' '),
    consoleErrors.length===0,pageErrors.length===0,failedRequests.length===0
  ];
  await browser.close();
  if(checks.some(check=>!check))process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
