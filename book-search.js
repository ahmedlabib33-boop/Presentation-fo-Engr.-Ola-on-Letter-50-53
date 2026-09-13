(function(){
  'use strict';

  const corpus=window.BOOK_SEARCH_CORPUS;
  if(!corpus)return;

  const T=(en,ar)=>({en,ar});
  const TOPICS=[
    {id:'concrete',roots:['concrete','خرسانة','الخرسانة'],label:T('Concrete works','الأعمال الخرسانية'),terms:['concrete','reinforced concrete','cast-in-place','cement','خرسانة','الخرسانة','مسلحة'],explain:T('Concrete requirements depend on the member, material, strength, loading and the governing project documents. Use the cited passage to identify the precise rule or method.','تعتمد متطلبات الخرسانة على العنصر والمواد والمقاومة والأحمال ومستندات المشروع الحاكمة. استخدم المقطع المشار إليه لتحديد القاعدة أو المنهج بدقة.')},
    {id:'formwork',roots:['concrete','formwork','forms','شدات','فرم'],label:T('Formwork and striking','الشدات وفكها'),terms:['formwork','forms','falsework','stripping','striking','shutter','شدات','فرم','القوالب','فك الشدات'],explain:T('This concerns the temporary moulds and supports used to shape concrete, including when they may be removed without damaging the work or creating an unsafe load path.','يتعلق ذلك بالقوالب والدعامات المؤقتة المستخدمة لتشكيل الخرسانة، وبموعد جواز فكها دون إتلاف العمل أو إنشاء مسار أحمال غير آمن.')},
    {id:'curing',roots:['concrete','curing','strength','معالجة','مقاومة'],label:T('Curing and strength gain','المعالجة واكتساب المقاومة'),terms:['curing','strength gain','compressive strength','maturity','concrete age','معالجة','المعالجة','مقاومة الخرسانة','العمر','المقاومة'],explain:T('The practical question is whether the concrete has gained enough verified strength for the next operation or imposed load; elapsed days alone may not prove that.','السؤال العملي هو ما إذا كانت الخرسانة قد اكتسبت مقاومة متحققة تكفي للعمل التالي أو الحمل المفروض؛ وقد لا يكفي عدد الأيام وحده لإثبات ذلك.')},
    {id:'shoring',roots:['concrete','formwork','shoring','reshoring','دعامات'],label:T('Shoring and reshoring','الدعامات وإعادة التدعيم'),terms:['shoring','reshoring','shore','reshores','backshoring','دعامات','الدعامات','إعادة التدعيم','اعادة التدعيم'],explain:T('Shoring carries fresh-concrete and construction loads; reshoring redistributes later loads. Removal must follow the verified strength, sequence and structural load path.','تحمل الدعامات أحمال الخرسانة الطازجة والتنفيذ، بينما تعيد دعامات ما بعد الفك توزيع الأحمال اللاحقة. ويجب أن يتبع الفك المقاومة المتحققة والتسلسل ومسار الحمل الإنشائي.')},
    {id:'schedule',roots:['schedule','programme','program','planning','برنامج','تخطيط'],label:T('Schedule planning','تخطيط البرنامج الزمني'),terms:['schedule','programme','program','planning','time management','برنامج زمني','البرنامج','الجدول الزمني','تخطيط'],explain:T('A schedule is the time model of scope, sequence, calendars, constraints and resources. A calculated date is useful only when those inputs represent the intended and buildable plan.','البرنامج الزمني نموذج للوقت يشمل النطاق والتسلسل والتقاويم والقيود والموارد. ولا يكون التاريخ المحسوب مفيدًا إلا إذا مثلت هذه المدخلات الخطة المقصودة والقابلة للتنفيذ.')},
    {id:'delay',roots:['schedule','delay','analysis','تأخير','تحليل'],label:T('Schedule delay analysis','تحليل التأخير الزمني'),terms:['delay analysis','forensic schedule','delay event','time impact','windows analysis','extension of time','تأخير','تحليل التأخير','حدث التأخير','الأثر الزمني','تمديد مدة'],explain:T('Delay analysis links a defined event to the critical work and then to project completion. The method, data date, records and treatment of concurrency must all be stated.','يربط تحليل التأخير حدثًا محددًا بالأعمال الحرجة ثم بتاريخ إكمال المشروع. ويجب بيان المنهج وتاريخ الحالة والسجلات ومعالجة التأخير المتزامن.')},
    {id:'critical',roots:['schedule','delay','critical','float','حرج','سماح'],label:T('Critical path and float','المسار الحرج والسماح'),terms:['critical path','criticality','total float','free float','longest path','المسار الحرج','حرج','السماح الكلي','الفائض الزمني'],explain:T('Critical work controls completion at the relevant time. Float measures timing flexibility; it is not automatically owned by one party unless the Contract says so.','يتحكم العمل الحرج في الإكمال خلال الفترة المعنية. ويقيس السماح المرونة الزمنية، ولا يكون مملوكًا تلقائيًا لطرف ما إلا إذا نص العقد على ذلك.')},
    {id:'logic',roots:['schedule','logic','relationship','lag','علاقات','منطق'],label:T('Logic and relationships','المنطق والعلاقات'),terms:['logic','relationship','predecessor','successor','lag','lead','restraint','علاقة','العلاقات','سابق','لاحق','فترة تأخير','قيد'],explain:T('Logic states what must happen before or after another activity. Changing a relationship or lag can change the result, so each edit needs a physical, contractual or record-based reason.','يحدد المنطق ما يجب أن يسبق نشاطًا أو يتبعه. وقد يغير تعديل العلاقة أو فترة التأخير النتيجة، لذلك يحتاج كل تعديل إلى سبب مادي أو تعاقدي أو قائم على السجل.')},
    {id:'baseline',roots:['schedule','baseline','update','progress','خط الأساس','تحديث'],label:T('Baseline, updates and as-built','خط الأساس والتحديثات والتنفيذ الفعلي'),terms:['baseline','update schedule','data date','status date','as-built','progress update','خط الأساس','تحديث البرنامج','تاريخ الحالة','التنفيذ الفعلي'],explain:T('The baseline records the accepted plan; updates record progress and current forecasts; as-built evidence records what occurred. They answer different questions and should not be mixed silently.','يسجل خط الأساس الخطة المقبولة، وتسجل التحديثات التقدم والتوقعات الحالية، ويسجل التنفيذ الفعلي ما حدث. وهي تجيب عن أسئلة مختلفة ولا ينبغي خلطها دون بيان.')},
    {id:'basis',roots:['schedule','basis','assumption','calendar','أساس','افتراضات'],label:T('Schedule basis and assumptions','أساس البرنامج والافتراضات'),terms:['schedule basis','basis document','assumption','calendar','resource','schedule risk','أساس البرنامج','الافتراضات','التقويم','الموارد'],explain:T('The schedule basis explains how the programme was built: scope, calendars, productivity, logic, constraints, resources, exclusions and risks. It makes later changes auditable.','يوضح أساس البرنامج كيفية بنائه: النطاق والتقاويم والإنتاجية والعلاقات والقيود والموارد والاستبعادات والمخاطر، مما يجعل التغييرات اللاحقة قابلة للتدقيق.')},
    {id:'claims',roots:['contract','claim','notice','entitlement','مطالبة','إخطار','استحقاق'],label:T('Contract notice and claims','الإخطار والمطالبات التعاقدية'),terms:['claim','notice','entitlement','extension of time','determination','time bar','engineer','مطالبة','إخطار','استحقاق','تمديد مدة','قرار المهندس','سقوط زمني'],explain:T('This passage may help with notice, causation, records or determination. Entitlement still comes from the executed Contract, Particular Conditions and governing law—not from a technical guide alone.','قد يساعد هذا المقطع في الإخطار أو السببية أو السجلات أو القرار. ويظل الاستحقاق مصدره العقد المنفذ والشروط الخاصة والقانون الحاكم، لا الدليل الفني وحده.')},
    {id:'drawings',roots:['drawing','ifc','approval','design','رسومات','اعتماد'],label:T('IFC drawings and approvals','رسومات IFC والاعتمادات'),terms:['drawing','ifc','approval','shop drawing','design information','رسومات','تنفيذي','اعتماد','معلومات التصميم'],explain:T('Drawings and approvals are information-release gates. Compare the required, submitted and returned dates, then test whether any delay affected critical work.','تمثل الرسومات والاعتمادات بوابات لإتاحة المعلومات. قارن التواريخ المطلوبة والمقدمة والمعادة، ثم اختبر ما إذا كان أي تأخير قد أثر في الأعمال الحرجة.')},
    {id:'safety',roots:['concrete','safety','hazard','osha','سلامة','خطر'],label:T('Construction safety','سلامة التشييد'),terms:['safety','hazard','osha','fall protection','inspection','formwork','shoring','سلامة','خطر','تفتيش','وقاية'],explain:T('Safety provisions establish minimum controls for people, temporary works and operations. They should not be reduced to a schedule assumption or treated as optional logic.','تضع أحكام السلامة حدًا أدنى لضبط الأفراد والأعمال المؤقتة والعمليات. ولا ينبغي اختزالها في افتراض زمني أو التعامل معها كعلاقات اختيارية.')},
    {id:'constructability',roots:['schedule','construction','constructability','buildability','قابلية التنفيذ'],label:T('Constructability and risk','قابلية التنفيذ والمخاطر'),terms:['constructability','buildability','achievable','site access','work sequence','construction risk','قابلية التنفيذ','قابل للبناء','تسلسل العمل','الوصول للموقع'],explain:T('Constructability asks whether scope, sequence, access, temporary works, trades and procurement form a plan that can actually be executed safely and efficiently.','تختبر قابلية التنفيذ ما إذا كان النطاق والتسلسل والوصول والأعمال المؤقتة والتخصصات والتوريد تشكل خطة يمكن تنفيذها فعليًا بأمان وكفاءة.')},
    {id:'procurement',roots:['procurement','delivery','material','steel','توريد','تسليم'],label:T('Procurement and delivery','التوريد والتسليم'),terms:['procurement','delivery','long lead','material','equipment','steel supply','توريد','تسليم','مواد','معدات','حديد التسليح'],explain:T('Procurement passages address information, approval, manufacture, delivery and responsibility. The schedule effect depends on the promised date, actual record and critical need date.','تتناول مقاطع التوريد المعلومات والاعتماد والتصنيع والتسليم والمسؤولية. ويعتمد الأثر الزمني على التاريخ المتعهد به والسجل الفعلي وتاريخ الاحتياج الحرج.')}
  ];

  const UI={
    eyebrow:T('Full-corpus research search','بحث في كامل محتوى المصادر'),
    title:T('Search all eight books at once','ابحث في المصادر الثمانية دفعة واحدة'),
    intro:T('Type a subject or any word. Smart suggestions expand the idea across related terminology, then return source wording and a plain explanation side by side.','اكتب موضوعًا أو أي كلمة. توسع الاقتراحات الذكية الفكرة عبر المصطلحات المرتبطة، ثم تعرض نص المصدر وشرحًا مبسطًا جنبًا إلى جنب.'),
    placeholder:T('Try: concrete, schedule, delay analysis, formwork…','جرّب: الخرسانة، البرنامج، تحليل التأخير، الشدات…'),
    label:T('Search the complete book corpus','البحث في كامل محتوى المصادر'),
    suggestions:T('Live subject and book-term predictions','توقعات فورية للموضوعات ومصطلحات الكتب'),
    subject:T('Subject','موضوع'),
    bookTerm:T('Book term','مصطلح من الكتب'),
    found:T('uses in the supplied books','استخدامًا في الكتب المرفقة'),
    quick:T('Start with a subject','ابدأ بموضوع'),
    allSources:T('All eight sources','جميع المصادر الثمانية'),
    search:T('Search','بحث'),
    clear:T('Clear','مسح'),
    passages:T('matching passages','مقطعًا مطابقًا'),
    sources:T('sources','مصادر'),
    showing:T('showing','المعروض'),
    exact:T('Exact source wording','النص الحرفي من المصدر'),
    plain:T('Plain explanation','شرح مبسط'),
    concepts:T('This passage is mainly about','يتناول هذا المقطع بصورة أساسية'),
    related:T('Related subject','الموضوع المرتبط'),
    sourceBoundary:T('Source boundary','حدود المصدر'),
    openGuide:T('Open source guide','فتح دليل المصدر'),
    fullPassage:T('Show full indexed passage','عرض المقطع المفهرس كاملًا'),
    more:T('Show more results','عرض نتائج إضافية'),
    noResults:T('No exact or related passage was found. Try a shorter term or choose a suggested subject.','لم يتم العثور على مقطع حرفي أو مرتبط. جرّب كلمة أقصر أو اختر موضوعًا مقترحًا.'),
    coverage:T('Search covers text extracted from all 527 supplied PDF pages plus OSHA 1926.703. The two ACI files are supplied excerpts; ECP 203 is OCR-indexed and must be checked against the scanned page before quotation.','يغطي البحث النص المستخرج من جميع صفحات PDF المرفقة البالغ عددها 527 صفحة، إضافة إلى OSHA 1926.703. ملفا ACI مقتطفان كما تم إرفاقهما؛ وقد فُهرس ECP 203 بالتعرف الضوئي ويجب مراجعته مقابل الصفحة المصورة قبل الاقتباس.'),
    typeHint:T('Results update as you type. Use ↑ and ↓ to choose a suggestion.','تتحدث النتائج أثناء الكتابة. استخدم ↑ و↓ لاختيار اقتراح.'),
    indexed:T('indexed passages','مقطعًا مفهرسًا'),
    ocrWarning:T('OCR extract—verify against the scanned page before quoting.','نص مستخرج آليًا—تحقق من الصفحة المصورة قبل الاقتباس.'),
    nativeNote:T('Text extracted from the supplied source.','نص مستخرج من المصدر المرفق.'),
    genericExplain:T('This passage contains the searched wording or a closely related term. Use the cited location and the source boundary before relying on it.','يحتوي هذا المقطع على العبارة المطلوبة أو مصطلح قريب منها. استخدم موضع المصدر وحدوده قبل الاعتماد عليه.')
  };

  const normalize=value=>String(value||'')
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g,'')
    .replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي')
    .toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]+/g,' ').replace(/\s+/g,' ').trim();
  const tokens=value=>normalize(value).split(' ').filter(token=>token.length>1);
  const unique=items=>[...new Set(items)];
  const topicById=new Map(TOPICS.map(topic=>[topic.id,topic]));

  function make(tag,cls,value){
    const node=document.createElement(tag);
    if(cls)node.className=cls;
    if(value!=null)node.textContent=value;
    return node;
  }

  function mount(container,options){
    const books=options.books||[];
    const booksById=new Map(books.map(book=>[book.id,book]));
    const isAr=()=>Boolean(options.arabic);
    const tx=value=>typeof value==='string'?value:(value?.[isAr()?'ar':'en']||value?.en||value?.ar||'');
    const state={query:'',topicId:null,sourceId:'all',limit:18,activeSuggestion:-1,allowedIds:new Set(books.map(book=>book.id))};
    let timer=null;

    container.innerHTML='';
    container.className='bi-search-lab';

    const head=make('header','bi-search-head');
    const headCopy=make('div');
    headCopy.append(make('div','bi-kicker',tx(UI.eyebrow)),make('h3',null,tx(UI.title)),make('p',null,tx(UI.intro)));
    const indexBadge=make('div','bi-index-badge');
    indexBadge.append(make('b',null,String(corpus.stats.passages)),make('span',null,tx(UI.indexed)));
    head.append(headCopy,indexBadge);
    container.appendChild(head);

    const form=make('form','bi-search-form');
    form.setAttribute('role','search');
    const field=make('div','bi-search-field');
    const input=make('input','bi-deep-input');
    input.type='search';input.autocomplete='off';input.spellcheck=true;
    input.placeholder=tx(UI.placeholder);input.setAttribute('aria-label',tx(UI.label));
    input.setAttribute('aria-controls','bookSearchSuggestions');input.setAttribute('aria-autocomplete','list');
    input.setAttribute('aria-describedby','bookSearchHint');
    const submit=make('button','btn bi-search-submit',tx(UI.search));submit.type='submit';
    const clear=make('button','btn bi-search-clear',tx(UI.clear));clear.type='button';clear.hidden=true;
    field.append(input,submit,clear);
    const source=make('select','bi-source-filter');source.setAttribute('aria-label',tx(UI.allSources));
    const all=make('option',null,tx(UI.allSources));all.value='all';source.appendChild(all);
    books.forEach(book=>{const option=make('option',null,tx(book.short));option.value=book.id;source.appendChild(option);});
    form.append(field,source);
    container.appendChild(form);

    const hint=make('div','bi-search-hint',tx(UI.typeHint));hint.id='bookSearchHint';container.appendChild(hint);
    const suggest=make('div','bi-suggestions');suggest.id='bookSearchSuggestions';suggest.setAttribute('role','listbox');suggest.hidden=true;container.appendChild(suggest);
    const quick=make('div','bi-quick-topics');container.appendChild(quick);
    const summary=make('div','bi-search-summary');summary.setAttribute('aria-live','polite');container.appendChild(summary);
    const results=make('div','bi-search-results');container.appendChild(results);
    const coverage=make('p','bi-search-coverage',tx(UI.coverage));container.appendChild(coverage);

    function relatedTopics(query){
      const q=normalize(query);
      if(!q)return TOPICS.filter(topic=>['concrete','schedule','delay','formwork','claims','critical'].includes(topic.id));
      const queryTokens=tokens(q);
      return TOPICS.map(topic=>{
        const label=normalize(tx(topic.label));
        const roots=topic.roots.map(normalize);
        const terms=topic.terms.map(normalize);
        let score=0;
        if(label.includes(q)||q.includes(label))score+=20;
        roots.forEach(root=>{if(root===q)score+=18;else if(root.includes(q)||q.includes(root))score+=10;});
        terms.forEach(term=>{if(term===q)score+=12;else if(term.includes(q)||q.includes(term))score+=5;});
        queryTokens.forEach(token=>{if(label.includes(token))score+=4;if(roots.some(root=>root.includes(token)))score+=3;});
        return {topic,score};
      }).filter(item=>item.score>0).sort((a,b)=>b.score-a.score).map(item=>item.topic).slice(0,7);
    }

    function predictionSuggestions(query){
      const q=normalize(query);
      if(!q)return [];
      const queryTokens=tokens(q);
      return (corpus.predictions||[]).map(prediction=>{
        const phrases=unique([
          tx(prediction.label),prediction.label.en,prediction.label.ar,...prediction.aliases
        ].map(normalize).filter(Boolean));
        let score=0;
        phrases.forEach(phrase=>{
          if(phrase===q)score=Math.max(score,150);
          else if(phrase.startsWith(q))score=Math.max(score,112);
          else if(phrase.split(' ').some(word=>word.startsWith(q)))score=Math.max(score,88);
          else if(phrase.includes(q))score=Math.max(score,62);
        });
        if(!score)return {prediction,score:0};
        const everyToken=queryTokens.every(token=>phrases.some(phrase=>
          phrase.split(' ').some(word=>word.startsWith(token))||phrase.includes(token)
        ));
        if(!everyToken)return {prediction,score:0};
        score+=Math.min(prediction.sources,8)*3+Math.min(Math.log2(prediction.occurrences+1)*4,28);
        return {prediction,score};
      }).filter(item=>item.score>0)
        .sort((a,b)=>b.score-a.score||b.prediction.sources-a.prediction.sources||b.prediction.occurrences-a.prediction.occurrences)
        .slice(0,10);
    }

    function suggestionItems(query){
      const combined=[];
      relatedTopics(query).forEach((topic,index)=>combined.push({kind:'topic',topic,score:178-index*4}));
      predictionSuggestions(query).forEach(item=>combined.push({kind:'prediction',prediction:item.prediction,score:item.score}));
      const seen=new Set();
      return combined.sort((a,b)=>b.score-a.score).filter(item=>{
        const label=normalize(tx(item.kind==='topic'?item.topic.label:item.prediction.label));
        if(seen.has(label))return false;
        seen.add(label);return true;
      }).slice(0,10);
    }

    function renderQuick(){
      quick.innerHTML='';
      quick.appendChild(make('span','bi-quick-label',tx(UI.quick)));
      relatedTopics('').forEach(topic=>{
        const button=make('button','bi-topic-chip',tx(topic.label));button.type='button';
        button.addEventListener('click',()=>selectTopic(topic));quick.appendChild(button);
      });
    }

    function renderSuggestions(){
      const items=suggestionItems(input.value);
      suggest.innerHTML='';
      if(!input.value.trim()||!items.length){suggest.hidden=true;input.setAttribute('aria-expanded','false');return;}
      const title=make('div','bi-suggest-title',tx(UI.suggestions));suggest.appendChild(title);
      items.forEach((item,index)=>{
        const button=make('button','bi-suggestion');button.type='button';button.setAttribute('role','option');
        button.setAttribute('aria-selected',state.activeSuggestion===index?'true':'false');
        const isTopic=item.kind==='topic';
        const model=isTopic?item.topic:item.prediction;
        const stats=isTopic?(corpus.topicStats[model.id]||{passages:0,sources:0}):model;
        const detail=isTopic?tx(model.explain):(model.occurrences+' '+tx(UI.found));
        const copy=make('span');
        const labelLine=make('span','bi-suggest-label');
        labelLine.append(make('strong',null,tx(model.label)),make('em',null,tx(isTopic?UI.subject:UI.bookTerm)));
        copy.append(labelLine,make('small',null,detail));
        const count=make('span','bi-suggest-count',stats.sources+' '+tx(UI.sources));
        button.append(copy,count);
        button.addEventListener('click',()=>isTopic?selectTopic(model):selectPrediction(model));suggest.appendChild(button);
      });
      suggest.hidden=false;input.setAttribute('aria-expanded','true');
    }

    function selectTopic(topic){
      state.topicId=topic.id;state.query=tx(topic.label);state.limit=18;state.activeSuggestion=-1;
      input.value=state.query;renderSuggestions();runSearch();input.focus();
    }

    function selectPrediction(prediction){
      state.topicId=prediction.topicId||null;state.query=tx(prediction.label);state.limit=18;state.activeSuggestion=-1;
      input.value=state.query;renderSuggestions();runSearch();input.focus();
    }

    function occurrenceCount(haystack,needle){
      if(!needle)return 0;
      let index=0,count=0;
      while((index=haystack.indexOf(needle,index))!==-1&&count<8){count+=1;index+=Math.max(needle.length,1);}
      return count;
    }

    function ranked(query){
      const q=normalize(query);
      if(!q)return [];
      const genericTokens=new Set(['the','and','for','with','from','works','work','guide','subject','اعمال','الاعمال','عمل','دليل','موضوع']);
      const raw=tokens(q).filter(token=>!genericTokens.has(token));
      const suggestions=state.topicId?[topicById.get(state.topicId)].filter(Boolean):relatedTopics(q);
      const expanded=unique(suggestions.flatMap(topic=>topic.terms.flatMap(term=>{
        const phrase=normalize(term);
        return [phrase,...tokens(phrase).filter(token=>token.length>=4&&!genericTokens.has(token))];
      }))).filter(term=>term&&!raw.includes(term)).slice(0,70);
      const suggestedIds=new Set(suggestions.map(topic=>topic.id));
      const scored=[];
      corpus.chunks.forEach((chunk,index)=>{
        if(!state.allowedIds.has(chunk.s))return;
        if(state.sourceId!=='all'&&chunk.s!==state.sourceId)return;
        const normalized=chunk._normalized||(chunk._normalized=normalize(chunk.t));
        let score=0;
        const exact=normalized.includes(q);
        if(exact)score+=70+Math.min(occurrenceCount(normalized,q),4)*8;
        let rawHits=0;
        raw.forEach(term=>{const count=occurrenceCount(normalized,term);if(count){rawHits+=1;score+=12+Math.min(count,4)*3;}});
        const topicHits=chunk.u.filter(id=>suggestedIds.has(id));
        if(state.topicId&&chunk.u.includes(state.topicId))score+=34;
        else score+=topicHits.length*7;
        let expandedHits=0;
        expanded.forEach(term=>{if(normalized.includes(term)){expandedHits+=1;score+=2;}});
        if(!exact&&!rawHits&&!topicHits.length&&!expandedHits)return;
        if(chunk.t.length>320)score+=3;
        if(chunk.p===1)score-=4;
        if(chunk.p<=2&&/(copyright|acknowledg(?:e)?ments?)/i.test(chunk.t))score-=42;
        scored.push({chunk,index,score,exact,rawHits,topicHits,expandedHits,highlight:unique([...raw,...expanded]).slice(0,60)});
      });
      scored.sort((a,b)=>b.score-a.score||a.chunk.p-b.chunk.p||a.index-b.index);
      const firstBySource=[];const seen=new Set();
      scored.forEach(item=>{if(!seen.has(item.chunk.s)){seen.add(item.chunk.s);firstBySource.push(item);}});
      const selected=[...firstBySource.sort((a,b)=>b.score-a.score)];
      const selectedKeys=new Set(selected.map(item=>item.index));
      scored.forEach(item=>{if(!selectedKeys.has(item.index)){selected.push(item);selectedKeys.add(item.index);}});
      return selected;
    }

    function matchPosition(text,terms){
      const lower=text.toLowerCase();let best=-1;let matched='';
      terms.forEach(term=>{
        const raw=String(term||'').toLowerCase();
        if(raw.length<2)return;
        const index=lower.indexOf(raw);
        if(index!==-1&&(best===-1||index<best)){best=index;matched=text.slice(index,index+raw.length);}
      });
      return {index:best,matched};
    }

    function excerpt(text,terms){
      const hit=matchPosition(text,terms);
      const center=hit.index<0?0:hit.index;
      let start=Math.max(0,center-150),end=Math.min(text.length,center+360);
      if(start>0){const space=text.indexOf(' ',start);if(space>0&&space<center)start=space+1;}
      if(end<text.length){const space=text.lastIndexOf(' ',end);if(space>center)end=space;}
      return {text:(start?'…':'')+text.slice(start,end).trim()+(end<text.length?'…':''),matched:hit.matched};
    }

    function highlighted(text,needle){
      const node=make('blockquote','bi-exact-copy');node.dir='auto';
      if(!needle){node.textContent=text;return node;}
      const lower=text.toLowerCase(),target=needle.toLowerCase();let cursor=0,index;
      while((index=lower.indexOf(target,cursor))!==-1){
        node.appendChild(document.createTextNode(text.slice(cursor,index)));
        node.appendChild(make('mark',null,text.slice(index,index+needle.length)));
        cursor=index+needle.length;
      }
      node.appendChild(document.createTextNode(text.slice(cursor)));return node;
    }

    function bestTopics(item){
      const order=new Map(relatedTopics(state.query).map((topic,index)=>[topic.id,index]));
      const broad=new Set(['concrete','schedule']);
      return unique(item.chunk.u).map(id=>topicById.get(id)).filter(Boolean).sort((a,b)=>{
        if(state.topicId&&!broad.has(state.topicId)){
          if(a.id===state.topicId)return -1;if(b.id===state.topicId)return 1;
        }
        if(state.topicId&&broad.has(state.topicId)){
          if(a.id===state.topicId&&b.id!==state.topicId)return 1;
          if(b.id===state.topicId&&a.id!==state.topicId)return -1;
        }
        return (order.get(a.id)??99)-(order.get(b.id)??99);
      }).slice(0,2);
    }

    function passageConcepts(item){
      const body=item.chunk._normalized||normalize(item.chunk.t);
      return (corpus.predictions||[]).filter(prediction=>{
        if(!item.chunk.u.includes(prediction.topicId))return false;
        return [prediction.label.en,...prediction.aliases].map(normalize).some(phrase=>phrase.length>3&&body.includes(phrase));
      }).sort((a,b)=>{
        const aGeneric=['concrete','schedule','claim','safety','inspection'].includes(a.id);
        const bGeneric=['concrete','schedule','claim','safety','inspection'].includes(b.id);
        return Number(aGeneric)-Number(bGeneric)||b.label.en.length-a.label.en.length||b.occurrences-a.occurrences;
      }).filter((prediction,index,array)=>array.findIndex(other=>normalize(other.label.en)===normalize(prediction.label.en))===index)
        .slice(0,3);
    }

    function renderResult(item,position){
      const chunk=item.chunk,book=booksById.get(chunk.s);if(!book)return null;
      const card=make('article','bi-search-result');
      const meta=make('header','bi-result-head');
      const sourceCopy=make('div');
      sourceCopy.append(make('span','bi-result-rank',String(position+1)),make('strong',null,tx(book.short)),make('span','bi-result-page',chunk.m==='text'?'29 CFR §1926.703':'PDF p. '+chunk.p));
      const mode=make('span','bi-result-mode '+(chunk.m==='ocr'?'ocr':'native'),chunk.m==='ocr'?'OCR':(chunk.m==='text'?'TEXT':'PDF TEXT'));
      meta.append(sourceCopy,mode);card.appendChild(meta);

      const body=make('div','bi-result-grid');
      const exact=make('section','bi-exact');exact.appendChild(make('h4',null,tx(UI.exact)));
      const snippet=excerpt(chunk.t,[state.query,...item.highlight]);
      exact.appendChild(highlighted(snippet.text,snippet.matched));
      exact.appendChild(make('p','bi-extract-note',chunk.m==='ocr'?tx(UI.ocrWarning):tx(UI.nativeNote)));
      const full=make('details','bi-full-passage');full.append(make('summary',null,tx(UI.fullPassage)));
      const fullText=make('p');fullText.dir='auto';fullText.textContent=chunk.t;full.appendChild(fullText);exact.appendChild(full);

      const plain=make('aside','bi-plain');plain.appendChild(make('h4',null,tx(UI.plain)));
      const concepts=passageConcepts(item);
      if(concepts.length){
        const conceptLine=make('p','bi-concept-line');
        conceptLine.append(document.createTextNode(tx(UI.concepts)+': '),make('strong',null,concepts.map(concept=>tx(concept.label)).join(' · ')));
        plain.appendChild(conceptLine);
      }
      const foundTopics=bestTopics(item);
      if(foundTopics.length){
        foundTopics.forEach(topic=>{
          const topicBlock=make('div','bi-plain-topic');
          topicBlock.append(make('b',null,tx(topic.label)),make('p',null,tx(topic.explain)));plain.appendChild(topicBlock);
        });
      }else plain.appendChild(make('p',null,tx(UI.genericExplain)));
      body.append(exact,plain);card.appendChild(body);

      const foot=make('footer','bi-result-foot');
      const boundary=make('details');boundary.append(make('summary',null,tx(UI.sourceBoundary)),make('p',null,tx(book.authority)));
      const open=make('button','bi-open-guide',tx(UI.openGuide));open.type='button';open.addEventListener('click',()=>options.onOpenBook?.(book.id));
      foot.append(boundary,open);card.appendChild(foot);return card;
    }

    function runSearch(){
      state.query=input.value.trim();state.limit=Math.max(state.limit,18);clear.hidden=!state.query;
      renderSuggestions();summary.innerHTML='';results.innerHTML='';
      if(!state.query){summary.appendChild(make('span',null,tx(UI.quick)));return;}
      const allResults=ranked(state.query);
      const sourceCount=new Set(allResults.map(item=>item.chunk.s)).size;
      const status=make('div');
      status.append(make('b',null,String(allResults.length)),document.createTextNode(' '+tx(UI.passages)+' · '),make('b',null,String(sourceCount)),document.createTextNode(' '+tx(UI.sources)+' · '+tx(UI.showing)+' '+Math.min(state.limit,allResults.length)));
      summary.appendChild(status);
      const topicList=make('div','bi-related-topics');
      relatedTopics(state.query).slice(0,6).forEach(topic=>{
        const button=make('button','bi-topic-chip small',tx(topic.label));button.type='button';button.addEventListener('click',()=>selectTopic(topic));topicList.appendChild(button);
      });
      if(topicList.childElementCount)summary.appendChild(topicList);
      if(!allResults.length){results.appendChild(make('div','bi-empty',tx(UI.noResults)));return;}
      allResults.slice(0,state.limit).forEach((item,index)=>{const node=renderResult(item,index);if(node)results.appendChild(node);});
      if(state.limit<allResults.length){
        const more=make('button','btn bi-more',tx(UI.more)+' ('+(allResults.length-state.limit)+')');more.type='button';
        more.addEventListener('click',()=>{state.limit+=18;runSearch();});results.appendChild(more);
      }
    }

    form.addEventListener('submit',event=>{event.preventDefault();state.limit=18;state.activeSuggestion=-1;runSearch();});
    input.addEventListener('input',()=>{state.topicId=null;state.limit=18;state.activeSuggestion=-1;renderSuggestions();clearTimeout(timer);timer=setTimeout(runSearch,110);});
    input.addEventListener('keydown',event=>{
      const available=suggestionItems(input.value);
      if(event.key==='ArrowDown'&&available.length){event.preventDefault();state.activeSuggestion=(state.activeSuggestion+1)%available.length;renderSuggestions();}
      else if(event.key==='ArrowUp'&&available.length){event.preventDefault();state.activeSuggestion=(state.activeSuggestion-1+available.length)%available.length;renderSuggestions();}
      else if(event.key==='Enter'&&state.activeSuggestion>=0&&available[state.activeSuggestion]){
        event.preventDefault();
        const item=available[state.activeSuggestion];
        item.kind==='topic'?selectTopic(item.topic):selectPrediction(item.prediction);
      }
      else if(event.key==='Escape'){state.activeSuggestion=-1;suggest.hidden=true;input.setAttribute('aria-expanded','false');}
    });
    input.addEventListener('focus',renderSuggestions);
    source.addEventListener('change',()=>{state.sourceId=source.value;state.limit=18;runSearch();});
    clear.addEventListener('click',()=>{state.query='';state.topicId=null;state.sourceId='all';state.limit=18;input.value='';source.value='all';runSearch();input.focus();});

    renderQuick();runSearch();
    return {
      setAllowed(ids){state.allowedIds=new Set(ids);if(state.sourceId!=='all'&&!state.allowedIds.has(state.sourceId)){state.sourceId='all';source.value='all';}runSearch();},
      focus(){input.focus();}
    };
  }

  window.BookSearch={mount,topics:TOPICS,ui:UI};
})();
