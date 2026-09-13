(function(){
  'use strict';

  const STORAGE_PREFIX='claim53.smart-table.v1.';
  const controllers=new WeakMap();
  const text={
    en:{tools:'Table tools',columns:'Columns',reset:'Reset table',manage:'Manage columns',hint:'Show, restore or freeze any column. Select a heading to sort.',show:'Show',freeze:'Freeze',showAll:'Show all',unfreeze:'Unfreeze all',close:'Close',visible:'visible',frozen:'frozen',sorted:'sorted',ascending:'ascending',descending:'descending',notSorted:'not sorted',sortBy:'Sort by'},
    ar:{tools:'أدوات الجدول',columns:'الأعمدة',reset:'إعادة ضبط الجدول',manage:'إدارة الأعمدة',hint:'إظهار أو استعادة أو تثبيت أي عمود. اختر عنوان العمود للفرز.',show:'إظهار',freeze:'تثبيت',showAll:'إظهار الكل',unfreeze:'إلغاء كل التثبيت',close:'إغلاق',visible:'ظاهر',frozen:'مثبت',sorted:'مرتب',ascending:'تصاعدي',descending:'تنازلي',notSorted:'غير مرتب',sortBy:'فرز حسب'}
  };
  const locale=()=>document.body.classList.contains('arabic-mode')?'ar':'en';
  const tx=key=>text[locale()][key];
  const clean=value=>String(value||'').replace(/\s+/g,' ').trim();
  const hash=value=>{let out=2166136261;for(let i=0;i<value.length;i++){out^=value.charCodeAt(i);out=Math.imul(out,16777619);}return (out>>>0).toString(36);};
  const natural=new Intl.Collator(undefined,{numeric:true,sensitivity:'base'});

  function tableKey(table){
    const host=document.getElementById('host');
    const section=table.closest('.sec');
    const pane=table.closest('.pane');
    if(host&&section&&pane){
      const sectionIndex=[...host.children].indexOf(section);
      const panes=[...section.querySelectorAll(':scope > .pane, :scope > div > .pane')];
      const paneIndex=panes.indexOf(pane);
      const tableIndex=[...pane.querySelectorAll('table')].indexOf(table);
      if(sectionIndex>=0&&paneIndex>=0&&tableIndex>=0)return `s${sectionIndex}.p${paneIndex}.t${tableIndex}`;
    }
    return 'h'+hash([...table.querySelectorAll('thead th')].map(th=>clean(th.textContent)).join('|'));
  }

  function readState(key,count){
    const base={hidden:[],pinned:[],sortIndex:-1,sortDirection:'none'};
    try{
      const saved=JSON.parse(localStorage.getItem(STORAGE_PREFIX+key)||'null');
      if(!saved)return base;
      base.hidden=Array.isArray(saved.hidden)?saved.hidden.filter(i=>Number.isInteger(i)&&i>=0&&i<count):[];
      base.pinned=Array.isArray(saved.pinned)?saved.pinned.filter(i=>Number.isInteger(i)&&i>=0&&i<count&&!base.hidden.includes(i)):[];
      base.sortIndex=Number.isInteger(saved.sortIndex)&&saved.sortIndex>=0&&saved.sortIndex<count?saved.sortIndex:-1;
      base.sortDirection=['ascending','descending'].includes(saved.sortDirection)?saved.sortDirection:'none';
    }catch(_error){}
    return base;
  }

  function saveState(controller){
    try{localStorage.setItem(STORAGE_PREFIX+controller.key,JSON.stringify(controller.state));}catch(_error){}
  }

  function typedValue(cell){
    const value=clean(cell?.textContent).replace(/[−–—]/g,'-');
    if(!value)return {kind:3,value:''};
    if(/^[-+]?\d+(?:[.,]\d+)?(?:\s*(?:days?|%))?$/i.test(value))return {kind:0,value:Number(value.replace(/,/g,'').replace(/\s*(?:days?|%)$/i,''))};
    if(/^(?:\d{1,2}[\s-](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s-]\d{2,4}|\d{4}-\d{2}-\d{2})$/i.test(value)){
      const time=Date.parse(value.replace(/-/g,' '));if(Number.isFinite(time))return {kind:1,value:time};
    }
    return {kind:2,value};
  }

  function compareCells(a,b,index,direction){
    const av=typedValue(a.children[index]),bv=typedValue(b.children[index]);
    if(av.kind===3||bv.kind===3)return av.kind===bv.kind?0:(av.kind===3?1:-1);
    let result;
    if(av.kind===bv.kind&&(av.kind===0||av.kind===1))result=av.value-bv.value;
    else result=natural.compare(String(av.value),String(bv.value));
    return direction==='descending'?-result:result;
  }

  function setColumnVisibility(controller){
    const {table,state}=controller;
    [...table.rows].forEach(row=>[...row.children].forEach((cell,index)=>cell.classList.toggle('st-hidden-column',state.hidden.includes(index))));
  }

  function updatePinned(controller){
    const {table,state}=controller;
    table.querySelectorAll('.st-pinned,.st-pin-edge').forEach(cell=>{cell.classList.remove('st-pinned','st-pin-edge');cell.style.removeProperty('--st-offset');});
    let offset=0,lastCells=[];
    state.pinned.filter(index=>!state.hidden.includes(index)).sort((a,b)=>a-b).forEach(index=>{
      const cells=[...table.rows].map(row=>row.children[index]).filter(Boolean);
      cells.forEach(cell=>{cell.classList.add('st-pinned');cell.style.setProperty('--st-offset',offset+'px');});
      const header=table.tHead?.rows[0]?.children[index];
      offset+=header?Math.ceil(header.getBoundingClientRect().width):0;
      lastCells=cells;
    });
    lastCells.forEach(cell=>cell.classList.add('st-pin-edge'));
  }

  function applySort(controller){
    const {table,state,originalRows}=controller;
    const body=table.tBodies[0];if(!body)return;
    const headers=[...table.tHead.rows[0].cells];
    headers.forEach((th,index)=>{
      const active=index===state.sortIndex&&state.sortDirection!=='none';
      th.setAttribute('aria-sort',active?state.sortDirection:'none');
      const icon=th.querySelector('.st-sort-icon');if(icon)icon.textContent=!active?'↕':state.sortDirection==='ascending'?'↑':'↓';
    });
    if(state.sortIndex<0||state.sortDirection==='none')originalRows.forEach(row=>body.appendChild(row));
    else [...originalRows].sort((a,b)=>compareCells(a,b,state.sortIndex,state.sortDirection)||originalRows.indexOf(a)-originalRows.indexOf(b)).forEach(row=>body.appendChild(row));
  }

  function summary(controller){
    const {state,count,toolbarSummary,headers}=controller;
    const parts=[`${count-state.hidden.length}/${count} ${tx('visible')}`];
    if(state.pinned.length)parts.push(`${state.pinned.length} ${tx('frozen')}`);
    if(state.sortIndex>=0&&state.sortDirection!=='none')parts.push(`${tx('sorted')}: ${clean(headers[state.sortIndex].querySelector('.st-sort-label')?.textContent)} ${tx(state.sortDirection)}`);
    toolbarSummary.textContent=parts.join(' · ');
  }

  function renderPanel(controller){
    const {panel,state,headers,count}=controller;panel.innerHTML='';
    const head=document.createElement('div');head.className='st-panel-head';
    const copy=document.createElement('div'),title=document.createElement('b'),hint=document.createElement('span');title.textContent=tx('manage');hint.textContent=tx('hint');copy.append(title,hint);
    const close=document.createElement('button');close.type='button';close.className='st-tool st-close';close.textContent='×';close.setAttribute('aria-label',tx('close'));close.addEventListener('click',()=>controller.togglePanel(false));head.append(copy,close);panel.appendChild(head);
    const list=document.createElement('div');list.className='st-column-list';
    headers.forEach((th,index)=>{
      const row=document.createElement('div');row.className='st-column';
      const name=document.createElement('span');name.className='st-column-name';name.textContent=clean(th.querySelector('.st-sort-label')?.textContent)||`Column ${index+1}`;
      const show=document.createElement('label');show.className='st-toggle';const showBox=document.createElement('input');showBox.type='checkbox';showBox.checked=!state.hidden.includes(index);showBox.disabled=showBox.checked&&state.hidden.length===count-1;show.append(showBox,document.createTextNode(tx('show')));
      const freeze=document.createElement('label');freeze.className='st-toggle';const freezeBox=document.createElement('input');freezeBox.type='checkbox';freezeBox.checked=state.pinned.includes(index);freeze.append(freezeBox,document.createTextNode(tx('freeze')));
      showBox.addEventListener('change',()=>{
        if(showBox.checked)state.hidden=state.hidden.filter(value=>value!==index);
        else if(state.hidden.length<count-1){state.hidden.push(index);state.pinned=state.pinned.filter(value=>value!==index);if(state.sortIndex===index){state.sortIndex=-1;state.sortDirection='none';applySort(controller);}}
        saveState(controller);controller.apply();renderPanel(controller);
      });
      freezeBox.addEventListener('change',()=>{
        if(freezeBox.checked){state.hidden=state.hidden.filter(value=>value!==index);if(!state.pinned.includes(index))state.pinned.push(index);}
        else state.pinned=state.pinned.filter(value=>value!==index);
        saveState(controller);controller.apply();renderPanel(controller);
      });
      row.append(name,show,freeze);list.appendChild(row);
    });
    panel.appendChild(list);
    const actions=document.createElement('div');actions.className='st-panel-actions';
    const showAll=document.createElement('button');showAll.type='button';showAll.className='st-tool';showAll.textContent=tx('showAll');showAll.addEventListener('click',()=>{state.hidden=[];saveState(controller);controller.apply();renderPanel(controller);});
    const unfreeze=document.createElement('button');unfreeze.type='button';unfreeze.className='st-tool';unfreeze.textContent=tx('unfreeze');unfreeze.addEventListener('click',()=>{state.pinned=[];saveState(controller);controller.apply();renderPanel(controller);});
    actions.append(showAll,unfreeze);panel.appendChild(actions);
  }

  function enhance(table){
    if(controllers.has(table)||!table.tHead||!table.tBodies.length||!table.tHead.rows[0])return;
    const wrap=table.closest('.tw');if(!wrap)return;
    const headers=[...table.tHead.rows[0].cells],count=headers.length;if(!count)return;
    const key=tableKey(table),state=readState(key,count),originalRows=[...table.tBodies[0].rows];
    wrap.classList.add('st-enhanced');table.dataset.smartTable=key;
    const toolbar=document.createElement('div');toolbar.className='st-toolbar';toolbar.setAttribute('aria-label',tx('tools'));
    const group=document.createElement('div');group.className='st-toolbar-group';
    const columns=document.createElement('button');columns.type='button';columns.className='st-tool';columns.setAttribute('aria-expanded','false');
    const reset=document.createElement('button');reset.type='button';reset.className='st-tool';
    const toolbarSummary=document.createElement('div');toolbarSummary.className='st-summary';toolbar.append(group,toolbarSummary);group.append(columns,reset);
    const panel=document.createElement('div');panel.className='st-panel';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','false');
    const scroll=document.createElement('div');scroll.className='st-scroll';
    wrap.insertBefore(toolbar,table);wrap.insertBefore(panel,table);wrap.insertBefore(scroll,table);scroll.appendChild(table);
    headers.forEach((th,index)=>{
      const nodes=[...th.childNodes],button=document.createElement('button'),label=document.createElement('span'),icon=document.createElement('span');button.type='button';button.className='st-sort';label.className='st-sort-label';icon.className='st-sort-icon';icon.textContent='↕';nodes.forEach(node=>label.appendChild(node));button.append(label,icon);th.appendChild(button);th.setAttribute('aria-sort','none');
      button.addEventListener('click',()=>{
        if(state.sortIndex!==index){state.sortIndex=index;state.sortDirection='ascending';}
        else if(state.sortDirection==='ascending')state.sortDirection='descending';
        else if(state.sortDirection==='descending'){state.sortIndex=-1;state.sortDirection='none';}
        else state.sortDirection='ascending';
        saveState(controller);applySort(controller);summary(controller);
      });
    });
    const controller={table,wrap,scroll,toolbar,group,columns,reset,toolbarSummary,panel,headers,count,key,state,originalRows};
    controller.togglePanel=open=>{panel.hidden=!open;columns.setAttribute('aria-expanded',String(open));if(open)renderPanel(controller);};
    controller.apply=()=>{setColumnVisibility(controller);columns.textContent=`${tx('columns')} · ${count-state.hidden.length}`;requestAnimationFrame(()=>updatePinned(controller));summary(controller);};
    controller.refreshLanguage=()=>{columns.textContent=`${tx('columns')} · ${count-state.hidden.length}`;reset.textContent=tx('reset');toolbar.setAttribute('aria-label',tx('tools'));summary(controller);if(!panel.hidden)renderPanel(controller);headers.forEach((th,index)=>{const button=th.querySelector('.st-sort');if(button)button.setAttribute('aria-label',`${tx('sortBy')} ${clean(th.querySelector('.st-sort-label')?.textContent)||index+1}`);});};
    controllers.set(table,controller);
    columns.addEventListener('click',()=>controller.togglePanel(panel.hidden));
    reset.addEventListener('click',()=>{state.hidden=[];state.pinned=[];state.sortIndex=-1;state.sortDirection='none';try{localStorage.removeItem(STORAGE_PREFIX+key);}catch(_error){}applySort(controller);controller.apply();if(!panel.hidden)renderPanel(controller);controller.refreshLanguage();});
    document.addEventListener('pointerdown',event=>{if(!panel.hidden&&!wrap.contains(event.target))controller.togglePanel(false);});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){controller.togglePanel(false);columns.focus();}});
    const resize=new ResizeObserver(()=>{if(table.isConnected)updatePinned(controller);else resize.disconnect();});resize.observe(scroll);
    applySort(controller);controller.apply();controller.refreshLanguage();
  }

  function enhanceAll(root=document){if(root.matches?.('table'))enhance(root);root.querySelectorAll?.('table').forEach(enhance);}
  function refreshAll(){document.querySelectorAll('table').forEach(table=>controllers.get(table)?.refreshLanguage());}
  function start(){enhanceAll();const host=document.getElementById('host')||document.body;new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===1)enhanceAll(node);}))).observe(host,{childList:true,subtree:true});window.addEventListener('site-language',()=>requestAnimationFrame(refreshAll));}
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start,{once:true}):start();
})();
