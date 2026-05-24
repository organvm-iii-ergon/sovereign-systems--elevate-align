#!/usr/bin/env node
/**
 * vacuum-gate.mjs — Content Vacuum Gate
 *
 * Constitutional Axiom #1: "N/A is a vacuum — never a resting state."
 *
 * Scans for empty config values and placeholder URLs. Each known vacuum
 * MUST have a named GitHub issue tracking it. The gate fails the build
 * when an UNTRACKED vacuum is detected — i.e. when the system encounters
 * an N/A that is not yet logged as work.
 *
 * Tracking source of truth: GitHub Issues (organvm-iii-ergon/sovereign-systems--elevate-align).
 * The `.config/board.config.json` file is project-board metadata only —
 * issues themselves live in the GH API, not in that JSON.
 *
 * Allow-list rather than live `gh` query: deterministic, no network on test,
 * and the allow-list is explicit context for every reader of the gate.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = dirname(fileURLToPath(import.meta.url));

/**
 * Each entry maps a vacuum-key (the field path) to the GH issue tracking it.
 * When a scan detects a vacuum whose key matches an entry here, it is TRACKED.
 * When a scan detects a vacuum NOT in this map, the gate fails.
 *
 * To resolve a tracked vacuum: populate the value AND remove the entry below.
 * To declare a new vacuum: add an entry with a real GH issue reference.
 */
const TRACKED_VACUUMS = {
  'hub.config.ts → ghl.quizFormUrl':
    'GH#58 (Maddie pending — hub assessment funnel)',
  'hydration.config.ts → filterTiers.anespa.affiliateUrl':
    'GH#49 (Maddie pending — affiliate links)',
  'hydration.config.ts → filterTiers.k8.affiliateUrl':
    'GH#49 (Maddie pending — affiliate links)',
};

function read(path) {
  return readFileSync(join(repoRoot, '..', path), 'utf8');
}

const vacuums = [];

function flag(field, value) {
  const ref = TRACKED_VACUUMS[field];
  vacuums.push({ field, value, tracked: Boolean(ref), ref: ref ?? null });
}

// --- hub.config.ts: quizFormUrl ---
const hubConfig = read('src/data/hub.config.ts');
if (/quizFormUrl:\s*''/.test(hubConfig)) {
  flag('hub.config.ts → ghl.quizFormUrl', "''");
}

// --- hydration.config.ts: empty affiliateUrl per filter tier ---
const hydrationConfig = read('src/data/hydration.config.ts');
const filterEntries = [
  ...hydrationConfig.matchAll(
    /\{\s*id:\s*'([^']+)'[\s\S]*?affiliateUrl:\s*'([^']*)'[\s\S]*?\}/g,
  ),
];
for (const match of filterEntries) {
  const id = match[1];
  const url = match[2];
  if (!url) {
    flag(`hydration.config.ts → filterTiers.${id}.affiliateUrl`, "''");
  }
}

// --- content frontmatter: empty required fields ---
function checkContentVacuums(dir, requiredFields) {
  const files = readdirSync(join(repoRoot, '..', dir)).filter((f) =>
    f.endsWith('.md'),
  );
  for (const file of files) {
    const source = read(`${dir}/${file}`);
    const fm = source.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) continue;
    for (const field of requiredFields) {
      const re = new RegExp(`^${field}:\\s*['"]?['"]?\\s*$`, 'm');
      if (re.test(fm[1])) {
        flag(`${dir}/${file} → ${field}`, 'empty');
      }
    }
  }
}

// Field names must match the content-collection schema (content.config.ts):
// pillars use `title`/`tagline`; branches use `title`/`hook`.
checkContentVacuums('src/content/pillars', ['title', 'tagline']);
checkContentVacuums('src/content/branches', ['title', 'hook']);

// --- Report ---
console.log('\n=== Content Vacuum Gate ===\n');

if (vacuums.length === 0) {
  console.log('✓ No content vacuums found.\n');
  process.exit(0);
}

let untracked = 0;
for (const v of vacuums) {
  const status = v.tracked ? `TRACKED — ${v.ref}` : 'UNTRACKED';
  const icon = v.tracked ? '✓' : '✗';
  console.log(`${icon} ${v.field}: ${v.value} [${status}]`);
  if (!v.tracked) untracked++;
}

console.log('');

if (untracked > 0) {
  console.error(`✗ ${untracked} untracked vacuum(s) found.`);
  console.error(
    '  File a GH issue with label "vacuum" and add an entry to TRACKED_VACUUMS in this file.',
  );
  console.error('  Axiom #1: N/A is a vacuum — never a resting state.\n');
  process.exit(1);
}

console.log(`✓ All ${vacuums.length} vacuum(s) tracked in TRACKED_VACUUMS.\n`);
process.exit(0);
