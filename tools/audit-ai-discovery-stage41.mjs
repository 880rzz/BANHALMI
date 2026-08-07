import fs from 'node:fs';

const entry=JSON.parse(fs.readFileSync('ai-entry.json','utf8'));
const core=JSON.parse(fs.readFileSync('knowledge-core.json','utf8'));
const blog=JSON.parse(fs.readFileSync('blog-entity.jsonld','utf8'));

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
console.log('Stage 41 AI discovery audit passed: concise priority contract, canonical hierarchy and Blog/WebSite entity are aligned.');
