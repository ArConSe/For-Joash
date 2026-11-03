# Claude Code Configuration

## Token Budget (MANDATORY)

**Accuracy first:** never trade correctness for brevity. Verify risky changes.
Save tokens on output, reads and noise, not on reasoning or checks.

Every coding task: apply the `ponytail` skill at `full` level, always on.

- **Replies:** terse. No restating the task, no recap of the diff, no
  "here's what I did" essays. Code and a 1-2 line note on skipped/risky items.
- **Reading:** grep/glob first, then Read only the needed line range. Never
  re-read a file already in context or one just edited. Never read lockfiles,
  `node_modules`, `dist`, `.next`, build output, or minified/generated files.
- **Planning:** plan only for non-trivial features, in a few bullets. Small fixes
  go straight to code.
- **Tests:** a test for new non-trivial logic and bug fixes; none for trivial
  edits. Run only the affected test file, not the whole suite, until the end.
- **Self-review:** a quick check for secrets/`any`/debug prints, not a report.
- **Tools:** batch independent calls in parallel. No subagents unless the work
  is truly parallel or search is broad. No re-verifying edits that succeeded.
- **Diffs over rewrites:** use Edit, never rewrite whole files for small changes.
- **No unrequested extras:** no refactors, docs, comments, abstractions or
  features beyond the ask.

