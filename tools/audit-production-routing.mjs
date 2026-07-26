const checks = [];
const failures = [];

async function request(url, options = {}) {
  const response = await fetch(url, {
    redirect: options.redirect || 'manual',
    headers: {
      'user-agent': 'BANHALMI production routing audit/1.2',
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
    for (const phrase of phrases) assert(body.includes(phrase), `${url}: live body missing required phrase: ${phrase}`);
  } catch (error) {
    failures.push(`${url}: request failed (${error.message})`);
  }
}

await checkPage('https://www.norbertbanhalmi.com/', [
  'Executive Portraiture',
  'Since 1999'
]);
await checkPage('https://www.norbertbanhalmi.com/hu/', [
  'Executive portré',
  '1999 óta'
]);
await checkPage('https://www.norbertbanhalmi.com/de-at/', [
  'Executive-Porträts',
  'Seit 1999'
]);
await checkPage('https://www.banhalmi.art/', [
  'This site is the artistic side.',
  'https://www.norbertbanhalmi.com/about/'
]);

console.log(checks.join('\n'));
if (failures.length) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join('\n'));
  process.exit(1);
}
console.log('Production routing and live content audit passed.');
