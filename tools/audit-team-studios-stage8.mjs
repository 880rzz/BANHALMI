import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const errors=[];
const pages=[
 ['about/index.html','Who leads what','Norbert Banhalmi','Viko Speier','Vienna and Budapest','/about/','/speier-viko/','/contact/'],
 ['contact/index.html','Who leads what','Norbert Banhalmi','Viko Speier','Vienna and Budapest','/about/','/speier-viko/','/contact/'],
 ['speier-viko/index.html','Who leads what','Norbert Banhalmi','Viko Speier','Vienna and Budapest','/about/','/speier-viko/','/contact/'],
 ['requestaquote/index.html','Who leads what','Norbert Banhalmi','Viko Speier','Vienna and Budapest','/about/','/speier-viko/','/contact/'],
 ['hu/eletmu/index.html','Ki mit vezet?','Bánhalmi Norbert','Viko Speier','Bécs és Budapest','/hu/eletmu/','/hu/speier-viko/','/hu/kapcsolat/'],
 ['hu/kapcsolat/index.html','Ki mit vezet?','Bánhalmi Norbert','Viko Speier','Bécs és Budapest','/hu/eletmu/','/hu/speier-viko/','/hu/kapcsolat/'],
 ['hu/speier-viko/index.html','Ki mit vezet?','Bánhalmi Norbert','Viko Speier','Bécs és Budapest','/hu/eletmu/','/hu/speier-viko/','/hu/kapcsolat/'],
 ['hu/ajanlatkeres/index.html','Ki mit vezet?','Bánhalmi Norbert','Viko Speier','Bécs és Budapest','/hu/eletmu/','/hu/speier-viko/','/hu/kapcsolat/'],
 ['de-at/werk/index.html','Wer verantwortet welchen Bereich?','Norbert Banhalmi','Viko Speier','Wien und Budapest','/de-at/werk/','/de-at/speier-viko/','/de-at/kontakt/'],
 ['de-at/kontakt/index.html','Wer verantwortet welchen Bereich?','Norbert Banhalmi','Viko Speier','Wien und Budapest','/de-at/werk/','/de-at/speier-viko/','/de-at/kontakt/'],
 ['de-at/speier-viko/index.html','Wer verantwortet welchen Bereich?','Norbert Banhalmi','Viko Speier','Wien und Budapest','/de-at/werk/','/de-at/speier-viko/','/de-at/kontakt/'],
 ['de-at/anfrage/index.html','Wer verantwortet welchen Bereich?','Norbert Banhalmi','Viko Speier','Wien und Budapest','/de-at/werk/','/de-at/speier-viko/','/de-at/kontakt/']
];

for(const [relative,heading,norbert,viko,studios,norbertLink,vikoLink,contactLink] of pages){
 const file=path.join(root,relative);
 if(!fs.existsSync(file)){errors.push(`${relative}: file missing`);continue;}
 const html=fs.readFileSync(file,'utf8');
 if((html.match(/data-team-roles="stage8"/g)||[]).length!==1) errors.push(`${relative}: team role block must appear exactly once`);
 const section=(html.match(/<section class="section-band team-role-clarity"[\s\S]*?<\/section>/)||[''])[0];
 if(!section.includes(heading)) errors.push(`${relative}: localized heading missing`);
 if((section.match(/<article class="card reveal">/g)||[]).length!==3) errors.push(`${relative}: expected exactly three responsibility cards`);
 for(const token of [norbert,viko,studios,norbertLink,vikoLink,contactLink,'AmCham Austria']) if(!section.includes(token)) errors.push(`${relative}: missing ${token}`);
 const lower=section.toLowerCase();
 if(!/(creative lead|kreatív vezető|kreative.*leitung)/.test(lower)) errors.push(`${relative}: Norbert creative lead role unclear`);
 if(!/(budapest studio|budapesti stúdió|budapester studio)/.test(lower)) errors.push(`${relative}: Viko Budapest studio role unclear`);
 if(!/(same professional system|ugyanannak a szakmai rendszernek|desselben professionellen systems)/.test(lower)) errors.push(`${relative}: two-base one-company model unclear`);
}

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Stage-eight team and studio role audit passed across 12 pages and three languages.');
