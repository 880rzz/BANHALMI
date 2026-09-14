import fs from 'node:fs';

const failures=[];
const authority=JSON.parse(fs.readFileSync('data/design-authority.json','utf8'));
const audit=fs.readFileSync('tools/audit-all-pages-design.mjs','utf8');
const restore=fs.readFileSync('tools/restore-production-design-authority.mjs','utf8');
const must=(ok,msg)=>{if(!ok)failures.push(msg)};

must(Number(authority.pageMaxPx)===1280,'BANHALMI canonical standard canvas must remain 1280px');
must(Number(authority.structuredMaxPx)===1440,'BANHALMI canonical structured canvas must remain 1440px');
must(Number(authority.responsive?.touchTargetPx)===44,'BANHALMI canonical touch target must remain 44px');
must(Number(authority.layout?.documentFlow?.footerMaxViewportFractionOnTabletDesktop)===0.85,'BANHALMI oversized-footer threshold must remain canonical');
must(Number(authority.layout?.footer?.desktopColumns)===6,'BANHALMI desktop footer must remain six-column compact geometry');
must(Number(authority.layout?.footer?.compactDesktopColumns)===4,'BANHALMI compact desktop footer must remain four-column geometry');
must(Number(authority.layout?.footer?.tabletColumns)===3,'BANHALMI tablet footer must remain three-column geometry');
must(Number(authority.layout?.footer?.mobileColumns)===1,'BANHALMI mobile footer must remain single-column geometry');
must(authority.navigation?.activeState==='text-only','BANHALMI active navigation must remain text-only');
must(authority.navigation?.activeFill==='none'&&authority.navigation?.activeBorder==='none'&&authority.navigation?.activeBoxShadow==='none','BANHALMI active navigation may not regain box styling');
must(authority.principles?.historicalScreenshotRegressionsAreReleaseBlocking===true,'historical screenshot regressions must stay release-blocking');
must(audit.includes('320,360,375,390,412,430,768,820,1024,1280,1366,1440,1920,2560,3840'),'responsive release matrix must cover 320px through 4K');
must(audit.includes('active navigation is boxed'),'boxed active-navigation browser guard missing');
must(audit.includes('footer occupies'),'oversized footer browser guard missing');
must(audit.includes('document horizontal overflow'),'horizontal overflow browser guard missing');
must(audit.includes('touch target'),'touch-target browser guard missing');
must(audit.includes("fs.readFileSync('data/design-authority.json','utf8')"),'design audit must read canonical authority');
must(restore.includes('data/design-authority.json'),'production compiler must read canonical design authority');
must(restore.includes('html body .site-header a{min-height:${touch}px!important'),'production compiler lost 44px header-link closure');
must(restore.includes('background:transparent!important;border:0!important;box-shadow:none!important;border-radius:${Number(nav.activeRadiusPx||0)}px!important'),'production compiler lost text-only active-navigation closure');
must(restore.includes('Canonical responsive footer geometry'),'production compiler lost canonical footer root-cause closure');
must(restore.includes('footer.desktopColumns||6'),'production compiler lost desktop footer column authority');
must(restore.includes('footer.compactDesktopColumns||4'),'production compiler lost compact desktop footer authority');
must(restore.includes('footer.tabletColumns||3'),'production compiler lost tablet footer authority');
must(!audit.includes('pageMaxPx=1200'),'stale 1200px canvas may not return to exhaustive audit');
must(!audit.includes('pageMaxPx=1500'),'stale 1500px canvas may not return to exhaustive audit');

if(failures.length){console.error(`BANHALMI historical design regression guard failed (${failures.length}):`);for(const f of failures)console.error(`- ${f}`);process.exit(1)}
console.log('BANHALMI historical design regression guard passed: canonical canvases, compiled 44px controls, text-only active navigation, compact responsive footer and overflow protections are locked through 4K.');
