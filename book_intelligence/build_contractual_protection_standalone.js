const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outputPath = path.join(root, 'samco-contractual-protection.html');

const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/\r\n/g, '\n');
const escapeScriptText = text => text.replace(/<\/script/gi, '<\\/script');

let html = read('index.html');
let protectionScript = read('letter53_upgrade.js');

// The standalone artifact exposes only the contractual-protection record. Keep
// unrelated tab construction inert so opening the file never requests another
// local HTML document.
protectionScript = protectionScript.replace(
  "primaveraFrame.src='primavera-xer-analyzer.html'",
  "primaveraFrame.src='about:blank'"
);

const protectionEvidencePaths = [...new Set(
  [...protectionScript.matchAll(/protectionFile\('([^']+)'/g)].map(match => match[1])
)];
const indexEvidencePaths = [...new Set(
  [...html.matchAll(/['"](evidence\/[^'"]+\.(?:png|jpe?g))['"]/gi)].map(match => match[1])
)];
const evidencePaths = [...new Set([...protectionEvidencePaths, ...indexEvidencePaths])];

if (!evidencePaths.length) {
  throw new Error('No protection evidence files were found in letter53_upgrade.js.');
}

const embeddedEvidence = {};
for (const relativePath of evidencePaths) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing protection evidence file: ${relativePath}`);
  }
  const extension = path.extname(relativePath).slice(1).toLowerCase();
  const mime = extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' : `image/${extension}`;
  embeddedEvidence[relativePath] = `data:${mime};base64,${fs.readFileSync(absolutePath).toString('base64')}`;
}

for (const relativePath of protectionEvidencePaths) {
  const needle = `protectionFile('${relativePath}'`;
  const replacement = `protectionFile(STANDALONE_PROTECTION_EVIDENCE[${JSON.stringify(relativePath)}]`;
  protectionScript = protectionScript.split(needle).join(replacement);
}

for (const relativePath of indexEvidencePaths) {
  html = html.split(`'${relativePath}'`).join(JSON.stringify(embeddedEvidence[relativePath]));
  html = html.split(`"${relativePath}"`).join(JSON.stringify(embeddedEvidence[relativePath]));
}

const protectionEvidenceObject = Object.fromEntries(
  protectionEvidencePaths.map(relativePath => [relativePath, embeddedEvidence[relativePath]])
);
protectionScript = `const STANDALONE_PROTECTION_EVIDENCE=${JSON.stringify(protectionEvidenceObject)};\n${protectionScript}`;

const cssFiles = [
  'letter53_upgrade.css',
  'book-intelligence.css',
  'book-reader.css',
  'smart-tables.css'
];

for (const cssFile of cssFiles) {
  const tagPattern = new RegExp(`<link\\s+rel=["']stylesheet["']\\s+href=["']${cssFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']\\s*\/?>`, 'i');
  html = html.replace(tagPattern, `<style data-inline-source="${cssFile}">\n${read(cssFile)}\n</style>`);
}

html = html.replace(/<link\s+rel=["']stylesheet["']\s+href=["']conference-call\.css["']\s*\/?>/i, '');
html = html.replace(/<script>\s*window\.va[\s\S]*?<\/script>\s*<script\s+defer\s+src=["']\/_vercel\/insights\/script\.js["']><\/script>/i, '');

const inlineScripts = {
  'book-intelligence.js': read('book-intelligence.js'),
  'smart-tables.js': read('smart-tables.js'),
  'letter53_upgrade.js': protectionScript
};

for (const [scriptFile, scriptText] of Object.entries(inlineScripts)) {
  const escapedName = scriptFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const tagPattern = new RegExp(`<script\\s+src=["']${escapedName}["'](?:\\s+defer)?\\s*><\\/script>`, 'i');
  html = html.replace(tagPattern, `<script data-inline-source="${scriptFile}">\n${escapeScriptText(scriptText)}\n</script>`);
}

html = html.replace(/<script\s+src=["']conference-call\.js["']\s+defer\s*><\/script>/i, '');
html = html.replace(
  /<title>[\s\S]*?<\/title>/i,
  '<title>SAMCO Contractual Protection | الحماية التعاقدية لموقف سامكو</title>'
);
html = html.replace('<body>', '<body class="unlocked contractual-protection-standalone">');

const standaloneCss = `
/* Standalone SAMCO Contractual Protection presentation */
html,body{height:auto;min-height:100%;overflow:auto!important}
body.contractual-protection-standalone #entry,
body.contractual-protection-standalone .bar,
body.contractual-protection-standalone #gs,
body.contractual-protection-standalone #tabbar,
body.contractual-protection-standalone .foot,
body.contractual-protection-standalone .desktop-scroll-cue,
body.contractual-protection-standalone .conference-call-launcher,
body.contractual-protection-standalone .voice-live-sync{display:none!important}
body.contractual-protection-standalone #master{
  display:block!important;opacity:1!important;visibility:visible!important;
  transform:none!important;position:relative!important;min-height:100vh
}
body.contractual-protection-standalone #master .doc{min-height:100vh}
body.contractual-protection-standalone #host>.sec{display:none!important}
body.contractual-protection-standalone #host>.contractual-protection-sec{
  display:block!important;width:100%!important;max-width:none!important
}
body.contractual-protection-standalone #host>.contractual-protection-sec>.pane{
  width:100%!important;max-width:none!important;overflow:visible!important;max-height:none!important
}
body.contractual-protection-standalone .standalone-protection-label{
  margin:0 0 14px;border:1px solid rgba(95,176,165,.72);border-left:4px solid #5fb0a5;
  background:linear-gradient(90deg,rgba(95,176,165,.12),rgba(223,188,103,.045));
  color:#dfbc67;padding:12px 16px;font:800 12px/1.5 "Segoe UI",Arial,sans-serif;
  letter-spacing:.09em;text-transform:uppercase
}
html[dir="rtl"] body.contractual-protection-standalone .standalone-protection-label{
  border-left:1px solid rgba(95,176,165,.72);border-right:4px solid #5fb0a5;text-align:right
}
@media(max-width:720px){
  body.contractual-protection-standalone #master .doc{width:100%;padding-left:12px;padding-right:12px}
  body.contractual-protection-standalone .standalone-protection-label{margin-top:6px}
}
@media print{
  body.contractual-protection-standalone .lang-toggle-top,
  body.contractual-protection-standalone .standalone-protection-label{display:none!important}
}
`;

html = html.replace('</head>', `<style id="standalone-contractual-protection-css">${standaloneCss}</style>\n</head>`);

const bootstrap = `
(() => {
  const ensureStandaloneLabel = () => {
    const pane = document.querySelector('#host > .contractual-protection-sec > .pane');
    if (!pane) return;
    let label = pane.querySelector('.standalone-protection-label');
    if (!label) {
      label = document.createElement('div');
      label.className = 'standalone-protection-label';
      pane.prepend(label);
    }
    label.textContent = document.documentElement.dir === 'rtl'
      ? 'الحماية التعاقدية لموقف سامكو · الإنجليزية / العربية · سجل أدلة مضمّن بالكامل'
      : 'SAMCO Contractual Protection · English / Arabic · Fully embedded evidence record';
  };
  const activateProtection = () => {
    const entry = document.getElementById('entry');
    const master = document.getElementById('master');
    if (entry) entry.hidden = true;
    document.documentElement.classList.add('unlocked');
    document.body.classList.add('unlocked', 'contractual-protection-standalone');
    if (master) master.classList.add('show');
    const protectionSection = document.querySelector('#host > .contractual-protection-sec');
    document.querySelectorAll('#host > .sec').forEach(section => {
      section.hidden = section !== protectionSection;
    });
    if (protectionSection) {
      protectionSection.hidden = false;
      ensureStandaloneLabel();
    }
    window.scrollTo(0, 0);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', activateProtection, {once:true});
  } else {
    activateProtection();
  }
  window.addEventListener('site-language', () => requestAnimationFrame(ensureStandaloneLabel));
})();
`;

html = html.replace('</body>', `<script id="standalone-contractual-protection-bootstrap">${bootstrap}</script>\n</body>`);

const requiredText = [
  'SAMCO Contractual Protection',
  'SAMCO position and record test',
  'Protected point',
  'Engineer Letter 050',
  'SAMCO STR-104',
  'Engineer Letter 053',
  'Expand all sources',
  'Retract all sources'
];

for (const text of requiredText) {
  if (!html.includes(text)) throw new Error(`Standalone output is missing required text: ${text}`);
}

if (/protectionFile\(['"]evidence\//.test(html)) {
  throw new Error('Standalone output still contains unembedded protection evidence paths.');
}
if (/<(?:link|script)[^>]+(?:href|src)=["'](?:letter53_upgrade|book-intelligence|book-reader|smart-tables|conference-call)/i.test(html)) {
  throw new Error('Standalone output still contains a local CSS or JavaScript dependency.');
}
if (!html.includes('data:image/png;base64,')) {
  throw new Error('Standalone output does not contain embedded PNG evidence.');
}

fs.writeFileSync(outputPath, html);

const size = fs.statSync(outputPath).size;
console.log(JSON.stringify({
  output: path.basename(outputPath),
  bytes: size,
  embeddedEvidenceFiles: evidencePaths.length,
  localStylesInlined: cssFiles.length,
  localScriptsInlined: Object.keys(inlineScripts).length
}, null, 2));
