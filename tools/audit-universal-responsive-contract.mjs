import fs from 'node:fs';
import path from 'node:path';

const root='.';
const pages=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules','_site','dist'].includes(entry.name))continue;const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(entry.isFile()&&entry.name.endsWith('.html'))pages.push(full)}}
walk(root);
const fail=(ok,msg)=>{if(!ok){console.error(`UNIVERSAL RESPONSIVE FAIL: ${msg}`);process.exitCode=1;}};
const css=fs.readFileSync('assets/css/site.css','utf8');
fail(new Set((css.match(/--space-[1-7]:/g)||[])).size===7,'canonical spacing scale is incomplete');
fail(css.includes('box-sizing:border-box'),'global box-sizing rule missing');
fail(css.includes('text-wrap:balance'),'balanced heading wrapping rule missing');
fail(css.includes('overflow-x:clip')||css.includes('overflow-x:hidden'),'horizontal overflow guard missing');
for(const file of pages){
  const html=fs.readFileSync(file,'utf8');
  const rel=path.relative(root,file).replaceAll('\\','/');
  const stylesheet=(html.match(/<link[^>]+rel=["'][^"']*stylesheet[^"']*["'][^>]*>/gi)||[]).filter(tag=>/assets\/css\/site\.css\?v=/i.test(tag));
  fail(stylesheet.length===1,`${rel} must discover exactly one versioned assets/css/site.css`);
  fail(!/<style\b/i.test(html),`${rel} contains a page-local style block; use the canonical stylesheet`);
  fail(!/\sstyle\s*=/.test(html),`${rel} contains an inline style attribute; use the canonical stylesheet`);
}
if(!process.exitCode)console.log(`BANHALMI universal responsive contract OK: ${pages.length} HTML pages use one canonical responsive stylesheet and no local style overrides.`);
