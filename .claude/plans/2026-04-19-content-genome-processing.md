# Content Genome Processing Pipeline — 8 Issues

## Context

The 5-PR corrective sequence is merged and deployed. The remaining work surface for sovereign-systems--elevate-align is content processing — 8 GitHub issues (#16, #22, #24, #26-28, #31-32) covering the 1,821-atom content genome extracted from Maddie's 127-file corpus. Investigation reveals 3 of 8 are already done; 5 require execution.

**Project root:** `/Users/4jp/Workspace/organvm-iii-ergon/sovereign-systems--elevate-align/`

## Phase 0: Close 3 Already-Done Issues

These have artifacts proving completion:

| Issue | Evidence | Action |
|-------|----------|--------|
| #22 (N/A routing) | `docs/archive/na-atom-disposition.md` — all 63 atoms routed | Close with comment |
| #26 (Social content) | `docs/social-content-calendar/` — 94 pieces across 7 files (9,149 lines) | Close with comment |
| #28 (Semantic clustering) | `docs/archive/content-units.yaml` — 241 units, 1,153 SIGNAL atoms clustered | Close with comment |

## Phase 1: Merge Pass (#24) — Prerequisite for Everything

**Goal:** Add `merge_group` field to `docs/archive/atom-registry.yaml`. Reduce 1,821 atoms → ~1,000 merge groups.

**Data:** 1,821 atoms across 119 source files, 357 unique (source_file, section) combinations. Average section has 5.1 atoms.

**Script:** Create `scripts/merge-atoms.py`

**Algorithm:**
1. Parse atom-registry.yaml
2. Group atoms by (source_file, section) — baseline 357 groups
3. Within each group, sub-divide when:
   - Nature shifts (e.g., CLAIM → QUESTION → NARRATIVE = 3 sub-groups)
   - Group size exceeds 4 atoms AND there's a nature boundary
4. Assign merge_group IDs: `MG-{NNNN}`
5. Write updated registry with `merge_group` field added to each atom
6. Report: total groups, distribution, coverage

**Target:** 800–1,100 merge groups (avg 1.7–2.3 atoms per group)

**Verification:** `grep -c "merge_group:" docs/archive/atom-registry.yaml` should match atom count (1,821). Unique merge_group count in 800-1,100 range.

**Files:**
- NEW: `scripts/merge-atoms.py`
- MODIFY: `docs/archive/atom-registry.yaml` (add merge_group field to each atom entry)

## Phase 2: Editorial Review of 104 Flagged Claims (#16)

**Goal:** Disposition each flagged atom as remove / reframe / caveat / keep-with-nuance.

**Source:** `docs/archive/flagged_atoms.txt` — 104 atom IDs with idea summaries

**Flagged categories (from issue):**
- Water memory (Masaru Emoto) — pseudoscience, needs removal or heavy caveat
- Quantum metaphors (3D/5D consciousness) — Maddie's framework, keep as metaphor with caveat
- Frequency healing (Cymascope, solfeggio) — some evidence exists, reframe carefully
- Spoon bending / ESP — remove
- Biophotonics — emerging science, caveat
- Cell communication / talking to water — reframe as metaphor

**Approach:**
1. Read each flagged atom from registry (cross-reference by ID)
2. Check against `src/data/citations.ts` for supporting evidence
3. Classify into 4 categories with rationale
4. Produce `docs/archive/editorial-dispositions.md` — table with atom ID, claim, disposition, rationale, publication-safe language

**Output:** `docs/archive/editorial-dispositions.md`

## Phase 3: Research Thread Mapping (#32)

**Goal:** Map Maddie's research threads to spiral destinations.

**Threads (from issue):**
| Thread | Source Files | Spiral Destination |
|--------|-------------|-------------------|
| Alchemy + spiritual symbolism | extracted/concepts/ | Inner Sovereignty nodes |
| Cymatics + frequencies | extracted/concepts/ | Physical Sovereignty (water + vibration) |
| FDA carcinogens | extracted/health/ | Water branches (contaminant education) |
| Veblen economics | extracted/business/ | Financial Sovereignty |
| Water crystals (Emoto) | extracted/water/ | Water branches (needs editorial framing per #16) |
| Ancient calendars | extracted/time-astro/ | Astrology layer (#30, deferred) |

**Approach:**
1. Read extracted source files by category
2. Map key findings to spiral nodes and branches
3. Produce mapping document with citations

**Output:** `docs/archive/research-thread-map.md`

## Phase 4: Branch Enrichment (#27)

**Goal:** Inject PARTIAL SIGNAL atoms into branch and pillar pages.

**Existing script:** `scripts/enrich-branches.py` — reads registry, matches atoms by strike_phase 2C, injects into branch pages.

**Approach:**
1. Verify script runs without errors
2. Run script in dry-run mode to see what would be injected
3. Review output for quality
4. Apply enrichment to `src/content/branches/*.md` and `src/content/pillars/*.md`
5. Build site to verify no breakage

**Files modified:** `src/content/branches/{gut-hormones,fertility,athletic,autoimmune,cancer-support,sustainability}.md`, `src/content/pillars/{physical,inner,identity,financial}.md`

## Phase 5: Downloadable Product Extraction (#31)

**Goal:** Extract at least 3 product atoms into formatted deliverables.

**Products identified in atoms (from issue):**
1. Birth control resources guide (design specs exist: terracotta rose + glacier blue)
2. Hormone cycle ebook (outline exists, multiple drafts)
3. Gut rebuilding diet plan (grocery lists, meal plans)
4. 30-day acupressure routine (daily progression)
5. Feel Good First script (reel/video)
6. Parasite cleanse guide
7. Launch checklist

**Approach:**
1. Search registry for product-type atoms (nature: PRODUCT, TOOL, PROTOCOL)
2. Extract relevant atoms by topic
3. Format into markdown documents at `docs/products/`
4. Minimum 3 products as per issue gate

**Output:** `docs/products/{birth-control-guide,hormone-cycle-ebook,gut-rebuilding-plan}.md`

## Execution Order

```
Phase 0: Close #22, #26, #28 (instant)
Phase 1: scripts/merge-atoms.py → run → update registry (#24)
Phase 2: Read flagged atoms → editorial-dispositions.md (#16)
Phase 3: Read research threads → research-thread-map.md (#32)
Phase 4: Run enrich-branches.py → enrich branch pages (#27)
Phase 5: Extract product atoms → docs/products/ (#31)
Commit + push after each phase. Close issues as completed.
```

## Verification

After all phases:
```bash
npm run build    # Zero errors, all 29 pages generate
grep -c "merge_group:" docs/archive/atom-registry.yaml  # Should be 1821
# Count unique merge groups — should be 800-1100
python3 -c "
import yaml
with open('docs/archive/atom-registry.yaml') as f:
    data = yaml.safe_load(f)
groups = set(a.get('merge_group') for a in data['atoms'])
print(f'{len(groups)} unique merge groups')
"
```

Final board state after all phases: 5 more issues closed (total 15 closed this session), 18 remaining (all client-gated or dependency-chained).
