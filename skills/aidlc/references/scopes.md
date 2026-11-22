# Scopes (workflow profiles), depth, and test strategy

A **scope** = which stages run (the EXECUTE/SKIP grid) + default depth + default
test strategy + review cap + ceremony defaults. The human picks a profile, or
describes the work and the conductor proposes one (or offers the adaptive
composer); nothing runs until they confirm.

## The 11 profiles

| Profile | Best for | Stages (after setup) | Depth | Test strategy |
|---|---|---|---|---|
| classic | V1-style Inception + Construction, minimal ceremony | 15 | standard | standard |
| express | lightest requirements→code→test (+ conditional deploy tail) | 7 | minimal | minimal |
| feature | production feature, full lifecycle | 30 | standard | standard |
| enterprise | regulated/high-assurance, full traceability | 30 | comprehensive | comprehensive |
| mvp | first real product increment, no Operation | 20 | standard | standard |
| poc | prove feasibility fast | 5 | minimal | minimal |
| bugfix | known defect + regression test | 6 | minimal | minimal |
| refactor | restructure without behavior change | 7 | minimal | minimal |
| infra | environments / IaC / deployment / cost | 12 | standard | standard |
| security-patch | CVE / focused vulnerability response | 7 | minimal | minimal |
| workshop | facilitated training, full lifecycle | 23 | standard | minimal |

Stage counts are static; conditional stages may still self-skip (e.g. Reverse
Engineering on greenfield). `classic` is the implicit default.

## Stage-by-scope matrix (✓ = EXECUTE)

| # | Stage | enterprise | feature | mvp | poc | bugfix | refactor | infra | sec-patch | classic | workshop | express |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.1–0.3 | Initialization | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 1.1 | Intent Capture & Framing | ✓ | ✓ | ✓ | ✓ | | | | | | | |
| 1.2 | Market Research | ✓ | ✓ | | | | | | | | | |
| 1.3 | Feasibility & Constraints | ✓ | ✓ | ✓ | | | | | | | | |
| 1.4 | Scope Definition | ✓ | ✓ | ✓ | | | | | | | | |
| 1.5 | Team Formation | ✓ | ✓ | | | | | | | | | |
| 1.6 | Rough Mockups | ✓ | ✓ | ✓ | | | | | | | | |
| 1.7 | Approval & Handoff | ✓ | ✓ | | | | | | | | | |
| 2.1 | Reverse Engineering | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | | ✓ | ✓ | ✓ | ✓ |
| 2.2 | Practices Discovery | ✓ | ✓ | ✓ | | | | ✓ | | ✓ | ✓ | |
| 2.3 | Requirements Analysis | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 2.4 | User Stories | ✓ | ✓ | ✓ | | | | | | ✓ | ✓ | |
| 2.5 | Refined Mockups | ✓ | ✓ | ✓ | | | | | | ✓ | ✓ | |
| 2.6 | Domain Design | ✓ | ✓ | ✓ | | | | | | ✓ | ✓ | |
| 2.7 | Units Generation | ✓ | ✓ | ✓ | | | | | | ✓ | ✓ | |
| 2.8 | Contract Design | ✓ | ✓ | ✓ | | | | | | ✓ | ✓ | |
| 2.9 | Delivery Planning | ✓ | ✓ | ✓ | | | | | | ✓ | ✓ | |
| 3.1 | Functional Design | ✓ | ✓ | ✓ | | | ✓ | | | ✓ | ✓ | |
| 3.2 | NFR Requirements | ✓ | ✓ | ✓ | | | | ✓ | ✓ | ✓ | ✓ | |
| 3.3 | NFR Design | ✓ | ✓ | ✓ | | | | ✓ | | ✓ | ✓ | |
| 3.4 | Infrastructure Design | ✓ | ✓ | ✓ | | | | ✓ | | ✓ | ✓ | |
| 3.5 | Code Generation | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 3.6 | Build and Test | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 3.7 | CI Pipeline | ✓ | ✓ | ✓ | | | | ✓ | | | ✓ | |
| 4.1 | Deployment Pipeline | ✓ | ✓ | | | ✓ | ✓ | ✓ | ✓ | | ✓ | ✓ |
| 4.2 | Environment Provisioning | ✓ | ✓ | | | | | ✓ | | | ✓ | |
| 4.3 | Deployment Execution | ✓ | ✓ | | | ✓ | ✓ | ✓ | ✓ | | ✓ | ✓ |
| 4.4 | Observability Setup | ✓ | ✓ | | | | | ✓ | | | ✓ | ✓ |
| 4.5 | Incident Response | ✓ | ✓ | | | | | | | | ✓ | |
| 4.6 | Performance Validation | ✓ | ✓ | | | | | | | | ✓ | |
| 4.7 | Feedback & Optimization | ✓ | ✓ | | | | | | | | ✓ | |

## Depth (artifact detail)

| Depth | Artifacts |
|---|---|
| minimal | 1–2 page docs, key decisions only, skip optional sections |
| standard | complete artifacts, all required sections, concise rationale |
| comprehensive | expanded artifacts, optional sections, detailed justification, compliance cross-references |

## Test strategy (test volume — independent of depth)

| Strategy | Volume |
|---|---|
| minimal | Nyquist: 1 test per requirement, happy-path floor per component, ~5–15 tests total |
| standard | 5–8 tests per component, unit + integration, ~75/20/5 pyramid |
| comprehensive | 10–15 tests per component, all types (unit/integration/E2E/perf/security) |

## The adaptive composer

When no profile obviously fits, or the human asks (`compose "…"`), dispatch the
composer persona (see `references/agents.md`) as a subagent. It estimates five
implementation-entropy components — intent ambiguity, structural uncertainty,
verification entropy, risk, unresolved assumptions — and proposes a minimum
viable EXECUTE/SKIP grid: a short offer in plain words naming the plan, its
stage count and approval questions, its Guard Policy and scope settings, with
every EXECUTE/SKIP justified. The human approves, edits, or rejects; nothing is
written before approval. A composed plan applies only to that piece of work
(unless the human asks to save it as a reusable scope).

## Overrides (mid-run, in the human's own words)

Depth (`--depth minimal|standard|comprehensive`), test strategy
(`--test-strategy …`), review cap (`--review adversarial|advisory|none`),
sensors/learnings/summary-confirmation/collaborators on|off, plan approval
(only the human turns it off), and adding/skipping a named stage
(`--add <stage>` / `--skip <stage>`) or switching profile (`--scope <plan>`).
These adjust the plan; they do not silently change what the human approved.
