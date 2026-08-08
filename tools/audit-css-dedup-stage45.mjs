import fs from 'node:fs';

const css=fs.readFileSync('assets/css/style.css','utf8');
const errors=[];
const marker='/* Production v3 — editorial SEO/GEO and Platon-inspired language sections */';

const markerCount=css.split(marker).length-1;
if(markerCount!==1) errors.push(`style.css must contain exactly one Production v3 editorial block; found ${markerCount}`);

for(const required of [
  '.editorial-about-expanded{background:#fff;}',
  '.banhalmi-platon-service-intro{',
  '.legal-grid{',
  '.professional-network .prose{',
  '.project-team-select, .amcham-benefit-box, .project-goals, .project-summary',
  '.service-info-cards{',
  '.site-header{',
  '.nav-links{',
  '.footer-brand-col{',
  '.menu-btn{display:inline-flex;}',
  '/* STAGE43-INLINE-PRESENTATION:START */'
]){
  if(!css.includes(required)) errors.push(`style.css missing Stage 45 retained design contract: ${required}`);
}

if(css.indexOf(marker)!==css.lastIndexOf(marker)){
  errors.push('style.css reintroduced the exact historical Production-v3 duplicate layer');
}

// Catch byte-equivalent rule resurrection even when somebody copies an old
// block without its historical marker. Context matters: the same rule may be
// valid under two different @media/@supports branches, so only duplicates in
// the same cascade context are rejected.
const source=css.replace(/\/\*[\s\S]*?\*\//g,'');
const seen=new Map();

function matchingBrace(text,open){
  let depth=1,quote='';
  for(let i=open+1;i<text.length;i++){
    const ch=text[i];
    if(quote){
      if(ch==='\\'){i++;continue;}
      if(ch===quote) quote='';
      continue;
    }
    if(ch==='"'||ch==="'"){quote=ch;continue;}
    if(ch==='{') depth++;
    else if(ch==='}'&&!--depth) return i;
  }
  return -1;
}
function norm(value){return value.replace(/\s+/g,' ').replace(/\s*([:;,>+~{}])\s*/g,'$1').trim();}
function parseRegion(text,context='root'){
  let cursor=0;
  while(cursor<text.length){
    const open=text.indexOf('{',cursor);
    if(open<0) break;
    const prelude=text.slice(cursor,open).trim();
    const close=matchingBrace(text,open);
    if(close<0){errors.push('style.css contains an unbalanced rule block');return;}
    const body=text.slice(open+1,close);
    const cleanPrelude=norm(prelude.replace(/^;+/,''));
    if(cleanPrelude){
      if(body.includes('{')||cleanPrelude.startsWith('@')){
        parseRegion(body,`${context}>${cleanPrelude}`);
      }else{
        const key=`${context}|${cleanPrelude}|${norm(body)}`;
        if(seen.has(key)) errors.push(`style.css exact duplicate rule returned in ${context}: ${cleanPrelude}`);
        else seen.set(key,true);
      }
    }
    cursor=close+1;
  }
}
parseRegion(source);

if(errors.length){
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Stage 45 CSS deduplication audit passed: one authoritative Production-v3 block remains and ${seen.size} normalized leaf rules contain no exact same-context duplicates.`);
