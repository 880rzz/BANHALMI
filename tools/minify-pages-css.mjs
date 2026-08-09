import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '_site/assets/css');
if (!fs.existsSync(root)) {
  console.error(`CSS directory not found: ${root}`);
  process.exit(1);
}

function stripComments(css) {
  let out = '';
  let quote = '';
  let escaped = false;
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    const next = css[i + 1];
    if (quote) {
      out += ch;
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = '';
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      out += ch;
      continue;
    }
    if (ch === '/' && next === '*') {
      i += 2;
      while (i < css.length && !(css[i] === '*' && css[i + 1] === '/')) i++;
      i++;
      continue;
    }
    out += ch;
  }
  return out;
}

function minify(css) {
  const noComments = stripComments(css);
  let out = '';
  let quote = '';
  let escaped = false;
  let pendingSpace = false;
  const tight = new Set(['{', '}', ':', ';', ',']);

  for (let i = 0; i < noComments.length; i++) {
    const ch = noComments[i];
    if (quote) {
      out += ch;
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = '';
      continue;
    }
    if (ch === '"' || ch === "'") {
      if (pendingSpace && out && !tight.has(out.at(-1))) out += ' ';
      pendingSpace = false;
      quote = ch;
      out += ch;
      continue;
    }
    if (/\s/.test(ch)) {
      pendingSpace = true;
      continue;
    }
    if (tight.has(ch)) {
      while (out.endsWith(' ')) out = out.slice(0, -1);
      out += ch;
      pendingSpace = false;
      continue;
    }
    if (pendingSpace && out && !tight.has(out.at(-1))) out += ' ';
    pendingSpace = false;
    out += ch;
  }

  return out.replace(/;}+/g, '}').trim();
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile() && entry.name.endsWith('.css')) files.push(full);
  }
  return files;
}

let beforeTotal = 0;
let afterTotal = 0;
for (const file of walk(root)) {
  const before = fs.readFileSync(file, 'utf8');
  const after = minify(before);
  const openBefore = (before.match(/{/g) || []).length;
  const closeBefore = (before.match(/}/g) || []).length;
  const openAfter = (after.match(/{/g) || []).length;
  const closeAfter = (after.match(/}/g) || []).length;
  if (!after || openBefore !== closeBefore || openAfter !== closeAfter || openBefore !== openAfter) {
    console.error(`Refusing unsafe CSS output for ${file}`);
    process.exit(1);
  }
  fs.writeFileSync(file, after + '\n');
  beforeTotal += Buffer.byteLength(before);
  afterTotal += Buffer.byteLength(after + '\n');
  console.log(`${path.relative(root, file)}: ${Buffer.byteLength(before)} -> ${Buffer.byteLength(after + '\n')} bytes`);
}

const saved = beforeTotal - afterTotal;
console.log(`Production CSS: ${beforeTotal} -> ${afterTotal} bytes; saved ${saved} bytes (${(saved / beforeTotal * 100).toFixed(1)}%).`);
if (saved < 1024) {
  console.error('CSS minification saved less than 1 KiB; refusing ineffective production step.');
  process.exit(1);
}
