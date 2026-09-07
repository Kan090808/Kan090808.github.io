import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
if (!fs.existsSync(dist)) {
  console.error('dist/ is missing');
  process.exit(1);
}

const needles = ['__local-cms', '本機編輯模式'];
const hits = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!/\.(js|css|html|map)$/.test(entry.name)) continue;
    const text = fs.readFileSync(full, 'utf8');
    for (const needle of needles) {
      if (text.includes(needle)) hits.push(`${path.relative(dist, full)}: ${needle}`);
    }
  }
}

walk(dist);

if (hits.length) {
  console.error('Production bundle leaked local editor code:\n' + hits.join('\n'));
  process.exit(1);
}

console.log('Production bundle has no local CMS strings.');
