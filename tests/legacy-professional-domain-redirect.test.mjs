import assert from 'node:assert/strict';
import middleware from '../middleware.js';

function verify(host, path, expectedLocation, expectedStatus = 308) {
  const request = new Request('https://' + host + path, { headers: { host } });
  const response = middleware(request);
  assert.equal(response.status, expectedStatus, host + path + ': HTTP status');
  if (expectedLocation) {
    assert.equal(response.headers.get('location'), expectedLocation, host + path + ': destination');
    assert.equal(response.headers.get('x-robots-tag'), null, 'Permanent redirects must not carry noindex');
  }
}

verify('www.norbertbanhalmi.com', '/', 'https://www.banhalmiphotography.com/');
verify('norbertbanhalmi.com', '/portrait/', 'https://www.banhalmiphotography.com/portrait/');
verify('www.norbertbanhalmi.com', '/hu/portre/?utm_source=legacy', 'https://www.banhalmiphotography.com/hu/portre/?utm_source=legacy');
verify('www.norbertbanhalmi.com', '/de-at/portrait/', 'https://www.banhalmiphotography.com/de-at/portrait/');
verify('www.norbertbanhalmi.com', '/quote/?campaign=old', 'https://www.banhalmiphotography.com/requestaquote/?campaign=old');
verify('norbertbanhalmi.com', '/trust/', 'https://www.banhalmiphotography.com/trust/');
verify('www.norbertbanhalmi.com', '/hu/trust/', 'https://www.banhalmiphotography.com/hu/bizalom/');
verify('www.norbertbanhalmi.com', '/de-at/trust/', 'https://www.banhalmiphotography.com/de-at/vertrauen/');
verify('www.banhalmi.at', '/', 'https://www.banhalmiphotography.com/de-at/');
verify('www.banhalminorbert.hu', '/', 'https://www.banhalmiphotography.com/hu/');
verify('unknown.example', '/', null, 404);
console.log('Legacy Professional 308 middleware redirect regression: passed.');
