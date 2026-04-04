# Sovereign Systems Spiral — Workspace Context

## Project Overview
**Sovereign Systems Spiral** is a multi-domain Astro 5 hub-and-spoke website for Maddie's 4-pillar health and business brand. It centralizes three distinct domains into a single codebase and deployment architecture.

- **Hub (`elevatealign.com`):** Central entry point featuring the interactive 4-pillar spiral navigation.
- **Water/Physical (`stopdrinkingacid.com`):** Documentary-first funnel, quiz, and 6 branch deep-dives.
- **Business/Financial (`eaucohub.com`):** Landing page for the professional/systems arm of the brand.

**Organ:** III (Commerce / Ergon)
**Client:** Maddie
**Studio:** ORGANVM Studio

## Tech Stack
- **Framework:** [Astro 5](https://astro.build/) (Static Site Generation)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) (using `@tailwindcss/vite`, CSS-first config)
- **Language:** TypeScript (Strict mode, no `any`)
- **Visuals:** Vanilla HTML5 Canvas for the Spiral animation (no external 3D/Canvas libs)
- **Deployment:** [Netlify](https://www.netlify.com/) (Node 22, auto-deploy on `main`)

## Core Architecture & Key Files

### Configuration & Data
- `src/data/hub.config.ts`: **Single source of truth.** Defines pillars, branches, domain mapping, and external GHL (GoHighLevel) URLs.
- `src/content.config.ts`: Defines Zod schemas for Astro Content Collections (`branches`, `pillars`).
- `netlify.toml`: Manages build settings and domain-based redirects (uncomment post-DNS).

### The Spiral Component
- `src/components/spiral/spiral.ts`: Pure Vanilla TS logic for the floating, interactive canvas spiral.
- `src/components/spiral/SpiralIsland.astro`: Astro client-side island (`client:idle`).
- `src/components/spiral/SpiralFallback.astro`: Static SVG fallback for non-JS/low-power environments.

### Content Structure
All client-editable content is managed via Markdown in `src/content/`:
- `src/content/branches/`: 6 pages (e.g., `gut-hormones.md`, `fertility.md`).
- `src/content/pillars/`: 4 pillar pages (e.g., `physical.md`, `inner.md`).

## Development Workflow

### Commands
```bash
npm run dev        # Local development server (localhost:4321)
npm run build      # Production build to dist/
npm run preview    # Local preview of the production build
```

### Conventions
1. **Surgical Updates:** When updating content, target the Markdown files in `src/content/`.
2. **Config First:** To change metadata (colors, URLs, taglines), edit `src/data/hub.config.ts`.
3. **No External Dependencies:** Avoid adding heavy 3D or animation libraries; prefer extending the existing vanilla `spiral.ts`.
4. **Tailwind 4:** Use the CSS-first configuration. No `tailwind.config.js` exists; global styles and Tailwind variables live in `src/styles/global.css`.
5. **Strict Types:** Always use TypeScript interfaces (see `hub.config.ts` for examples).

## Documentation Hierarchy
- `CLAUDE.md`: High-level summary of commands and page mapping.
- `docs/design-decisions.md`: Record of architectural and aesthetic choices.
- `docs/corpus-canon.md`: **Foundational Mandate.** Contains 263 sacred and biomedical citations backing every claim on the site. Every health claim must map back to an entry here.
- `docs/superpowers/`: Project-specific plans and specifications.

## Deployment Notes
- **Platform:** Cloudflare Pages (sovereign-systems-spiral.pages.dev)
- The site builds all routes into a single `dist/`.
- `functions/capture.ts` is a Cloudflare Pages Function for email capture.
- Custom domains are added via Cloudflare Pages dashboard → Custom Domains.
- `netlify.toml` is legacy — deployment is on Cloudflare, not Netlify.

<!-- ORGANVM:AUTO:START -->
## System Context (auto-generated — do not edit)

**Organ:** ORGAN-III (Commerce) | **Tier:** standard | **Status:** LOCAL
**Org:** `organvm-iii-ergon` | **Repo:** `sovereign-systems--elevate-align`

### Edges
- *No inter-repo edges declared in seed.yaml*

### Siblings in Commerce
`classroom-rpg-aetheria`, `gamified-coach-interface`, `trade-perpetual-future`, `fetch-familiar-friends`, `sovereign-ecosystem--real-estate-luxury`, `public-record-data-scrapper`, `search-local--happy-hour`, `multi-camera--livestream--framework`, `universal-mail--automation`, `mirror-mirror`, `the-invisible-ledger`, `enterprise-plugin`, `virgil-training-overlay`, `tab-bookmark-manager`, `a-i-chat--exporter` ... and 15 more

### Governance
- Strictly unidirectional flow: I→II→III. No dependencies on Theory (I).

*Last synced: 2026-04-04T22:32:46Z*

## Active Handoff Protocol

If `.conductor/active-handoff.md` exists, **READ IT FIRST** before doing any work.
It contains constraints, locked files, conventions, and completed work from the
originating agent. You MUST honor all constraints listed there.

If the handoff says "CROSS-VERIFICATION REQUIRED", your self-assessment will
NOT be trusted. A different agent will verify your output against these constraints.

## Session Review Protocol

At the end of each session that produces or modifies files:
1. Run `organvm session review --latest` to get a session summary
2. Check for unimplemented plans: `organvm session plans --project .`
3. Export significant sessions: `organvm session export <id> --slug <slug>`
4. Run `organvm prompts distill --dry-run` to detect uncovered operational patterns

Transcripts are on-demand (never committed):
- `organvm session transcript <id>` — conversation summary
- `organvm session transcript <id> --unabridged` — full audit trail
- `organvm session prompts <id>` — human prompts only


## System Library

Plans: 269 indexed | Chains: 5 available | SOPs: 99 active
Discover: `organvm plans search <query>` | `organvm chains list` | `organvm sop lifecycle`
Library: `meta-organvm/praxis-perpetua/library/`


## Active Directives

| Scope | Phase | Name | Description |
|-------|-------|------|-------------|
| system | any | atomic-clock | The Atomic Clock |
| system | any | execution-sequence | Execution Sequence |
| system | any | multi-agent-dispatch | Multi-Agent Dispatch |
| system | any | session-handoff-avalanche | Session Handoff Avalanche |
| system | any | system-loops | System Loops |
| system | any | prompting-standards | Prompting Standards |
| system | any | research-standards-bibliography | APPENDIX: Research Standards Bibliography |
| system | any | phase-closing-and-forward-plan | METADOC: Phase-Closing Commemoration & Forward Attack Plan |
| system | any | research-standards | METADOC: Architectural Typology & Research Standards |
| system | any | sop-ecosystem | METADOC: SOP Ecosystem — Taxonomy, Inventory & Coverage |
| system | foundation | agent-seeding-and-workforce-planning | agent-seeding-and-workforce-planning |
| system | foundation | architecture-decision-records | architecture-decision-records |
| system | any | autonomous-content-syndication | SOP: Autonomous Content Syndication (The Broadcast Protocol) |
| system | any | autopoietic-systems-diagnostics | SOP: Autopoietic Systems Diagnostics (The Mirror of Eternity) |
| system | any | background-task-resilience | background-task-resilience |
| system | any | cicd-resilience-and-recovery | SOP: CI/CD Pipeline Resilience & Recovery |
| system | any | community-event-facilitation | SOP: Community Event Facilitation (The Dialectic Crucible) |
| system | any | context-window-conservation | context-window-conservation |
| system | any | conversation-to-content-pipeline | SOP — Conversation-to-Content Pipeline |
| system | any | cross-agent-handoff | SOP: Cross-Agent Session Handoff |
| system | any | cross-channel-publishing-metrics | SOP: Cross-Channel Publishing Metrics (The Echo Protocol) |
| system | any | data-migration-and-backup | SOP: Data Migration and Backup Protocol (The Memory Vault) |
| system | any | document-audit-feature-extraction | SOP: Document Audit & Feature Extraction |
| system | any | dynamic-lens-assembly | SOP: Dynamic Lens Assembly |
| system | any | essay-publishing-and-distribution | SOP: Essay Publishing & Distribution |
| system | any | formal-methods-applied-protocols | SOP: Formal Methods Applied Protocols |
| system | any | formal-methods-master-taxonomy | SOP: Formal Methods Master Taxonomy (The Blueprint of Proof) |
| system | any | formal-methods-tla-pluscal | SOP: Formal Methods — TLA+ and PlusCal Verification (The Blueprint Verifier) |
| system | any | generative-art-deployment | SOP: Generative Art Deployment (The Gallery Protocol) |
| system | foundation | legal-compliance-matrix | legal-compliance-matrix |
| system | any | market-gap-analysis | SOP: Full-Breath Market-Gap Analysis & Defensive Parrying |
| system | any | mcp-server-fleet-management | SOP: MCP Server Fleet Management (The Server Protocol) |
| system | any | multi-agent-swarm-orchestration | SOP: Multi-Agent Swarm Orchestration (The Polymorphic Swarm) |
| system | any | network-testament-protocol | SOP: Network Testament Protocol (The Mirror Protocol) |
| system | foundation | ontological-renaming | ontological-renaming |
| system | any | open-source-licensing-and-ip | SOP: Open Source Licensing and IP (The Commons Protocol) |
| system | any | performance-interface-design | SOP: Performance Interface Design (The Stage Protocol) |
| system | any | pitch-deck-rollout | SOP: Pitch Deck Generation & Rollout |
| system | any | polymorphic-agent-testing | SOP: Polymorphic Agent Testing (The Adversarial Protocol) |
| system | any | promotion-and-state-transitions | SOP: Promotion & State Transitions |
| system | foundation | readme-and-documentation | readme-and-documentation |
| system | any | recursive-study-feedback | SOP: Recursive Study & Feedback Loop (The Ouroboros) |
| system | any | repo-onboarding-and-habitat-creation | SOP: Repo Onboarding & Habitat Creation |
| system | any | research-to-implementation-pipeline | SOP: Research-to-Implementation Pipeline (The Gold Path) |
| system | any | security-and-accessibility-audit | SOP: Security & Accessibility Audit |
| system | any | session-self-critique | session-self-critique |
| system | any | smart-contract-audit-and-legal-wrap | SOP: Smart Contract Audit and Legal Wrap (The Ledger Protocol) |
| system | any | source-evaluation-and-bibliography | SOP: Source Evaluation & Annotated Bibliography (The Refinery) |
| system | any | stranger-test-protocol | SOP: Stranger Test Protocol |
| system | any | strategic-foresight-and-futures | SOP: Strategic Foresight & Futures (The Telescope) |
| system | any | styx-pipeline-traversal | SOP: Styx Pipeline Traversal (The 7-Organ Transmutation) |
| system | any | system-dashboard-telemetry | SOP: System Dashboard Telemetry (The Panopticon Protocol) |
| system | any | the-descent-protocol | the-descent-protocol |
| system | any | the-membrane-protocol | the-membrane-protocol |
| system | any | theoretical-concept-versioning | SOP: Theoretical Concept Versioning (The Epistemic Protocol) |
| system | any | theory-to-concrete-gate | theory-to-concrete-gate |
| system | any | typological-hermeneutic-analysis | SOP: Typological & Hermeneutic Analysis (The Archaeology) |
| unknown | any | SOP-SS-ATM-001_001-atomic-decomposition | SOP-SS-ATM-001_001: Atomic Decomposition & Coverage Proof |
| unknown | any | SOP-SS-CLT-001_001-ontology_client_decisions | SOP-SS-CLT-001_001-ontology_client_decisions |
| unknown | any | SOP-SS-CNT-001_001-content-extraction-and-node-injection | SOP-SS-CNT-001_001: Content Extraction & Node Injection |
| unknown | any | SOP-SS-ISS-001-001-ontology-issue-specification | SOP-SS-ISS-001-001-ontology-issue-specification |
| unknown | any | SOP-SS-PRC-001_001-ontology_meta_process | SOP-SS-PRC-001-001-ontology-meta-process |
| unknown | any | SOP-SS-QAB-001_001-project-board-qa | SOP-SS-QAB-001_001-project-board-qa |
| unknown | any | SOP-SS-TRK-001_001-ontology_issue_tracking | SOP-SS-TRK-001_001-ontology_issue_tracking |
| unknown | any | registry | SOP Registry — Sovereign Systems |

Linked skills: api-design-patterns, cicd-resilience-and-recovery, coding-standards-enforcer, continuous-learning-agent, contract-risk-analyzer, cross-agent-handoff, evaluation-to-growth, gdpr-compliance-check, genesis-dna, multi-agent-workforce-planner, planning-and-roadmapping, promotion-and-state-transitions, quality-gate-baseline-calibration, repo-onboarding-and-habitat-creation, security-threat-modeler, structural-integrity-audit


**Prompting (Google)**: context 1M tokens (Gemini 1.5 Pro), format: markdown, thinking: thinking mode (thinkingConfig)


## Live System Variables (Ontologia)

| Variable | Value | Scope | Updated |
|----------|-------|-------|---------|
| `active_repos` | 72 | global | 2026-04-04 |
| `archived_repos` | 54 | global | 2026-04-04 |
| `ci_workflows` | 106 | global | 2026-04-04 |
| `code_files` | 0 | global | 2026-04-04 |
| `dependency_edges` | 60 | global | 2026-04-04 |
| `operational_organs` | 9 | global | 2026-04-04 |
| `published_essays` | 29 | global | 2026-04-04 |
| `repos_with_tests` | 0 | global | 2026-04-04 |
| `sprints_completed` | 33 | global | 2026-04-04 |
| `test_files` | 0 | global | 2026-04-04 |
| `total_organs` | 9 | global | 2026-04-04 |
| `total_repos` | 128 | global | 2026-04-04 |
| `total_words_formatted` | 0 | global | 2026-04-04 |
| `total_words_numeric` | 0 | global | 2026-04-04 |
| `total_words_short` | 0K+ | global | 2026-04-04 |

Metrics: 9 registered | Observations: 22704 recorded
Resolve: `organvm ontologia status` | Refresh: `organvm refresh`


## System Density (auto-generated)

AMMOI: 56% | Edges: 41 | Tensions: 33 | Clusters: 5 | Adv: 13 | Events(24h): 28152
Structure: 8 organs / 128 repos / 1654 components (depth 17) | Inference: 98% | Organs: META-ORGANVM:64%, ORGAN-I:55%, ORGAN-II:47%, ORGAN-III:55% +4 more
Last pulse: 2026-04-04T22:32:30 | Δ24h: -0.0% | Δ7d: n/a


## Dialect Identity (Trivium)

**Dialect:** EXECUTABLE_ALGORITHM | **Classical Parallel:** Arithmetic | **Translation Role:** The Engineering — proves that proofs compute

Strongest translations: I (formal), II (structural), VII (structural)

Scan: `organvm trivium scan III <OTHER>` | Matrix: `organvm trivium matrix` | Synthesize: `organvm trivium synthesize`


## Logos Documentation Layer

**Status:** MISSING | **Symmetry:** 0.5 (GHOST)

Nature demands a documentation counterpart. This formation maintains its narrative record in `docs/logos/`.

### The Tetradic Counterpart
- **[Telos (Idealized Form)](../docs/logos/telos.md)** — The dream and theoretical grounding.
- **[Pragma (Concrete State)](../docs/logos/pragma.md)** — The honest account of what exists.
- **[Praxis (Remediation Plan)](../docs/logos/praxis.md)** — The attack vectors for evolution.
- **[Receptio (Reception)](../docs/logos/receptio.md)** — The account of the constructed polis.

### Alchemical I/O
- **[Source & Transmutation](../docs/logos/alchemical-io.md)** — Narrative of inputs, process, and returns.



*Compliance: Implementation exists without record.*

<!-- ORGANVM:AUTO:END -->
