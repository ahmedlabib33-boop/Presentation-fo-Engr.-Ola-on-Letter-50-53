import fs from "node:fs";

const target = process.argv[2];
if (!target) throw new Error("Target HTML path is required");

let source = fs.readFileSync(target, "utf8");
const eol = source.includes("\r\n") ? "\r\n" : "\n";
const withEol = (value) => value.replaceAll("\n", eol);

const evidenceAssignment = withEol(`SHOTS.event2Evidence = [
  {src:'evidence/str-044-rev3.png',label:'STR-044 Rev.3 — Consultant reply sheet'},
  {src:'evidence/str-046-rev2.png',label:'STR-046 Rev.2 — Consultant reply sheet'},
  {src:'evidence/str-054-rev2.png',label:'STR-054 Rev.2 — Consultant reply sheet'},
  {src:'evidence/str-055-rev2.png',label:'STR-055 Rev.2 — Consultant reply sheet'},
  {src:'evidence/acepm-ifc-analysis-page-1.png',label:'ACEPM IFC analysis — page 1 of 3'},
  {src:'evidence/acepm-ifc-analysis-page-2.png',label:'ACEPM IFC analysis — page 2 of 3'},
  {src:'evidence/acepm-ifc-analysis-page-3.png',label:'ACEPM IFC analysis — page 3 of 3'}
];`);

const assignmentPattern = /SHOTS\.event2Evidence\s*=\s*"data:image\/png;base64,[^"]+";/g;
const assignmentMatches = source.match(assignmentPattern) ?? [];
if (assignmentMatches.length !== 1) {
  throw new Error(`Expected one embedded event2Evidence assignment; found ${assignmentMatches.length}`);
}
source = source.replace(assignmentPattern, evidenceAssignment);

const oldShotCss = withEol(`.shot{margin:14px 0 6px;border:1px solid var(--line);border-radius:3px;overflow:hidden;background:#fff}
.shot img{display:block;width:100%;height:auto}`);
const newShotCss = withEol(`.shot{margin:14px 0 6px;border:1px solid var(--line);border-radius:3px;overflow:hidden;background:#fff}
.shot img{display:block;width:100%;height:auto}
.shot.multi{display:grid;gap:10px;padding:10px;background:#e9edf0;overflow:visible}
.shotpage{margin:0;border:1px solid #b9c1c8;background:#fff;overflow:hidden}
.shotpage figcaption{padding:7px 10px;background:#f4f6f7;color:#263746;font-size:11.5px;font-weight:600;border-top:1px solid #cbd2d8}`);
if (!source.includes(oldShotCss)) throw new Error("Evidence-shot CSS block not found");
source = source.replace(oldShotCss, newShotCss);

const oldLightboxCss = withEol(`#lb{position:fixed;inset:0;z-index:200;background:rgba(3,8,14,.93);display:none;
  place-items:center;padding:22px;cursor:zoom-out;backdrop-filter:blur(4px)}
#lb.on{display:grid}
#lb img{max-width:100%;max-height:86vh;border:1px solid var(--line);background:#fff}
#lb .cap{position:absolute;bottom:14px;left:0;right:0;text-align:center;font-size:12px;color:var(--dim)}`);
const newLightboxCss = withEol(`#lb{position:fixed;inset:0;z-index:200;background:rgba(3,8,14,.93);display:none;
  align-items:start;justify-items:center;padding:22px;cursor:zoom-out;backdrop-filter:blur(4px);overflow:auto}
#lb.on{display:grid}
#lb img{width:auto;height:auto;max-width:none;max-height:none;margin-bottom:44px;border:1px solid var(--line);background:#fff}
#lb .cap{position:fixed;bottom:0;left:0;right:0;text-align:center;font-size:12px;color:var(--soft);padding:10px 14px;background:rgba(3,8,14,.94);border-top:1px solid var(--line)}`);
if (!source.includes(oldLightboxCss)) throw new Error("Lightbox CSS block not found");
source = source.replace(oldLightboxCss, newLightboxCss);

const oldShotFunction = withEol(`function shot(key,cap,open){
  const d=el('details','shotwrap'); if(open)d.open=true;
  d.appendChild(el('summary',null,'Show the source page'));
  const box=el('div','shot');
  const img=document.createElement('img');img.src=SHOTS[key];img.alt=cap;img.loading='lazy';
  img.addEventListener('click',()=>{
    document.getElementById('lbimg').src=SHOTS[key];
    document.getElementById('lbcap').textContent=cap.replace(/<[^>]+>/g,'');
    document.getElementById('lb').classList.add('on');
  });
  box.appendChild(img);
  d.appendChild(box);
  d.appendChild(el('div','shotcap',cap));
  return d;
}`);
const newShotFunction = withEol(`function shot(key,cap,open){
  const d=el('details','shotwrap'); if(open)d.open=true;
  d.appendChild(el('summary',null,'Show the source page'));
  const box=el('div','shot');
  const plainCap=cap.replace(/<[^>]+>/g,'');
  const value=SHOTS[key];
  const sources=Array.isArray(value)?value:[{src:value,label:plainCap}];
  if(sources.length>1)box.classList.add('multi');
  sources.forEach((source,index)=>{
    const item=typeof source==='string'?{src:source,label:'Source page '+(index+1)}:source;
    const label=item.label||plainCap;
    const img=document.createElement('img');img.src=item.src;img.alt=label;img.loading='lazy';img.decoding='async';
    img.addEventListener('click',()=>{
      const lbimg=document.getElementById('lbimg');lbimg.src=item.src;lbimg.alt=label;
      document.getElementById('lbcap').textContent=label;
      document.getElementById('lb').classList.add('on');
    });
    if(sources.length>1){
      const page=el('figure','shotpage');page.appendChild(img);
      const pageCap=document.createElement('figcaption');pageCap.textContent=label;page.appendChild(pageCap);box.appendChild(page);
    }else box.appendChild(img);
  });
  d.appendChild(box);
  d.appendChild(el('div','shotcap',cap));
  return d;
}`);
if (!source.includes(oldShotFunction)) throw new Error("shot() function not found");
source = source.replace(oldShotFunction, newShotFunction);

fs.writeFileSync(target, source, "utf8");
console.log("Replaced the low-resolution composite with seven original evidence pages.");
