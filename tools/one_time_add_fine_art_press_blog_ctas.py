from pathlib import Path
import json

PAGES = {
    "glamour/index.html": {
        "lead": "For years, my personal work has explored identity, dignity, the body and memory. I bring that experience to every commission. It helps me make images that feel personal and true, not merely polished.",
        "group_label": "Further resources",
        "press_label": "Press",
        "press_aria": "Open the press archive",
        "press_url": "https://www.banhalmi.art/press.html",
        "blog_label": "Blog",
        "blog_aria": "Open the blog",
        "blog_url": "https://blog.banhalmi.art/?lang=en-GB",
    },
    "hu/muveszi-fotografia/index.html": {
        "lead": "Sok éve foglalkozom az identitás, a méltóság, a test és az emlékezet kérdéseivel. Ez a tapasztalat a megbízásos munkáimban is velem van. Segít abban, hogy ne csak előnyös, hanem személyes és igaz képek szülessenek.",
        "group_label": "További tartalmak",
        "press_label": "Sajtó",
        "press_aria": "Sajtóarchívum megnyitása",
        "press_url": "https://www.banhalmi.art/hu/press.html",
        "blog_label": "Blog",
        "blog_aria": "Blog megnyitása",
        "blog_url": "https://blog.banhalmi.art",
    },
    "de-at/fine-art/index.html": {
        "lead": "Seit vielen Jahren beschäftige ich mich mit Identität, Würde, Körper und Erinnerung. Diese Erfahrung nehme ich in jeden Auftrag mit. So entstehen Bilder, die nicht nur gut aussehen, sondern persönlich und ehrlich wirken.",
        "group_label": "Weitere Inhalte",
        "press_label": "Presse",
        "press_aria": "Pressearchiv öffnen",
        "press_url": "https://www.banhalmi.art/de-at/press.html",
        "blog_label": "Blog",
        "blog_aria": "Blog öffnen",
        "blog_url": "https://blog.banhalmi.art/?lang=de",
    },
}

for relative, data in PAGES.items():
    path = Path(relative)
    html = path.read_text(encoding="utf-8")
    if "fine-art-resource-actions" in html:
        raise SystemExit(f"{relative}: fine-art resource buttons already exist")
    marker = f'<p class="lead">{data["lead"]}</p><figure class="service-hero-image'
    if html.count(marker) != 1:
        raise SystemExit(f"{relative}: expected hero description marker once, found {html.count(marker)}")
    buttons = (
        f'<p class="lead">{data["lead"]}</p>'
        f'<div class="hero-actions fine-art-resource-actions reveal" aria-label="{data["group_label"]}">'
        f'<a class="btn btn-primary" data-fine-art-resource="press" href="{data["press_url"]}" target="_blank" rel="noopener noreferrer" aria-label="{data["press_aria"]}">{data["press_label"]}</a>'
        f'<a class="btn btn-ghost" data-fine-art-resource="blog" href="{data["blog_url"]}" target="_blank" rel="noopener noreferrer" aria-label="{data["blog_aria"]}">{data["blog_label"]}</a>'
        f'</div><figure class="service-hero-image'
    )
    path.write_text(html.replace(marker, buttons, 1), encoding="utf-8")
    print(f"{relative}: press and blog buttons added")

AUDIT = r'''import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const failures=[];
const pages=[
  {
    file:'glamour/index.html',
    labels:['Press','Blog'],
    urls:['https://www.banhalmi.art/press.html','https://blog.banhalmi.art/?lang=en-GB'],
    group:'Further resources'
  },
  {
    file:'hu/muveszi-fotografia/index.html',
    labels:['Sajtó','Blog'],
    urls:['https://www.banhalmi.art/hu/press.html','https://blog.banhalmi.art'],
    group:'További tartalmak'
  },
  {
    file:'de-at/fine-art/index.html',
    labels:['Presse','Blog'],
    urls:['https://www.banhalmi.art/de-at/press.html','https://blog.banhalmi.art/?lang=de'],
    group:'Weitere Inhalte'
  }
];

for(const page of pages){
  const html=fs.readFileSync(path.join(root,page.file),'utf8');
  const blocks=html.match(/<div class="hero-actions fine-art-resource-actions reveal"[\s\S]*?<\/div>/g)||[];
  if(blocks.length!==1){
    failures.push(`${page.file}: expected one fine-art resource button group, found ${blocks.length}`);
    continue;
  }
  const block=blocks[0];
  if(!block.includes(`aria-label="${page.group}"`)) failures.push(`${page.file}: localized group label missing`);
  const links=[...block.matchAll(/<a class="([^"]+)" data-fine-art-resource="(press|blog)" href="([^"]+)" target="_blank" rel="noopener noreferrer" aria-label="[^"]+">([^<]+)<\/a>/g)];
  if(links.length!==2){
    failures.push(`${page.file}: expected two resource buttons, found ${links.length}`);
  }else{
    const expectedRoles=['press','blog'];
    const expectedClasses=['btn btn-primary','btn btn-ghost'];
    links.forEach((match,index)=>{
      if(match[1]!==expectedClasses[index]) failures.push(`${page.file}: wrong button style for ${expectedRoles[index]}`);
      if(match[2]!==expectedRoles[index]) failures.push(`${page.file}: wrong resource order at ${index+1}`);
      if(match[3]!==page.urls[index]) failures.push(`${page.file}: wrong ${expectedRoles[index]} URL ${match[3]}`);
      if(match[4]!==page.labels[index]) failures.push(`${page.file}: wrong localized label ${match[4]}`);
    });
  }
  const blockPos=html.indexOf(block);
  const heroStart=html.indexOf('<section class="hero service-hero service-editorial-hero">');
  const figurePos=html.indexOf('<figure class="service-hero-image',heroStart);
  const heroLeads=[...html.slice(heroStart,figurePos).matchAll(/<p class="lead">/g)];
  if(heroStart<0||figurePos<0||blockPos<heroStart||blockPos>figurePos) failures.push(`${page.file}: buttons are not between the hero description and image`);
  if(heroLeads.length!==2) failures.push(`${page.file}: expected two hero description paragraphs before the buttons, found ${heroLeads.length}`);
}

if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log('Fine-art press and blog CTA audit passed in English, Hungarian and German.');
'''
Path("tools/audit-fine-art-press-blog-ctas.mjs").write_text(AUDIT, encoding="utf-8")

package_path = Path("package.json")
package = json.loads(package_path.read_text(encoding="utf-8"))
audit_command = "node tools/audit-fine-art-press-blog-ctas.mjs"
if audit_command not in package["scripts"]["audit"]:
    package["scripts"]["audit"] += " && " + audit_command
package["scripts"]["audit:fine-art-resources"] = audit_command
package_path.write_text(json.dumps(package, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("Permanent audit added to package.json")
