const fs = require('fs');
const vm = require('vm');
const path = require('path');

const repo = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(repo, 'index.html'), 'utf8');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const inlineScripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(match => !/\bsrc\s*=|application\/ld\+json/i.test(match[1]));
inlineScripts.forEach((match, index) => {
  try { new vm.Script(match[2], { filename: `index-inline-${index + 1}.js` }); }
  catch (error) { failures.push(`Inline script ${index + 1}: ${error.message}`); }
});

assert(/book-intelligence\.js[\s\S]*book-search-corpus\.js[\s\S]*book-search\.js/.test(html), 'Search scripts are missing or out of order');
assert(/book-reader\.css/.test(html), 'Embedded reader stylesheet is missing');
assert(/book-reader\.js/.test(html), 'Embedded reader script is missing');
assert(/smart-tables\.css/.test(html), 'Smart table stylesheet is missing');
assert(/smart-tables\.js/.test(html), 'Smart table script is missing');
assert(/\['Read the Books','reader'\]/.test(html), 'Read the Books Library tab is missing');
assert(!/id=["']btnAr["']/.test(html), 'Removed Arabic-summary button is still present');
assert(/Prepared for <b>Eng\. OLA - CTO<\/b>/.test(html), 'Prepared-for header line is missing');

const readerFiles = ['book-reader-engine.js', 'book-reader-worker.js', 'book-reader.js', 'book-reader.css'];
readerFiles.forEach(file => assert(fs.existsSync(path.join(repo, file)), `Reader file is missing: ${file}`));
['smart-tables.js', 'smart-tables.css'].forEach(file => assert(fs.existsSync(path.join(repo, file)), `Smart table file is missing: ${file}`));
const suppliedSources = ['aace29.pdf', 'aace48.pdf', 'aace38.pdf', 'aci3472.pdf', 'aci347.pdf', 'ecp203.pdf', 'fidic1999.pdf', 'osha703.txt'];
suppliedSources.forEach(file => assert(fs.existsSync(path.join(repo, 'books', file)), `Embedded source is missing: ${file}`));
['pdf.mjs', 'pdf.worker.mjs', 'LICENSE'].forEach(file => assert(fs.existsSync(path.join(repo, 'vendor', 'pdfjs', file)), `PDF reader dependency is missing: ${file}`));

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(repo, 'book-search-corpus.js'), 'utf8'), context);
const corpus = context.window.BOOK_SEARCH_CORPUS;
assert(corpus.stats.sources === 8, 'Expected eight indexed sources');
assert(corpus.stats.pdfPages === 527, 'Expected 527 indexed PDF pages');
assert(corpus.stats.passages === 1439, 'Expected 1,439 indexed passages');
assert(corpus.predictions.length >= 55, 'Prediction vocabulary is incomplete');
assert(Object.values(corpus.sourceStats).every(source => source.pages === source.indexedPages), 'Not every supplied page is indexed');
assert(corpus.topicStats.concrete.sources === 8, 'Concrete topic does not span all sources');
assert(corpus.topicStats.schedule.sources >= 7, 'Schedule topic coverage is incomplete');

console.log(JSON.stringify({
  inlineScripts: inlineScripts.length,
  stats: corpus.stats,
  predictions: corpus.predictions.length,
  sourceStats: corpus.sourceStats,
  embeddedSources: suppliedSources.length,
  failures
}, null, 2));
if (failures.length) process.exitCode = 1;
