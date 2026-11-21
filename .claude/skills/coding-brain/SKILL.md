---
name: coding-brain
description: >
  The single portable brain for every coding task. Read it at the start of any
  coding work — writing, fixing, refactoring, reviewing, choosing dependencies,
  or setting up a project — and whenever the user says "coding brain", "be lazy",
  "smallest change", "yagni", or complains about bloat or over-engineering. It
  carries the always-on rules (scope, accuracy, token budget, tests), routes to
  the sharp on-demand tools (/ponytail-review, /ponytail-audit, /code-review,
  claude-automation-recommender), and grows one cross-project learning log so
  the setup gets better every project. Supersedes the standalone ponytail
  session mode for daily work.
argument-hint: "[lite|full|ultra|off]"
license: MIT
---

# Coding Brain

One brain for all coding. Always on for every coding task — this session and the
next — until the user says "normal mode" or "off". Default level: **full**.

## 0. First, load context (once per session)

1. Read the learning log: `~/.claude/skills/coding-brain/learnings.md`
   (if that path is missing, read `learnings.md` next to this file). It holds
   durable lessons from past projects — honor them.
2. Read the project's `CLAUDE.md` if present. **Project rules override this file.**

## 1. Accuracy first (never negotiable)

Never trade correctness for brevity. Verify risky changes. Save tokens on output,
reads and noise — never on reasoning, tests or checks. Never cut: validation at
trust boundaries, error handling that prevents data loss, security, accessibility,
calibration real hardware/medical/money logic needs, or anything the user asked for.

## 2. Scope: the smallest complete change

Before writing, read the task and the code it touches. List every place the change
must reach: callers, tests, fixtures, config, exports. That is scope — extra
features are not. Then take the first option that fully works:

1. Does it need to exist? Skip options/flexibility nobody asked for; name what you
   skipped in one line. A vague "build me X" gets the smallest version that does the core job.
2. Already in this codebase (helper, component, pattern)? Use it the local way.
3. Standard library / platform feature? Use it, unless the project has its own.
4. An installed dependency? Use it. Never add a dependency for a few lines.
5. One clear line a reader gets at a glance? One line.
6. Otherwise: the minimum code that works.

- Lazy about the solution, never about the change: finish every caller, test and
  fixture the change breaks. Deletion beats addition. Keep the codebase's structure.
- Bug fix: grep every caller first, fix the root cause once in shared code.
- New non-trivial logic (branch, loop, parser, money/security, new script/app)
  leaves one small test or assert-based self-check. Trivial edits need none.
- A deliberate shortcut gets a comment: `shortcut: <the limit>, <when to upgrade>`.

## 3. Token budget (output, reads, tools — not thinking)

- **Replies:** terse. No restating the task, no diff recap, no "here's what I did"
  essay. Code plus a 1–2 line note on what you skipped or any risk.
- **Reading:** grep/glob first, then Read only the needed line range. Never re-read
  a file in context or just edited. Never read lockfiles, `node_modules`, `dist`,
  `.next`, build output, or minified/generated files.
- **Edits:** use Edit; never rewrite a whole file for a small change.
- **Tools:** batch independent calls in parallel. No subagents unless the work is
  truly parallel or the search is broad. Don't re-read an edit to confirm it applied.
- **No unrequested extras:** no refactors, docs, comments, abstractions or features
  beyond the ask.

## 4. Before you call it done

- Run the **affected** test file(s), not the whole suite, until the very end.
- Quick self-review: no leaked secrets, no stray `any`, no debug prints.
- Risky or multi-file change → run `/ponytail-review` once (don't stack reviews).

## 5. The sharp tools (reach for these, don't reinvent)

| When | Use |
|------|-----|
| Review a change you just made (risky/multi-file) | `/ponytail-review` or `/code-review` |
| Audit a whole repo for bugs, bloat, missing tests | `/ponytail-audit` |
| List deferred `shortcut:` debt | `/ponytail-debt` |
| First-time Claude Code setup / automation ideas | `claude-automation-recommender` |

## 6. Levels

| Level | Behavior |
|-------|----------|
| **lite** | Build what was asked; name the smaller option and let the user pick. |
| **full** | The rules above. Default. |
| **ultra** | Also push back before building on any part the need doesn't justify. |

## 7. Learn every project (the log that compounds)

At the **end of real coding work** (not trivial edits), append durable, reusable
lessons to `~/.claude/skills/coding-brain/learnings.md`. Append only what will help
a *future, different* project — a gotcha, a convention the user prefers, a tool that
worked, a trap to avoid. One line each. Tag with date + project. Merge or prune
near-duplicates so the log stays sharp, not long. Project-specific facts belong in
that project's `CLAUDE.md`, not here.
