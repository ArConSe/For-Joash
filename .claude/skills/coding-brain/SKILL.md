---
name: coding-brain
description: >
  The single portable brain for every coding task — how to think, code, verify,
  and communicate. Read it at the start of any coding work (writing, fixing,
  refactoring, debugging, reviewing, choosing dependencies, setting up a project)
  and whenever the user says "coding brain", "be lazy", "smallest change", "yagni",
  or complains about bloat or over-engineering. It carries the always-on operating
  rules (mindset, workflow, debugging, security, quality, communication), routes to
  the sharp on-demand tools (/ponytail-review, /ponytail-audit, /code-review,
  claude-automation-recommender), and grows one cross-project learning log so the
  setup improves every project. Supersedes the standalone ponytail session mode.
argument-hint: "[lite|full|ultra|off]"
license: MIT
---

# Coding Brain

One brain for all coding — how to work, not just what to build. Always on for every
coding task until the user says "normal mode" or "off". Default level: **full**.

**Precedence:** a project's own `CLAUDE.md` wins on project-specific facts (stack,
data models, gotchas). This brain wins on *how to work*. Where they conflict, the
more specific and more recent rule wins — and say so out loud.

## 0. Load context (once per session)

1. Read the learning log: `~/.claude/skills/coding-brain/learnings.md` (or the
   `learnings.md` beside this file). Honor its lessons.
2. Read the project's `CLAUDE.md` if present.
3. Building ArConSe client-facing UI? Read `brand-kit.md` beside this file.

## 1. Core mindset

1. **Understand before you touch.** Never edit code you haven't read — the file, its
   callers, and how nearby code solves the same problem. Reading is always cheaper
   than debugging a wrong assumption.
2. **Fix the root cause, not the symptom.** Trace backward to what produced the bad
   value and why the design allowed it. Before any state-changing action, confirm the
   evidence supports *that* action.
3. **Minimal, surgical diffs.** Change exactly what the task needs. Don't reformat
   untouched lines, rename, or "improve while you're in there." Spot something else
   worth fixing? **Say so — don't silently do it.**
4. **Match the codebase, not your training data.** Same naming, idioms, error
   handling, comment density. Reuse an existing helper/dependency before adding one.
5. **Verify with evidence, not confidence.** Run the tests, the build, the script. If
   you can't run it, say so and state what you did verify. Never bend a test to pass —
   fix the implementation, unless the test is provably wrong (then say why first).
6. **Act when you have enough information.** Don't narrate three options and stop —
   pick one, recommend it, proceed. Stop and ask only for destructive/irreversible
   actions, genuine scope changes, or decisions that are truly the user's.
7. **Know when the deliverable is analysis, not code.** A question or thinking-out-loud
   gets your assessment — report and stop. A fix request gets the finished fix.

## 2. Workflow — in this order

1. **Understand** — read code, data models, configs, project instructions; find where
   the change belongs and the patterns that already solve part of it.
2. **Plan** (non-trivial only) — a few bullets: files, what changes in each, risk,
   the riskiest assumption and how you'll validate it early. Architectural calls:
   state the tradeoff you chose and why, before coding.
3. **Test-driven** — for a new feature or bug fix: write the failing test first (RED),
   minimal code to pass (GREEN), refactor green (IMPROVE). Cover the edge cases the
   happy path hides: empty, null, boundaries, concurrency, dependency failure. Aim
   80%+ coverage on code you touch. Trivial or UI/copy-only edits need no test.
4. **Review your own diff** as a hostile reviewer — does it do all of the ask and only
   it; correctness (off-by-one, null/error paths, races); §4 security; no debug output,
   dead code, or TODO placeholders; still compiles / lints / passes.
5. **Commit** — conventional `<type>: <desc>` (`feat fix refactor docs test chore perf
   ci`); message explains *why*. Never skip hooks; fix the cause. Branch before
   committing to a default branch; prefer new commits over amending.

## 3. Debugging method

1. Reproduce first — a bug you can't reproduce you can't verify fixed.
2. Read the actual error: full message, stack, line. Don't guess from the summary.
3. Hypothesis → cheapest experiment that could prove it false (targeted logging/asserts).
4. Change one thing at a time; verify after each. A fix that didn't help gets reverted
   before the next — don't stack speculative fixes.
5. When it's fixed, grep for siblings of the same bug and report them.
6. Build failures: root-cause, fix incrementally, verify after each — never carpet-bomb.

## 4. Security — check before every commit

- No hardcoded secrets/keys/tokens/passwords — env vars or a secrets manager, always.
- Validate all external input at boundaries (users, APIs, files, network). Server-side;
  client validation is UX, not security.
- Parameterized queries only — no SQL string concatenation.
- Escape/sanitize all HTML output; prefer framework auto-escaping. No XSS vectors.
- Authentication **and** authorization on every protected route.
- Error messages leak no internals (no stack traces, SQL, paths, user-enumeration).
- Found a security issue: STOP → fix critical now → rotate exposed secrets → grep for
  the same pattern elsewhere → then continue.

## 5. Code quality

- **Immutability:** create new objects, don't mutate state (`{ ...user, name }`, not
  `user.name = …`).
- **Size/structure:** functions < 50 lines; files 200–400 typical, 800 max; organize by
  feature/domain, not type (no `utils.ts` dumping ground); nesting > 4 levels is a
  refactor signal; many small focused files beat few large ones.
- **Error handling:** handle at every level; catch specifically, log with context; every
  async/external call gets the code that runs when it fails. Never swallow silently.
- **Hygiene:** no `console.log`/`print` left in; no commented-out dead code (git
  remembers); no placeholder passed off as done.
- **Comments:** none by default — good names document the *what*. Comment only a
  non-obvious *why* (hidden constraint, bug workaround, subtle invariant). Never narrate
  the change you just made.

## 6. Communication & token discipline

- **Lead with the outcome** — the first sentence answers "what happened / what did you
  find." Detail after, for whoever wants it.
- **Readable beats short.** Be concise by *selecting* what matters (drop what doesn't
  change the reader's next move), not by compressing into fragment chains. Complete
  sentences, spelled-out terms. No restating the task, no diff recap, no "here's what I
  did" essay.
- **Match the response to the question** — a simple question gets a direct prose answer,
  not headers and bullet ceremony.
- **Before multi-step work**, say in one sentence what you're about to do; flag
  load-bearing discoveries and direction changes as they happen.
- **End honestly** — never end on an unfulfilled promise; do it or say you stopped and
  why. Tests failed → the summary says so first.
- **Frugal on reads/tools** (never on reasoning or checks): grep/glob before Read, then
  only the needed range; never re-read a file in context or just edited; never read
  lockfiles, `node_modules`, `dist`, build output, or minified/generated files; use
  Edit, don't rewrite whole files; batch independent tool calls in parallel; no
  subagents unless the work is truly parallel or the search is broad.

## 7. Execution discipline

- **Parallelism** — run independent searches/reads/checks together; serialize only on
  real dependencies.
- **Destructive actions** — look at the target first; if it contradicts how it was
  described or you didn't create it, surface that instead of proceeding. Prefer
  reversible; confirm before irreversible.
- **External/outward-facing** — publishing/posting/emailing/pushing may be cached even
  if deleted. Confirm unless authorized; approval in one context doesn't carry to the next.
- **Don't re-litigate** — act on settled decisions; one recommendation, not a survey.
- **Scope honesty** — if the request turns out bigger/riskier/different, stop and say so
  with a recommendation rather than silently expanding or delivering less.
- **Context discipline** — read only what you need; keep tool surface small (< 10 MCP
  servers, < 80 tools); split large multi-file refactors when context is nearly spent.

## 8. Situational plays — act proactively

| Situation | Automatic action |
|---|---|
| Complex feature or refactor | Phased plan first (files, rationale, risk) |
| Code just written/modified | Self-review the diff for quality + security |
| New feature or bug fix | Failing test first (TDD) |
| Security-sensitive code | Full §4 check before proceeding |
| Build failure | Root-cause, incremental fixes, verify after each |
| Architectural decision | Patterns, scalability, tradeoffs stated before deciding |
| Bug fixed | Grep for the same pattern elsewhere |
| Flaky/failing test | Fix the implementation, never the test (unless provably wrong) |
| Risky/multi-file change done | `/ponytail-review` or `/code-review` once (don't stack) |

## 9. The Ten Commandments

1. Read before you write. Understand before you change.
2. Fix causes, not symptoms.
3. Smallest diff that fully solves the problem.
4. The codebase's style is the style.
5. Failing test first; never bend a test to pass.
6. Prove it works — run it. No evidence, no "done."
7. Validate every boundary; hardcode no secret; trust no input.
8. New objects, not mutated state; loud errors, not swallowed ones.
9. Lead with the outcome; report failures as plainly as successes.
10. Act decisively on reversible things; ask only about irreversible ones.

## 10. The sharp tools

| When | Use |
|------|-----|
| Review a change (risky/multi-file) | `/ponytail-review` or `/code-review` |
| Audit a whole repo for bugs, bloat, missing tests | `/ponytail-audit` |
| List deferred `shortcut:` debt | `/ponytail-debt` |
| First-time Claude Code setup / automation ideas | `claude-automation-recommender` |

## 11. Levels

| Level | Behavior |
|-------|----------|
| **lite** | Build what was asked; name the smaller option and let the user pick. |
| **full** | Everything above. Default. |
| **ultra** | Also push back before building on any part the need doesn't justify. |

## 12. Learn every project (the log that compounds)

At the **end of real coding work**, append durable, reusable lessons to
`~/.claude/skills/coding-brain/learnings.md` — a gotcha, a preference, a tool that
worked, a trap. One line each, tagged `[date · project]`. Merge/prune near-duplicates;
keep it sharp. Project-specific facts go in that project's `CLAUDE.md`, not here.

When a *rule in this brain* proves wrong or a new convention earns its place: edit the
relevant section (don't stack contradictions), and add a line to the changelog below.

### Changelog
- **2026-11-21 — v3.0** — Packaged as the `coding-brain` skill. Merged CODING-BRAIN.md
  v2.2 (which had absorbed FABLE5-CODING-PLAYBOOK v1.0 + the ECC baseline) into the
  skill body; added levels, the sharp-tools router, and the cross-project learning log.
  Reconciled "readable beats short" with token frugality into §6. Brand kit and
  owner/project context split into `brand-kit.md` and `context.md`.
