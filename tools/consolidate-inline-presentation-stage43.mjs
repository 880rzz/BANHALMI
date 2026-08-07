import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const cssPath=path.join(root,'assets/css/style.css');
let css=fs.readFileSync(cssPath,'utf8');
const marker='/* STAGE43-INLINE-PRESENTATION:START */';
if(!css.includes(marker)){
  css += `\n\n${marker}\n/* Reusable form/contact presentation belongs to the design system, never HTML attributes. */\n.smart-quote-layout .location-cards{margin-top:28px;}\n.smart-quote-layout .field.consent label{font-weight:400;}\n.form [data-form-note]{margin-top:16px;color:var(--gold-deep);}\n/* STAGE43-INLINE-PRESENTATION:END */\n`;
  fs.writeFileSync(cssPath,css);
}

let filesChanged=0;
let replacements=0;
function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(['.git','node_modules'].includes(entry.name)) continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()){ walk(full); continue; }
    if(!entry.name.endsWith('.html')) continue;
    let html=fs.readFileSync(full,'utf8');
    const original=html;

    html=html.replace(/(<div\b[^>]*class=["'][^"']*\blocation-cards\b[^"']*["'][^>]*?)\sstyle=["']margin-top:\s*28px;?["']([^>]*>)/gi,'$1$2');
    html=html.replace(/(<label\b(?=[^>]*\bfor=["']consent["'])[^>]*?)\sstyle=["']font-weight:\s*400;?["']([^>]*>)/gi,'$1$2');
    html=html.replace(/(<p\b(?=[^>]*\bdata-form-note(?:=["'][^"']*["'])?)[^>]*?)\sstyle=["']margin-top:\s*16px;?\s*color:\s*var\(--gold-deep\);?["']([^>]*>)/gi,'$1$2');

    if(html!==original){
      replacements += (original.match(/style=["'](?:margin-top:\s*28px;?|font-weight:\s*400;?|margin-top:\s*16px;?\s*color:\s*var\(--gold-deep\);?)["']/gi)||[]).length;
      fs.writeFileSync(full,html);
      filesChanged++;
    }
  }
}
walk(root);
console.log(`Stage 43 inline-presentation consolidation changed ${filesChanged} HTML files; candidate replacements: ${replacements}.`);
