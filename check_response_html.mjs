import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const target = process.argv[2];
const source = fs.readFileSync(target, "utf8");
const scripts = [...source.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter((match) => !/\bsrc\s*=|application\/ld\+json/i.test(match[1]))
  .map((match) => match[2]);
if (!scripts.length) throw new Error("No script blocks found");
scripts.forEach((script, index) => new vm.Script(script, { filename: `${path.basename(target)}#script-${index + 1}` }));

const block = /SHOTS\.event2Evidence\s*=\s*\[([\s\S]*?)\];/.exec(source)?.[1];
if (!block) throw new Error("Event 2 evidence array not found");
const assetPaths = [...block.matchAll(/src:'([^']+)'/g)].map((match) => match[1]);
if (assetPaths.length !== 7) throw new Error(`Expected 7 Event 2 evidence assets; found ${assetPaths.length}`);
const missing = assetPaths.filter((asset) => !fs.existsSync(path.resolve(path.dirname(target), asset)));
if (missing.length) throw new Error(`Missing assets: ${missing.join(", ")}`);
if (source.includes("SHOTS.event2Evidence = \"data:image")) throw new Error("Low-resolution composite is still embedded");

console.log(JSON.stringify({ scriptsParsed: scripts.length, event2Assets: assetPaths.length, missingAssets: 0 }, null, 2));
