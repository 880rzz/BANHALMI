import fs from 'node:fs';

const file='assets/css/style.css';
let css=fs.readFileSync(file,'utf8');
const matches=css.match(/^\s*-webkit-\s*$/gm)||[];
if(!matches.length){console.log('No standalone vendor-prefix fragments found.');process.exit(0);}
css=css.replace(/^\s*-webkit-\s*\n?/gm,'');
fs.writeFileSync(file,css);
console.log(`Removed ${matches.length} standalone -webkit- CSS fragments from style.css.`);
