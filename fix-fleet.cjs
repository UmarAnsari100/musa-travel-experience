const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'pages', 'Fleet.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// Rules to force dark mode and apply custom theme colors
const rules = [
  { from: /bg-white dark:bg-\[\#0e1111\]/g, to: 'bg-[#0e1111]' },
  { from: /bg-white dark:bg-\[\#111\]/g, to: 'bg-[#0D1C1A]' },
  { from: /bg-white dark:bg-\[\#0F1E1C\]/g, to: 'bg-[#0F1E1C]' },
  { from: /text-\[rgba\(64,138,113,0\.12\)\] dark:text-white/g, to: 'text-[#F0FFF8]' },
  { from: /text-\[rgba\(64,138,113,0\.12\)\] dark:text-\[\#F0FFF8\]/g, to: 'text-[#F0FFF8]' },
  { from: /text-black\/\[0\.05\] dark:text-white\/\[0\.03\]/g, to: 'text-[rgba(176,228,204,0.02)]' },
  { from: /border-black\/5 dark:border-white\/5/g, to: 'border-[rgba(64,138,113,0.15)]' },
  { from: /text-gray-text([^d]*)dark:text-gray-400/g, to: 'text-[#7ABFA0]$1' },
  { from: /text-gray-500 dark:text-gray-400/g, to: 'text-[#7ABFA0]' },
  { from: /text-gray-400 dark:text-gray-500/g, to: 'text-[rgba(176,228,204,0.50)]' },
  { from: /text-gray-400 dark:text-\[\#7ABFA0\]/g, to: 'text-[#7ABFA0]' },
  { from: /text-gray-500 dark:text-\[\#7ABFA0\]/g, to: 'text-[#7ABFA0]' },
  { from: /text-gray-800 dark:text-white/g, to: 'text-[#F0FFF8]' },
  { from: /border-gray-200 dark:border-white\/10/g, to: 'border-[rgba(64,138,113,0.15)]' },
  { from: /bg-black\/10 dark:bg-white\/10/g, to: 'bg-[rgba(176,228,204,0.1)]' },
  { from: /hover:bg-black\/20 dark:hover:bg-white\/20/g, to: 'hover:bg-[rgba(176,228,204,0.2)]' },
  { from: /bg-\[\#E8E8E4\] dark:bg-\[rgba\(64,138,113,0\.20\)\]/g, to: 'bg-[rgba(64,138,113,0.15)]' },
  { from: /border-\[\#E8E8E4\] dark:border-\[rgba\(64,138,113,0\.25\)\]/g, to: 'border-[rgba(64,138,113,0.25)]' },
  { from: /text-\[\#0D0D14\]/g, to: 'text-[#0e1111]' },
  { from: /bg-\[\#B0E4CC\]\/5 dark:bg-\[\#B0E4CC\]\/5/g, to: 'bg-[#0D1C1A]' },
  { from: /border-\[\#B0E4CC\]\/10/g, to: 'border-[rgba(64,138,113,0.15)]' },
  { from: /dark:hover:bg-white\/5/g, to: 'hover:bg-white/5' },
  { from: /hover:bg-\[\#F0FFF8\]/g, to: 'hover:bg-[#163026]' }
];

let newContent = content;
for (const rule of rules) {
  newContent = newContent.replace(rule.from, rule.to);
}

fs.writeFileSync(targetPath, newContent, 'utf8');
console.log('Fleet.tsx updated.');
