import {execSync} from 'node:child_process';
import fs from 'node:fs';
await import('./apply-governance-confidentiality-stage10.mjs');
execSync('git checkout origin/main -- .github/workflows/full-audit.yml',{stdio:'inherit'});
for(const file of ['.github/workflows/stage10-governance-migration.yml','tools/apply-governance-confidentiality-stage10.mjs']){
  if(fs.existsSync(file)) fs.rmSync(file);
}
