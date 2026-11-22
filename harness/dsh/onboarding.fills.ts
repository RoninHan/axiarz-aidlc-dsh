// harness/dsh/onboarding.fills.ts — DeepSeek Harness's onboarding-doc fills.
// The packager renders onboarding-harness.md (filled here) plus neutral
// onboarding into dist/dsh/AGENTS.md, then substitutes {{HARNESS_DIR}}.

import type { OnboardingFills } from "../../scripts/onboarding.ts";

const fills: OnboardingFills = {
  invoke: "用 aidlc",
  slots: {
    title_block: `# AI-DLC

Your project's name, notes and rules go in \`aidlc/spaces/default/memory/project.md\`. Every AI tool in this project reads it.

This project uses AI-DLC (AI-Driven Development Life Cycle) for structured development. The workspace shell ships in \`.dsh/\` (no setup command) and its conductor is discovered as the \`aidlc\` skill. Describe what you want to build and it sets up the workflow for you. Say "用 aidlc" followed by a scope or project description to begin. The engine runs through \`bun .dsh/tools/aidlc.ts\`; it also accepts \`--doctor\`, \`--version\`, \`--stage <slug>\`, \`--phase <name>\`, \`--depth <level>\`, \`--test-strategy <level>\`, \`--review <class>\`, and \`compose "<task>"\` as arguments to its \`engine orchestrate\` route.`,

    prereq_bullets: `- **Runtime**: Framework commands run through \`{{INVOKE}}\`. The copy channel needs Bun on PATH; keep the engine directory and its runtime available.
- **Model provider**: DeepSeek Harness keeps your existing model route; the shipped shell does not select one.
- **MCP servers (optional)**: configure MCP in DeepSeek Harness's own settings; this shell declares none.`,

    prereq_bullets_tail: `- **Settings**: DeepSeek Harness applies its own permission presets; AI-DLC does not add any.
- **Hooks (gap)**: this row does not register AI-DLC's flow-altering hooks; they are documented as a gap for a later milestone. The prose bounds (approval gates, plan approval, review classes) still govern the run.`,

    hook_permissions_note: `This DSH row runs no project hooks; nothing needs approving for hooks. Approve the tool calls DeepSeek Harness asks about as your own project's policy allows.`,

    agents_note: `Each is a flat \`.md\` file prefixed \`aidlc-<role>-agent.md\` under \`.dsh/agents/\`; the \`aidlc\` session takes on each expert role itself where the stage calls for it, and delegates the four dispatched stages (2.1 pipeline, 2.2 subagent, 2.4 mob, 3.5 subagent), reviewer passes, and composer requests to DeepSeek Harness subagents.`,

    structure_extra: "",

    sections_before_resumption: `## AI-DLC Method (layered)

The AI-DLC method — the layered practice files (\`org.md\`, \`team.md\`, \`project.md\`, and the per-phase \`phases/<phase>.md\`) — is authored once at the workspace root under \`aidlc/spaces/<active-space>/memory/\`. Edit the active space's memory files; they are the single hand-editable source of truth, identical on every harness.`,

    sections_after_resumption: `## Local settings

DeepSeek Harness keeps its own per-machine settings; AI-DLC's engine state and artifacts live under \`aidlc/\`.`,
  },
};

export default fills;
