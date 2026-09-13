const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const baseUrl = process.env.SMART_TABLE_URL || 'http://127.0.0.1:8765/';
  const browser = await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const context = await browser.newContext({viewport:{width:1280,height:900}});
  const page = await context.newPage();
  const consoleErrors=[],pageErrors=[],failedRequests=[];
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
  page.on('pageerror',error=>pageErrors.push(error.message));
  page.on('requestfailed',request=>failedRequests.push(`${request.url()} ${request.failure()?.errorText||''}`));

  async function enter(){
    await page.locator('#press').click();
    await page.locator('#master.show').waitFor({timeout:12000});
  }
  function approvalTable(){return page.locator('table[data-smart-table="s2.p0.t1"]');}
  function approvalWrap(){return approvalTable().locator('xpath=ancestor::div[contains(concat(" ",normalize-space(@class)," ")," tw ")]');}
  async function openTarget(){
    await page.locator('.tb').filter({hasText:/^Event 2 - IFC$/}).click();
    await page.locator('.sb').filter({hasText:/^What happened$/}).click();
    await approvalTable().waitFor();
  }
  async function values(index){return approvalTable().locator(`tbody tr td:nth-child(${index+1})`).evaluateAll(cells=>cells.map(cell=>Number((cell.textContent||'').trim())));}
  async function setColumn(name,kind,checked){
    const row=approvalWrap().locator('.st-column').filter({hasText:name});
    const input=row.locator('input').nth(kind==='freeze'?1:0);
    checked?await input.check():await input.uncheck();
  }

  await page.goto(baseUrl,{waitUntil:'networkidle'});
  await page.evaluate(()=>Object.keys(localStorage).filter(key=>key.startsWith('claim53.smart-table.')).forEach(key=>localStorage.removeItem(key)));
  await enter();
  const totalTables=await page.locator('table').count();
  const enhancedTables=await page.locator('table[data-smart-table]').count();
  const sortableHeaders=await page.locator('table[data-smart-table] thead th .st-sort').count();
  const headerCount=await page.locator('table[data-smart-table] thead th').count();
  await openTarget();
  const wrap=approvalWrap();
  await wrap.locator('.st-toolbar .st-tool').filter({hasText:/^Columns/}).click();
  await setColumn('Evidence note','show',false);
  const hiddenEvidence=await approvalTable().locator('thead th:nth-child(11)').evaluate(cell=>getComputedStyle(cell).display==='none');
  const columnsAfterHide=await wrap.locator('.st-toolbar .st-tool').first().innerText();
  await setColumn('Building','freeze',true);
  await setColumn('Drawing No.','freeze',true);
  await page.waitForTimeout(100);
  const pinProof=await approvalTable().evaluate(table=>{
    const h1=table.tHead.rows[0].cells[0],h5=table.tHead.rows[0].cells[4];
    return {first:h1.classList.contains('st-pinned'),fifth:h5.classList.contains('st-pinned'),firstOffset:h1.style.getPropertyValue('--st-offset'),fifthOffset:h5.style.getPropertyValue('--st-offset')};
  });
  await page.keyboard.press('Escape');
  const varianceHeader=approvalTable().locator('th').nth(7).locator('.st-sort');
  await varianceHeader.click();const ascending=await values(7);
  await varianceHeader.click();const descending=await values(7);
  await varianceHeader.click();const original=await values(7);

  await varianceHeader.click();
  await varianceHeader.click();
  await wrap.locator('.st-toolbar .st-tool').filter({hasText:/^Columns/}).click();
  const storageState=await page.evaluate(()=>Object.entries(localStorage).find(([key])=>key.startsWith('claim53.smart-table.v1.s2.p0.t1'))||null);
  await page.screenshot({path:path.join(__dirname,'smart-table-desktop.png'),fullPage:false});

  await page.reload({waitUntil:'networkidle'});await enter();await openTarget();
  const persisted={
    hidden:await approvalTable().locator('thead th:nth-child(11)').evaluate(cell=>getComputedStyle(cell).display==='none'),
    pinned:await approvalTable().locator('thead th:nth-child(1)').evaluate(cell=>cell.classList.contains('st-pinned')),
    sort:await approvalTable().locator('thead th:nth-child(8)').getAttribute('aria-sort'),
    values:await values(7)
  };
  await approvalWrap().locator('.st-tool').filter({hasText:/Reset table/}).click();
  await page.waitForTimeout(100);
  const reset={
    evidenceVisible:await approvalTable().locator('thead th:nth-child(11)').isVisible(),
    pinned:await approvalTable().locator('.st-pinned').count(),
    sort:await approvalTable().locator('thead th:nth-child(8)').getAttribute('aria-sort'),
    values:await values(7)
  };

  await page.locator('#langToggleTop').click();
  const arabicColumns=await approvalWrap().locator('.st-toolbar .st-tool').first().innerText();
  await page.locator('#langToggleTop').click();
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(150);
  await approvalWrap().locator('.st-toolbar .st-tool').filter({hasText:/^Columns/}).click();
  const mobile=await approvalWrap().evaluate(node=>({clientWidth:node.clientWidth,scrollWidth:node.scrollWidth,panelPosition:getComputedStyle(node.querySelector('.st-panel')).position}));
  await page.screenshot({path:path.join(__dirname,'smart-table-mobile.png'),fullPage:false});

  const isAscending=ascending.every((value,index)=>!index||ascending[index-1]<=value);
  const isDescending=descending.every((value,index)=>!index||descending[index-1]>=value);
  const expectedOriginal=[-12,-12,-4,-4,-84,-84,-31,-31];
  const report={baseUrl,totalTables,enhancedTables,sortableHeaders,headerCount,hiddenEvidence,columnsAfterHide,pinProof,ascending,descending,original,storageState,persisted,reset,arabicColumns,mobile,consoleErrors,pageErrors,failedRequests};
  console.log(JSON.stringify(report,null,2));
  const checks=[
    totalTables>=10,enhancedTables===totalTables,sortableHeaders===headerCount,
    hiddenEvidence,/10$/.test(columnsAfterHide),pinProof.first,pinProof.fifth,pinProof.firstOffset==='0px',parseFloat(pinProof.fifthOffset)>0,
    isAscending,isDescending,JSON.stringify(original)===JSON.stringify(expectedOriginal),
    Boolean(storageState),persisted.hidden,persisted.pinned,persisted.sort==='descending',isDescending,
    reset.evidenceVisible,reset.pinned===0,reset.sort==='none',JSON.stringify(reset.values)===JSON.stringify(expectedOriginal),
    /الأعمدة/.test(arabicColumns),mobile.scrollWidth<=mobile.clientWidth+2,mobile.panelPosition==='fixed',
    consoleErrors.length===0,pageErrors.length===0,failedRequests.length===0
  ];
  await browser.close();
  if(checks.some(check=>!check))process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
