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
      if (i >= css.length) throw new Error('Unterminated CSS comment');
      i++;
      continue;
    }
    out += ch;
  }
  if (quote) throw new Error('Unterminated CSS string');
  return out;
}

function structuralBraces(css) {
  let quote = '';
  let escaped = false;
  let inComment = false;
  let open = 0;
  let close = 0;

  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    const next = css[i + 1];
    if (inComment) {
      if (ch === '*' && next === '/') {
        inComment = false;
        i++;
      }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = '';
      continue;
    }
    if (ch === '/' && next === '*') {
      inComment = true;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === '{') open++;
    else if (ch === '}') close++;
  }

  if (inComment) throw new Error('Unterminated CSS comment');
  if (quote) throw new Error('Unterminated CSS string');
  return { open, close };
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

  return out.trim();
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile() && entry.name.endsWith('.css')) files.push(full);
  }
  return files;
}

const files = walk(root);
if (!files.length) {
  console.error(`No CSS files found under ${root}`);
  process.exit(1);
}

let beforeTotal = 0;
let afterTotal = 0;
for (const file of files) {
  try {
    const before = fs.readFileSync(file, 'utf8');
    const beforeStructure = structuralBraces(before);
    if (beforeStructure.open !== beforeStructure.close) {
      throw new Error(`Source CSS has unbalanced structural braces (${beforeStructure.open}/${beforeStructure.close})`);
    }

    const after = minify(before);
    const afterStructure = structuralBraces(after);
    if (!after) throw new Error('Minified CSS is empty');
    if (afterStructure.open !== afterStructure.close) {
      throw new Error(`Minified CSS has unbalanced structural braces (${afterStructure.open}/${afterStructure.close})`);
    }
    if (beforeStructure.open !== afterStructure.open || beforeStructure.close !== afterStructure.close) {
      throw new Error(`Structural block count changed (${beforeStructure.open}/${beforeStructure.close} -> ${afterStructure.open}/${afterStructure.close})`);
    }

    const output = after + '\n';
    fs.writeFileSync(file, output);
    beforeTotal += Buffer.byteLength(before);
    afterTotal += Buffer.byteLength(output);
    console.log(`${path.relative(root, file)}: ${Buffer.byteLength(before)} -> ${Buffer.byteLength(output)} bytes`);
  } catch (error) {
    console.error(`Refusing unsafe CSS output for ${file}: ${error.message}`);
    process.exit(1);
  }
}

const saved = beforeTotal - afterTotal;
const percent = beforeTotal ? saved / beforeTotal * 100 : 0;
console.log(`Production CSS: ${beforeTotal} -> ${afterTotal} bytes; saved ${saved} bytes (${percent.toFixed(1)}%).`);
if (saved < 1024) {
  console.error('CSS minification saved less than 1 KiB; refusing ineffective production step.');
  process.exit(1);
}
