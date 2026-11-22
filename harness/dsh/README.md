# DeepSeek Harness (dsh) — AI-DLC harness row

Projects the harness-neutral `core/` tree into `dist/dsh/.dsh/` (copy channel,
`bun .dsh/tools/aidlc.ts`) and the native `dist-release/dsh/.dsh/` tree. This is
the `harness/dsh/` row for the "one core, many harnesses" port; it adds `dsh` to
`core/` so `aidlc config --harness dsh` accepts it.

## What DSH reads

- `.dsh/skills/<name>/SKILL.md` — DSH's `skill-filesystem` provider discovers
  `<project>/.dsh/skills/<name>/SKILL.md` (rank 100), so the orchestrator
  (`aidlc`) and every runner/stage/scope skill load on demand. The conductor
  shells out to `bun .dsh/tools/aidlc.ts` in the copy channel.
- `AGENTS.md` at the project root — always-on workspace guidance, the neutral
  part shared byte-identically with the other AGENTS.md-reading harnesses
  (`shared: "identical"`); the harness-specific setup lands in
  `.dsh/onboarding.md`.

## Known gap: hooks

DSH has no project-local hook/settings file the host reads the way Claude Code
reads `.claude/settings.json`. This row therefore registers **none** of
AI-DLC's flow-altering hooks (plan-approval, review-freeze, reviewer-scope,
state-transition, Stop, deliver-stage-rules). The prose bounds (approval gates,
Plan Approval, review classes, the reviewer loop) still govern a run. A later
milestone wires them through DSH's Cordis hook seams or the
`dsh-hooks-claude-code` bridge.

## Doctor

`aidlc doctor` reports **0 problems** on a dsh project: the `.dsh` arm checks
the conductor skill (`.dsh/skills/aidlc/SKILL.md`), the engine dispatcher
(`.dsh/tools/aidlc.ts`), and the root `AGENTS.md`, and states the hooks gap as
one advisory warning. Verified end to end on a simulated install.

## Known gaps (M1)

- **Tool binding** — `scripts/harness-bindings.ts` has no `dsh` heading, so a
  dsh tree ships every tool's protocol subsection in the four binding runs
  (ensemble, construction, reviewer, swarm) until a `### DeepSeek Harness`
  subsection is added to each and `BINDING_HEADINGS` gains `dsh`.
- **Hook adapter** — none authored (see the hook gap above).

## Tier projection

`tierFlavor: "copilot"` — DSH runs every agent on the session's model route
(no per-agent `model:`/`effort:` frontmatter), and Copilot's projection is the
`{ model: null }` shape that adds none. This also avoids the Claude
`settings.json` permission expansion, which a DSH tree has no file for.

## Build

```bash
bun install --frozen-lockfile
bun scripts/package.ts dsh
bun scripts/package.ts --check   # determinism gate
```
