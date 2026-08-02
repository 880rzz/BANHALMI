import {execSync} from 'node:child_process';
import fs from 'node:fs';
await import('./apply-data-retention-stage12.mjs');
execSync('git checkout origin/main -- .github/workflows/full-audit.yml',{stdio:'inherit'});
for(const file of ['tools/apply-data-retention-stage12.mjs','tools/apply-deliverables-stage9.mjs']){
  if(fs.existsSync(file)) fs.rmSync(file);
}
