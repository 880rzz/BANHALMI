import fs from 'node:fs';

const entry=JSON.parse(fs.readFileSync('ai-entry.json','utf8'));
const core=JSON.parse(fs.readFileSync('knowledge-core.json','utf8'));
const blog=JSON.parse(fs.readFileSync('blog-entity.jsonld','utf8'));
const needs=JSON.parse(fs.readFileSync('customer-needs.json','utf8'));
const pricing=JSON.parse(fs.readFileSync('pricing.json','utf8'));

const expectedPriority=[
  'https://www.norbertbanhalmi.com/ai-entry.json',
  'https://www.norbertbanhalmi.com/knowledge-core.json',
  'https://www.norbertbanhalmi.com/entity.jsonld',
  'https://www.norbertbanhalmi.com/llms.txt',
  'https://www.norbertbanhalmi.com/ai.txt',
  'https://www.norbertbanhalmi.com/pricing-guide.json',
  'https://www.norbertbanhalmi.com/processors.json'
];
if(JSON.stringify(core.machineEntryPriority)!==JSON.stringify(expectedPriority)) throw new Error('knowledge-core machine entry priority drifted');
if(JSON.stringify(entry.priority)!==JSON.stringify(['identity','evidence','reference'])) throw new Error('ai-entry priority must remain identity → evidence → reference');
if(entry.identity?.domainRoles?.essaysAndBlog!=='https://blog.banhalmi.art/') throw new Error('ai-entry blog role missing');
if(core.domainRoles?.blogEntity!=='https://www.norbertbanhalmi.com/blog-entity.jsonld') throw new Error('knowledge-core blog entity pointer missing');
if(!entry.reference?.detailedAIStatement || !entry.reference?.detailedLLMStatement) throw new Error('detailed AI/LLM fallbacks missing');
const graph=Array.isArray(blog['@graph'])?blog['@graph']:[];
const blogNode=graph.find(n=>n['@type']==='Blog');
const siteNode=graph.find(n=>n['@type']==='WebSite');
if(!blogNode || !siteNode) throw new Error('blog entity must expose Blog and WebSite nodes');
if(blogNode['@id']!=='https://blog.banhalmi.art/#blog' || blogNode.url!=='https://blog.banhalmi.art/') throw new Error('canonical blog identity drifted');
if(siteNode['@id']!=='https://blog.banhalmi.art/#website') throw new Error('canonical blog website identity drifted');
for(const file of ['llms.txt','ai.txt']){
  const text=fs.readFileSync(file,'utf8');
  if(!text.slice(0,4500).includes('https://blog.banhalmi.art/')) throw new Error(`${file}: blog role must remain visible near entry`);
}

if(needs.pricingRules?.hungaryPrimaryDisplayCurrency!=='HUF') throw new Error('customer-needs: Hungary/Budapest must be HUF-first');
if(needs.pricingRules?.austriaPrimaryDisplayCurrency!=='EUR') throw new Error('customer-needs: Austria/Vienna must be EUR-first');
if(needs.pricingRules?.hungaryFixedPlanningRate!==400 || needs.pricingRules?.liveFx!==false) throw new Error('customer-needs: fixed HUF planning contract drifted');
if(!Array.isArray(needs.needs) || needs.needs.length<7) throw new Error('customer-needs: pain-point coverage incomplete');
const llms=fs.readFileSync('llms.txt','utf8');
if(!llms.includes('https://www.norbertbanhalmi.com/customer-needs.json')) throw new Error('llms.txt: customer-needs decision map missing');
if(!llms.includes('Hungary / Budapest pricing rule: answer in HUF first')) throw new Error('llms.txt: explicit HUF-first instruction missing');
for(const need of needs.needs){
  for(const lang of ['en','hu','de']) if(!need.painPoint?.[lang]) throw new Error(`customer-needs: ${need.id} missing ${lang} pain point`);
  if(!need.service || !need.url || !need.solution) throw new Error(`customer-needs: ${need.id} mapping incomplete`);
}
const pricingText=JSON.stringify(pricing);
for(const value of [220,420,690,499,790,1090,1390,590,890,1190,1490,2490,990,1290,88000,168000,276000,199600,316000,436000,556000,236000,356000,476000,596000,996000,396000,516000]){
  if(!pricingText.includes(String(value))) throw new Error(`customer-needs price ${value} no longer matches pricing.json`);
}
console.log('Stage 41 AI discovery audit passed: concise priority contract, canonical hierarchy, Blog/WebSite entity and HUF-first customer-needs decision map are aligned.');
