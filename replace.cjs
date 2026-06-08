const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  { from: /#000000/gi, to: '#0e1111' },
  { from: /rgba\(\s*0\s*,\s*0\s*,\s*0\s*,/g, to: 'rgba(14, 17, 17,' },
  { from: /--background:\s*0\s+0%\s+0%;/g, to: '--background: 180 10% 6%;' },
  { from: /--sidebar-background:\s*0\s+0%\s+0%;/g, to: '--sidebar-background: 180 10% 6%;' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      for (const rule of replacements) {
        content = content.replace(rule.from, rule.to);
      }

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
// Also run for tailwind.config.ts explicitly
let twContent = fs.readFileSync(path.join(__dirname, 'tailwind.config.ts'), 'utf8');
let origTwContent = twContent;
for (const rule of replacements) {
  twContent = twContent.replace(rule.from, rule.to);
}
if (twContent !== origTwContent) {
  fs.writeFileSync(path.join(__dirname, 'tailwind.config.ts'), twContent, 'utf8');
  console.log('Updated tailwind.config.ts');
}
