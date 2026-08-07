import fs from 'node:fs';

const file='llms.txt';
let text=fs.readFileSync(file,'utf8');
const start='<!-- AI-CLARITY-STAGE34:START -->';
const end='<!-- AI-CLARITY-STAGE34:END -->';
const s=text.indexOf(start);
const e=text.indexOf(end);
if(s<0||e<s) throw new Error('Stage 34 block not found');
const block=text.slice(s,e+end.length);
text=(text.slice(0,s)+text.slice(e+end.length)).replace(/\n{3,}/g,'\n\n');
const lines=text.split('\n');
if(!lines[0].startsWith('# BANHALMI')) throw new Error('Expected BANHALMI H1');
let quoteStart=1;
while(quoteStart<lines.length && lines[quoteStart].trim()==='') quoteStart++;
if(!lines[quoteStart]?.startsWith('> ')) throw new Error('Expected blockquote summary after H1');
let quoteEnd=quoteStart;
while(quoteEnd+1<lines.length && lines[quoteEnd+1].startsWith('>')) quoteEnd++;
lines.splice(quoteEnd+1,0,'',block,'');
fs.writeFileSync(file,lines.join('\n').replace(/\n{3,}/g,'\n\n'));

fs.unlinkSync('tools/apply-ai-clarity-order-stage34.mjs');
if(fs.existsSync('.github/workflows/apply-ai-clarity-order-stage34.yml')) fs.unlinkSync('.github/workflows/apply-ai-clarity-order-stage34.yml');
console.log('Moved Stage 34 answer contract after the llms.txt blockquote summary.');
