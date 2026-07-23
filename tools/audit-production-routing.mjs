const checks = [];
const failures = [];

async function request(url, options = {}) {
  const response = await fetch(url, {
    redirect: options.redirect || 'manual',
    headers: {
      'user-agent': 'BANHALMI production routing audit/1.0',
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

async function checkPage(url, phrases) {
  try {
    const { response, body } = await request(`${url}${url.includes('?') ? '&' : '?'}audit=${Date.now()}`, { redirect: 'follow' });
    checks.push(`${url} -> ${response.status}`);
    assert(response.ok, `${url}: expected 2xx, received ${response.status}`);
    for (const phrase of phrases) {
      assert(body.includes(phrase), `${url}: live body missing required phrase: ${phrase}`);
    }
  } catch (error) {
    failures.push(`${url}: request failed (${error.message})`);
  }
}

async function checkRedirect(url, expectedTargetPrefix) {
  try {
    const { response } = await request(`${url}${url.includes('?') ? '&' : '?'}audit=${Date.now()}`, { redirect: 'manual', readBody: false });
    const location = response.headers.get('location') || '';
    checks.push(`${url} -> ${response.status} ${location}`);
    assert([301, 302, 307, 308].includes(response.status), `${url}: expected HTTP redirect, received ${response.status}`);
    const absolute = location ? new URL(location, url).href : '';
    assert(absolute.startsWith(expectedTargetPrefix), `${url}: expected target beginning ${expectedTargetPrefix}, received ${absolute || '(none)'}`);
  } catch (error) {
    failures.push(`${url}: request failed (${error.message})`);
  }
}

await checkPage('https://www.norbertbanhalmi.com/', [
  'Visual Trust Strategy',
  'We build visual trust before the meeting begins.'
]);
await checkPage('https://www.norbertbanhalmi.com/hu/', [
  'Vizuális bizalomstratégia',
  'Vizuális bizalmat építünk már az első találkozás előtt.'
]);
await checkPage('https://www.norbertbanhalmi.com/de-at/', [
  'Strategie für visuelles Vertrauen',
  'Wir schaffen visuelles Vertrauen vor der ersten Begegnung.'
]);
await checkPage('https://www.banhalmi.art/', [
  'This site is the artistic side.',
  'https://www.norbertbanhalmi.com/about/'
]);

await checkRedirect('https://banhalmi.at/', 'https://www.norbertbanhalmi.com/de-at/');
await checkRedirect('https://www.banhalmi.at/', 'https://www.norbertbanhalmi.com/de-at/');
await checkRedirect('https://banhalminorbert.hu/', 'https://www.norbertbanhalmi.com/hu/');
await checkRedirect('https://www.banhalminorbert.hu/', 'https://www.norbertbanhalmi.com/hu/');

console.log(checks.join('\n'));
if (failures.length) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join('\n'));
  process.exit(1);
}
console.log('Production routing and live content audit passed.');
