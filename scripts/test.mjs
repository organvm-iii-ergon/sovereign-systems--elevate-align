#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));

function read(path) {
  return readFileSync(join(repoRoot, path), 'utf8');
}

function listFiles(path) {
  return readdirSync(join(repoRoot, path)).filter((name) => !name.startsWith('.')).sort();
}

function frontmatter(path) {
  const source = read(path);
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(match, `${path} has frontmatter`);
  const data = {};
  for (const line of match[1].split('\n')) {
    const entry = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!entry) continue;
    data[entry[1]] = entry[2].replace(/^["']|["']$/g, '');
  }
  return data;
}

function sliceBetween(source, start, end) {
  const startIndex = source.indexOf(start);
  assert.notEqual(startIndex, -1, `found ${start}`);
  const endIndex = source.indexOf(end, startIndex);
  assert.notEqual(endIndex, -1, `found ${end}`);
  return source.slice(startIndex, endIndex);
}

function slugsFromBlock(block) {
  return [...block.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]).sort();
}

function assertDeepEqualSet(actual, expected, label) {
  assert.deepEqual([...actual].sort(), [...expected].sort(), label);
}

const hubConfig = read('src/data/hub.config.ts');
const pillarsBlock = sliceBetween(hubConfig, 'pillars: [', 'nodes: [');
const nodesBlock = sliceBetween(hubConfig, 'nodes: [', 'branches: [');
const branchesBlock = sliceBetween(hubConfig, 'branches: [', 'domains: {');

const pillarSlugs = slugsFromBlock(pillarsBlock);
const branchSlugs = slugsFromBlock(branchesBlock);
const pillarFiles = listFiles('src/content/pillars').map((name) => name.replace(/\.md$/, ''));
const branchFiles = listFiles('src/content/branches').map((name) => name.replace(/\.md$/, ''));

assertDeepEqualSet(pillarSlugs, pillarFiles, 'pillar config and content files stay in sync');
assertDeepEqualSet(branchSlugs, branchFiles, 'branch config and content files stay in sync');

for (const file of listFiles('src/content/pillars')) {
  const data = frontmatter(`src/content/pillars/${file}`);
  assert.equal(data.status, 'live', `${file} is not a public placeholder`);
}

for (const file of listFiles('src/content/branches')) {
  const data = frontmatter(`src/content/branches/${file}`);
  assert.equal(data.status, 'live', `${file} is not a public placeholder`);
}

const nodeEntries = [...nodesBlock.matchAll(/\{\s*id:\s*(\d+),[\s\S]*?themes:\s*\[([^\]]+)\][\s\S]*?\}/g)];
assert.equal(nodeEntries.length, 13, '13 spiral nodes are configured');
assert.deepEqual(
  nodeEntries.map((match) => Number(match[1])),
  Array.from({ length: 13 }, (_, index) => index + 1),
  'spiral node IDs are contiguous 1..13',
);

for (const match of nodeEntries) {
  const id = Number(match[1]);
  const themes = [...match[2].matchAll(/'([^']+)'/g)].map((theme) => theme[1]);
  assert.equal(themes.length, 3, `node ${id} has exactly three quiz themes`);
}

const envVars = [...nodesBlock.matchAll(/envVar:\s*'([^']+)'/g)].map((match) => match[1]);
assert.equal(new Set(envVars).size, 13, 'each spiral node has a unique EnvVar');

const quizPage = read('src/pages/quiz.astro');
assert.match(quizPage, /status:\s*n\.status/, 'quiz serializes node status to the browser');
assert.match(quizPage, /status:\s*'live'\s*\|\s*'locked'/, 'quiz client contract types node status');
assert.match(quizPage, /fetch\('\/capture'/, 'quiz capture posts to the local capture endpoint');

const quizEmbed = read('src/components/QuizEmbed.astro');
assert.match(quizEmbed, /href="\/quiz"/, 'water quiz fallback links to the local assessment');
assert.doesNotMatch(quizEmbed, /quiz-waitlist-form/, 'water quiz fallback is not a waitlist stub');

const captureRoute = read('src/pages/capture.ts');
assert.match(captureRoute, /EMAIL_RE\.test\(email\)/, 'capture validates email syntax');
assert.match(captureRoute, /quizNodeId >= 1 && data\.quizNodeId <= 13/, 'capture bounds quiz node IDs');
assert.match(captureRoute, /Promise\.all\(/, 'capture dispatches sinks without serial blocking');

const citations = JSON.parse(read('public/citations.json'));
assert.ok(Object.keys(citations).length > 0, 'generated citation JSON is parseable and nonempty');

const manifestDir = join(repoRoot, 'docs/manifests');
const manifestJson = readdirSync(manifestDir)
  .filter((name) => name.endsWith('-project-manifest-annotated-bibliography.json'))
  .sort()
  .at(-1);
assert.ok(manifestJson, 'annotated bibliography JSON manifest exists');
const manifest = JSON.parse(read(`docs/manifests/${manifestJson}`));
assert.ok(Array.isArray(manifest) && manifest.length > 0, 'annotated bibliography JSON parses');
assert.ok(manifest.every((entry) => entry.uid && entry.path && entry.thread_id && entry.annotation), 'manifest entries carry required bibliography fields');

const manifestMd = manifestJson.replace(/\.json$/, '.md');
const manifestMdPath = join(manifestDir, manifestMd);
assert.ok(statSync(manifestMdPath).isFile(), 'annotated bibliography Markdown manifest exists');
assert.equal(read(`docs/manifests/${manifestMd}`).includes('\0'), false, 'Markdown manifest is searchable text');

// --- Content Vacuum Gate ---
const { execSync } = await import('node:child_process');
try {
  execSync('node scripts/vacuum-gate.mjs', { cwd: repoRoot, stdio: 'pipe' });
  console.log('ok - content vacuum gate passed');
} catch (err) {
  console.error(err.stdout?.toString() || err.message);
  process.exit(1);
}

console.log(`ok - ${nodeEntries.length} nodes, ${pillarSlugs.length} pillars, ${branchSlugs.length} branches, ${manifest.length} manifest entries`);
