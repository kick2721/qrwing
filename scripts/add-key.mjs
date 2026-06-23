const fs = require("fs");
const text = fs.readFileSync("src/lib/i18n.ts", "utf-8");
const result = text.replace(
  /(    dashboardConfirmTitle:)/g,
  '    dashboardSelectQR: "Select a QR code to view stats",\n$1'
);
fs.writeFileSync("src/lib/i18n.ts", result);
console.log("Done");
