import fs from "node:fs";

const target = process.argv[2];
if (!target) throw new Error("Target HTML path is required");

const from = '"Event 2 - IFC":"الحدث 2 — الرسومات"';
const to = '"Event 2 - IFC":"الحدث 2 - IFC"';
let source = fs.readFileSync(target, "utf8");
const matches = source.split(from).length - 1;
if (matches !== 1) {
  throw new Error(`Expected exactly 1 Arabic mapping; found ${matches}`);
}
source = source.replace(from, to);
fs.writeFileSync(target, source, "utf8");
console.log("Updated Arabic-mode label mapping.");
