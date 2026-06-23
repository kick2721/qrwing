const fs = require("fs");
const text = fs.readFileSync("src/lib/i18n.ts", "utf-8");
const result = text.replace(
  /(    trialPrompt:)/g,
  '    editQR: "Edit QR",\n    saveError: "Error saving. Please try again.",\n$1'
);
fs.writeFileSync("src/lib/i18n.ts", result);
console.log("Done");
