import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
const dir=path.resolve(import.meta.dirname,'../.github/workflows');const errors=[];
for(const name of await readdir(dir)){if(!/\.ya?ml$/.test(name)||name.startsWith('_'))continue;const text=await readFile(path.join(dir,name),'utf8');if(/contents:\s*write/i.test(text))errors.push(name+': contents write permission is forbidden');if(/git\s+push/i.test(text))errors.push(name+': permanent workflow must not push');if(/git\s+commit/i.test(text))errors.push(name+': permanent workflow must not commit');if(/npm\s+run\s+fix:/i.test(text))errors.push(name+': workflow invokes a mutating fixer')}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}console.log('Workflow safety audit passed: permanent workflows are read-only and cannot rewrite source.');
