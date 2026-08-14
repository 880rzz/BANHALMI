import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root=path.resolve(process.argv[2]||'_site');
const sourceCss=path.resolve('assets/css/design-authority-stage77.css');
const productionCss=path.join(root,'assets/css/style.css');
const commercial=new Set([
  'portrait/index.html','lifestyle/index.html','event-photography/index.html',
  'hu/portre/index.html','hu/brand/index.html','hu/rendezvenyfotozas/index.html',
  'de-at/portrait/index.html','de-at/brand/index.html','de-at/eventfotografie/index.html'
]);
const fineArt=new Set(['glamour/index.html','hu/muveszi-fotografia/index.html','de-at/fine-art/index.html']);
const stop=new Set('a an and or the of to for in on with from by at is are be as that this it its your you one egy az és vagy hogy aki ami amire mit der die das ein eine einer einen und oder von für mit ist sind zu im in den dem des'.split(/\s+/));

function compactCss(css){return css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').replace(/\s*([{}:;,])\s*/g,'$1').trim()}
const css=await readFile(sourceCss,'utf8');
let built=await readFile(productionCss,'utf8');
if(!built.includes('STAGE77-DESIGN-FIRST-PRINCIPLES:START')){
  built=built.trimEnd()+'\n'+compactCss(css)+'\n';
  await writeFile(productionCss,built,'utf8');
}

function textOnly(inner){return inner.replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim()}
function accentInner(inner){
  if(/bn-heading-accent|title-accent/.test(inner)) return inner;
  const parts=inner.split(/(<[^>]+>)/g);
  let targetPart=-1,targetWord='';
  for(let i=parts.length-1;i>=0;i--){
    if(parts[i].startsWith('<')) continue;
    const words=[...parts[i].matchAll(/[\p{L}\p{N}][\p{L}\p{N}’'\-–]+/gu)];
    const choice=[...words].reverse().find(m=>!stop.has(m[0].toLowerCase())&&m[0].length>2)||words.at(-1);
    if(choice){targetPart=i;targetWord=choice[0];break}
  }
  if(targetPart<0) return inner;
  const esc=targetWord.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  parts[targetPart]=parts[targetPart].replace(new RegExp(`(${esc})(?![\\s\\S]*${esc})`,'i'),'<span class="bn-heading-accent">$1</span>');
  return parts.join('');
}

function withAttribute(tag,name,value){
  const re=new RegExp(`\\s${name}=["'][^"']*["']`,'i');
  return re.test(tag)?tag.replace(re,` ${name}="${value}"`):tag.replace(/>$/,` ${name}="${value}">`);
}
function surfaceFor(tag,fallback){
  if(/\btrust-proof\b|\bcta-band\b|\bpresence-thesis\b/.test(tag)) return 'dark';
  if(/\bservice-gallery-section\b|\breviews-drawer-section\b|\bnext-step-selector\b|\bfp-decision-system\b/.test(tag)) return 'soft';
  if(/\bhero\b/.test(tag)) return 'white';
  return fallback;
}
function assignTopLevelSurfaces(html){
  const mainStart=html.search(/<main\b/i); if(mainStart<0) return html;
  const mainEnd=html.indexOf('</main>',mainStart); if(mainEnd<0) return html;
  const segment=html.slice(mainStart,mainEnd);
  const token=/<\/?(?:main|section|details)\b[^>]*>/gi;
  const stack=[]; let cursor=0, out='', alternating=0; let match;
  while((match=token.exec(segment))){
    out+=segment.slice(cursor,match.index); let tag=match[0];
    const closing=/^<\//.test(tag); const name=(tag.match(/^<\/?([a-z]+)/i)||[])[1]?.toLowerCase();
    if(closing){stack.pop(); out+=tag}
    else{
      if(name==='section'&&stack.at(-1)==='main'){
        const fallback=(alternating++%2===0)?'white':'soft';
        tag=withAttribute(tag,'data-surface',surfaceFor(tag,fallback));
      }
      stack.push(name); out+=tag;
    }
    cursor=token.lastIndex;
  }
  out+=segment.slice(cursor);
  return html.slice(0,mainStart)+out+html.slice(mainEnd);
}

function topLevelSections(html){
  const mainStart=html.search(/<main\b/i), mainEnd=html.indexOf('</main>',mainStart); if(mainStart<0||mainEnd<0) return [];
  const segment=html.slice(mainStart,mainEnd); const token=/<\/?(?:main|section|details)\b[^>]*>/gi; const stack=[]; const starts=[]; const sections=[]; let m;
  while((m=token.exec(segment))){
    const tag=m[0], closing=/^<\//.test(tag), name=(tag.match(/^<\/?([a-z]+)/i)||[])[1]?.toLowerCase();
    if(!closing){
      if(name==='section'&&stack.at(-1)==='main') starts.push({start:mainStart+m.index,tag});
      stack.push(name);
    }else{
      const popped=stack.pop();
      if(name==='section'&&popped==='section'&&stack.at(-1)==='main'){
        const s=starts.pop(); if(s) sections.push({...s,end:mainStart+token.lastIndex});
      }
    }
  }
  return sections.sort((a,b)=>a.start-b.start);
}

function simplifyCommercial(html,rel){
  if(!commercial.has(rel)||html.includes('data-service-simplified="stage77"')) return html;
  const sections=topLevelSections(html); const gallery=sections.findIndex(s=>/service-gallery-section/.test(s.tag));
  const keep=sections.findIndex(s=>/partnership-deliverables/.test(s.tag));
  if(gallery<0||keep<0||gallery-keep<3) throw new Error(`${rel}: service decision path no longer matches Stage77 contract`);
  const candidates=sections.slice(keep+1,gallery);
  const content=candidates.map(s=>html.slice(s.start,s.end)).join('');
  const lang=rel.startsWith('hu/')?'hu':rel.startsWith('de-at/')?'de':'en';
  const label={en:'How the work is built',hu:'Hogyan épül fel a munka',de:'So entsteht die Arbeit'}[lang];
  const block=`<details class="service-deep-dive" data-service-simplified="stage77"><summary>${label}</summary><div class="service-deep-dive-content">${content}</div></details>`;
  for(let i=candidates.length-1;i>=0;i--) html=html.slice(0,candidates[i].start)+html.slice(candidates[i].end);
  const refreshed=topLevelSections(html); const galleryNow=refreshed.find(s=>/service-gallery-section/.test(s.tag));
  if(!galleryNow) throw new Error(`${rel}: gallery lost during Stage77 simplification`);
  html=html.slice(0,galleryNow.start)+block+html.slice(galleryNow.start);
  return html;
}

async function walk(dir,rel=''){
  for(const e of await readdir(dir,{withFileTypes:true})){
    const full=path.join(dir,e.name), next=rel?`${rel}/${e.name}`:e.name;
    if(e.isDirectory()) await walk(full,next);
    else if(e.isFile()&&e.name.endsWith('.html')){
      let html=await readFile(full,'utf8');
      const before=[...html.matchAll(/<(h1|h2)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map(m=>textOnly(m[2]));
      html=html.replace(/<(h1|h2)\b([^>]*)>([\s\S]*?)<\/\1>/gi,(all,name,attrs,inner)=>`<${name}${attrs}>${accentInner(inner)}</${name}>`);
      html=assignTopLevelSurfaces(html);
      html=simplifyCommercial(html,next);
      const after=[...html.matchAll(/<(h1|h2)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map(m=>textOnly(m[2]));
      if(JSON.stringify(before)!==JSON.stringify(after)) throw new Error(`${next}: Stage77 changed heading text`);
      const missing=[...html.matchAll(/<(h1|h2)\b[^>]*>([\s\S]*?)<\/\1>/gi)].filter(m=>!/(bn-heading-accent|title-accent)/.test(m[2]));
      if(missing.length) throw new Error(`${next}: ${missing.length} production H1/H2 headings lack a highlighted phrase`);
      if(fineArt.has(next)&&/service-deep-dive/.test(html)) throw new Error(`${next}: fine-art narrative must remain open, not collapsed`);
      await writeFile(full,html,'utf8');
    }
  }
}
await walk(root);
console.log('Stage77 applied: every production H1/H2 has a stable highlighted phrase, section surfaces are explicit, and commercial service detail is simplified without removing content.');
