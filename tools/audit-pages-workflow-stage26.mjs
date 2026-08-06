import fs from 'node:fs';

const workflowFile = '.github/workflows/pages.yml';
const recoveryFile = 'docs/github-pages-recovery.md';
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};
const count = (text, value) => text.split(value).length - 1;

assert(fs.existsSync(workflowFile), `${workflowFile} is missing`);
assert(fs.existsSync(recoveryFile), `${recoveryFile} is missing`);

const workflow = fs.readFileSync(workflowFile, 'utf8');
const recovery = fs.readFileSync(recoveryFile, 'utf8');

for (const token of [
  'name: Deploy production site to GitHub Pages',
  'branches:\n      - main',
  'workflow_dispatch:',
  'contents: read',
  'pages: write',
  'id-token: write',
  'group: github-pages-production',
  'cancel-in-progress: false',
  'run: npm run audit',
  'git archive --format=tar HEAD',
  'actions/configure-pages@v5',
  'actions/upload-pages-artifact@v4',
  'path: _site',
  'actions/deploy-pages@v5',
  'timeout-minutes: 35',
  'timeout: 1800000',
  'error_count: 30',
  'reporting_interval: 5000'
]) {
  assert(workflow.includes(token), `${workflowFile}: required contract token missing: ${token}`);
}

for (const excluded of [
  '_site/.github',
  '_site/tests',
  '_site/tools',
  '_site/docs',
  '_site/package.json',
  '_site/package-lock.json',
  '_site/playwright.config.mjs'
]) {
  assert(workflow.includes(excluded), `${workflowFile}: internal artifact exclusion missing: ${excluded}`);
}

for (const requiredArtifact of [
  '_site/.nojekyll',
  '_site/CNAME',
  '_site/index.html',
  '_site/hu/index.html',
  '_site/de-at/index.html',
  '_site/robots.txt',
  '_site/sitemap.xml',
  '_site/assets/css/style.css',
  '_site/assets/js/quote-calculator.js'
]) {
  assert(workflow.includes(`test -f ${requiredArtifact}`), `${workflowFile}: artifact assertion missing: ${requiredArtifact}`);
}

assert(!/contents:\s*write/i.test(workflow), `${workflowFile}: source write permission is forbidden`);
assert(!/git\s+(push|commit)/i.test(workflow), `${workflowFile}: source mutation command is forbidden`);
assert(!/cancel-in-progress:\s*true/i.test(workflow), `${workflowFile}: active production deployment must not be cancelled by a newer run`);
assert(count(workflow, 'actions/deploy-pages@v5') === 1, `${workflowFile}: exactly one deploy-pages step is required`);
assert(workflow.includes('Symbolic links are forbidden in the Pages artifact.'), `${workflowFile}: symlink rejection is missing`);

for (const token of [
  'deployment_queued',
  'GitHub Actions',
  '30-minute',
  'Settings → Pages',
  'Source'
]) {
  assert(recovery.includes(token), `${recoveryFile}: activation or recovery guidance missing: ${token}`);
}

if (failures.length) {
  console.error(`Stage 26 custom Pages workflow audit failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Stage 26 custom GitHub Pages workflow contract passed.');
