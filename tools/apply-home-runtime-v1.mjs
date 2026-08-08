import fs from 'node:fs';
const pages=['index.html','hu/index.html','de-at/index.html'];
const oldRef='/assets/js/main.js?v=20260808-mobile100-v2';
const newRef='/assets/js/home-runtime.js?v=20260808-home-runtime-v1';
for(const page of pages){
  let html=fs.readFileSync(page,'utf8');
  if(!html.includes(oldRef)&&!html.includes(newRef))throw new Error(`${page}: expected main runtime reference missing`);
  html=html.replace(oldRef,newRef);
  if(!html.includes(newRef))throw new Error(`${page}: homepage runtime replacement failed`);
  if(html.includes(oldRef))throw new Error(`${page}: heavyweight homepage runtime still present`);
  fs.writeFileSync(page,html);
}
console.log('Applied lean homepage runtime to EN/HU/DE.');
