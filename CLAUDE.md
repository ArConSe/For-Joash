# Claude Code Configuration

## Coding standard: one brain, always on

Every coding task runs under the **`coding-brain`** skill (default level `full`).
It owns the universal rules — scope (smallest complete change), accuracy-first,
token budget, tests, review routing, and the cross-project learning log — so they
are not repeated here. Read it at session start; it in turn reads this file, and
**the project-specific rules below override it**.

Sync: `coding-brain` is maintained globally at `~/.claude/skills/coding-brain/`
and copied into `.claude/skills/coding-brain/` here. On a new project, copy the
global skill in. Update the global master; re-copy to propagate.

## NurseCalc (medication calculator): accuracy is non-negotiable

Project-specific, overrides the brain's "smallest change":

- Any change to dose, unit, rate or formula logic (`nursecalc/src/lib`,
  `nursecalc/src/data`, `catalog.js`) needs a test in `nursecalc/tests/` and a
  passing `cd nursecalc && npx vitest run` before it is called done.
- Cross-check formulas against `nursecalc/NurseCalc_Formula_and_Drug_Reference.md`.
- UI/copy-only edits: no test needed.
