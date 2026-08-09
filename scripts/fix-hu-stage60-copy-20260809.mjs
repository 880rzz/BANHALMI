import { readFile, writeFile } from 'node:fs/promises';
const p='hu/portre/index.html';
let s=await readFile(p,'utf8');
s=s.replace('Az executive portré és headshot fotózás középpontjában továbbra is a C-level vezetők, igazgatósági tagok, sajtó-, PR- és LinkedIn-megjelenések állnak.','A vezetői portréfotózás középpontjában továbbra is a felsővezetők, igazgatósági tagok, valamint a sajtó-, PR- és LinkedIn-megjelenések állnak.');
await writeFile(p,s);
