global.window = {};
require('../Response-on-53/book-search-corpus.js');
const { BookIndex } = require('../Response-on-53/book-reader-engine.js');
const corpus = window.BOOK_SEARCH_CORPUS;
const topics = [
  { id: 'schedule', roots: ['schedule'], label: { en: 'Schedule planning', ar: 'تخطيط البرنامج الزمني' }, terms: ['schedule', 'programme', 'planning'] },
  { id: 'delay', roots: ['schedule', 'delay'], label: { en: 'Schedule delay analysis', ar: 'تحليل التأخير الزمني' }, terms: ['delay analysis', 'forensic schedule', 'time impact'] }
];
let started = performance.now();
const index = new BookIndex(corpus.chunks.filter(chunk => chunk.s === 'aace29'), corpus.predictions, topics);
const buildMs = performance.now() - started;
const timings = [];
const predictionSets = {};
for (const query of ['sch', 'schedule d', 'schedul', 'forensic schedule']) {
  started = performance.now();
  predictionSets[query] = index.predict(query).slice(0, 8);
  timings.push({ query, ms: performance.now() - started });
}
started = performance.now();
const results = index.search('schedule delay analysis');
const searchMs = performance.now() - started;
started = performance.now();
const quoted = index.search('"forensic schedule analysis"');
const quotedMs = performance.now() - started;
const checks = {
  learnedVocabulary: index.candidates.length > 100,
  prefixPredictions: predictionSets.sch.length > 0,
  continuousRefinement: predictionSets['schedule d'].length > 0 && predictionSets['schedule d'].every(item => item.label.toLowerCase().includes('schedule d')),
  typoTolerance: predictionSets.schedul.some(item => item.label.toLowerCase().includes('schedule')),
  relevantResults: results.length > 0 && results[0].page > 0,
  quotedExactOnly: quoted.length > 0 && quoted.every(item => item.match === 'exact'),
  predictionLatency: timings.every(item => item.ms < 15),
  searchLatency: searchMs < 15
};
console.log(JSON.stringify({ buildMs, candidates: index.candidates.length, timings, predictionSets, searchMs, resultCount: results.length, firstResult: results[0], quotedMs, quotedCount: quoted.length, checks }, null, 2));
if (Object.values(checks).some(value => !value)) process.exitCode = 1;
