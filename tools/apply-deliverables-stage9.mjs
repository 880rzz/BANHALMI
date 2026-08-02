import {execSync} from 'node:child_process';
import fs from 'node:fs';
await import('./apply-governance-confidentiality-stage10.mjs');
execSync('git checkout origin/main -- .github/workflows/full-audit.yml',{stdio:'inherit'});
for(const file of ['.github/workflows/stage10-governance-migration.yml','tools/apply-governance-confidentiality-stage10.mjs']){
  if(fs.existsSync(file)) fs.rmSync(file);
}
execSync('git config user.name "github-actions[bot]"');
execSync('git config user.email "41898282+github-actions[bot]@users.noreply.github.com"');
execSync('git add -A');
execSync('git reset portrait/index.html');
execSync('git commit -m "Prepare stage ten governance and confidentiality clarity"',{stdio:'inherit'});
