const targets = [
  'https://www.norbertbanhalmi.com/',
  'https://www.norbertbanhalmi.com/hu/',
  'https://www.norbertbanhalmi.com/de-at/'
];

const thresholds = {
  LARGEST_CONTENTFUL_PAINT_MS: 2500,
  INTERACTION_TO_NEXT_PAINT: 200,
  CUMULATIVE_LAYOUT_SHIFT_SCORE: 0.1
};

const key = process.env.PAGESPEED_API_KEY || '';
let measured = 0;
const failures = [];

for (const target of targets) {
  const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  endpoint.searchParams.set('url', target);
  endpoint.searchParams.set('strategy', 'mobile');
  endpoint.searchParams.append('category', 'performance');
  if (key) endpoint.searchParams.set('key', key);
  const response = await fetch(endpoint, { headers: { accept: 'application/json' } });
  if ([403, 429].includes(response.status)) {
    console.warn(`PSI unavailable for ${target}: HTTP ${response.status}. Configure PAGESPEED_API_KEY for stable quota.`);
    continue;
  }
  if (!response.ok) throw new Error(`PSI request failed for ${target}: HTTP ${response.status}`);
  const data = await response.json();
  const field = data.loadingExperience?.metrics || data.originLoadingExperience?.metrics || {};
  const values = {
    LARGEST_CONTENTFUL_PAINT_MS: Number(field.LARGEST_CONTENTFUL_PAINT_MS?.percentile ?? NaN),
    INTERACTION_TO_NEXT_PAINT: Number(field.INTERACTION_TO_NEXT_PAINT?.percentile ?? NaN),
    CUMULATIVE_LAYOUT_SHIFT_SCORE: Number(field.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile ?? NaN) / 100
  };
  const available = Object.entries(values).filter(([, value]) => Number.isFinite(value));
  if (!available.length) {
    console.log(`PSI/CrUX: ${target} has insufficient field data; Lighthouse lab gate remains authoritative in CI.`);
    continue;
  }
  measured++;
  console.log(`PSI/CrUX mobile p75 ${target}: ${available.map(([name, value]) => `${name}=${value}`).join(', ')}`);
  for (const [name, value] of available) if (value > thresholds[name]) failures.push(`${target}: ${name} ${value} exceeds good threshold ${thresholds[name]}`);
}

if (!measured) console.log('No URL had sufficient CrUX field data in this run.');
if (failures.length) {
  console.error('\nCore Web Vitals field gate failed:');
  for (const failure of failures) console.error(`✗ ${failure}`);
  process.exit(1);
}
console.log('PSI/CrUX field monitor passed for every metric with sufficient data.');
