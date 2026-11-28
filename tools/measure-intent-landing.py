"""Compute disclosed city-service landing accuracy from GSC query/page rows.

Usage: python tools/measure-intent-landing.py query-page-export.json
The export is only read locally. Do not commit raw query rows.
"""
from pathlib import Path
from urllib.parse import urlsplit
import json,re,sys
P='https://www.banhalmiphotography.com'

patterns={
'portrait':{'en':r'executive portr|business headshot|professional cv phot|portrait photograph|headshot photograph|linkedin (?:photograph|headshot)|(?:^| )headshots?(?: |$)','de':r'führungskräfteportr|business[ -]?portr|bewerbungsfot|portraitfotograf|porträtfotograf|linkedin.fotograf','hu':r'(?:üzleti |vezetői )?portré ?fotó|portréfotózás|önéletrajz.?fot|linkedin fotó|üzleti portré'},
'brand':{'en':r'personal brand(?:ing)? photogr|visual brand photogr|brand photographer','de':r'personal brand(?:ing)? fotograf|brandfotograf|brand fotograf','hu':r'személyes márka ?fotó|brandfotózás|arculati fotózás'},
'event':{'en':r'event photograph|conference photograph|reportage photographer','de':r'eventfotograf|event fotograf|kongressfotograf|konferenzfotograf|reportagefotograf|veranstaltungsfotograf','hu':r'rendezvény ?fotózás|konferencia ?fotózás|riport ?fotózás'},
'artists':{'en':r'actor headshot|artist portrait|performer portfolio|musician portrait|casting phot','de':r'schauspieler.{0,2}(?:portr|headshot)|künstlerportr|musikerportr|castingfoto','hu':r'színészportr|castingfotó|zenészportr|táncosportf|művészportr'}}
def classify(q):
 q=q.casefold()
 if re.search(r'banhalmi|bánhalmi|norbert|boudoir|glamou?r|(?:^| )akt(?: |$)|aktfot|passfoto|wedding|hochzeit|esküvő|self.portrait|immobilien|bérlés',q):return None
 matches=[(s,l) for s,ps in patterns.items() for l,p in ps.items() if re.search(p,q)]
 # A subject-specific phrase is stronger than its generic headshot noun;
 # localized city tokens can disambiguate a standalone English industry loanword.
 if len(matches)>1 and ('artists','en') in matches and ('portrait','en') in matches:
  matches.remove(('portrait','en'))
 if matches==[('portrait','en')] and re.fullmatch(r'headshots? wien',q):return None
 city=[c for c,p in [('vienna',r'\bvienna\b|\bwien(?:er)?\b|\bbécs\w*\b'),('budapest',r'\bbudapest\w*\b')] if re.search(p,q)]
 if len(matches)==1 and len(city)==1:return (*matches[0],city[0])
def weight(rows):return sum(x['impressions'] for x in rows)
def metrics(rows,dst):
 if not rows:return dict(impressions=None,clicks=None,ctr=None,averagePosition=None,currentlyRankingUrl=None,currentlyRankingUrls=[],matchingImpressions=None,status='no_disclosed_classifiable_rows')
 n=weight(rows);c=sum(x['clicks'] for x in rows); by={}
 for x in rows:
  p=x['keys'][1].split('?')[0];by[p]=by.get(p,0)+x['impressions']
 ranked=sorted(by,key=lambda p:(-by[p],p))
 return dict(impressions=n,clicks=c,ctr=round(100*c/n,3),averagePosition=round(sum(x['position']*x['impressions'] for x in rows)/n,2),currentlyRankingUrl=ranked[0],currentlyRankingUrls=ranked,matchingImpressions=by.get(dst,0),status='measured_disclosed_rows')

def aggregate(rows, owners):
    buckets={}
    for x in rows:
        q,u=x['keys']
        if urlsplit(u).netloc!='www.banhalmiphotography.com':
            continue
        spec=classify(q)
        if spec: buckets.setdefault(spec,[]).append(x)
    out={}
    for (service,lang,market), seq in buckets.items():
        out[f'{service}.{market}.{lang}']=metrics(seq,P+owners[service][lang])
    eligible=sum(m['impressions'] for m in out.values())
    in_owner=sum(m['matchingImpressions'] for m in out.values())
    return dict(classifiedImpressions=eligible,correctLandingImpressions=in_owner,
                intentLandingAccuracy=in_owner/eligible if eligible else None,groups=out)

if __name__=='__main__':
    assert classify('portraitfotografie wien')==('portrait','de','vienna')
    assert classify('event photographer budapest')==('event','en','budapest')
    assert classify('vezetői portréfotózás Bécsben')==('portrait','hu','vienna')
    assert classify('actor headshots vienna')==('artists','en','vienna')
    assert classify('self portrait vienna') is None
    assert classify('fotós budapest') is None
    assert classify('headshots wien') is None
    assert classify('portfolio') is None
    assert classify('event photography vienna budapest') is None
    if len(sys.argv)!=2: raise SystemExit(__doc__)
    f = Path(__file__).resolve().parent.parent/'service-owner-routing.json'
    owners={o['service']:o['routes'] for o in json.loads(f.read_text())['owners']}
    owners['artists']=owners.pop('fine-art')
    result=json.loads(Path(sys.argv[1]).read_text())
    if isinstance(result,dict) and result.get('pagination',{}).get('nextOffset') is not None:
        raise SystemExit('GSC export has an unread page; aggregate all pages before scoring.')
    rows=result if isinstance(result,list) else result['rows']
    print(json.dumps(aggregate(rows,owners),ensure_ascii=False,indent=2))
