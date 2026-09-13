import fs from "node:fs";

const target = process.argv[2];
if (!target) throw new Error("Target HTML path is required");

const replacements = [
  ["Event 2 — Drawings", "Event 2 - IFC"],
];

let source = fs.readFileSync(target, "utf8");
for (const [from, to] of replacements) {
  const matches = source.split(from).length - 1;
  if (matches !== 2) {
    throw new Error(`Expected exactly 2 occurrences of ${JSON.stringify(from)}; found ${matches}`);
  }
  source = source.replaceAll(from, to);
}

fs.writeFileSync(target, source, "utf8");
console.log("Updated navigation label and translation key.");
