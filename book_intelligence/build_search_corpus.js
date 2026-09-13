const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'text');
const output = path.join(__dirname, '..', 'Response-on-53', 'book-search-corpus.js');

const sources = [
  { id: 'aace29', file: 'aace_international_recommended_practice_delay_analysis.pages.json', mode: 'native' },
  { id: 'aace48', file: 'aace_48r_06_schedule_constructability_review_compress.pages.json', mode: 'native' },
  { id: 'aace38', file: 'acce_schedule_basis_38r_06.pages.json', mode: 'native' },
  { id: 'aci3472', file: 'american_concrete_institute___aci_347_2r_17_official.pages.json', mode: 'native' },
  { id: 'aci347', file: 'american_concrete_institute___aci_347r_14_official.pages.json', mode: 'native' },
  { id: 'ecp203', file: 'egypt_housing___building_research_center___hbrc_ecp203_official.ocr.json', mode: 'ocr' },
  { id: 'fidic1999', file: 'fidic___conditions_of_contract_for_construction_for_building_and_engineering_works_designed_by_the_employer__1999.pages.json', mode: 'native' },
  { id: 'osha703', file: 'osha_1926_703_cast_in_place_concrete.txt', mode: 'text' }
];

const topics = {
  concrete: ['concrete', 'cement', 'reinforced concrete', 'cast-in-place', 'خرسانة', 'الخرسانة', 'اسمنت', 'أسمنت', 'مسلحة'],
  formwork: ['formwork', 'forms', 'falsework', 'stripping', 'striking', 'shutter', 'شدات', 'الشدة', 'الشدات', 'فرم', 'القوالب', 'فك الشدات'],
  curing: ['curing', 'strength gain', 'compressive strength', 'maturity', 'concrete age', 'معالجة', 'المعالجة', 'مقاومة الخرسانة', 'العمر', 'المقاومة'],
  shoring: ['shoring', 'reshoring', 'shore', 'reshores', 'backshoring', 'دعامات', 'الدعامات', 'إعادة التدعيم', 'اعادة التدعيم'],
  schedule: ['schedule', 'programme', 'program', 'planning', 'time management', 'برنامج زمني', 'البرنامج', 'الجدول الزمني', 'تخطيط'],
  delay: ['delay analysis', 'forensic schedule', 'delay event', 'time impact', 'windows analysis', 'تأخير', 'تحليل التأخير', 'حدث التأخير', 'الأثر الزمني'],
  critical: ['critical path', 'criticality', 'total float', 'free float', 'longest path', 'المسار الحرج', 'حرج', 'السماح الكلي', 'الفائض الزمني'],
  logic: ['logic', 'relationship', 'predecessor', 'successor', 'lag', 'lead', 'restraint', 'علاقة', 'العلاقات', 'سابق', 'لاحق', 'فترة تأخير', 'قيد'],
  baseline: ['baseline', 'update schedule', 'data date', 'status date', 'as-built', 'progress update', 'خط الأساس', 'تحديث البرنامج', 'تاريخ الحالة', 'التنفيذ الفعلي'],
  basis: ['schedule basis', 'basis document', 'assumption', 'calendar', 'resource', 'schedule risk', 'أساس البرنامج', 'الافتراضات', 'التقويم', 'الموارد'],
  claims: ['claim', 'notice', 'entitlement', 'extension of time', 'determination', 'time bar', 'مطالبة', 'إخطار', 'استحقاق', 'تمديد مدة', 'قرار المهندس', 'سقوط زمني'],
  drawings: ['drawing', 'ifc', 'approval', 'shop drawing', 'design information', 'رسومات', 'تنفيذي', 'اعتماد', 'معلومات التصميم'],
  safety: ['safety', 'hazard', 'osha', 'fall protection', 'inspection', 'سلامة', 'خطر', 'تفتيش', 'وقاية'],
  constructability: ['constructability', 'buildability', 'achievable', 'site access', 'work sequence', 'قابلية التنفيذ', 'قابل للبناء', 'تسلسل العمل', 'الوصول للموقع'],
  procurement: ['procurement', 'delivery', 'long lead', 'material', 'equipment', 'steel supply', 'توريد', 'تسليم', 'مواد', 'معدات', 'حديد التسليح']
};

// Curated engineering concepts are ranked only after their wording is found in
// the supplied corpus. This keeps autocomplete useful while making its counts
// and source coverage evidence-based rather than generic web suggestions.
const predictionSeeds = [
  ['concrete', 'Concrete', 'الخرسانة', 'concrete', ['cast in place concrete']],
  ['reinforced-concrete', 'Reinforced concrete', 'الخرسانة المسلحة', 'concrete', ['reinforced concrete']],
  ['cast-in-place', 'Cast-in-place concrete', 'الخرسانة المصبوبة في الموقع', 'concrete', ['cast-in-place', 'cast in place']],
  ['concrete-strength', 'Concrete strength', 'مقاومة الخرسانة', 'curing', ['concrete strength', 'strength of concrete']],
  ['compressive-strength', 'Compressive strength', 'مقاومة الضغط', 'curing', ['compressive strength']],
  ['curing', 'Concrete curing', 'معالجة الخرسانة', 'curing', ['curing', 'cure concrete']],
  ['formwork', 'Formwork', 'الشدات والقوالب', 'formwork', ['formwork', 'forms for concrete']],
  ['falsework', 'Falsework', 'الأعمال المؤقتة الحاملة', 'formwork', ['falsework']],
  ['formwork-removal', 'Formwork removal and striking', 'فك الشدات والقوالب', 'formwork', ['formwork removal', 'removal of forms', 'stripping', 'striking']],
  ['shoring', 'Shoring', 'الدعامات', 'shoring', ['shoring', 'shores']],
  ['reshoring', 'Reshoring', 'إعادة التدعيم', 'shoring', ['reshoring', 'reshores']],
  ['construction-loads', 'Construction loads', 'أحمال التنفيذ', 'shoring', ['construction loads', 'construction load']],
  ['schedule', 'Schedule', 'البرنامج الزمني', 'schedule', ['schedule', 'programme']],
  ['schedule-planning', 'Schedule planning', 'تخطيط البرنامج الزمني', 'schedule', ['schedule planning', 'project planning', 'planning and scheduling']],
  ['delay-analysis', 'Schedule delay analysis', 'تحليل التأخير الزمني', 'delay', ['delay analysis', 'schedule delay analysis']],
  ['forensic-schedule', 'Forensic schedule analysis', 'التحليل الجنائي للبرنامج', 'delay', ['forensic schedule analysis', 'forensic scheduling']],
  ['time-impact', 'Time impact analysis', 'تحليل الأثر الزمني', 'delay', ['time impact analysis', 'time impact']],
  ['windows-analysis', 'Windows analysis', 'تحليل النوافذ الزمنية', 'delay', ['windows analysis', 'window analysis']],
  ['critical-path', 'Critical path', 'المسار الحرج', 'critical', ['critical path']],
  ['longest-path', 'Longest path', 'أطول مسار', 'critical', ['longest path']],
  ['total-float', 'Total float', 'السماح الكلي', 'critical', ['total float']],
  ['free-float', 'Free float', 'السماح الحر', 'critical', ['free float']],
  ['float-ownership', 'Float ownership', 'ملكية السماح الزمني', 'critical', ['float ownership', 'ownership of float']],
  ['baseline-schedule', 'Baseline schedule', 'البرنامج الأساسي', 'baseline', ['baseline schedule', 'baseline programme']],
  ['schedule-update', 'Schedule update', 'تحديث البرنامج', 'baseline', ['schedule update', 'updated schedule', 'programme update']],
  ['data-date', 'Data date', 'تاريخ البيانات', 'baseline', ['data date']],
  ['status-date', 'Status date', 'تاريخ الحالة', 'baseline', ['status date']],
  ['as-built', 'As-built schedule', 'برنامج التنفيذ الفعلي', 'baseline', ['as-built schedule', 'as built schedule', 'as-built programme']],
  ['progress-update', 'Progress update', 'تحديث التقدم', 'baseline', ['progress update', 'progress information']],
  ['logic', 'Schedule logic', 'منطق البرنامج', 'logic', ['schedule logic', 'network logic', 'logic']],
  ['relationships', 'Activity relationships', 'علاقات الأنشطة', 'logic', ['activity relationships', 'relationships']],
  ['predecessor', 'Predecessor and successor', 'النشاط السابق واللاحق', 'logic', ['predecessor', 'successor']],
  ['lag', 'Lag and lead', 'فترات التأخير والتقديم', 'logic', ['lag', 'lead time']],
  ['constraints', 'Schedule constraints', 'قيود البرنامج', 'logic', ['schedule constraints', 'constraints']],
  ['calendars', 'Schedule calendars', 'تقاويم البرنامج', 'basis', ['schedule calendar', 'calendars', 'calendar']],
  ['schedule-basis', 'Schedule basis', 'أساس البرنامج الزمني', 'basis', ['schedule basis', 'basis of schedule']],
  ['schedule-assumptions', 'Schedule assumptions', 'افتراضات البرنامج', 'basis', ['schedule assumptions', 'assumptions']],
  ['schedule-risk', 'Schedule risk', 'مخاطر البرنامج', 'basis', ['schedule risk', 'risk analysis']],
  ['resource-loading', 'Resource loading', 'تحميل الموارد', 'basis', ['resource loading', 'resource loaded']],
  ['constructability', 'Constructability review', 'مراجعة قابلية التنفيذ', 'constructability', ['constructability review', 'constructability']],
  ['work-sequence', 'Work sequence', 'تسلسل الأعمال', 'constructability', ['work sequence', 'construction sequence', 'sequence of work']],
  ['procurement', 'Procurement schedule', 'برنامج التوريد', 'procurement', ['procurement schedule', 'procurement']],
  ['long-lead', 'Long-lead items', 'المواد طويلة التوريد', 'procurement', ['long lead', 'long-lead']],
  ['material-delivery', 'Material delivery', 'تسليم المواد', 'procurement', ['material delivery', 'delivery of materials']],
  ['ifc-drawings', 'IFC drawings', 'رسومات IFC التنفيذية', 'drawings', ['ifc drawings', 'ifc drawing']],
  ['shop-drawings', 'Shop drawings', 'الرسومات التنفيذية التفصيلية', 'drawings', ['shop drawings', 'shop drawing']],
  ['revised-drawings', 'Revised drawings', 'الرسومات المعدلة', 'drawings', ['revised drawings', 'drawing revision']],
  ['design-information', 'Design information', 'معلومات التصميم', 'drawings', ['design information']],
  ['submittal', 'Submittal and approval', 'التقديم والاعتماد', 'drawings', ['submittal', 'submission and approval', 'approval process']],
  ['review-period', 'Review period', 'مدة المراجعة', 'drawings', ['review period', 'period for review']],
  ['claim', 'Contract claim', 'المطالبة التعاقدية', 'claims', ['contract claim', 'claim']],
  ['notice', 'Notice requirements', 'متطلبات الإخطار', 'claims', ['notice requirements', 'notice']],
  ['extension-time', 'Extension of time', 'تمديد المدة', 'claims', ['extension of time']],
  ['entitlement', 'Entitlement', 'الاستحقاق', 'claims', ['entitlement']],
  ['causation', 'Delay causation', 'سببية التأخير', 'claims', ['delay causation', 'causation']],
  ['concurrency', 'Concurrent delay', 'التأخير المتزامن', 'delay', ['concurrent delay', 'concurrency']],
  ['determination', 'Engineer determination', 'قرار المهندس', 'claims', ["engineer's determination", 'engineer determination', 'determination']],
  ['contemporaneous-records', 'Contemporaneous records', 'السجلات المعاصرة', 'claims', ['contemporaneous records', 'project records']],
  ['variation', 'Variation', 'التغيير', 'claims', ['variation']],
  ['safety', 'Construction safety', 'سلامة التشييد', 'safety', ['construction safety', 'safety']],
  ['fall-protection', 'Fall protection', 'الحماية من السقوط', 'safety', ['fall protection']],
  ['formwork-inspection', 'Formwork inspection', 'فحص الشدات', 'safety', ['formwork inspection', 'forms shall be inspected']],
  ['reinforcing-steel', 'Reinforcing steel', 'حديد التسليح', 'concrete', ['reinforcing steel', 'reinforcement steel']],
  ['temporary-works', 'Temporary works', 'الأعمال المؤقتة', 'formwork', ['temporary works']],
  ['inspection', 'Inspection and verification', 'الفحص والتحقق', 'safety', ['inspection', 'verification']]
].map(([id, en, ar, topicId, aliases]) => ({ id, label: { en, ar }, topicId, aliases }));

function normalize(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function clean(value) {
  return String(value || '')
    .replace(/\r/g, '')
    .replace(/\u0000/g, '')
    .replace(/[\t\f\v]+/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{4,}/g, '\n\n')
    .trim();
}

function chunksForPage(text, maxLength = 1350, minLength = 420) {
  const cleaned = clean(text);
  if (!cleaned) return [];
  const chunks = [];
  let start = 0;
  while (start < cleaned.length) {
    let end = Math.min(start + maxLength, cleaned.length);
    if (end < cleaned.length) {
      const window = cleaned.slice(start + minLength, end + 120);
      let best = -1;
      const boundary = /[.!?؟؛:]\s+|\n{2,}|\n(?=[A-Z\u0600-\u06ff])/g;
      for (const match of window.matchAll(boundary)) best = match.index + match[0].length;
      if (best > 0) end = Math.min(start + minLength + best, cleaned.length);
      else {
        const space = cleaned.lastIndexOf(' ', end);
        if (space > start + minLength) end = space;
      }
    }
    const chunk = cleaned.slice(start, end).trim();
    if (chunk) chunks.push(chunk);
    start = end;
  }
  return chunks;
}

function topicIds(text) {
  const normalized = normalize(text);
  return Object.entries(topics)
    .filter(([, terms]) => terms.some(term => normalized.includes(normalize(term))))
    .map(([id]) => id);
}

const records = [];
const sourceStats = {};

for (const source of sources) {
  let pages;
  if (source.mode === 'text') {
    pages = [{ page: 1, text: fs.readFileSync(path.join(sourceDir, source.file), 'utf8') }];
  } else {
    pages = JSON.parse(fs.readFileSync(path.join(sourceDir, source.file), 'utf8'));
  }
  let indexedPages = 0;
  let sourcePassages = 0;
  for (const page of pages) {
    const pageChunks = chunksForPage(page.text);
    if (pageChunks.length) indexedPages += 1;
    pageChunks.forEach((text, sequence) => {
      records.push({ s: source.id, p: page.page || 1, n: sequence + 1, m: source.mode, u: topicIds(text), t: text });
      sourcePassages += 1;
    });
  }
  sourceStats[source.id] = { pages: pages.length, indexedPages, passages: sourcePassages, mode: source.mode };
}

const topicStats = {};
for (const id of Object.keys(topics)) {
  const matching = records.filter(record => record.u.includes(id));
  topicStats[id] = {
    passages: matching.length,
    sources: new Set(matching.map(record => record.s)).size
  };
}

function occurrenceCount(haystack, needle) {
  let index = 0;
  let count = 0;
  while (needle && (index = haystack.indexOf(needle, index)) !== -1) {
    count += 1;
    index += Math.max(needle.length, 1);
  }
  return count;
}

const normalizedRecords = records.map(record => ({ source: record.s, text: normalize(record.t) }));
const predictions = predictionSeeds.map(seed => {
  const needles = [...new Set([seed.label.en, ...seed.aliases].map(normalize).filter(Boolean))];
  let occurrences = 0;
  const sourceIds = new Set();
  normalizedRecords.forEach(record => {
    let recordHits = 0;
    needles.forEach(needle => { recordHits += occurrenceCount(record.text, needle); });
    if (recordHits) {
      occurrences += recordHits;
      sourceIds.add(record.source);
    }
  });
  return { ...seed, occurrences, sources: sourceIds.size };
}).filter(item => item.occurrences > 0)
  .sort((a, b) => b.sources - a.sources || b.occurrences - a.occurrences || a.label.en.localeCompare(b.label.en));

const corpus = {
  version: 1,
  generated: '12 Sep 2026',
  stats: {
    sources: sources.length,
    pdfPages: 527,
    nativeTextPages: 302,
    ocrPages: 225,
    textSections: 1,
    passages: records.length
  },
  sourceStats,
  topicStats,
  predictions,
  chunks: records
};

fs.writeFileSync(output, `window.BOOK_SEARCH_CORPUS=${JSON.stringify(corpus)};\n`, 'utf8');
console.log(JSON.stringify({ output, bytes: fs.statSync(output).size, stats: corpus.stats, sourceStats, topicStats, predictions: predictions.length }, null, 2));
