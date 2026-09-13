const fs = require('fs');
const vm = require('vm');
const path = require('path');

const repo = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(repo, 'index.html'), 'utf8');
const letter53Upgrade = fs.readFileSync(path.join(repo, 'letter53_upgrade.js'), 'utf8');
const primaveraAnalyzer = fs.readFileSync(path.join(repo, 'primavera-xer-analyzer.html'), 'utf8');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const inlineScripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(match => !/\bsrc\s*=|application\/ld\+json/i.test(match[1]));
inlineScripts.forEach((match, index) => {
  try { new vm.Script(match[2], { filename: `index-inline-${index + 1}.js` }); }
  catch (error) { failures.push(`Inline script ${index + 1}: ${error.message}`); }
});
try { new vm.Script(letter53Upgrade, { filename: 'letter53_upgrade.js' }); }
catch (error) { failures.push(`Letter 053 upgrade script: ${error.message}`); }
const analyzerScript = primaveraAnalyzer.match(/<script>([\s\S]*?)<\/script>/i);
try { new vm.Script(analyzerScript ? analyzerScript[1] : '', { filename: 'primavera-xer-analyzer.js' }); }
catch (error) { failures.push(`Primavera analyzer script: ${error.message}`); }

assert(/book-intelligence\.js[\s\S]*book-search-corpus\.js[\s\S]*book-search\.js/.test(html), 'Search scripts are missing or out of order');
assert(/book-reader\.css/.test(html), 'Embedded reader stylesheet is missing');
assert(/book-reader\.js/.test(html), 'Embedded reader script is missing');
assert(/smart-tables\.css/.test(html), 'Smart table stylesheet is missing');
assert(/smart-tables\.js/.test(html), 'Smart table script is missing');
assert(/\['Read the Books','reader'\]/.test(html), 'Read the Books Library tab is missing');
assert(!/id=["']btnAr["']/.test(html), 'Removed Arabic-summary button is still present');
assert(/Prepared for <b>Eng\. OLA - CTO<\/b>/.test(html), 'Prepared-for header line is missing');
assert(/letter53_upgrade\.css/.test(html), 'Letter 053 control stylesheet is missing');
assert(/letter53_upgrade\.js/.test(html), 'Letter 053 control script is missing');
assert(/Primavera Analyzer/.test(letter53Upgrade), 'Primavera Analyzer top-level tab is missing');
assert(/primavera-xer-analyzer\.html/.test(letter53Upgrade), 'Primavera Analyzer iframe is missing');
assert(/Apply ACEPM 24/.test(primaveraAnalyzer), 'ACEPM 24 treatment selector is missing');
assert(/Import one or more outside schedules/.test(primaveraAnalyzer), 'External XER import is missing');
assert(/Budgeted total cost/.test(primaveraAnalyzer) && /Earned Value/.test(primaveraAnalyzer), 'Required cost and EV metrics are missing');
assert(/Ground floor \/ works milestone/.test(primaveraAnalyzer) && /Data date/.test(primaveraAnalyzer), 'Required milestone and data-date metrics are missing');
assert(/Not rescheduled in P6/.test(primaveraAnalyzer), 'Native P6 recalculation control is missing');

const analyzerFiles = [
  'primavera-app-source.html',
  'assets/primavera/02_NDJSON_SOURCE_AUDIT.json',
  'assets/primavera/05_INTEGRITY_VERIFICATION.json',
  'assets/primavera/README_AUDIT.txt',
  ...[1, 2, 3, 4, 5].map(index => `assets/xer/schedule-0${index}.xer`)
];
analyzerFiles.forEach(file => assert(fs.existsSync(path.join(repo, file)), `Analyzer source is missing: ${file}`));
const controlAudit = JSON.parse(fs.readFileSync(path.join(repo, 'assets/primavera/02_NDJSON_SOURCE_AUDIT.json'), 'utf8'));
assert(controlAudit.engineer_control_matrix.length === 24, 'Embedded ACEPM control matrix must contain exactly 24 relationships');

const pointsBlock = letter53Upgrade.match(/const POINTS53=\[([\s\S]*?)\];\s*\n\s*const QUESTION_REGISTER/);
assert(pointsBlock && (pointsBlock[1].match(/\{n:\d+/g) || []).length === 23, 'Letter 053 register must cover exactly 23 points');
const actionsBlock = letter53Upgrade.match(/const ACTIONS=\[([\s\S]*?)\];\s*\n\s*const LETTER_SECTIONS/);
assert(actionsBlock && (actionsBlock[1].match(/\['[A-L]'/g) || []).length === 12, 'Required actions A-L are incomplete');
assert(/const EVIDENCE_FIELDS=\[[^\]]*'Notes'\]/.test(letter53Upgrade), '18-column Evidence and Verification Register schema is missing');
const fieldsBlock = letter53Upgrade.match(/const EVIDENCE_FIELDS=\[([^\]]+)\]/);
assert(fieldsBlock && (fieldsBlock[1].match(/'[^']+'/g) || []).length === 18, 'Evidence register must contain exactly 18 control fields');
assert(/EVIDENCE\.length\+' principal assertions \+ '\+REL_EVIDENCE\.length\+' relationship records/.test(letter53Upgrade), 'Evidence totals are not exposed in the UI');
assert(/REL_EVIDENCE=REL\.map/.test(letter53Upgrade), 'All 24 relationships are not linked into the verification register');
assert(/Excluded — not relied upon/.test(letter53Upgrade), 'Letter 055 exclusion control is missing');
assert(/37 − 35 is a two-day arithmetic difference[\s\S]*not the isolated effect/.test(html), 'The invalid 37/35 causal attribution has not been corrected');
assert(/71\/76 Project Finish discrepancy/.test(html), 'The 71/76 version discrepancy is not disclosed');
assert(/Seven changed relationships carry post-pour or post-curing waiting controls/.test(html), 'Strength-lag claim is not technically qualified');

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
