/**
 * Safety-first read-only follow-up of exactly 37 English Wix pages that
 * returned HTTP 429 in an over-eager 555-URL CI viewport sweep.
 * Chromium at 390px, one visitor/context at a time, 2.5s between URLs.
 * HTTP 429 is a platform throttle (not a missing article/schema) and causes
 * an immediate cooldown and at most one retry, then fail-closed abort.
 * No consent interaction, tag injection, post mutation or GSC resubmission.
 */
import fs from 'node:fs';
import path from 'node:path';
import {chromium, devices} from 'playwright';

const fixture=JSON.parse(fs.readFileSync('tools/fixtures/wix-20261123-english-429-retest.json','utf8'));
const urls=fixture.urls||[];
if(urls.length!==37 || new Set(urls).size!==37 ||
   !urls.every(x=>x.startsWith('https://blog.banhalmi.art/en/post/')))
  throw new Error('Unexpected 37-URL scoped English recheck inventory');
const output='artifacts/wix-37-throttle-recheck';
fs.mkdirSync(output,{recursive:true});
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const comparable=u=>{
  try{const p=new URL(u);return p.origin+p.pathname.replace(/\/+$/,'');}
  catch{return null;}
};
const browser=await chromium.launch({headless:true});
const records=[];
let aborted=false;
try {
  for(const [i,url] of urls.entries()) {
    const context=await browser.newContext({...devices['iPhone 13'],viewport:{width:390,height:844}});
    const page=await context.newPage();
    const result={url,width:390,status:null,finalUrl:null,title:null,h1:false,canonical:null,overflow:null,
      issue:null,throttled:false,retried:false,screenshot:null};
    try {
      for(let attempt=0;attempt<2;attempt++) {
        const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:40000});
        result.status=response?.status()??0;
        result.finalUrl=page.url();
        if(result.status===429){
          result.throttled=true;
          if(attempt===0){
            result.retried=true;
            console.warn('WIX-429-COOLDOWN: '+url+' (pause 20s, retry only once)');
            await sleep(20000);
            continue;
          }
          result.issue='HTTP 429 again; abort further requests to protect live Wix';
          aborted=true;
          break;
        }
        if([502,503,504].includes(result.status)&&attempt===0){
          await sleep(5000);
          continue;
        }
        if(result.status!==200){result.issue='HTTP '+result.status;break;}
        await page.waitForTimeout(1450);
        const p=await page.evaluate(()=>{
          const visible=el=>{
            const r=el.getBoundingClientRect(),style=getComputedStyle(el);
            return r.height>0&&r.width>0&&style.visibility!=='hidden'&&style.display!=='none';
          };
          return {
            title:document.title||null,
            h1:[...document.querySelectorAll('h1')].some(visible),
            canonical:document.querySelector('link[rel="canonical"]')?.href||null,
            overflow:Math.max(document.documentElement.scrollWidth,document.body?.scrollWidth||0)-innerWidth
          };
        });
        Object.assign(result,p);
        if(!result.title?.trim()||!result.h1||comparable(result.canonical)!==comparable(url) ||result.overflow>24){
          result.issue='Rendered issue: title='+Boolean(result.title?.trim())+
            ', H1='+result.h1+', canonical='+result.canonical+', overflow='+result.overflow;
        }
        break;
      }
      if(result.issue||i%8===0){
        const name='en-scoped-'+String(i).padStart(2,'0')+'.png';
        result.screenshot=name;
        await page.screenshot({path:path.join(output,name),fullPage:false,timeout:10000}).catch(()=>{result.screenshot=null;});
      }
    } catch(error){result.issue=String(error?.message||error).slice(0,260);}
    finally{await context.close();records.push(result);}
    if(result.issue)console.error('WIX-RECHECK-FAIL '+JSON.stringify(result));
    if(aborted)break;
    if((i+1)%8===0)console.log('WIX-RECHECK-PROGRESS '+(i+1)+'/'+urls.length);
    await sleep(2500);
  }
} finally {await browser.close();}
const success=records.filter(x=>x.status===200&&!x.issue).length;
const failures=records.filter(x=>x.issue).length;
const summary={tested:records.length,expected:37,success,failures,abortedFor429:aborted,
  untested:37-records.length,generatedAt:new Date().toISOString()};
fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({summary,sourceRun:fixture.sourceRun,records},null,2)+'\n');
console.log('WIX-37-RATE-SAFE '+JSON.stringify(summary));
if(aborted || success!==37 || failures)process.exitCode=1;
