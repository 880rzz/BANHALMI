import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const skip=new Set(['.git','node_modules','_site','dist','coverage','assets','api','.well-known']);
const files=[];
function walk(dir,b=''){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(e.isDirectory()&&skip.has(e.name))continue;const rel=path.posix.join(b,e.name),abs=path.join(dir,e.name);if(e.isDirectory())walk(abs,rel);else if(e.isFile()&&e.name.endsWith('.html'))files.push([rel,abs])}}
function isRedirect(h){return /<meta[^>]+http-equiv=["']refresh["']/i.test(h)||(/location\.(?:replace|href)\s*=/i.test(h)&&!/<main\b/i.test(h))}
function attr(tag,name){const m=tag.match(new RegExp(`${name}=["']([^"']*)["']`,'i'));return m?.[1]||''}
function meta(h,key){for(const m of h.matchAll(/<meta\b[^>]*>/gi)){const n=attr(m[0],'name').toLowerCase(),p=attr(m[0],'property').toLowerCase();if(n===key||p===key)return attr(m[0],'content')}return''}
function setMeta(h,key,value,kind='name'){
  const re=new RegExp(`<meta\\b[^>]*${kind}=["']${key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}["'][^>]*>`,'i');
  const match=h.match(re);if(!match)return h;
  const replaced=match[0].replace(/content=["'][^"']*["']/i,`content="${value.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"`);
  return h.replace(match[0],replaced);
}
function langFor(rel){return rel.startsWith('hu/')?'hu-HU':rel.startsWith('de-at/')?'de-AT':'en'}
function canonical(h){return h.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1]||h.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)?.[1]||''}
function syncJsonLd(h,title,description,url,language){return h.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,(all,open,raw,close)=>{
  let data;try{data=JSON.parse(raw)}catch{return all}
  const visit=node=>{
    if(!node||typeof node!=='object')return;
    if(Array.isArray(node)){node.forEach(visit);return}
    if(Array.isArray(node['@graph']))node['@graph'].forEach(visit);
    const types=[].concat(node['@type']||[]);
    const pageLike=types.some(t=>['WebPage','ProfilePage','AboutPage','ContactPage','FAQPage','CollectionPage'].includes(t));
    if(pageLike && (!node.url || node.url===url || node['@id']?.startsWith(url))){
      node.url=url;
      node.name=title;
      node.description=description;
      node.inLanguage=language;
    }
  };
  visit(data);return open+JSON.stringify(data)+close;
})}
walk(root);
let changed=0;
for(const [rel,abs] of files){
  let h=fs.readFileSync(abs,'utf8');if(isRedirect(h)||!/<main\b/i.test(h)||/(^|\/)404\.html$/i.test(rel))continue;
  const visible=(h.match(/<main\b[\s\S]*?<\/main>/i)?.[0]||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();if(visible.length<160)continue;
  if(rel==='de-at/vertrauen/index.html'){
    h=h.replace(/<title>Trust Center \| BANHALMI<\/title>/i,'<title>Vertrauen &amp; Transparenz | BANHALMI</title>');
  }
  const title=(h.match(/<title>([\s\S]*?)<\/title>/i)?.[1]||'').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').trim();
  const description=meta(h,'description');const url=canonical(h);const language=langFor(rel);
  if(!title||!description||!url)continue;
  let next=h;
  next=setMeta(next,'og:title',title,'property');
  next=setMeta(next,'twitter:title',title,'name');
  next=setMeta(next,'og:description',description,'property');
  next=setMeta(next,'twitter:description',description,'name');
  next=setMeta(next,'og:url',url,'property');
  next=syncJsonLd(next,title,description,url,language);
  if(next!==h||h!==fs.readFileSync(abs,'utf8')){fs.writeFileSync(abs,next);changed++}
}
console.log(`Google page contract remediation synchronized ${changed} HTML files.`);
