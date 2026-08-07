const checks = [];
const failures = [];

async function request(url, options = {}) {
  const response = await fetch(url, {
    redirect: options.redirect || 'manual',
    headers: {
      'user-agent': 'BANHALMI production routing audit/3.0',
      'cache-control': 'no-cache',
      pragma: 'no-cache'
    },
    signal: AbortSignal.timeout(20000)
  });
  const body = options.readBody === false ? '' : await response.text();
  return { response, body };
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

async function checkPage(url, expectations = {}) {
  try {
    const separator = url.includes('?') ? '&' : '?';
    const { response, body } = await request(`${url}${separator}audit=${Date.now()}`, { redirect: 'follow' });
    checks.push(`${url} -> ${response.status} ${response.url}`);
    assert(response.ok, `${url}: expected 2xx, received ${response.status}`);

    if (expectations.finalUrl) {
      assert(response.url.startsWith(expectations.finalUrl), `${url}: expected final URL beginning ${expectations.finalUrl}, received ${response.url}`);
    }

    for (const phrase of expectations.all || []) {
      assert(body.includes(phrase), `${url}: live body missing required phrase: ${phrase}`);
    }

    for (const group of expectations.any || []) {
      assert(
        group.some((phrase) => body.includes(phrase)),
        `${url}: live body contains none of the accepted role markers: ${group.join(' | ')}`
      );
    }

    for (const { pattern, label } of expectations.patterns || []) {
      assert(pattern.test(body), `${url}: live body missing ${label}`);
    }
  } catch (error) {
    failures.push(`${url}: request failed (${error.message})`);
  }
}

async function checkRedirect(url, expectedTarget) {
  try {
    const separator = url.includes('?') ? '&' : '?';
    const { response } = await request(`${url}${separator}audit=${Date.now()}`, { redirect: 'manual', readBody: false });
    const location = response.headers.get('location') || '';
    const absolute = location ? new URL(location, url).href : '';
    checks.push(`${url} -> ${response.status} ${location}`);
    assert([301, 302, 307, 308].includes(response.status), `${url}: expected HTTP redirect, received ${response.status}`);
    assert(absolute.startsWith(expectedTarget), `${url}: expected target beginning ${expectedTarget}, received ${absolute || '(none)'}`);
  } catch (error) {
    failures.push(`${url}: redirect check failed (${error.message})`);
  }
}

await checkPage('https://www.norbertbanhalmi.com/', {
  all: ['Executive Portraiture', 'Since 1999'],
  finalUrl: 'https://www.norbertbanhalmi.com/'
});
await checkPage('https://www.norbertbanhalmi.com/hu/', {
  all: ['Executive portré', '1999 óta'],
  finalUrl: 'https://www.norbertbanhalmi.com/hu/'
});
await checkPage('https://www.norbertbanhalmi.com/de-at/', {
  all: ['Executive-Porträts', 'Seit 1999'],
  finalUrl: 'https://www.norbertbanhalmi.com/de-at/'
});

for (const [alias, target] of [
  ['https://banhalmi.at/', 'https://www.norbertbanhalmi.com/de-at/'],
  ['https://www.banhalmi.at/', 'https://www.norbertbanhalmi.com/de-at/'],
  ['https://banhalminorbert.hu/', 'https://www.norbertbanhalmi.com/hu/'],
  ['https://www.banhalminorbert.hu/', 'https://www.norbertbanhalmi.com/hu/']
]) {
  await checkRedirect(alias, target);
}

await checkPage('https://www.norbertbanhalmi.com/robots.txt', {
  all: ['User-agent: *', 'Allow: /', 'Sitemap: https://www.norbertbanhalmi.com/sitemap.xml']
});
await checkPage('https://www.norbertbanhalmi.com/sitemap.xml', {
  all: ['<urlset', '<loc>https://www.norbertbanhalmi.com/', '<lastmod>']
});
await checkPage('https://www.norbertbanhalmi.com/llms.txt', {
  all: [
    '# BANHALMI',
    '## Canonical identity and answer contract',
    'https://www.banhalmi.art/',
    'https://blog.banhalmi.art/',
    'New York is not presented as a studio or operational base'
  ]
});
await checkPage('https://www.norbertbanhalmi.com/ai.txt', {
  all: [
    '## Canonical identity and answer contract',
    'https://www.norbertbanhalmi.com/',
    'https://www.banhalmi.art/',
    'https://blog.banhalmi.art/',
    'New York is not a studio, office, headquarters or operational base'
  ]
});

// The archive wording is editorial and may evolve. Its production contract is
// verified through stable identity, canonical and role signals rather than one
// frozen marketing sentence.
await checkPage('https://www.banhalmi.art/', {
  all: [
    'https://www.norbertbanhalmi.com/about/',
    'https://www.norbertbanhalmi.com/'
  ],
  any: [
    ['Official Art Archive', 'official archive', 'artistic oeuvre', 'art archive']
  ],
  patterns: [
    {
      pattern: /<link\b[^>]*rel=["']canonical["'][^>]*href=["']https:\/\/www\.banhalmi\.art\/?["'][^>]*>/i,
      label: 'the canonical banhalmi.art homepage declaration'
    },
    {
      pattern: /<html\b[^>]*lang=["']en(?:-[A-Z]{2})?["']/i,
      label: 'the English language declaration'
    }
  ]
});

await checkPage('https://blog.banhalmi.art/blog', {
  finalUrl: 'https://blog.banhalmi.art/blog'
});

console.log(checks.join('\n'));
if (failures.length) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join('\n'));
  process.exit(1);
}
console.log('Production routing, alias, machine-entry and ecosystem live audit passed.');
