import {readFile,writeFile,readdir,access,unlink} from 'node:fs/promises';
import path from 'node:path';

const root=path.resolve(process.argv[2]||'_site');
const cssSource=path.resolve('assets/css/design-authority-stage77.css');
const cssTarget=path.join(root,'assets/css/style.css');
const oldToken='style.css?v=20260813-stage75-first-principles';
const newToken='style.css?v=20260814-stage77-design';
const commercial=new Set(['portrait/index.html','lifestyle/index.html','event-photography/index.html','hu/portre/index.html','hu/brand/index.html','hu/rendezvenyfotozas/index.html','de-at/portrait/index.html','de-at/brand/index.html','de-at/eventfotografie/index.html']);
const fineArt=new Set(['glamour/index.html','hu/muveszi-fotografia/index.html','de-at/fine-art/index.html']);
const stop=new Set('a an and or the of to for in on with from by at is are be as that this it its your you one egy az és vagy hogy aki ami amire mit der die das ein eine einer einen und oder von für mit ist sind zu im in den dem des'.split(/\s+/));
const exists=async f=>{try{await access(f);return true}catch{return false}};
const compact=s=>s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').replace(/\s*([{}:;,])\s*/g,'$1').trim();

if(await exists(cssTarget)){
  let css=await readFile(cssTarget,'utf8');
  if(!css.includes('STAGE77-DESIGN-FIRST-PRINCIPLES:START')) css+=`\n${compact(await readFile(cssSource,'utf8'))}\n`;
  await writeFile(cssTarget,css,'utf8');
  const extra=path.join(root,'assets/css/design-authority-stage77.css');
  if(await exists(extra)) await unlink(extra);
}

const plain=s=>s.replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
function accent(inner){
  if(/bn-heading-accent|title-accent/.test(inner)) return inner;
  const parts=inner.split(/(<[^>]+>)/g);
  for(let i=parts.length-1;i>=0;i--){
    if(parts[i].startsWith('<')) continue;
    const words=[...parts[i].matchAll(/[\p{L}\p{N}][\p{L}\p{N}’'\-–]+/gu)];
    const hit=[...words].reverse().find(m=>!stop.has(m[0].toLowerCase())&&m[0].length>2)||words.at(-1);
    if(!hit) continue;
    const esc=hit[0].replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    parts[i]=parts[i].replace(new RegExp(`(${esc})(?![\\s\\S]*${esc})`,'i'),'<span class="bn-heading-accent">$1</span>');
    return parts.join('');
  }
  return inner;
}
function attr(tag,name,value){const r=new RegExp(`\\s${name}=["'][^"']*["']`,'i');return r.test(tag)?tag.replace(r,` ${name}="${value}"`):tag.replace(/>$/,` ${name}="${value}">`)}
function surface(tag,fallback){if(/\btrust-proof\b|\bcta-band\b|\bpresence-thesis\b/.test(tag))return'dark';if(/\bservice-gallery-section\b|\breviews-drawer-section\b|\bnext-step-selector\b|\bfp-decision-system\b/.test(tag))return'soft';if(/\bhero\b/.test(tag))return'white';return fallback}
function sections(html,decorate=false){
  const ms=html.search(/<main\b/i),me=html.indexOf('</main>',ms);if(ms<0||me<0)return decorate?html:[];
  const src=html.slice(ms,me),re=/<\/?(?:main|section|details)\b[^>]*>/gi,stack=[],starts=[],found=[];let m,c=0,out='',pos=0;
  while((m=re.exec(src))){let tag=m[0];if(decorate)out+=src.slice(pos,m.index);const close=/^<\//.test(tag),name=(tag.match(/^<\/?([a-z]+)/i)||[])[1]?.toLowerCase();
    if(close){const popped=stack.pop();if(name==='section'&&popped==='section'&&stack.at(-1)==='main'){const s=starts.pop();if(s)found.push({...s,end:ms+re.lastIndex})}}
    else{if(name==='section'&&stack.at(-1)==='main'){starts.push({start:ms+m.index,tag});if(decorate)tag=attr(tag,'data-surface',surface(tag,c++%2?'soft':'white'))}stack.push(name)}
    if(decorate){out+=tag;pos=re.lastIndex}
  }
  if(!decorate)return found.sort((a,b)=>a.start-b.start);out+=src.slice(pos);return html.slice(0,ms)+out+html.slice(me);
}
function simplify(html,rel){
  if(!commercial.has(rel)||html.includes('data-service-simplified="stage77"'))return html;
  const all=sections(html),g=all.findIndex(x=>/service-gallery-section/.test(x.tag)),k=all.findIndex(x=>/partnership-deliverables/.test(x.tag));
  if(g<0||k<0||g-k<3)throw new Error(`${rel}: service decision path no longer matches Stage77 contract`);
  const move=all.slice(k+1,g),body=move.map(x=>html.slice(x.start,x.end)).join(''),lang=rel.startsWith('hu/')?'hu':rel.startsWith('de-at/')?'de':'en',label={en:'How the work is built',hu:'Hogyan épül fel a munka',de:'So entsteht die Arbeit'}[lang];
  for(let i=move.length-1;i>=0;i--)html=html.slice(0,move[i].start)+html.slice(move[i].end);
  const gallery=sections(html).find(x=>/service-gallery-section/.test(x.tag));if(!gallery)throw new Error(`${rel}: gallery lost during Stage77 simplification`);
  const block=`<details class="service-deep-dive" data-service-simplified="stage77"><summary>${label}</summary><div class="service-deep-dive-content">${body}</div></details>`;
  return html.slice(0,gallery.start)+block+html.slice(gallery.start);
}
async function walk(dir,rel=''){
  for(const e of await readdir(dir,{withFileTypes:true})){
    const f=path.join(dir,e.name),r=rel?`${rel}/${e.name}`:e.name;if(e.isDirectory()){await walk(f,r);continue}if(!e.name.endsWith('.html'))continue;
    let html=await readFile(f,'utf8');html=html.replaceAll(oldToken,newToken);const before=[...html.matchAll(/<(h1|h2)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map(x=>plain(x[2]));
    html=html.replace(/<(h1|h2)\b([^>]*)>([\s\S]*?)<\/\1>/gi,(x,n,a,i)=>`<${n}${a}>${accent(i)}</${n}>`);html=sections(html,true);html=simplify(html,r);
    const hs=[...html.matchAll(/<(h1|h2)\b[^>]*>([\s\S]*?)<\/\1>/gi)],after=hs.map(x=>plain(x[2]));if(JSON.stringify(before)!==JSON.stringify(after))throw new Error(`${r}: Stage77 changed heading text`);
    if(hs.some(x=>!/(bn-heading-accent|title-accent)/.test(x[2])))throw new Error(`${r}: production H1/H2 lacks highlighted phrase`);if(fineArt.has(r)&&/service-deep-dive/.test(html))throw new Error(`${r}: fine-art narrative must remain open`);if(html.includes(oldToken))throw new Error(`${r}: stale Stage75 CSS token survived`);
    await writeFile(f,html,'utf8');
  }
}
await walk(root);
console.log('Stage77 applied: stable H1/H2 accents, explicit surfaces, simplified commercial service detail, open Fine Art narrative and fresh production CSS token.');
