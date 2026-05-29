#!/usr/bin/env node
/**
 * Build-time enumerator for the /library page.
 *
 * @astrojs/cloudflare v13 prerenders pages in workerd, which has no host
 * filesystem — so `library.astro` can't call `node:fs` at render time anymore.
 * This script runs in Node during `prebuild`, walks the catalog declared in
 * `src/lib/docs-library.ts`, and writes the file listing to
 * `src/data/library-manifest.json`, which the page imports as plain data.
 *
 * Imports the `.ts` catalog directly via Node's native type-stripping (Node ≥22.18).
 */
import {
  readdirSync,
  statSync,
  existsSync,
  writeFileSync,
  mkdirSync,
} from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, basename, extname } from 'node:path';
import { LIBRARY } from '../src/lib/docs-library.ts';

const repoRoot = process.cwd();
const DEFAULT_EXTS = ['.md', '.html', '.pdf', '.json', '.txt'];

/**
 * Last-modified date for a path, sourced from git (committer date of the most
 * recent commit touching it) so the value is deterministic across checkouts.
 * Filesystem mtime is NOT version-controlled — `git checkout` stamps every file
 * with the current wall-clock time, which made the committed manifest churn on
 * every build and rendered the displayed dates meaningless. Falls back to fs
 * mtime only for files not yet committed (new/untracked) or when git is absent.
 */
function lastModifiedIso(relPath, st) {
  try {
    const out = execFileSync(
      'git',
      ['log', '-1', '--format=%cI', '--', relPath],
      { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim();
    // Normalize to UTC 'Z' so dates sort chronologically by lexical compare
    // regardless of the committer's timezone (and match the prior fs-mtime format).
    if (out) return new Date(out).toISOString();
  } catch {
    // git unavailable or path untracked — fall through to fs mtime
  }
  return st.mtime.toISOString();
}

function discoverFiles(entry) {
  const absRoot = join(repoRoot, entry.path);
  if (!existsSync(absRoot)) return [];

  if (entry.kind === 'single-file') {
    const st = statSync(absRoot);
    return [
      {
        name: basename(entry.path),
        relPath: entry.path,
        ext: extname(entry.path).toLowerCase(),
        sizeBytes: st.size,
        mtimeIso: lastModifiedIso(entry.path, st),
        isDir: false,
      },
    ];
  }

  const exts = entry.exts ?? DEFAULT_EXTS;
  const out = [];
  for (const child of readdirSync(absRoot)) {
    if (child.startsWith('.')) continue;
    const abs = join(absRoot, child);
    const relPath = join(entry.path, child);
    const st = statSync(abs);
    if (st.isDirectory()) {
      out.push({
        name: child,
        relPath,
        ext: '',
        sizeBytes: 0,
        mtimeIso: lastModifiedIso(relPath, st),
        isDir: true,
      });
      continue;
    }
    const ext = extname(child).toLowerCase();
    if (exts.length && !exts.includes(ext)) continue;
    out.push({
      name: child,
      relPath,
      ext,
      sizeBytes: st.size,
      mtimeIso: lastModifiedIso(relPath, st),
      isDir: false,
    });
  }
  // Newest first; relPath tiebreaker makes order independent of readdir order.
  out.sort(
    (a, b) =>
      b.mtimeIso.localeCompare(a.mtimeIso) ||
      a.relPath.localeCompare(b.relPath),
  );
  return out;
}

const manifest = {};
for (const entry of LIBRARY) {
  const all = discoverFiles(entry);
  const max = entry.maxShown ?? 30;
  manifest[entry.slug] = {
    files: all.slice(0, max),
    total: all.length,
    shown: Math.min(max, all.length),
  };
}

mkdirSync('src/data', { recursive: true });
writeFileSync(
  'src/data/library-manifest.json',
  JSON.stringify(manifest, null, 2) + '\n',
);
console.log(
  `[prebuild] Generated src/data/library-manifest.json (${Object.keys(manifest).length} entries)`,
);
