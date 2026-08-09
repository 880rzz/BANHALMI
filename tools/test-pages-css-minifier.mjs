import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const repoRoot = process.cwd();
const sourceRoot = path.join(repoRoot, 'assets', 'css');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'banhalmi-css-minify-'));
const tempCss = path.join(tempRoot, 'assets', 'css');

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile() && entry.name.endsWith('.css')) files.push(full);
  }
  return files;
}

function hash(file) {
  return createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

try {
  if (!fs.existsSync(sourceRoot)) throw new Error(`Missing source CSS directory: ${sourceRoot}`);
  fs.mkdirSync(path.dirname(tempCss), { recursive: true });
  fs.cpSync(sourceRoot, tempCss, { recursive: true });

  const sourceFiles = walk(sourceRoot);
  if (!sourceFiles.length) throw new Error('No source CSS files found.');
  const sourceHashes = new Map(sourceFiles.map(file => [path.relative(sourceRoot, file), hash(file)]));
  const beforeBytes = sourceFiles.reduce((sum, file) => sum + fs.statSync(file).size, 0);

  const result = spawnSync(process.execPath, [path.join(repoRoot, 'tools', 'minify-pages-css.mjs'), tempCss], {
    cwd: repoRoot,
    encoding: 'utf8'
  });
  if (result.status !== 0) {
    throw new Error(`Minifier exited ${result.status}.\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
  if (!/Production CSS: \d+ -> \d+ bytes; saved \d+ bytes/.test(result.stdout)) {
    throw new Error(`Minifier did not report byte savings.\n${result.stdout}`);
  }

  const outputFiles = walk(tempCss);
  if (outputFiles.length !== sourceFiles.length) {
    throw new Error(`CSS file count changed (${sourceFiles.length} -> ${outputFiles.length}).`);
  }
  const afterBytes = outputFiles.reduce((sum, file) => sum + fs.statSync(file).size, 0);
  if (afterBytes >= beforeBytes) {
    throw new Error(`Minified CSS is not smaller (${beforeBytes} -> ${afterBytes}).`);
  }
  if (beforeBytes - afterBytes < 1024) {
    throw new Error(`Minifier saved less than 1 KiB (${beforeBytes - afterBytes} bytes).`);
  }

  for (const file of sourceFiles) {
    const rel = path.relative(sourceRoot, file);
    if (hash(file) !== sourceHashes.get(rel)) {
      throw new Error(`Source CSS was modified during artifact test: ${rel}`);
    }
    const output = path.join(tempCss, rel);
    if (!fs.existsSync(output) || fs.statSync(output).size === 0) {
      throw new Error(`Missing or empty minified output: ${rel}`);
    }
  }

  console.log(result.stdout.trim());
  console.log(`✓ Production CSS minifier contract passed on ${sourceFiles.length} files; source tree remained immutable.`);
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
