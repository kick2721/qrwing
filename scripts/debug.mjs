import { readFileSync } from "fs";
let c = readFileSync("src/lib/i18n.ts", "utf8");
c = c.replace(/\r/g, "");
const lines = c.split("\n");
// Find en block keys with their values
let inEn = false;
let enKeyVals = [];
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (/^  en: \{$/.test(l)) { inEn = true; continue; }
  if (inEn) {
    if (/^\}$/.test(l.trim())) break;
    const m = l.match(/^(    [\w-]+: )".*"(,?)$/);
    if (m) enKeyVals.push({ line: l, key: m[1], comma: m[2] });
  }
}
// Find ar block keys
let inAr = false;
let arKeys = [];
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (/^  ar: \{$/.test(l)) { inAr = true; continue; }
  if (inAr) {
    if (/^\}$/.test(l.trim())) break;
    const m = l.match(/^    ([\w-]+):/);
    if (m) arKeys.push(m[1]);
  }
}
console.log("EN keys count:", enKeyVals.length);
console.log("AR keys count:", arKeys.length);
console.log("EN first:", enKeyVals[0]?.key);
console.log("EN last:", enKeyVals[enKeyVals.length - 1]?.key);
// Check what's in en but not ar
const arSet = new Set(arKeys);
const missing = enKeyVals.filter(kv => !arSet.has(kv.key.trim().split(":")[0]));
console.log("Missing from AR:", missing.length, missing.slice(0, 5).map(m => m.key));
