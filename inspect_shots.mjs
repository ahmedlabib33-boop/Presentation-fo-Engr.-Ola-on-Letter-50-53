import fs from "node:fs";

const source = fs.readFileSync(process.argv[2], "utf8");
const line = source.split(/\r?\n/).find((value) => value.startsWith("const SHOTS="));
if (!line) throw new Error("SHOTS definition not found");
const shots = JSON.parse(line.slice("const SHOTS=".length, -1));
const assignedShotPattern = /SHOTS\.([A-Za-z0-9_]+)\s*=\s*"(data:[^"]+)";/g;
for (const match of source.matchAll(assignedShotPattern)) shots[match[1]] = match[2];

function dimensions(buffer, mime) {
  if (mime === "image/png") {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (mime === "image/jpeg") {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset += 1; continue; }
      const marker = buffer[offset + 1];
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
      }
      if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) { offset += 2; continue; }
      const length = buffer.readUInt16BE(offset + 2);
      offset += 2 + length;
    }
  }
  return { width: null, height: null };
}

const result = Object.entries(shots).map(([key, dataUrl]) => {
  const match = /^data:([^;]+);base64,(.*)$/.exec(dataUrl);
  if (!match) return { key, kind: "external", value: dataUrl };
  const buffer = Buffer.from(match[2], "base64");
  return { key, mime: match[1], bytes: buffer.length, ...dimensions(buffer, match[1]) };
});
console.log(JSON.stringify(result, null, 2));

const used = [...source.matchAll(/shot\('([^']+)'/g)].map((match) => match[1]);
console.log(JSON.stringify({ used }, null, 2));
