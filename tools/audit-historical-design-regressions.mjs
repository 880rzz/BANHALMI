import fs from 'node:fs';

const failures=[];
const authority=JSON.parse(fs.readFileSync('data/design-authority.json','utf8'));
const audit=fs.readFileSync('tools/audit-all-pages-design.mjs','utf8');
const restore=fs.readFileSync('tools/restore-production-design-authority.mjs','utf8');
const must=(ok,msg)=>{if(!ok)failures.push(msg)};

must(Number(authority.pageMaxPx)===1280,'BANHALMI canonical standard canvas must remain 1280px');
must(Number(authority.structuredMaxPx)===1440,'BANHALMI canonical structured canvas must remain 1440px');
must(audit.includes('320,360,375,390,412,430,768,820,1024,1280,1366,1440,1920,2560,3840'),'responsive release matrix must cover 320px through 4K');
must(audit.includes('active navigation is boxed'),'boxed active-navigation regression guard missing');
must(audit.includes('footer occupies'),'oversized footer regression guard missing');
must(audit.includes('document horizontal overflow'),'horizontal overflow regression guard missing');
must(audit.includes('touch target'),'touch-target regression guard missing');
must(audit.includes("fs.readFileSync('data/design-authority.json','utf8')"),'design audit must read canonical authority');
must(restore.includes('data/design-authority.json'),'production compiler must read canonical design authority');
must(!audit.includes('pageMaxPx=1200'),'stale 1200px canvas may not return to exhaustive audit');
must(!audit.includes('pageMaxPx=1500'),'stale 1500px canvas may not return to exhaustive audit');

if(failures.length){console.error(`BANHALMI historical design regression guard failed (${failures.length}):`);for(const f of failures)console.error(`- ${f}`);process.exit(1)}
console.log('BANHALMI historical design regression guard passed: canonical 1280/1440 canvases and screenshot-era navigation/footer/overflow/touch protections are release-blocking through 4K.');
