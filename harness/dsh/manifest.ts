// harness/dsh/manifest.ts — the DeepSeek Harness (DSH) distribution row.
//
// One core, N harnesses: project the harness-neutral core/ tree into
// dist/dsh/.dsh/. DSH is a Claude-shaped skill host: it discovers
// <project>/.dsh/skills/<name>/SKILL.md through its skill-filesystem provider
// and reads AGENTS.md as workspace guidance. The conductor shells out to the
// engine in .dsh/tools/ (copy channel: `bun .dsh/tools/aidlc.ts`).
//
// Hook gap (documented, per the porting guide): DSH has no project-local
// hook/settings file the host reads the way Claude Code reads
// .claude/settings.json, so the flow-altering hooks (plan-approval,
// review-freeze, reviewer-scope, state-transition, Stop, deliver-stage-rules)
// are not registered by this row. The prose bounds still govern; a later
// milestone wires them through DSH's hook seams.

import type { HarnessManifest } from "../../scripts/manifest-types.ts";
import onboardingFills from "./onboarding.fills.ts";

const manifest: HarnessManifest = {
  name: "dsh",
  productName: "DeepSeek Harness",
  // No slash command: the person starts a run by describing the work, and the
  // conductor loads on demand.
  configNextStep:
    'describe the work in a DeepSeek Harness session ("用 aidlc 建一个 …") or load the aidlc skill',
  harnessDir: ".dsh",
  orchestratorSkillPath: ".dsh/skills/aidlc/SKILL.md",
  // DSH is a "no model policy on the agent file" host (every agent runs on the
  // session's model route), so reuse the copilot tier projection: `{ model:
  // null }`, no model/effort frontmatter added. This also avoids the Claude
  // settings.json permission expansion, which a DSH tree has no file for.
  tierFlavor: "copilot",
  coreDirs: [
    { src: "tools", dst: "tools" },
    { src: "aidlc-common", dst: "aidlc-common" },
    { src: "knowledge", dst: "knowledge" },
    { src: "sensors", dst: "sensors" },
    { src: "scopes", dst: "scopes" },
    { src: "agents", dst: "agents" },
    { src: "hooks", dst: "hooks" },
    { src: "skills/aidlc-session-cost", dst: "skills/aidlc-session-cost" },
    { src: "skills/aidlc-replay", dst: "skills/aidlc-replay" },
    { src: "skills/aidlc-outcomes-pack", dst: "skills/aidlc-outcomes-pack" },
    { src: "skills/aidlc-issue-report", dst: "skills/aidlc-issue-report" },
    { src: "skills/aidlc-knowledge", dst: "skills/aidlc-knowledge" },
  ],
  harnessFiles: [
    { src: "skills/aidlc/SKILL.md", dst: "skills/aidlc/SKILL.md" },
    { src: "skills/aidlc/question-rendering.md", dst: "skills/aidlc/question-rendering.md" },
    { src: "skills/aidlc/composer.md", dst: "skills/aidlc/composer.md" },
    { src: "skills/aidlc/tables.md", dst: "skills/aidlc/tables.md" },
  ],
  // DSH reads AGENTS.md at the project root as always-on workspace guidance.
  // The root file stays the byte-identical neutral part (shared with the other
  // AGENTS.md-reading harnesses); the harness-specific setup lands in
  // .dsh/onboarding.md.
  onboarding: { dst: "AGENTS.md", projectRoot: true, harnessDst: "onboarding.md", fills: onboardingFills },
  rulesRename: null,
  rootIntegrations: [
    { path: "AGENTS.md", policy: "managed-block", marker: "agents", shared: "identical" },
  ],
  emit: null,
};

export default manifest;
