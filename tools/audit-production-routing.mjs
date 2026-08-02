const checks = [];
const failures = [];

async function request(url, options = {}) {
  const response = await fetch(url, {
    redirect: options.redirect || 'manual',
    headers: {
      'user-agent': 'BANHALMI production routing audit/2.0',
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
    const { response, body } = await request(`${url}${url.includes('?') ? '&' : '?'}audit=${Date.now()}`, { redirect: 'follow' });
    checks.push(`${url} -> ${response.status}`);
    assert(response.ok, `${url}: expected 2xx, received ${response.status}`);

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

await checkPage('https://www.norbertbanhalmi.com/', {
  all: ['Executive Portraiture', 'Since 1999']
});
await checkPage('https://www.norbertbanhalmi.com/hu/', {
  all: ['Executive portré', '1999 óta']
});
await checkPage('https://www.norbertbanhalmi.com/de-at/', {
  all: ['Executive-Porträts', 'Seit 1999']
});

// The archive wording is editorial and may evolve. Its production contract is
// therefore verified through stable identity, canonical and role signals — not
// by freezing one historic marketing sentence into CI.
await checkPage('https://www.banhalmi.art/', {
  all: [
    'https://www.banhalmi.art/norbert-banhalmi#person',
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

console.log(checks.join('\n'));
if (failures.length) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join('\n'));
  process.exit(1);
}
console.log('Production routing and semantic live-content audit passed.');
