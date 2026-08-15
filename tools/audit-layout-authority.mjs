import fs from 'node:fs';
const css=fs.readFileSync('assets/css/site.css','utf8');
const fail=[];
if(/(^|[}\s])section\{padding:/m.test(css)) fail.push('naked global section padding returned');
if(!css.includes('main>section{padding:72px 0;}')) fail.push('desktop base page-section rhythm missing');
if(!css.includes('main>section{padding:var(--jony-air) 0;}')) fail.push('Jony page-section rhythm is not scoped');
if(!css.includes('main>section{padding:clamp(64px,7.5vw,104px) 0;}')) fail.push('readability page-section rhythm is not scoped');
if((css.match(/main>section\{padding:56px 0;\}/g)||[]).length<2) fail.push('mobile page-section rhythm authority drifted');
if(css.includes('padding-bottom:52px')||css.includes('padding-right:58px')) fail.push('legacy quote-card reserved whitespace returned');
if(!css.includes('.option-row>span>.info-tip,.category-card>span>.info-tip{position:static!important;')) fail.push('quote info control is not flow-positioned');
if(!css.includes('.smart-quote-layout .category-grid{gap:9px!important;align-items:start!important}')) fail.push('quote grid may stretch cards again');
if((css.match(/html body \.smart-quote-layout :is\(\.category-card,\.option-row\)\{/g)||[]).length!==2) fail.push('quote density authority count drifted');
if(fail.length){console.error('Layout authority audit failed:\n- '+fail.join('\n- '));process.exit(1)}
console.log('Layout authority audit passed.');
