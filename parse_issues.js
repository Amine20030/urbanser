const fs = require('node:fs');
let data;
try {
  let raw = fs.readFileSync('issues.json', 'utf16le');
  raw = raw.replace(/^\uFEFF/, '');
  data = JSON.parse(raw);
  const lines = data.issues.map(i => `${i.component} | L${i.line || 'N/A'} | [${i.severity}] ${i.message}`);
  fs.writeFileSync('parsed_issues.txt', lines.join('\n'), 'utf8');
} catch (e) {
  console.error(e);
}
