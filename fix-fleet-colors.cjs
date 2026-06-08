const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'pages', 'Fleet.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

const rules = [
  // Gold to Mint
  { from: /#C9A84C/g, to: '#B0E4CC' },
  // Gray texts
  { from: /text-gray-500([^a-zA-Z0-9_\-])/g, to: 'text-[#7ABFA0]$1' },
  { from: /text-gray-400([^a-zA-Z0-9_\-])/g, to: 'text-[rgba(176,228,204,0.50)]$1' },
  { from: /dark:text-\[rgba\(176,228,204,0\.50\)\]/g, to: '' },
  { from: /dark:text-\[\#7ABFA0\]/g, to: '' },
  { from: /dark:bg-\[\#111\]/g, to: '' },
  { from: /dark:border-white\/5/g, to: '' },
  { from: /text-gray-text/g, to: 'text-[#7ABFA0]' }
];

for (const rule of rules) {
  content = content.replace(rule.from, rule.to);
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Fleet colors fixed.');
