(function(){
  'use strict';

  const FILES={
    aace29:'books/aace29.pdf',aace48:'books/aace48.pdf',aace38:'books/aace38.pdf',
    aci3472:'books/aci3472.pdf',aci347:'books/aci347.pdf',ecp203:'books/ecp203.pdf',
    fidic1999:'books/fidic1999.pdf',osha703:'books/osha703.txt'
  };
  const T=(en,ar)=>({en,ar});
  const UI={
    kicker:T('Embedded source room','غرفة قراءة المصادر المدمجة'),
    title:T('Read the Books','قراءة الكتب'),
    intro:T('Choose a source, read every supplied page, and search inside that source. Predictions come from its own wording and engineering concepts, and each result opens the original page.','اختر مصدرًا واقرأ كل الصفحات المرفقة وابحث داخل ذلك المصدر. تأتي التوقعات من نصه ومفاهيمه الهندسية، وتفتح كل نتيجة الصفحة الأصلية.'),
    choose:T('Choose a source','اختر مصدرًا'),
    search:T('Search this book','ابحث داخل هذا الكتاب'),
    searchButton:T('Search','بحث'),
    clear:T('Clear','مسح'),
    placeholder:T('Type any word or subject…','اكتب أي كلمة أو موضوع…'),
    prediction:T('Predictions from this book','توقعات من هذا الكتاب'),
    concept:T('Engineering concept','مفهوم هندسي'),
    phrase:T('Book phrase','عبارة من الكتاب'),
    correction:T('Possible spelling','تصحيح محتمل'),
    related:T('Related subject','موضوع مرتبط'),
    uses:T('uses','تكرار'),
    pages:T('pages','صفحات'),
    page:T('Page','صفحة'),
    previous:T('Previous page','الصفحة السابقة'),
    next:T('Next page','الصفحة التالية'),
    zoomOut:T('Zoom out','تصغير'),
    zoomIn:T('Zoom in','تكبير'),
    fit:T('Fit width','ملاءمة العرض'),
    original:T('Open original','فتح الأصل'),
    loading:T('Loading source…','جارٍ تحميل المصدر…'),
    indexing:T('Building this book’s private search index…','جارٍ بناء فهرس البحث الخاص بهذا الكتاب…'),
    ready:T('Ready to read and search','جاهز للقراءة والبحث'),
    results:T('results in this book','نتيجة داخل هذا الكتاب'),
    resultHint:T('Select a result to open its original page. Quotation marks require the exact phrase.','اختر نتيجة لفتح صفحتها الأصلية. استخدم علامتي اقتباس للبحث عن العبارة الحرفية.'),
    exact:T('Exact phrase','عبارة حرفية'),
    words:T('All words','كل الكلمات'),
    relatedMatch:T('Related concept','مفهوم مرتبط'),
    sourceText:T('Source wording','نص المصدر'),
    plain:T('Plain explanation','شرح مبسط'),
    noResults:T('No passage found in this source. Try a shorter phrase or select a prediction.','لم يتم العثور على مقطع في هذا المصدر. جرّب عبارة أقصر أو اختر أحد التوقعات.'),
    ocr:T('OCR text — verify the scanned page before quoting.','نص OCR — تحقق من الصفحة المصورة قبل الاقتباس.'),
    native:T('Extracted from the supplied source.','مستخرج من المصدر المرفق.'),
    error:T('The source could not be displayed.','تعذر عرض المصدر.'),
    indexed:T('searchable phrases','عبارة قابلة للبحث'),
    generic:T('This passage contains the searched wording or a related engineering concept. Use the original page to read it in context.','يحتوي هذا المقطع على العبارة المطلوبة أو مفهوم هندسي مرتبط. اقرأ الصفحة الأصلية لفهم السياق.'),
    allEight:T('All 8 supplied sources','جميع المصادر الثمانية المرفقة')
  };
  const make=(tag,cls,value)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(value!=null)node.textContent=value;return node;};
  const escapeReg=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  let pdfModulePromise;
  function pdfModule(){
    if(!pdfModulePromise)pdfModulePromise=import('./vendor/pdfjs/pdf.mjs').then(pdfjs=>{
      pdfjs.GlobalWorkerOptions.workerSrc='./vendor/pdfjs/pdf.worker.mjs';return pdfjs;
    });
    return pdfModulePromise;
  }

  function mount(container,{books,arabic=false}){
    const tx=value=>typeof value==='string'?value:(value?.[arabic?'ar':'en']||value?.en||value?.ar||'');
    const topics=window.BookSearch?.topics||[];
    const topicMap=new Map(topics.map(topic=>[topic.id,topic]));
    const bookMap=new Map(books.map(book=>[book.id,book]));
    const worker=new Worker('book-reader-worker.js');
    let requestId=0,renderTask=null,documentHandle=null,documentKey='',searchTimer=null,destroyed=false;
    const pending=new Map();
    const state={bookId:books[0].id,page:1,pages:1,zoom:1,query:'',candidateId:null,predictions:[],results:[],active:-1};
    worker.postMessage({type:'configure',topics});
    worker.onmessage=event=>{const message=event.data,key=message.type+':'+message.id;const callback=pending.get(key);if(callback){pending.delete(key);message.error?callback.reject(new Error(message.error)):callback.resolve(message);}};
    const ask=(type,payload={})=>new Promise((resolve,reject)=>{const id=++requestId;pending.set(type+':'+id,{resolve,reject});worker.postMessage({type,id,bookId:state.bookId,...payload});});

    container.innerHTML='';container.className='br-shell';
    const hero=make('header','br-hero');
    const heroCopy=make('div');heroCopy.append(make('div','bi-kicker',tx(UI.kicker)),make('h2',null,tx(UI.title)),make('p',null,tx(UI.intro)));
    const coverage=make('div','br-coverage');coverage.append(make('b',null,'8'),make('span',null,tx(UI.allEight)));hero.append(heroCopy,coverage);container.appendChild(hero);

    const layout=make('section','br-layout');
    const shelf=make('nav','br-shelf');shelf.setAttribute('aria-label',tx(UI.choose));
    const main=make('section','br-main');
    const searchPanel=make('aside','br-search-panel');
    layout.append(shelf,main,searchPanel);container.appendChild(layout);

    const readerHead=make('header','br-reader-head');
    const identity=make('div','br-reader-identity');const sourceTitle=make('h3');const sourceMeta=make('p');identity.append(sourceTitle,sourceMeta);
    const sourceLink=make('a','btn br-original',tx(UI.original));sourceLink.target='_blank';sourceLink.rel='noopener';
    readerHead.append(identity,sourceLink);main.appendChild(readerHead);
    const tools=make('div','br-tools');
    const prev=make('button','br-tool',tx(UI.previous));prev.type='button';
    const pageWrap=make('label','br-page-control');pageWrap.append(document.createTextNode(tx(UI.page)+' '));
    const pageInput=make('input');pageInput.type='number';pageInput.min='1';pageInput.value='1';pageWrap.appendChild(pageInput);
    const pageTotal=make('span',null,' / 1');pageWrap.appendChild(pageTotal);
    const next=make('button','br-tool',tx(UI.next));next.type='button';
    const zoomOut=make('button','br-tool',tx(UI.zoomOut));zoomOut.type='button';
    const zoomLabel=make('span','br-zoom','100%');
    const zoomIn=make('button','br-tool',tx(UI.zoomIn));zoomIn.type='button';
    const fit=make('button','br-tool',tx(UI.fit));fit.type='button';
    tools.append(prev,pageWrap,next,zoomOut,zoomLabel,zoomIn,fit);main.appendChild(tools);
    const viewer=make('div','br-viewer');viewer.setAttribute('aria-live','polite');
    const canvas=make('canvas','br-canvas');const textView=make('pre','br-text-view');textView.hidden=true;textView.setAttribute('data-source-text','');
    const loading=make('div','br-loading',tx(UI.loading));viewer.append(canvas,textView,loading);main.appendChild(viewer);

    const form=make('form','br-search-form');form.setAttribute('role','search');
    const searchInput=make('input','br-search-input');searchInput.type='search';searchInput.autocomplete='off';searchInput.spellcheck=true;searchInput.placeholder=tx(UI.placeholder);searchInput.setAttribute('aria-label',tx(UI.search));searchInput.setAttribute('aria-controls','readerPredictions');searchInput.setAttribute('aria-autocomplete','list');
    const searchButton=make('button','btn',tx(UI.searchButton));searchButton.type='submit';
    const clear=make('button','btn br-clear',tx(UI.clear));clear.type='button';clear.hidden=true;
    form.append(searchInput,searchButton,clear);searchPanel.appendChild(form);
    const searchStatus=make('div','br-search-status',tx(UI.indexing));searchStatus.setAttribute('aria-live','polite');searchPanel.appendChild(searchStatus);
    const predictions=make('div','br-predictions');predictions.id='readerPredictions';predictions.setAttribute('role','listbox');predictions.hidden=true;searchPanel.appendChild(predictions);
    const results=make('div','br-results');searchPanel.appendChild(results);

    function buildShelf(){
      shelf.innerHTML='';books.forEach(book=>{
        const button=make('button','br-book');button.type='button';button.setAttribute('aria-current',book.id===state.bookId?'true':'false');
        button.append(make('span','br-book-num',String(book.order)),make('span','br-book-copy'));
        button.lastChild.append(make('strong',null,tx(book.short)),make('small',null,tx(book.title)),make('em',null,(window.BOOK_SEARCH_CORPUS.sourceStats[book.id]?.pages||1)+' '+tx(UI.pages)));
        button.addEventListener('click',()=>activateBook(book.id));shelf.appendChild(button);
      });
    }
    function renderPredictions(){
      predictions.innerHTML='';const items=state.predictions;
      if(!state.query||!items.length){predictions.hidden=true;searchInput.setAttribute('aria-expanded','false');return;}
      predictions.appendChild(make('div','br-predict-title',tx(UI.prediction)));
      items.forEach((item,index)=>{
        const button=make('button','br-prediction');button.type='button';button.setAttribute('role','option');button.setAttribute('aria-selected',state.active===index?'true':'false');
        const copy=make('span');copy.append(make('strong',null,item.label),make('small',null,tx(UI[item.kind]||UI.phrase)));
        const count=make('span','br-predict-count',item.count+' '+tx(UI.uses)+' · '+item.pages+' '+tx(UI.pages));button.append(copy,count);
        button.addEventListener('click',()=>selectPrediction(item));predictions.appendChild(button);
      });
      predictions.hidden=false;searchInput.setAttribute('aria-expanded','true');
    }
    async function updatePredictions(){
      const query=searchInput.value.trim();state.query=query;state.active=-1;
      if(!query){state.predictions=[];renderPredictions();return;}
      const bookId=state.bookId;
      try{const response=await ask('predict',{query,language:arabic?'ar':'en'});if(bookId!==state.bookId||query!==searchInput.value.trim())return;state.predictions=response.items;renderPredictions();}
      catch(error){if(!destroyed)searchStatus.textContent=error.message;}
    }
    function selectPrediction(item){clearTimeout(searchTimer);state.candidateId=item.id;state.query=item.label;searchInput.value=item.label;state.active=-1;state.predictions=[];renderPredictions();runSearch();}
    function excerpt(item){
      const text=item.text.replace(/\s+/g,' ').trim();const terms=item.terms.filter(Boolean).sort((a,b)=>b.length-a.length);const lower=text.toLowerCase();let at=-1;
      for(const term of terms){at=lower.indexOf(term.toLowerCase());if(at>=0)break;}
      const start=Math.max(0,at<0?0:at-115),end=Math.min(text.length,start+420);return (start?'…':'')+text.slice(start,end)+(end<text.length?'…':'');
    }
    function highlighted(text,query){
      const node=make('p','br-result-text');node.setAttribute('data-source-text','');const terms=[query,...query.split(/\s+/)].filter(term=>term.length>1).sort((a,b)=>b.length-a.length);
      if(!terms.length){node.textContent=text;return node;}const re=new RegExp('('+terms.map(escapeReg).join('|')+')','ig');let cursor=0;for(const match of text.matchAll(re)){node.append(document.createTextNode(text.slice(cursor,match.index)),make('mark',null,match[0]));cursor=match.index+match[0].length;}node.appendChild(document.createTextNode(text.slice(cursor)));return node;
    }
    function plainExplanation(item){
      const topicIds=item.topics||[];const topic=topicIds.map(id=>topicMap.get(id)).filter(Boolean).find(topic=>!['concrete','schedule'].includes(topic.id))||topicIds.map(id=>topicMap.get(id)).find(Boolean);
      return topic?tx(topic.explain):tx(UI.generic);
    }
    function renderResults(ms=0){
      results.innerHTML='';if(!state.query)return;
      const head=make('header','br-results-head');head.append(make('b',null,state.results.length+' '+tx(UI.results)),make('span',null,tx(UI.resultHint)));results.appendChild(head);
      if(!state.results.length){results.appendChild(make('div','bi-empty',tx(UI.noResults)));return;}
      state.results.slice(0,60).forEach(item=>{
        const button=make('button','br-result');button.type='button';button.dataset.page=String(item.page);
        const meta=make('span','br-result-meta');meta.append(make('strong',null,tx(UI.page)+' '+item.page),make('em',null,tx(UI[item.match==='exact'?'exact':item.match==='words'?'words':'relatedMatch'])));button.appendChild(meta);
        button.appendChild(highlighted(excerpt(item),state.query));
        const explanation=make('span','br-result-plain');explanation.append(make('b',null,tx(UI.plain)),make('span',null,plainExplanation(item)));button.appendChild(explanation);
        button.addEventListener('click',()=>{goPage(item.page);button.scrollIntoView({block:'nearest'});});results.appendChild(button);
      });
      searchStatus.textContent=state.results.length+' '+tx(UI.results)+' · '+ms.toFixed(1)+' ms';
    }
    async function runSearch(keepPredictions=false){
      const query=searchInput.value.trim();state.query=query;clear.hidden=!query;if(!keepPredictions){state.predictions=[];renderPredictions();}
      if(!query){state.results=[];results.innerHTML='';searchStatus.textContent=tx(UI.ready);return;}
      const bookId=state.bookId;searchStatus.textContent=tx(UI.search)+'…';
      try{const response=await ask('search',{query,options:{candidateId:state.candidateId,related:true}});if(bookId!==state.bookId||query!==searchInput.value.trim())return;state.results=response.items;renderResults(response.ms);}
      catch(error){if(!destroyed)searchStatus.textContent=error.message;}
    }
    async function loadSource(book){
      const url=FILES[book.id];sourceLink.href=url;loading.hidden=false;loading.textContent=tx(UI.loading);canvas.hidden=true;textView.hidden=true;
      if(book.id==='osha703'){
        const response=await fetch(url);if(!response.ok)throw new Error('HTTP '+response.status);textView.textContent=await response.text();textView.hidden=false;state.pages=1;state.page=1;updateTools();loading.hidden=true;return;
      }
      if(documentKey!==book.id){if(documentHandle?.destroy)await documentHandle.destroy();const pdfjs=await pdfModule();documentHandle=await pdfjs.getDocument({url,cMapUrl:'vendor/pdfjs/cmaps/',cMapPacked:true,standardFontDataUrl:'vendor/pdfjs/standard_fonts/',wasmUrl:'vendor/pdfjs/wasm/'}).promise;documentKey=book.id;}
      state.pages=documentHandle.numPages;state.page=Math.min(Math.max(1,state.page),state.pages);await renderPage();
    }
    function updateTools(){pageInput.value=String(state.page);pageInput.max=String(state.pages);pageTotal.textContent=' / '+state.pages;prev.disabled=state.page<=1;next.disabled=state.page>=state.pages;zoomLabel.textContent=Math.round(state.zoom*100)+'%';}
    async function renderPage(){
      if(!documentHandle||destroyed)return;if(renderTask){renderTask.cancel();renderTask=null;}
      loading.hidden=false;canvas.hidden=true;const pageNumber=state.page;try{
        const page=await documentHandle.getPage(pageNumber);const base=page.getViewport({scale:1});const available=Math.max(250,viewer.clientWidth-34);const fitScale=Math.min(1.55,available/base.width);const viewport=page.getViewport({scale:fitScale*state.zoom});const ratio=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.floor(viewport.width*ratio);canvas.height=Math.floor(viewport.height*ratio);canvas.style.width=Math.floor(viewport.width)+'px';canvas.style.height=Math.floor(viewport.height)+'px';
        renderTask=page.render({canvasContext:canvas.getContext('2d',{alpha:false}),viewport,transform:ratio===1?null:[ratio,0,0,ratio,0,0]});await renderTask.promise;if(pageNumber!==state.page)return;canvas.hidden=false;loading.hidden=true;updateTools();
      }catch(error){if(error?.name!=='RenderingCancelledException'){loading.hidden=false;loading.textContent=tx(UI.error)+' '+error.message;}}
    }
    async function goPage(page){state.page=Math.max(1,Math.min(state.pages,Number(page)||1));updateTools();if(state.bookId==='osha703')return;await renderPage();viewer.scrollTo({top:0,behavior:'smooth'});}
    async function activateBook(bookId){
      if(bookId===state.bookId&&documentKey)return;state.bookId=bookId;state.page=1;state.zoom=1;state.query='';state.candidateId=null;state.predictions=[];state.results=[];searchInput.value='';clear.hidden=true;results.innerHTML='';predictions.hidden=true;buildShelf();
      const book=bookMap.get(bookId);sourceTitle.textContent=tx(book.title);const stats=window.BOOK_SEARCH_CORPUS.sourceStats[bookId];sourceMeta.textContent=tx(book.issuer)+' · '+stats.pages+' '+tx(UI.pages)+(stats.mode==='ocr'?' · OCR':'');searchStatus.textContent=tx(UI.indexing);
      try{const [prepared]=await Promise.all([ask('prepare'),loadSource(book)]);if(bookId!==state.bookId)return;searchStatus.textContent=tx(UI.ready)+' · '+prepared.phrases+' '+tx(UI.indexed);}
      catch(error){if(bookId===state.bookId){loading.hidden=false;loading.textContent=tx(UI.error)+' '+error.message;searchStatus.textContent=error.message;}}
    }

    form.addEventListener('submit',event=>{event.preventDefault();clearTimeout(searchTimer);state.candidateId=null;runSearch();});
    searchInput.addEventListener('input',()=>{state.candidateId=null;clear.hidden=!searchInput.value;updatePredictions();clearTimeout(searchTimer);searchTimer=setTimeout(()=>runSearch(true),130);});
    searchInput.addEventListener('keydown',event=>{const items=state.predictions;if(event.key==='ArrowDown'&&items.length){event.preventDefault();state.active=(state.active+1)%items.length;renderPredictions();}else if(event.key==='ArrowUp'&&items.length){event.preventDefault();state.active=(state.active-1+items.length)%items.length;renderPredictions();}else if(event.key==='Enter'&&state.active>=0&&items[state.active]){event.preventDefault();selectPrediction(items[state.active]);}else if(event.key==='Escape'){state.predictions=[];renderPredictions();}});
    clear.addEventListener('click',()=>{searchInput.value='';state.query='';state.candidateId=null;state.predictions=[];state.results=[];clear.hidden=true;renderPredictions();results.innerHTML='';searchStatus.textContent=tx(UI.ready);searchInput.focus();});
    prev.addEventListener('click',()=>goPage(state.page-1));next.addEventListener('click',()=>goPage(state.page+1));pageInput.addEventListener('change',()=>goPage(pageInput.value));
    zoomOut.addEventListener('click',()=>{state.zoom=Math.max(.55,state.zoom-.15);renderPage();});zoomIn.addEventListener('click',()=>{state.zoom=Math.min(2.5,state.zoom+.15);renderPage();});fit.addEventListener('click',()=>{state.zoom=1;renderPage();});
    let resizeTimer,lastViewerWidth=0;const resize=()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{const width=viewer.clientWidth;if(width&&Math.abs(width-lastViewerWidth)>8&&state.bookId!=='osha703'){lastViewerWidth=width;renderPage();}},150);};window.addEventListener('resize',resize);
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(viewer);
    buildShelf();activateBook(state.bookId);
    return {destroy(){destroyed=true;clearTimeout(searchTimer);clearTimeout(resizeTimer);window.removeEventListener('resize',resize);resizeObserver.disconnect();if(renderTask)renderTask.cancel();if(documentHandle?.destroy)documentHandle.destroy();worker.terminate();pending.forEach(item=>item.reject(new Error('Reader closed')));pending.clear();}};
  }
  window.BookReader={mount};
})();
