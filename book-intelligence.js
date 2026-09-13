(function(){
  const T=(en,ar)=>({en:en,ar:ar});
  const L=(title,detail,ref,titleAr,detailAr,refAr)=>({
    title:T(title,titleAr),detail:T(detail,detailAr),ref:T(ref,refAr||ref)
  });

  window.BOOK_INTELLIGENCE={
    updated:'12 Sep 2026',
    metrics:{sources:8,pdfPages:527,nativeTextPages:302,ocrPages:225},
    lenses:[
      {id:'plain',label:T('Plain English','شرح مبسط')},
      {id:'construction',label:T('Construction','إدارة التشييد')},
      {id:'schedule',label:T('Schedule / Data','البرنامج والبيانات')},
      {id:'risk',label:T('Risk','المخاطر')},
      {id:'contract',label:T('Contract','العقود')},
      {id:'terms',label:T('Translation notes','ملاحظات الترجمة')}
    ],
    ui:{
      kicker:T('Eight-source working library','مكتبة عمل من ثمانية مصادر'),
      title:T('Book Intelligence','ذكاء الكتب'),
      intro:T(
        'Use this workspace to understand what each source says, what authority it carries, and where it helps Claim No. 1. Every explanation is a plain-language synthesis of the supplied file, with limits kept next to the conclusion.',
        'استخدم مساحة العمل هذه لفهم مضمون كل مصدر، وقوته المرجعية، وموضع فائدته للمطالبة رقم 1. كل شرح هو خلاصة مبسطة للملف المرفق، وتظهر حدود الاستخدام بجوار النتيجة.'
      ),
      boundary:T(
        'Decision rule: the executed Contract and Particular Conditions control entitlement; the technical and schedule references explain method, safety and evidence.',
        'قاعدة القرار: العقد المنفذ والشروط الخاصة يحكمان الاستحقاق؛ أما المراجع الفنية والزمنية فتشرح المنهج والسلامة والدليل.'
      ),
      sources:T('Sources','المصادر'),
      pages:T('PDF pages reviewed','صفحات PDF التي تمت مراجعتها'),
      coverage:T('Native-text pages','صفحات ذات نص أصلي'),
      ocr:T('OCR-indexed scan pages','صفحات ممسوحة مفهرسة بالتعرف الضوئي'),
      search:T('Search every book, topic and risk…','ابحث في كل كتاب وموضوع ومخاطرة…'),
      allDomains:T('All disciplines','جميع التخصصات'),
      allClasses:T('All source classes','جميع أنواع المصادر'),
      reset:T('Reset','إعادة الضبط'),
      showing:T('Showing','المعروض'),
      of:T('of','من'),
      authority:T('Authority boundary','حدود القوة المرجعية'),
      sections:T('How the source is organised','كيف تم تنظيم المصدر'),
      claimUse:T('Use for Claim No. 1','الاستخدام في المطالبة رقم 1'),
      sourceMap:T('Source map','خريطة المصدر'),
      guard:T('Do not overstate','لا تتجاوز حدود الدليل'),
      status:T('Coverage status','حالة التغطية'),
      noResults:T('No source matches these filters. Reset the filters or try a shorter term.','لا يوجد مصدر يطابق هذه المرشحات. أعد الضبط أو استخدم عبارة أقصر.'),
      compareTitle:T('Which source answers which question?','أي مصدر يجيب عن أي سؤال؟'),
      compareIntro:T('The sources work as a stack. Contract entitlement, schedule method and construction safety are separate questions.','تعمل المصادر كطبقات مترابطة. الاستحقاق التعاقدي ومنهج التحليل الزمني وسلامة التنفيذ مسائل منفصلة.'),
      faqTitle:T('Fast answers before using the library','إجابات سريعة قبل استخدام المكتبة')
    },
    domains:[
      {id:'delay',label:T('Delay analysis','تحليل التأخير')},
      {id:'schedule',label:T('Schedule quality','جودة البرنامج')},
      {id:'concrete',label:T('Concrete / formwork','الخرسانة والشدات')},
      {id:'contract',label:T('Contract administration','إدارة العقود')},
      {id:'safety',label:T('Safety','السلامة')}
    ],
    classes:[
      {id:'guidance',label:T('Recommended practice','ممارسة موصى بها')},
      {id:'engineering',label:T('Engineering guide','دليل هندسي')},
      {id:'contract',label:T('Contract form','نموذج عقد')},
      {id:'code',label:T('Local code','كود محلي')},
      {id:'regulation',label:T('Regulation','لائحة')}
    ],
    books:[
      {
        id:'aace29',order:1,
        short:T('AACE 29R-03','AACE 29R-03'),
        title:T('Forensic Schedule Analysis','التحليل الجنائي للبرامج الزمنية'),
        issuer:T('AACE International · 2011 revision','AACE International · إصدار منقح 2011'),
        classId:'guidance',classLabel:T('Recommended practice','ممارسة موصى بها'),
        domains:['delay','schedule','contract'],domainLabel:T('Delay analysis','تحليل التأخير'),
        pages:T('135 PDF pages · complete supplied publication','135 صفحة PDF · النسخة المرفقة كاملة'),
        authority:T(
          'Method guidance. AACE 29R-03 is not a contract clause and does not decide legal entitlement. It becomes more influential when the Contract adopts it or the parties use it as their agreed analytical framework.',
          'مرجع منهجي. لا يعد AACE 29R-03 بندًا تعاقديًا ولا يقرر الاستحقاق القانوني. تزداد قوته إذا تبناه العقد أو استخدمه الطرفان كإطار تحليلي متفق عليه.'
        ),
        plain:T(
          'AACE 29R-03 explains how to investigate delay after the facts. It says the analyst must validate the schedules, identify the real critical path, separate cause from effect, choose a method that fits the available records, and show every material adjustment. It presents nine method families; it does not declare one method correct for every project.',
          'يشرح AACE 29R-03 كيفية فحص التأخير بعد وقوعه. ويطلب التحقق من البرامج الزمنية، وتحديد المسار الحرج الحقيقي، وفصل السبب عن الأثر، واختيار منهج يناسب السجلات المتاحة، وإظهار كل تعديل جوهري. ويعرض تسع عائلات منهجية، ولا يقرر أن منهجًا واحدًا يصلح لكل مشروع.'
        ),
        lenses:{
          construction:T('Use the method to test whether a model still describes work that can actually be built. A logic edit is not neutral if it removes curing, crew movement, access or sequence restraints that existed in the accepted plan.','استخدم المنهج لاختبار ما إذا كان النموذج ما يزال يصف عملًا قابلًا للتنفيذ. تعديل العلاقات ليس محايدًا إذا أزال مدد المعالجة أو حركة الفرق أو قيود الوصول أو التسلسل الموجودة في الخطة المقبولة.'),
          schedule:T('The data task is source validation before calculation: baseline, updates, data dates, calendars, logic, progress, actual dates and delay fragnets. Then isolate the effect of each correction and preserve an audit trail.','تبدأ مهمة البيانات بالتحقق من المصدر قبل الحساب: خط الأساس والتحديثات وتواريخ الحالة والتقاويم والعلاقات والتقدم والتواريخ الفعلية وشبكات التأخير. ثم يعزل أثر كل تصحيح مع الاحتفاظ بمسار تدقيق.'),
          risk:T('The largest analytical risks are mixing prospective and retrospective viewpoints, correcting only items that help one side, treating activity delay as project delay, and discussing concurrency without matching critical paths and time periods.','أكبر المخاطر التحليلية هي خلط المنظور المستقبلي بالاستعادي، وتصحيح العناصر التي تفيد طرفًا واحدًا فقط، واعتبار تأخير النشاط تأخيرًا للمشروع، ومناقشة التزامن دون مطابقة المسارات الحرجة والفترات الزمنية.'),
          contract:T('Use AACE 29R-03 to explain analytical reliability, not entitlement. Notice, causation, compensability, time bars and the Engineer’s determination duties come from the executed Contract and governing law.','استخدم AACE 29R-03 لشرح موثوقية التحليل، لا لإثبات الاستحقاق. الإخطار والسببية وقابلية التعويض والسقوط الزمني وواجبات قرار المهندس مصدرها العقد المنفذ والقانون الحاكم.'),
          terms:T('“Prospective” means looking forward from the analysis date. “Retrospective” means reconstructing what happened. “Observational” reads schedule behaviour; “modeled” inserts or removes events. “Criticality” concerns project completion, not merely a late activity.','تعني «المستقبلية» النظر إلى الأمام من تاريخ التحليل، وتعني «الاستعادية» إعادة بناء ما حدث. ويقرأ المنهج «الرصدي» سلوك البرنامج، بينما يضيف المنهج «النمذجي» الأحداث أو يزيلها. وترتبط «الحرجية» بإتمام المشروع لا بمجرد تأخر نشاط.')
        },
        sections:[
          T('Taxonomy: prospective or retrospective; observational or modeled; static or dynamic logic.','التصنيف: مستقبلي أو استعادي؛ رصدي أو نمذجي؛ منطق ثابت أو متغير.'),
          T('Source validation: baseline, as-built records, updates and discrete delay events.','التحقق من المصادر: خط الأساس وسجلات التنفيذ الفعلي والتحديثات وأحداث التأخير المحددة.'),
          T('Method implementation: MIP 3.1 through MIP 3.9, from static comparisons to additive and subtractive simulations.','تنفيذ المناهج: من MIP 3.1 إلى MIP 3.9، من المقارنات الثابتة إلى المحاكاة بالإضافة أو الحذف.'),
          T('Analysis evaluation: criticality, float, concurrency, pacing, mitigation, acceleration and responsibility.','تقييم التحليل: الحرجية والسماح والتزامن والمجاراة والتخفيف والتعجيل والمسؤولية.'),
          T('Method selection: match the technique to the Contract, the question and the quality of available schedules.','اختيار المنهج: مواءمة التقنية مع العقد والسؤال وجودة البرامج المتاحة.')
        ],
        claimUse:[
          T('Test whether each of the 24 logic changes corrected a true physical or contractual impossibility.','اختبار ما إذا كان كل تعديل من تعديلات العلاقات الأربع والعشرين يصحح استحالة مادية أو تعاقدية حقيقية.'),
          T('Separate actual-duration substitution, logic revision and approval-date correction into auditable sensitivities.','فصل استبدال المدد الفعلية وتعديل العلاقات وتصحيح تواريخ الاعتماد في اختبارات حساسية قابلة للتدقيق.'),
          T('Require a native CPM recalculation before changing the stated day quantum.','اشتراط إعادة حساب أصلية باستخدام CPM قبل تغيير مقدار الأيام المعلن.')
        ],
        locators:[
          L('Framework and taxonomy','What the method names mean and how they differ.','PDF pp. 2–8; text pp. 9–18','الإطار والتصنيف','معنى أسماء المناهج وأوجه اختلافها.','صفحات PDF 2–8؛ الصفحات المطبوعة 9–18'),
          L('Source validation','Protocols for baselines, updates, as-built evidence and event records.','Text pp. 18–37','التحقق من المصدر','بروتوكولات خط الأساس والتحديثات وأدلة التنفيذ الفعلي وسجلات الأحداث.','الصفحات المطبوعة 18–37'),
          L('Nine methods','Detailed minimum and enhanced implementation protocols.','Text pp. 38–97','المناهج التسعة','بروتوكولات تنفيذ أساسية ومحسنة بالتفصيل.','الصفحات المطبوعة 38–97'),
          L('Analysis evaluation','Critical path, concurrency, pacing, mitigation and responsibility.','Text pp. 98–124','تقييم التحليل','المسار الحرج والتزامن والمجاراة والتخفيف والمسؤولية.','الصفحات المطبوعة 98–124'),
          L('Choosing a method','Selection factors and closing guidance.','Text pp. 125–134','اختيار المنهج','عوامل الاختيار والإرشادات الختامية.','الصفحات المطبوعة 125–134')
        ],
        guard:T('Do not cite AACE 29R-03 as proof that 76, 37, 21 or 12 days is correct. The recommended practice supplies tests and protocols; the native schedule files and verified project records supply the result.','لا تستشهد بـ AACE 29R-03 كدليل على صحة 76 أو 37 أو 21 أو 12 يومًا. فالممارسة الموصى بها تقدم الاختبارات والبروتوكولات، بينما تقدم ملفات البرنامج الأصلية وسجلات المشروع المتحقق منها النتيجة.'),
        status:T('Complete native text extraction: 135 of 135 PDF pages.','استخراج نص أصلي كامل: 135 من 135 صفحة PDF.')
      },
      {
        id:'aace48',order:2,
        short:T('AACE 48R-06','AACE 48R-06'),
        title:T('Schedule Constructability Review','مراجعة قابلية تنفيذ البرنامج الزمني'),
        issuer:T('AACE International · 2009','AACE International · 2009'),
        classId:'guidance',classLabel:T('Recommended practice','ممارسة موصى بها'),
        domains:['schedule','concrete','safety'],domainLabel:T('Schedule quality','جودة البرنامج'),
        pages:T('11 PDF pages · complete supplied publication','11 صفحة PDF · النسخة المرفقة كاملة'),
        authority:T('Good-practice guidance for reviewing whether a schedule is accurate, logical and achievable. It does not replace the Contract, an approved method statement or a structural design.','إرشاد مهني لمراجعة ما إذا كان البرنامج دقيقًا ومنطقيًا وقابلًا للتنفيذ. ولا يحل محل العقد أو بيان الطريقة المعتمد أو التصميم الإنشائي.'),
        plain:T('AACE 48R-06 asks one practical question: can the project be built the way the schedule says? It reviews scope, sequence, trade interfaces, IFC information, procurement lead times, site access, temporary works, weather, labour, safety, testing and commissioning across design, procurement and execution.','يطرح AACE 48R-06 سؤالًا عمليًا واحدًا: هل يمكن تنفيذ المشروع بالطريقة التي يصفها البرنامج؟ ويفحص النطاق والتسلسل وتداخلات التخصصات ومعلومات IFC ومدد التوريد والوصول للموقع والأعمال المؤقتة والطقس والعمالة والسلامة والاختبارات والتشغيل خلال التصميم والتوريد والتنفيذ.'),
        lenses:{
          construction:T('A constructability review follows the planned sequence from access and civil works through structure, enclosure, services, finishes, testing and handover. The reviewer needs project-type experience, not scheduling software knowledge alone.','تتبع مراجعة قابلية التنفيذ التسلسل المخطط من الوصول والأعمال المدنية إلى الهيكل والغلاف والخدمات والتشطيبات والاختبارات والتسليم. ويحتاج المراجع إلى خبرة بنوع المشروع، لا مجرد معرفة برنامج الجدولة.'),
          schedule:T('Check completeness, links from start to finish, control points such as IFC issue, procurement sources, realistic durations, calendars, resource peaks and commissioning interfaces. A date can calculate correctly and still describe an unbuildable plan.','افحص الاكتمال والعلاقات من البداية إلى النهاية ونقاط التحكم مثل إصدار IFC ومصادر مدد التوريد وواقعية المدد والتقاويم وذروة الموارد وتداخلات التشغيل. قد يكون التاريخ محسوبًا حسابيًا بطريقة صحيحة لكنه يصف خطة غير قابلة للتنفيذ.'),
          risk:T('The review exposes risks before they become delay: late design, long-lead items, site congestion, access conflicts, weather exposure, unavailable labour, temporary-facility clashes and unsafe sequences.','تكشف المراجعة المخاطر قبل تحولها إلى تأخير: تأخر التصميم والمواد طويلة التوريد وازدحام الموقع وتعارض الوصول والتعرض للطقس ونقص العمالة وتعارض المنشآت المؤقتة والتسلسلات غير الآمنة.'),
          contract:T('Use the practice to test schedule quality and the reasonableness of proposed logic. Acceptance, revision rights and consequences of a deficient programme still depend on the Contract.','استخدم الممارسة لاختبار جودة البرنامج ومعقولية العلاقات المقترحة. ويظل القبول وحقوق التعديل وآثار قصور البرنامج خاضعًا للعقد.'),
          terms:T('“Constructability” is buildability in context. “Control point” is a milestone or gate that releases later work. “Vertical slice” means reviewing one work stream across design, procurement and construction before moving to the next.','«قابلية التنفيذ» هي إمكانية البناء في ظروف المشروع. و«نقطة التحكم» معلم أو بوابة تسمح ببدء العمل اللاحق. و«الشريحة الرأسية» مراجعة مسار عمل واحد عبر التصميم والتوريد والتنفيذ قبل الانتقال إلى المسار التالي.')
        },
        sections:[
          T('Purpose and background of schedule constructability review.','الغرض والخلفية لمراجعة قابلية تنفيذ البرنامج.'),
          T('How review depth changes across design, procurement and execution.','كيف يتغير عمق المراجعة خلال التصميم والتوريد والتنفيذ.'),
          T('Completeness, coordination, commissioning, work by others, IFC control points, safety, long-lead items and weather.','الاكتمال والتنسيق والتشغيل وأعمال الغير ونقاط تحكم IFC والسلامة والمواد طويلة التوريد والطقس.'),
          T('Site planning: access, temporary facilities, laydown, manpower, sequence, civil works and permanent systems.','تخطيط الموقع: الوصول والمنشآت المؤقتة والتخزين والعمالة والتسلسل والأعمال المدنية والأنظمة الدائمة.'),
          T('A field-oriented review checklist from site access through facility completion.','قائمة مراجعة ميدانية من الوصول للموقع حتى اكتمال المنشأة.')
        ],
        claimUse:[
          T('Support the statement that IFC issue is a legitimate schedule control point.','دعم أن إصدار IFC يمثل نقطة تحكم مشروعة في البرنامج.'),
          T('Test whether zeroing curing and reshoring links leaves an achievable concrete sequence.','اختبار ما إذا كان تصفير علاقات المعالجة وإعادة التدعيم يترك تسلسلًا خرسانيًا قابلًا للتنفيذ.'),
          T('Frame the 24-link review around build method, not personal preference.','تأطير مراجعة العلاقات الأربع والعشرين حول طريقة التنفيذ، لا التفضيل الشخصي.')
        ],
        locators:[
          L('Purpose','Guideline status and the aim of the review.','PDF p. 2','الغرض','صفة الدليل وهدف المراجعة.','صفحة PDF 2'),
          L('Core test','Accurate, logical and achievable schedule.','PDF pp. 3–4','الاختبار الأساسي','برنامج دقيق ومنطقي وقابل للتنفيذ.','صفحات PDF 3–4'),
          L('Project phases','Design, procurement and execution reviews.','PDF pp. 4–5','مراحل المشروع','مراجعات التصميم والتوريد والتنفيذ.','صفحات PDF 4–5'),
          L('Review considerations','Control points, long leads, weather and detail.','PDF pp. 6–7','اعتبارات المراجعة','نقاط التحكم والتوريد الطويل والطقس ومستوى التفصيل.','صفحات PDF 6–7'),
          L('Site checklist','Access, civil work, facility work and completion sequence.','PDF pp. 8–10','قائمة الموقع','الوصول والأعمال المدنية وأعمال المنشأة وتسلسل الإكمال.','صفحات PDF 8–10')
        ],
        guard:T('AACE 48R-06 can show that logic should represent the build plan. It cannot by itself prove the required curing duration, structural capacity or extension-of-time quantum.','يمكن لـ AACE 48R-06 إثبات أن العلاقات يجب أن تمثل خطة التنفيذ، لكنه لا يثبت وحده مدة المعالجة المطلوبة أو القدرة الإنشائية أو مقدار تمديد الوقت.'),
        status:T('Complete native text extraction: 11 of 11 PDF pages.','استخراج نص أصلي كامل: 11 من 11 صفحة PDF.')
      },
      {
        id:'aace38',order:3,
        short:T('AACE 38R-06','AACE 38R-06'),
        title:T('Documenting the Schedule Basis','توثيق أسس البرنامج الزمني'),
        issuer:T('AACE International · 2009','AACE International · 2009'),
        classId:'guidance',classLabel:T('Recommended practice','ممارسة موصى بها'),
        domains:['schedule','risk','contract'],domainLabel:T('Schedule governance','حوكمة البرنامج'),
        pages:T('12 PDF pages · complete supplied publication','12 صفحة PDF · النسخة المرفقة كاملة'),
        authority:T('Good-practice guidance for documenting assumptions, logic and governance. It supports transparency but does not amend the accepted baseline or the Contract.','إرشاد مهني لتوثيق الافتراضات والعلاقات والحوكمة. يدعم الشفافية لكنه لا يعدل خط الأساس المقبول أو العقد.'),
        plain:T('AACE 38R-06 says every serious schedule needs a written operating manual. The schedule basis explains what is included, who supplied the information, how durations and logic were built, which calendars and constraints apply, what risks and exclusions remain, how the critical path runs and how later baseline changes are reconciled.','يقرر AACE 38R-06 أن كل برنامج جاد يحتاج إلى دليل تشغيل مكتوب. وتشرح وثيقة الأساس ما تم إدراجه ومن قدم المعلومات وكيف بنيت المدد والعلاقات والتقاويم والقيود والمخاطر والاستبعادات والمسار الحرج وكيف تتم مطابقة تغييرات خط الأساس لاحقًا.'),
        lenses:{
          construction:T('The basis should record execution strategy, work areas, crew sizes, productivity, equipment, access, laydown, procurement, subcontract interfaces, testing and commissioning. Those facts explain why logic exists.','ينبغي أن تسجل وثيقة الأساس استراتيجية التنفيذ ومناطق العمل وأحجام الفرق والإنتاجية والمعدات والوصول والتخزين والتوريد وتداخلات المقاولين والاختبارات والتشغيل. وهذه الوقائع تشرح سبب وجود العلاقات.'),
          schedule:T('Treat the basis as model metadata: calendars, data sources, duration rules, relationship rules, constraints, codes, software settings, critical and near-critical paths, reserve and change history.','تعامل مع وثيقة الأساس كبيانات وصفية للنموذج: التقاويم ومصادر البيانات وقواعد المدد والعلاقات والقيود والأكواد وإعدادات البرنامج والمسارات الحرجة وشبه الحرجة والاحتياطي وسجل التغيير.'),
          risk:T('Visible assumptions, exclusions, risks, opportunities and reserve stop hidden uncertainty from being mistaken for certainty. The basis should change with controlled change management, not silent retrospective edits.','تمنع الافتراضات والاستبعادات والمخاطر والفرص والاحتياطي الظاهرة من تحويل عدم اليقين الخفي إلى يقين زائف. وينبغي تحديث الوثيقة من خلال إدارة تغيير مضبوطة لا تعديلات استعادية صامتة.'),
          contract:T('The basis can explain how the schedule implements contract milestones, owner inputs, review periods and work by others. If it conflicts with the Contract, the Contract’s priority rules control.','يمكن لوثيقة الأساس شرح كيفية تطبيق معالم العقد ومدخلات صاحب العمل وفترات المراجعة وأعمال الغير في البرنامج. وإذا تعارضت مع العقد فتسري قواعد أولوية مستندات العقد.'),
          terms:T('“Schedule basis” is the narrative behind the CPM file. “Preferential logic” is a contractor’s chosen sequence beyond minimum contract requirements, such as crew movement or form reuse. “Reserve” is a disclosed allowance derived from risk assessment, not automatically float.','«أساس البرنامج» هو السرد الذي يشرح ملف CPM. و«العلاقات التفضيلية» هي تسلسل يختاره المقاول فوق الحد الأدنى للعقد، مثل حركة الفرق أو إعادة استخدام الشدات. و«الاحتياطي» سماح معلن مستمد من تقييم المخاطر، وليس السماح الزمني تلقائيًا.')
        },
        sections:[
          T('Project description, integration, scope, WBS/OBS and responsibility.','وصف المشروع والتكامل والنطاق وWBS/OBS والمسؤوليات.'),
          T('Execution and procurement strategy, contract type and key dates.','استراتيجية التنفيذ والتوريد ونوع العقد والتواريخ الرئيسية.'),
          T('Planning basis, critical path, execution path, turnover and startup.','أساس التخطيط والمسار الحرج ومسار التنفيذ والتسليم والتشغيل.'),
          T('Issues, risks, opportunities, assumptions, exclusions and exceptions.','المسائل والمخاطر والفرص والافتراضات والاستبعادات والاستثناءات.'),
          T('Baseline reconciliation, reserve, project buy-in, software and technique controls.','مطابقة خط الأساس والاحتياطي واعتماد فريق المشروع وضوابط البرامج والتقنيات.')
        ],
        claimUse:[
          T('Ask for the contemporaneous basis for each disputed logic relationship before calling it unnecessary.','طلب الأساس المعاصر لكل علاقة متنازع عليها قبل وصفها بأنها غير ضرورية.'),
          T('Show that crew movement and form reuse are recognised examples of preferential logic.','إظهار أن حركة الفرق وإعادة استخدام الشدات أمثلة معترف بها للعلاقات التفضيلية.'),
          T('Document verified approval dates, calendars and change reasons before native recalculation.','توثيق تواريخ الاعتماد المتحقق منها والتقاويم وأسباب التغيير قبل إعادة الحساب الأصلية.')
        ],
        locators:[
          L('Core contents','The complete list of basis-document topics.','PDF p. 3','المحتويات الأساسية','القائمة الكاملة لموضوعات وثيقة الأساس.','صفحة PDF 3'),
          L('Project and scope','Integration inputs, WBS, OBS and responsibilities.','PDF pp. 3–4','المشروع والنطاق','مدخلات التكامل وWBS وOBS والمسؤوليات.','صفحات PDF 3–4'),
          L('Dates and planning','Milestones, submittals, calendars, logic and productivity sources.','PDF pp. 5–6','التواريخ والتخطيط','المعالم والتقديمات والتقاويم والعلاقات ومصادر الإنتاجية.','صفحات PDF 5–6'),
          L('Risk and change','Risks, assumptions, exclusions, reconciliation and reserve.','PDF pp. 7–8','المخاطر والتغيير','المخاطر والافتراضات والاستبعادات والمطابقة والاحتياطي.','صفحات PDF 7–8'),
          L('Software and checklist','Logic, lags, constraints, calendars, settings and Appendix A.','PDF pp. 9–12','البرنامج والقائمة','العلاقات وفترات التأخير والقيود والتقاويم والإعدادات والملحق أ.','صفحات PDF 9–12')
        ],
        guard:T('A later narrative cannot retroactively prove what the approved baseline meant. Prefer the basis issued with the schedule, contemporaneous review comments and actual change records.','لا يمكن لسرد لاحق أن يثبت بأثر رجعي معنى خط الأساس المقبول. الأفضل الاعتماد على وثيقة الأساس الصادرة مع البرنامج وتعليقات المراجعة المعاصرة وسجلات التغيير الفعلية.'),
        status:T('Complete native text extraction: 12 of 12 PDF pages.','استخراج نص أصلي كامل: 12 من 12 صفحة PDF.')
      },
      {
        id:'aci3472',order:4,
        short:T('ACI 347.2R-17','ACI 347.2R-17'),
        title:T('Guide for Shoring/Reshoring of Concrete Multistory Buildings','دليل التدعيم وإعادة التدعيم للمباني الخرسانية متعددة الطوابق'),
        issuer:T('American Concrete Institute · 2017','المعهد الأمريكي للخرسانة · 2017'),
        classId:'engineering',classLabel:T('Engineering guide','دليل هندسي'),
        domains:['concrete','safety','schedule'],domainLabel:T('Shoring / reshoring','التدعيم وإعادة التدعيم'),
        pages:T('5 supplied PDF pages · excerpt only','5 صفحات PDF مرفقة · مقتطف فقط'),
        authority:T('Engineering guidance, not a project-specific design and not a substitute for the engineer of record. The supplied file is only an excerpt of a longer guide.','إرشاد هندسي، وليس تصميمًا خاصًا بالمشروع ولا بديلًا عن مهندس التصميم المسؤول. والملف المرفق مقتطف فقط من دليل أطول.'),
        plain:T('ACI 347.2R-17 explains why multistory concrete needs a planned shoring and reshoring cycle. Fresh slabs receive their own weight plus formwork, workers, equipment and loads passed down from floors above. The cycle therefore depends on load distribution and early-age slab strength, including flexure and punching shear, rather than on a convenient fixed number of days.','يشرح ACI 347.2R-17 سبب حاجة الخرسانة متعددة الطوابق إلى دورة مخططة للتدعيم وإعادة التدعيم. تتحمل البلاطات الحديثة وزنها ووزن الشدات والعمال والمعدات والأحمال المنقولة من الطوابق الأعلى. لذلك تعتمد الدورة على توزيع الأحمال ومقاومة البلاطات المبكرة، بما يشمل الانحناء والقص الثاقب، لا على عدد أيام ثابت للملاءمة.'),
        lenses:{
          construction:T('The form system, stripping sequence, number of supported floors and use of shores, reshores, backshores or preshores change both productivity and the load path. The plan must stay under field supervision and engineering review.','يغير نظام الشدات وتسلسل الفك وعدد الطوابق المدعومة واستخدام الدعائم أو إعادة التدعيم أو التدعيم الخلفي أو المسبق كلًا من الإنتاجية ومسار الأحمال. ويجب أن تظل الخطة تحت إشراف ميداني ومراجعة هندسية.'),
          schedule:T('A concrete cycle duration is an output of the approved forming system, placement rate, strength-development evidence and load analysis. The schedule should carry those dependencies explicitly instead of assuming same-day stripping.','مدة دورة الخرسانة ناتج لنظام الشدات المعتمد ومعدل الصب ودليل تطور المقاومة وتحليل الأحمال. وينبغي أن يحمل البرنامج هذه الاعتماديات صراحة بدل افتراض الفك في اليوم نفسه.'),
          risk:T('Premature removal can overload young slabs or shores and lead to cracking, excessive deflection, punching shear distress or partial/total failure. The consequence is safety and structural performance, not only time.','قد تؤدي الإزالة المبكرة إلى تحميل زائد للبلاطات الحديثة أو الدعائم وحدوث تشققات أو ترخيم مفرط أو مشاكل قص ثاقب أو فشل جزئي أو كلي. فالنتيجة تتعلق بالسلامة والأداء الإنشائي، لا بالوقت فقط.'),
          contract:T('Use the guide to explain why the disputed restraint needs engineering evidence. The project drawings, specifications, approved method statement and engineer-of-record requirements decide the actual removal criteria.','استخدم الدليل لشرح سبب حاجة القيد المتنازع عليه إلى دليل هندسي. وتحدد رسومات المشروع ومواصفاته وبيان الطريقة المعتمد ومتطلبات مهندس التصميم معايير الإزالة الفعلية.'),
          terms:T('“Shore” supports formwork and fresh concrete. “Reshore” is installed after a slab has been stripped and allowed to carry its own weight. “Backshore” remains or is replaced without that unloading step. These are different load-transfer conditions.','«الدعامة» تحمل الشدة والخرسانة الحديثة. و«إعادة التدعيم» تركب بعد فك البلاطة والسماح لها بحمل وزنها. أما «التدعيم الخلفي» فيبقى أو يستبدل دون خطوة تفريغ الحمل. وهذه حالات مختلفة لانتقال الأحمال.')
        },
        sections:[
          T('Introduction: failures and defects linked to premature shore removal.','المقدمة: حالات الفشل والعيوب المرتبطة بالإزالة المبكرة للدعائم.'),
          T('Notation and definitions for loads, early-age capacity and shoring systems.','الرموز والتعريفات للأحمال والقدرة المبكرة وأنظمة التدعيم.'),
          T('Shoring/reshoring construction needs and four forming-system families.','احتياجات تنفيذ التدعيم وإعادة التدعيم وأربع عائلات لأنظمة الشدات.'),
          T('Full-guide topics listed in the contents: construction loads, load combinations and distribution.','موضوعات الدليل الكامل الواردة في الفهرس: أحمال التنفيذ وتركيبات الأحمال وتوزيعها.'),
          T('Full-guide topics listed in the contents: early-age slab strength, serviceability and worked examples.','موضوعات الدليل الكامل الواردة في الفهرس: مقاومة البلاطات المبكرة وقابلية الخدمة وأمثلة تطبيقية.')
        ],
        claimUse:[
          T('Establish that stripping and vertical-cycle restraints represent a structural load-transfer problem.','إثبات أن قيود الفك والدورة الرأسية تمثل مسألة انتقال أحمال إنشائية.'),
          T('Require the underlying strength/load analysis before setting those links to zero.','اشتراط تحليل المقاومة والأحمال قبل تصفير هذه العلاقات.'),
          T('Treat the supplied excerpt as supporting context, not a project calculation.','معاملة المقتطف المرفق كسياق داعم، لا كحساب خاص بالمشروع.')
        ],
        locators:[
          L('Contents','Map of the complete guide.','PDF pp. 2–3','الفهرس','خريطة الدليل الكامل.','صفحات PDF 2–3'),
          L('Introduction','Why early removal creates structural risk.','PDF p. 4; printed pp. 1–2','المقدمة','لماذا تنشئ الإزالة المبكرة خطرًا إنشائيًا.','صفحة PDF 4؛ الصفحات المطبوعة 1–2'),
          L('Definitions','Shore, reshore, backshore, preshore and strength variables.','PDF pp. 4–5','التعريفات','الدعامة وإعادة التدعيم والتدعيم الخلفي والمسبق ومتغيرات المقاومة.','صفحات PDF 4–5'),
          L('Construction needs','Load sharing across several young floors.','PDF p. 5; printed p. 3','احتياجات التنفيذ','توزيع الأحمال عبر عدة طوابق حديثة.','صفحة PDF 5؛ الصفحة المطبوعة 3'),
          L('Forming systems','Shoring-based, flying truss, column-mounted and tunnel systems.','PDF p. 5; excerpt ends mid-section','أنظمة الشدات','أنظمة قائمة على التدعيم والجمالونات الطائرة والمثبتة على الأعمدة والأنفاق.','صفحة PDF 5؛ ينتهي المقتطف وسط القسم')
        ],
        guard:T('HOLD: no shoring duration, floor cycle or removal strength is approved by this summary. A qualified formwork designer and engineer of record must confirm the project-specific load path, concrete strength and sequence.','تعليق: لا تعتمد هذه الخلاصة أي مدة تدعيم أو دورة طابق أو مقاومة إزالة. يجب أن يؤكد مصمم شدات مؤهل ومهندس التصميم مسار الأحمال ومقاومة الخرسانة والتسلسل الخاص بالمشروع.'),
        status:T('Supplied excerpt reviewed: 5 of 5 PDF pages; the source itself states the complete guide continues beyond the excerpt.','تمت مراجعة المقتطف المرفق: 5 من 5 صفحات PDF؛ ويبين المصدر نفسه أن الدليل الكامل يستمر بعد المقتطف.')
      },
      {
        id:'aci347',order:5,
        short:T('ACI 347R-14','ACI 347R-14'),
        title:T('Guide to Formwork for Concrete','دليل الشدات الخرسانية'),
        issuer:T('American Concrete Institute · 2014','المعهد الأمريكي للخرسانة · 2014'),
        classId:'engineering',classLabel:T('Engineering guide','دليل هندسي'),
        domains:['concrete','safety','schedule'],domainLabel:T('Formwork','الشدات'),
        pages:T('11 supplied PDF pages · Chapters 1–4 excerpt','11 صفحة PDF مرفقة · مقتطف من الفصول 1–4'),
        authority:T('Engineering guidance for formwork planning and design. It is not automatically the governing code and the supplied file is an authorised excerpt, not the complete guide.','إرشاد هندسي لتخطيط وتصميم الشدات. وليس الكود الحاكم تلقائيًا، والملف المرفق مقتطف مصرح به وليس الدليل الكامل.'),
        plain:T('ACI 347R-14 covers the temporary system that shapes and supports fresh concrete. The supplied chapters define responsibilities, identify what contract documents and formwork drawings should contain, and explain loads, material capacity, accessories, shores, bracing, foundations and settlement. The complete guide also covers construction, materials, architectural concrete and special methods.','يغطي ACI 347R-14 النظام المؤقت الذي يشكل الخرسانة الحديثة ويدعمها. وتحدد الفصول المرفقة المسؤوليات وما ينبغي أن تتضمنه مستندات العقد ورسومات الشدات وتشرح الأحمال وقدرة المواد والملحقات والدعائم والتدعيم والأساسات والهبوط. ويغطي الدليل الكامل أيضًا التنفيذ والمواد والخرسانة المعمارية والطرق الخاصة.'),
        lenses:{
          construction:T('The formwork team plans layout, drawings, erection, bracing, placement sequence, inspection and removal. Economy comes from repetition and coordination, but safety and required concrete quality remain constraints.','يخطط فريق الشدات للتوزيع والرسومات والتركيب والتدعيم وتسلسل الصب والفحص والإزالة. وتأتي الوفورات من التكرار والتنسيق، مع بقاء السلامة وجودة الخرسانة المطلوبة كقيود.'),
          schedule:T('Formwork drawings should state placement sequence and minimum elapsed time between adjacent placements. Shoring analysis considers floor cycle, concrete strength at loading and the distribution of load during placing, stripping and reshoring.','ينبغي أن تبين رسومات الشدات تسلسل الصب والحد الأدنى للزمن بين الصبات المتجاورة. ويراعي تحليل التدعيم دورة الطابق ومقاومة الخرسانة عند التحميل وتوزيع الأحمال أثناء الصب والفك وإعادة التدعيم.'),
          risk:T('Principal risks include inadequate formwork/shoring design, unexpected vertical or lateral loads, weak foundations, settlement, missing bracing, unsafe accessories and removing support before the structure can carry the construction loads.','تشمل المخاطر الرئيسية قصور تصميم الشدات أو التدعيم والأحمال الرأسية أو الأفقية غير المتوقعة وضعف الأساسات والهبوط ونقص التدعيم والملحقات غير الآمنة وإزالة الدعم قبل قدرة المنشأ على حمل أحمال التنفيذ.'),
          contract:T('The guide assigns information duties between the engineer/architect and formwork engineer/contractor. Project specifications should state removal strength and reshoring requirements; formwork plans remain subject to the actual contractual allocation.','يوزع الدليل واجبات المعلومات بين المهندس/المعماري ومهندس/مقاول الشدات. وينبغي أن تحدد مواصفات المشروع مقاومة الإزالة ومتطلبات إعادة التدعيم؛ وتظل خطط الشدات خاضعة للتوزيع التعاقدي الفعلي.'),
          terms:T('“Form” is the mold in contact with concrete. “Formwork” is the entire mold-and-support system. “Falsework” is the temporary supporting structure. “Reshore” and “backshore” describe different unloading and support sequences.','«القالب» هو السطح الملامس للخرسانة. و«الشدة» هي منظومة القالب والدعم كاملة. و«المنشأ المؤقت» هو هيكل الدعم المؤقت. وتصف إعادة التدعيم والتدعيم الخلفي تسلسلين مختلفين للتفريغ والدعم.')
        },
        sections:[
          T('Introduction, scope, notation and definitions.','المقدمة والنطاق والرموز والتعريفات.'),
          T('General considerations: economy and required contract-document information.','اعتبارات عامة: الاقتصاد والمعلومات المطلوبة في مستندات العقد.'),
          T('Design: planning, objectives, deficiencies, drawings and calculations.','التصميم: التخطيط والأهداف وأوجه القصور والرسومات والحسابات.'),
          T('Loads and capacities: vertical, lateral, special and post-tensioning loads; members and accessories.','الأحمال والقدرات: الرأسية والأفقية والخاصة وأحمال الشد اللاحق والعناصر والملحقات.'),
          T('Shores, bracing, foundations and settlement; later complete-guide chapters are listed but not supplied.','الدعائم والتدعيم والأساسات والهبوط؛ الفصول اللاحقة مدرجة في الفهرس لكنها غير مرفقة.')
        ],
        claimUse:[
          T('Show that elapsed time, concrete strength and construction sequence belong in formwork planning.','إظهار أن الزمن المنقضي ومقاومة الخرسانة وتسلسل التنفيذ عناصر في تخطيط الشدات.'),
          T('Support the need for a rational shore/reshore load analysis before deleting vertical-cycle constraints.','دعم الحاجة إلى تحليل منطقي لأحمال التدعيم وإعادة التدعيم قبل حذف قيود الدورة الرأسية.'),
          T('Separate the scheduling question from the engineering approval question.','فصل مسألة الجدولة عن مسألة الاعتماد الهندسي.')
        ],
        locators:[
          L('Scope and terminology','Roles, formwork system and guide coverage.','PDF pp. 2–4; printed pp. 1–3','النطاق والمصطلحات','الأدوار ونظام الشدات وتغطية الدليل.','صفحات PDF 2–4؛ الصفحات المطبوعة 1–3'),
          L('Contract documents','Removal strength, reshoring requirements and responsibility.','PDF pp. 5–6; printed pp. 4–5','مستندات العقد','مقاومة الإزالة ومتطلبات إعادة التدعيم والمسؤولية.','صفحات PDF 5–6؛ الصفحات المطبوعة 4–5'),
          L('Drawings and calculations','Placement sequence and minimum elapsed time.','PDF pp. 6–7; printed pp. 5–6','الرسومات والحسابات','تسلسل الصب والحد الأدنى للزمن المنقضي.','صفحات PDF 6–7؛ الصفحات المطبوعة 5–6'),
          L('Loads','Concrete pressure, construction, lateral, special and post-tensioning loads.','PDF pp. 7–10; printed pp. 6–9','الأحمال','ضغط الخرسانة وأحمال التنفيذ والأفقية والخاصة والشد اللاحق.','صفحات PDF 7–10؛ الصفحات المطبوعة 6–9'),
          L('Shores','Inputs for number of supported floors and load transfer.','PDF p. 11; printed p. 10','الدعائم','مدخلات تحديد عدد الطوابق المدعومة وانتقال الأحمال.','صفحة PDF 11؛ الصفحة المطبوعة 10')
        ],
        guard:T('HOLD: the guide does not authorise a generic minimum stripping period for this project. Use the approved design, strength tests, specifications, method statement and engineer-of-record review.','تعليق: لا يجيز الدليل مدة عامة لفك الشدات في هذا المشروع. استخدم التصميم المعتمد واختبارات المقاومة والمواصفات وبيان الطريقة ومراجعة مهندس التصميم.'),
        status:T('Supplied excerpt reviewed: 11 of 11 PDF pages, covering printed pages 1–10 and ending at the start of Chapter 5.','تمت مراجعة المقتطف المرفق: 11 من 11 صفحة PDF، تغطي الصفحات المطبوعة 1–10 وتنتهي عند بداية الفصل 5.')
      },
      {
        id:'ecp203',order:6,
        short:T('ECP 203/2018','الكود المصري 203/2018'),
        title:T('Egyptian Code for Design and Construction of Reinforced Concrete Structures','الكود المصري لتصميم وتنفيذ المنشآت الخرسانية المسلحة'),
        issuer:T('Housing & Building National Research Center · Fourth update, 2018','المركز القومي لبحوث الإسكان والبناء · التحديث الرابع 2018'),
        classId:'code',classLabel:T('Local code','كود محلي'),
        domains:['concrete','safety','contract'],domainLabel:T('Egyptian concrete code','كود الخرسانة المصري'),
        pages:T('225 PDF pages · complete Arabic image scan','225 صفحة PDF · مسح صوري عربي كامل'),
        authority:T('Potentially governing local technical code for an Egyptian project, subject to the Contract, approved edition and applicable law. Code interpretation and compliance need the responsible licensed engineer.','قد يكون الكود الفني المحلي الحاكم لمشروع في مصر، وفقًا للعقد والإصدار المعتمد والقانون الواجب التطبيق. ويتطلب تفسير الكود وإثبات الالتزام مراجعة المهندس المرخص المسؤول.'),
        plain:T('ECP 203/2018 is the Egyptian rulebook for reinforced-concrete design and execution. It addresses materials, durability, analysis and limit states, member design, reinforcement detailing, serviceability, foundations and construction controls. In the visually checked formwork section, Clauses 9-5-4 and 9-5-5 make removal depend on the member, span, concrete strength, loading and special precautions. That is incompatible with treating every restraint as zero without an engineering basis.','الكود المصري 203/2018 هو المرجع المصري لتصميم وتنفيذ المنشآت الخرسانية المسلحة. ويغطي المواد والمتانة والتحليل وحالات الحدود وتصميم العناصر وتفاصيل التسليح وقابلية الخدمة والأساسات وضوابط التنفيذ. وفي قسم الشدات الذي تمت مراجعته بصريًا، يربط البندان 9-5-4 و9-5-5 الفك بنوع العنصر والبحر ومقاومة الخرسانة والأحمال والاحتياطات الخاصة. وهذا لا يتفق مع معاملة كل قيد على أنه صفري دون أساس هندسي.'),
        lenses:{
          construction:T('Use the code together with approved drawings, specifications, method statements, test results and inspection records. The checked provisions distinguish side forms, load-bearing forms and special cases where supports also carry a floor above. Early removal depends on demonstrated strength and responsible approval.','استخدم الكود مع الرسومات والمواصفات وبيانات الطريقة ونتائج الاختبارات وسجلات الفحص المعتمدة. تفرق الأحكام التي تمت مراجعتها بين القوالب الجانبية والشدات الحاملة والحالات الخاصة التي تحمل فيها الدعائم طابقًا أعلى. ويعتمد الفك المبكر على مقاومة مثبتة واعتماد مسؤول.'),
          schedule:T('Translate Clauses 9-5-4 and 9-5-5 into explicit hold points for strength acceptance, formwork/shore removal and the next load event. The checked pages use time-and-span rules, strength evidence and special support precautions; a zero-day relationship needs a project-specific engineering justification.','حوّل البندين 9-5-4 و9-5-5 إلى نقاط توقف صريحة لقبول المقاومة وفك الشدات أو الدعائم وحدث التحميل التالي. تستخدم الصفحات التي تمت مراجعتها قواعد الزمن والبحر ودليل المقاومة واحتياطات دعم خاصة؛ ولذلك يحتاج القيد الصفري إلى مبرر هندسي خاص بالمشروع.'),
          risk:T('The main risk is using OCR text as if it were an authenticated clause. Arabic numerals, equation signs, tables and page references can be misread. Verify any decisive provision directly against the page image and approved printed edition.','الخطر الرئيسي هو استخدام نص التعرف الضوئي كأنه بند موثق. قد تُقرأ الأرقام العربية وعلامات المعادلات والجداول وأرقام الصفحات خطأ. تحقق من أي حكم حاسم مباشرة من صورة الصفحة والإصدار المطبوع المعتمد.'),
          contract:T('Confirm that ECP 203/2018 is the specified edition and determine how the Contract ranks codes, specifications, drawings and instructions. Technical applicability does not by itself establish time entitlement.','تأكد من أن ECP 203/2018 هو الإصدار المحدد وحدد ترتيب الكود والمواصفات والرسومات والتعليمات في العقد. الانطباق الفني لا يثبت بذاته الاستحقاق الزمني.'),
          terms:T('“Limit state” is a condition beyond which the structure no longer satisfies a design requirement. “Serviceability” concerns usable performance such as deflection and cracking. “Execution” covers how the designed concrete work is produced and controlled on site.','«حالة الحد» وضع لا يعود بعده المنشأ مستوفيًا لمتطلبات التصميم. و«قابلية الخدمة» تتعلق بالأداء القابل للاستخدام مثل الترخيم والتشقق. و«التنفيذ» يشمل كيفية إنتاج العمل الخرساني المصمم وضبطه بالموقع.')
        },
        sections:[
          T('Front matter and contents for the 2018 fourth update.','المقدمة والفهرس للتحديث الرابع لسنة 2018.'),
          T('Materials and concrete properties, including durability-related requirements.','المواد وخواص الخرسانة، بما يشمل متطلبات مرتبطة بالمتانة.'),
          T('Structural analysis, limit states and reinforced-concrete member design.','التحليل الإنشائي وحالات الحدود وتصميم عناصر الخرسانة المسلحة.'),
          T('Reinforcement, serviceability, detailing, foundations and special structural topics.','التسليح وقابلية الخدمة والتفاصيل والأساسات والموضوعات الإنشائية الخاصة.'),
          T('Execution and quality-control provisions to be matched to project procedures.','أحكام التنفيذ وضبط الجودة التي يجب مطابقتها بإجراءات المشروع.')
        ],
        claimUse:[
          T('Use Clauses 9-5-4 and 9-5-5 as the verified local-code starting point for formwork-removal and extra-loading restraints.','استخدام البندين 9-5-4 و9-5-5 كنقطة بداية متحققة من الكود المحلي لقيود فك الشدات والأحمال الإضافية.'),
          T('Connect the applicable rule to approved method statements, concrete cube tests, inspection releases and the actual formwork system.','ربط القاعدة الواجبة ببيانات الطريقة المعتمدة واختبارات مكعبات الخرسانة وتصاريح الفحص ونظام الشدات الفعلي.'),
          T('Preserve the non-zero restraint unless a project-specific engineering check supports a different duration.','الإبقاء على القيد غير الصفري ما لم يدعم فحص هندسي خاص بالمشروع مدة مختلفة.')
        ],
        locators:[
          L('Edition identity','Official cover and fourth-update date.','PDF pp. 1–3','هوية الإصدار','الغلاف الرسمي وتاريخ التحديث الرابع.','صفحات PDF 1–3'),
          L('Contents','Arabic contents map for chapters and clause numbers.','PDF pp. 7–15; OCR navigation only','الفهرس','خريطة عربية للفصول وأرقام البنود.','صفحات PDF 7–15؛ للتنقل بالتعرف الضوئي فقط'),
          L('Execution chapter','Concrete production, placing, curing, formwork and quality controls.','Chapter 9; PDF pp. 181–202','باب التنفيذ','إنتاج الخرسانة وصبها ومعالجتها والشدات وضبط الجودة.','الباب 9؛ صفحات PDF 181–202'),
          L('Formwork planning','Types, design, loads, assembly and erection.','Clauses 9-5-1 to 9-5-3; PDF pp. 184–185','تخطيط الشدات','الأنواع والتصميم والأحمال والإعداد والتركيب.','البنود 9-5-1 إلى 9-5-3؛ صفحات PDF 184–185'),
          L('Removal and special precautions','Time/span, strength, additional-load and approval conditions.','Clauses 9-5-4 and 9-5-5; PDF p. 186, printed pp. 9-10 to 9-11','الفك والاحتياطات الخاصة','شروط الزمن والبحر والمقاومة والأحمال الإضافية والاعتماد.','البندان 9-5-4 و9-5-5؛ صفحة PDF 186، الصفحات المطبوعة 9-10 إلى 9-11')
        ],
        guard:T('Clauses 9-5-4 and 9-5-5 were checked directly on the page image. OCR is used for navigation across the rest of the 225-page scan; any other decisive clause number, equation or table value remains HOLD until its page image is checked.','تمت مراجعة البندين 9-5-4 و9-5-5 مباشرة على صورة الصفحة. ويستخدم التعرف الضوئي للتنقل في بقية المسح المكون من 225 صفحة؛ ويظل أي رقم بند أو معادلة أو قيمة جدول أخرى حاسمة في حالة تعليق حتى مراجعة صورتها.'),
        status:T('Complete Arabic/English OCR index: 225 of 225 PDF pages. The Claim No. 1 formwork spread at PDF p. 186 was also visually verified.','فهرس تعرف ضوئي عربي/إنجليزي كامل: 225 من 225 صفحة PDF. وتمت كذلك مراجعة صفحة الشدات ذات الصلة بالمطالبة رقم 1 بصريًا في صفحة PDF 186.')
      },
      {
        id:'fidic1999',order:7,
        short:T('FIDIC Red Book 1999','فيديك الكتاب الأحمر 1999'),
        title:T('Conditions of Contract for Construction','شروط عقد التشييد'),
        issuer:T('FIDIC · First Edition 1999','فيديك · الطبعة الأولى 1999'),
        classId:'contract',classLabel:T('Contract form','نموذج عقد'),
        domains:['contract','delay','schedule'],domainLabel:T('Contract administration','إدارة العقود'),
        pages:T('128 PDF pages · General Conditions, guidance and forms','128 صفحة PDF · الشروط العامة والإرشاد والنماذج'),
        authority:T('Contractual only to the extent incorporated into the executed Contract. The General Conditions and Particular Conditions operate together; the signed agreement, Appendix to Tender and document-priority clause can change the result.','تكون له قوة تعاقدية بقدر إدماجه في العقد المنفذ. تعمل الشروط العامة والخاصة معًا؛ وقد تغير الاتفاقية الموقعة وملحق العطاء وبند أولوية المستندات النتيجة.'),
        plain:T('The 1999 Red Book is a standard contract for works designed mainly by the Employer. It allocates duties among Employer, Engineer and Contractor; governs programme, time, payment, variations, testing, taking over, claims and disputes; and provides a process for notice, records, detailed claims and determination. It does not prove what happened on this project: the records do that.','الكتاب الأحمر 1999 نموذج عقد لأعمال يصممها صاحب العمل أساسًا. يوزع الواجبات بين صاحب العمل والمهندس والمقاول، وينظم البرنامج والوقت والدفع والتغييرات والاختبارات والتسلم والمطالبات والنزاعات، ويضع مسارًا للإخطار والسجلات والمطالبة التفصيلية والقرار. لكنه لا يثبت ما حدث في هذا المشروع؛ السجلات هي التي تثبته.'),
        lenses:{
          construction:T('The Contractor executes and programmes the work; the Employer provides access and specified inputs; the Engineer administers instructions, approvals and determinations within the Contract. Site records connect those duties to actual events.','ينفذ المقاول الأعمال ويعد البرنامج؛ ويوفر صاحب العمل الوصول والمدخلات المحددة؛ ويدير المهندس التعليمات والاعتمادات والقرارات داخل العقد. وتربط سجلات الموقع هذه الواجبات بالأحداث الفعلية.'),
          schedule:T('Clause 8 links programme, progress, completion and EOT. A schedule demonstrates timing and critical effect; it does not replace the separate requirements for contractual cause, notice, records and a properly particularised claim.','يربط البند 8 البرنامج والتقدم والإكمال وتمديد الوقت. يوضح البرنامج التوقيت والأثر الحرج، لكنه لا يحل محل المتطلبات المنفصلة للسبب التعاقدي والإخطار والسجلات والمطالبة المفصلة.'),
          risk:T('High-risk failure points are missing the notice window, weak contemporaneous records, inconsistent dates, ignoring Particular Conditions, treating an interim assessment as final, and mixing time entitlement with cost entitlement.','نقاط الفشل عالية المخاطر هي تفويت مهلة الإخطار وضعف السجلات المعاصرة وتعارض التواريخ وتجاهل الشروط الخاصة واعتبار التقييم المؤقت نهائيًا وخلط الاستحقاق الزمني بالمالي.'),
          contract:T('For Claim No. 1, read Sub-Clauses 1.5, 1.9, 3.5, 4.20, 8.3, 8.4, 14.2 and 20.1 with the Particular Conditions and Appendix to Tender. Build a chain: obligation, event, notice, contemporaneous record, critical effect, mitigation, particulars and fair determination.','بالنسبة للمطالبة رقم 1، اقرأ البنود الفرعية 1.5 و1.9 و3.5 و4.20 و8.3 و8.4 و14.2 و20.1 مع الشروط الخاصة وملحق العطاء. ابنِ سلسلة: الالتزام والحدث والإخطار والسجل المعاصر والأثر الحرج والتخفيف والتفاصيل والقرار العادل.'),
          terms:T('“Entitlement” is the contractual right in principle. “Quantum” is the amount of time or money proved. “Particular Conditions” amend the standard General Conditions. A “determination” is the Engineer’s reasoned contractual decision, not the raw schedule calculation.','«الاستحقاق» هو الحق التعاقدي من حيث المبدأ. و«المقدار» هو الوقت أو المال المثبت. وتعدل «الشروط الخاصة» الشروط العامة النموذجية. و«القرار» هو القرار التعاقدي المسبب للمهندس، وليس حساب البرنامج الخام.')
        },
        sections:[
          T('Clauses 1–7: general provisions, Employer, Engineer, Contractor, subcontractors, labour and materials.','البنود 1–7: الأحكام العامة وصاحب العمل والمهندس والمقاول ومقاولو الباطن والعمالة والمواد.'),
          T('Clauses 8–11: commencement, programme, delay, suspension, testing, taking over and defects.','البنود 8–11: البدء والبرنامج والتأخير والتعليق والاختبارات والتسلم والعيوب.'),
          T('Clauses 12–14: measurement, variations, Contract Price and payment.','البنود 12–14: القياس والتغييرات وقيمة العقد والدفع.'),
          T('Clauses 15–19: termination, suspension, risk, insurance and force majeure.','البنود 15–19: الإنهاء والتعليق والمخاطر والتأمين والقوة القاهرة.'),
          T('Clause 20, Particular Conditions guidance and tender/agreement/DAB forms.','البند 20 وإرشاد الشروط الخاصة ونماذج العطاء والاتفاقية ومجلس فض النزاع.')
        ],
        claimUse:[
          T('Test the notice and continuing-claim path for each steel batch separately.','اختبار مسار الإخطار والمطالبة المستمرة لكل دفعة حديد على حدة.'),
          T('Link delayed drawings/IFC information to the EOT clause and verified critical effect.','ربط الرسومات أو معلومات IFC المتأخرة ببند تمديد الوقت والأثر الحرج المتحقق منه.'),
          T('Reserve rights while separating accepted principle from disputed quantum.','حفظ الحقوق مع فصل المبدأ المقبول عن المقدار المتنازع عليه.')
        ],
        locators:[
          L('Contract architecture','Foreword, General/Particular Conditions and document hierarchy.','PDF pp. 5–16','بنية العقد','المقدمة والشروط العامة والخاصة وترتيب المستندات.','صفحات PDF 5–16'),
          L('Delayed information and determination','Sub-Clauses 1.9 and 3.5.','Printed pp. 7 and 11; PDF pp. 22 and 26','المعلومات المتأخرة والقرار','البندان الفرعيان 1.9 و3.5.','الصفحتان المطبوعتان 7 و11؛ صفحات PDF 22 و26'),
          L('Employer inputs','Sub-Clause 4.20 and related project amendments.','Printed pp. 18–19; PDF pp. 33–34','مدخلات صاحب العمل','البند الفرعي 4.20 وتعديلات المشروع المرتبطة.','الصفحات المطبوعة 18–19؛ صفحات PDF 33–34'),
          L('Programme and time','Sub-Clauses 8.3, 8.4 and 8.6.','Printed pp. 27–28; PDF pp. 42–43','البرنامج والوقت','البنود الفرعية 8.3 و8.4 و8.6.','الصفحات المطبوعة 27–28؛ صفحات PDF 42–43'),
          L('Claims procedure','Sub-Clause 20.1: notice, records, interim/final particulars and determination.','Printed pp. 58–59; PDF pp. 73–74','إجراءات المطالبات','البند الفرعي 20.1: الإخطار والسجلات والتفاصيل المرحلية والنهائية والقرار.','الصفحات المطبوعة 58–59؛ صفحات PDF 73–74')
        ],
        guard:T('Do not rely on the unamended FIDIC wording where the executed Particular Conditions differ. Contract interpretation and legal entitlement require the signed documents and, where needed, qualified legal review.','لا تعتمد على نص فيديك غير المعدل عندما تختلف الشروط الخاصة المنفذة. يتطلب تفسير العقد والاستحقاق القانوني المستندات الموقعة، وعند الحاجة، مراجعة قانونية مؤهلة.'),
        status:T('Complete native text extraction: 128 of 128 PDF pages. Personal licence markings in the supplied copy are intentionally excluded from the interface.','استخراج نص أصلي كامل: 128 من 128 صفحة PDF. تم استبعاد علامات الترخيص الشخصية الموجودة في النسخة المرفقة عمدًا من الواجهة.')
      },
      {
        id:'osha703',order:8,
        short:T('OSHA 1926.703','OSHA 1926.703'),
        title:T('Requirements for Cast-in-Place Concrete','متطلبات الخرسانة المصبوبة في الموقع'),
        issuer:T('U.S. Occupational Safety and Health Administration','إدارة السلامة والصحة المهنية الأمريكية'),
        classId:'regulation',classLabel:T('Regulation','لائحة'),
        domains:['safety','concrete'],domainLabel:T('Construction safety','سلامة التشييد'),
        pages:T('Complete supplied text extract · section 1926.703','مستخرج نصي مرفق كامل · القسم 1926.703'),
        authority:T('Mandatory U.S. workplace-safety regulation within its jurisdiction. On an Egyptian project it is a safety benchmark unless the Contract, employer rules or applicable law incorporates it.','لائحة سلامة عمل إلزامية داخل نطاق الاختصاص الأمريكي. وفي مشروع بمصر تعد معيارًا استرشاديًا للسلامة ما لم يدمجها العقد أو قواعد صاحب العمل أو القانون الواجب التطبيق.'),
        plain:T('OSHA 1926.703 sets minimum safety rules for cast-in-place concrete. Formwork must carry expected loads, drawings and revisions must be available, shores must be inspected and braced, reinforcing steel must be stable, and forms or reshores must stay until concrete strength is established by the specified conditions or appropriate testing.','يضع OSHA 1926.703 قواعد سلامة دنيا للخرسانة المصبوبة في الموقع. يجب أن تتحمل الشدات الأحمال المتوقعة، وأن تتوافر الرسومات وتعديلاتها، وأن تفحص الدعائم وتدعم، وأن يكون حديد التسليح مستقرًا، وأن تبقى القوالب أو إعادة التدعيم حتى تثبت مقاومة الخرسانة بالشروط المحددة أو الاختبار المناسب.'),
        lenses:{
          construction:T('Keep current formwork drawings at the jobsite, inspect shoring before and around placement, reject weakened equipment, brace tiered shores and sequence reshoring when slabs must carry construction loads.','احتفظ برسومات الشدات الحالية في الموقع، وافحص التدعيم قبل الصب وأثناءه وبعده، وارفض المعدات الضعيفة، وثبت الدعائم المتراكبة، ورتب إعادة التدعيم عندما تتحمل البلاطات أحمال التنفيذ.'),
          schedule:T('The removal gate is evidence-based: follow the plans/specifications or appropriate strength testing. A programme can model that gate as logic or a hold point; it should not assume immediate release without the required evidence.','بوابة الفك قائمة على الدليل: اتبع الرسومات والمواصفات أو اختبار المقاومة المناسب. يمكن للبرنامج تمثيل هذه البوابة كعلاقة أو نقطة توقف، ولا ينبغي افتراض الفك الفوري دون الدليل المطلوب.'),
          risk:T('The controlled hazards are formwork failure, unstable shoring, damaged components, eccentric loads, unsafe tiered shores, reinforcing-steel collapse and premature removal.','المخاطر الخاضعة للضبط هي فشل الشدات وعدم استقرار التدعيم والمكونات التالفة والأحمال اللامركزية والدعائم المتراكبة غير الآمنة وانهيار حديد التسليح والإزالة المبكرة.'),
          contract:T('OSHA supports the engineering reason for a non-zero restraint, but it is not automatically a contract entitlement clause and may not be the applicable statutory regime in Egypt.','يدعم OSHA السبب الهندسي لقيد غير صفري، لكنه ليس تلقائيًا بند استحقاق تعاقدي وقد لا يكون النظام القانوني الواجب التطبيق في مصر.'),
          terms:T('“Employer” in OSHA means the employing entity responsible for workplace compliance; it is not automatically the same defined party as “Employer” in FIDIC. Keep the two meanings separate.','تعني كلمة «صاحب العمل» في OSHA الجهة المشغلة المسؤولة عن الالتزام في مكان العمل؛ وليست تلقائيًا الطرف المعرف نفسه باسم «صاحب العمل» في فيديك. يجب الفصل بين المعنيين.')
        },
        sections:[
          T('1926.703(a): formwork capacity and drawings at the jobsite.','1926.703(a): قدرة الشدات وتوافر الرسومات في الموقع.'),
          T('1926.703(b): shoring/reshoring inspection, condition, alignment, bracing and load control.','1926.703(b): فحص التدعيم وإعادة التدعيم والحالة والمحاذاة والتثبيت وضبط الأحمال.'),
          T('1926.703(c): vertical slipform rods, supports, platforms, jacks and lift rate.','1926.703(c): قضبان الشدات المنزلقة الرأسية والدعامات والمنصات والرافعات ومعدل الرفع.'),
          T('1926.703(d): stability of reinforcing steel and wire mesh.','1926.703(d): ثبات حديد التسليح والشبك السلكي.'),
          T('1926.703(e): strength-based removal of forms, shores and reshores.','1926.703(e): فك القوالب والدعائم وإعادة التدعيم وفق المقاومة.')
        ],
        claimUse:[
          T('Show why same-day striking is not a neutral schedule simplification.','إظهار أن فك الشدة في اليوم نفسه ليس تبسيطًا محايدًا للبرنامج.'),
          T('Frame the required evidence: specification condition or appropriate strength test.','تحديد الدليل المطلوب: شرط بالمواصفة أو اختبار مقاومة مناسب.'),
          T('Use only as an applicable rule or disclosed benchmark, not as Egyptian law.','استخدامه فقط كقاعدة واجبة التطبيق أو معيار استرشادي معلن، لا كقانون مصري.')
        ],
        locators:[
          L('General formwork','Capacity for expected vertical and lateral loads.','1926.703(a)','متطلبات عامة للشدات','قدرة تحمل الأحمال الرأسية والأفقية المتوقعة.','1926.703(a)'),
          L('Shoring and reshoring','Inspection, damage, foundations, alignment and bracing.','1926.703(b)(1)–(10)','التدعيم وإعادة التدعيم','الفحص والتلف والأساسات والمحاذاة والتثبيت.','1926.703(b)(1)–(10)'),
          L('Slipforms','Supports, platforms, devices and safe lift rate.','1926.703(c)(1)–(7)','الشدات المنزلقة','الدعامات والمنصات والأجهزة ومعدل الرفع الآمن.','1926.703(c)(1)–(7)'),
          L('Reinforcing steel','Support against overturning/collapse and mesh recoil.','1926.703(d)(1)–(2)','حديد التسليح','الدعم ضد الانقلاب والانهيار وارتداد الشبك.','1926.703(d)(1)–(2)'),
          L('Removal','Specification or testing basis for form and reshore removal.','1926.703(e)(1)–(2)','الإزالة','أساس المواصفة أو الاختبار لفك القوالب وإعادة التدعيم.','1926.703(e)(1)–(2)')
        ],
        guard:T('Do not present OSHA as the governing Egyptian regulation without an incorporation or applicability check. The value here is the clear safety principle and evidence gate for removal.','لا تعرض OSHA باعتباره اللائحة المصرية الحاكمة دون فحص الإدماج أو الانطباق. القيمة هنا هي مبدأ السلامة الواضح وبوابة الدليل المطلوبة للفك.'),
        status:T('Complete supplied text reviewed: all paragraphs of 1926.703(a) through (e).','تمت مراجعة النص المرفق كاملًا: جميع فقرات 1926.703(a) إلى (e).')
      }
    ],
    compare:[
      {source:T('FIDIC 1999','فيديك 1999'),question:T('Who owes what, what must be notified, and how EOT is determined?','من يلتزم بماذا، وما الذي يجب الإخطار به، وكيف يحدد تمديد الوقت؟'),weight:T('Primary if incorporated and as amended','أساسي إذا أدمج وبحسب تعديلاته'),classId:'contract'},
      {source:T('AACE 29R-03','AACE 29R-03'),question:T('Is the delay analysis method transparent, repeatable and fitted to the records?','هل منهج تحليل التأخير شفاف وقابل للتكرار ومناسب للسجلات؟'),weight:T('Method guidance','إرشاد منهجي'),classId:'guidance'},
      {source:T('AACE 48R-06','AACE 48R-06'),question:T('Does the schedule describe an accurate, logical and buildable sequence?','هل يصف البرنامج تسلسلًا دقيقًا ومنطقيًا وقابلًا للتنفيذ؟'),weight:T('Constructability guidance','إرشاد قابلية التنفيذ'),classId:'guidance'},
      {source:T('AACE 38R-06','AACE 38R-06'),question:T('Where did durations, calendars, logic, assumptions and changes come from?','ما مصادر المدد والتقاويم والعلاقات والافتراضات والتغييرات؟'),weight:T('Governance guidance','إرشاد حوكمة'),classId:'guidance'},
      {source:T('ACI 347R-14','ACI 347R-14'),question:T('What must formwork design and planning consider?','ما الذي يجب أن يراعيه تصميم وتخطيط الشدات؟'),weight:T('Engineering guide; excerpt supplied','دليل هندسي؛ مقتطف مرفق'),classId:'engineering'},
      {source:T('ACI 347.2R-17','ACI 347.2R-17'),question:T('How do construction loads and young-slab strength govern reshoring cycles?','كيف تحكم أحمال التنفيذ ومقاومة البلاطات الحديثة دورات إعادة التدعيم؟'),weight:T('Engineering guide; excerpt supplied','دليل هندسي؛ مقتطف مرفق'),classId:'engineering'},
      {source:T('ECP 203/2018','الكود المصري 203/2018'),question:T('What local reinforced-concrete rules govern the approved design and execution?','ما قواعد الخرسانة المسلحة المحلية الحاكمة للتصميم والتنفيذ المعتمدين؟'),weight:T('Potential local code; applicability to confirm','كود محلي محتمل؛ يلزم تأكيد الانطباق'),classId:'code'},
      {source:T('OSHA 1926.703','OSHA 1926.703'),question:T('What safety evidence is required before formwork or reshores are removed?','ما دليل السلامة المطلوب قبل فك الشدات أو إعادة التدعيم؟'),weight:T('U.S. regulation; benchmark unless applicable','لائحة أمريكية؛ معيار استرشادي ما لم تنطبق'),classId:'regulation'}
    ],
    faqs:[
      {q:T('Which source decides entitlement?','أي مصدر يقرر الاستحقاق؟'),a:T('The executed Contract, including Particular Conditions and the Appendix to Tender, controls entitlement. AACE and ACI sources explain method and engineering context.','يحكم العقد المنفذ، بما في ذلك الشروط الخاصة وملحق العطاء، الاستحقاق. وتشرح مراجع AACE وACI المنهج والسياق الهندسي.')},
      {q:T('Which source proves the number of delay days?','أي مصدر يثبت عدد أيام التأخير؟'),a:T('No book proves the number. The day result comes from verified project facts and a controlled native CPM calculation using a disclosed method.','لا يثبت أي كتاب العدد. تأتي نتيجة الأيام من وقائع المشروع المتحقق منها وحساب CPM أصلي مضبوط بمنهج معلن.')},
      {q:T('Can ACI or OSHA set the project formwork lag?','هل يمكن لـ ACI أو OSHA تحديد مدة الشدات بالمشروع؟'),a:T('They explain the strength and load conditions. The project-specific duration needs approved documents, strength evidence, the forming system and responsible engineering review.','يشرحان شروط المقاومة والأحمال. أما المدة الخاصة بالمشروع فتحتاج إلى مستندات معتمدة ودليل مقاومة ونظام الشدات ومراجعة هندسية مسؤولة.')},
      {q:T('Why is ECP 203 marked HOLD?','لماذا وُسم الكود المصري بحالة تعليق؟'),a:T('The supplied PDF is an image scan. OCR helps navigation but can misread Arabic numerals, equations and tables, so decisive text must be checked on the page image.','ملف PDF المرفق مسح صوري. يساعد التعرف الضوئي في التنقل لكنه قد يخطئ في الأرقام العربية والمعادلات والجداول، لذلك يجب التحقق من النص الحاسم في صورة الصفحة.')}
    ]
  };
})();
