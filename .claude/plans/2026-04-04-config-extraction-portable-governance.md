# Config Extraction — Make Board Governance Scripts Portable

**Date:** 2026-04-04
**Context:** The three governance scripts (`transition-issue.sh`, `sync-tracking-table.sh`, `audit-board.sh`) work but have ~60 lines of hardcoded IDs (field IDs, option IDs, project ID, org name) welded to this specific project instance. The user's principle: "the work must exist outside the instance of creation so it can be a process refined and repeated."

**Goal:** Extract all instance-specific values into `board.config.json`. Scripts read from config. New project = new config file, same scripts.

---

## What Gets Extracted

All hardcoded values in the three scripts move to one config file:

```json
{
  "owner": "organvm-iii-ergon",
  "repo": "organvm-iii-ergon/sovereign-systems--elevate-align",
  "project_num": 5,
  "project_id": "PVT_kwDODwtKPs4BTOQo",
  "audit_log": "docs/audit/transitions.log",
  "fields": {
    "status":         { "id": "PVTSSF_...", "options": { "GATED": "b385...", ... } },
    "phase":          { "id": "PVTSSF_...", "options": { "α": "9bb1...", ... } },
    "issue_type":     { "id": "PVTSSF_...", "options": { "DECISION": "fea6...", ... } },
    "gate_met":       { "id": "PVTSSF_...", "options": { "Yes": "d040...", "No": "aed6..." } },
    "priority":       { "id": "PVTSSF_...", "options": { "P0-blocker": "7f04...", ... } },
    "next_action":    { "id": "PVTF_..." },
    "external_party": { "id": "PVTF_..." }
  },
  "transitions": {
    "GATED":  ["SPEC"],
    "SPEC":   ["WIP"],
    "WIP":    ["DONE"],
    "DONE":   ["CLOSED", "WIP"],
    "CLOSED": []
  }
}
```

## Files to Modify

| File | Change |
|------|--------|
| `board.config.json` | **CREATE** — all instance-specific IDs and rules |
| `scripts/transition-issue.sh` | Remove ~50 lines of hardcoded IDs, add config loader |
| `scripts/sync-tracking-table.sh` | Remove hardcoded owner/project_num, read from config |
| `scripts/audit-board.sh` | Remove hardcoded owner/project_num/audit_log, read from config |

## Config Loading Pattern

Each script starts with:
```bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG="${BOARD_CONFIG:-${SCRIPT_DIR}/../board.config.json}"

if [[ ! -f "$CONFIG" ]]; then
  echo "ERROR: board.config.json not found. Expected at: $CONFIG" >&2
  exit 1
fi

# Read values via python (jq not guaranteed on all systems)
OWNER=$(python3 -c "import json; print(json.load(open('$CONFIG'))['owner'])")
PROJECT_NUM=$(python3 -c "import json; print(json.load(open('$CONFIG'))['project_num'])")
# ... etc
```

The `BOARD_CONFIG` env var allows override — so the same scripts can be pointed at a different project's config.

## Portability Model

```
scripts/                    ← THE PROCESS (portable, same everywhere)
  transition-issue.sh
  sync-tracking-table.sh
  audit-board.sh

board.config.json           ← THE INSTANCE (unique per project)
```

To stand up governance for a new project:
1. Copy `board.config.json`
2. Run `gh project field-list <N> --owner <org> --format json` to get field IDs
3. Fill the config
4. Scripts work immediately

## Verification

- [ ] `bash scripts/transition-issue.sh 22 --field "Next Action" --value "test" --reason "config test"` works
- [ ] `bash scripts/sync-tracking-table.sh` produces same output as before
- [ ] `bash scripts/audit-board.sh` produces same output as before
- [ ] `BOARD_CONFIG=/dev/null bash scripts/transition-issue.sh 1 --status WIP --reason "x"` fails with config error
- [ ] No hardcoded IDs remain in any script (grep for `PVTSSF_\|PVTF_\|PVT_kw`)
