# Phases and Stages

AI-DLC runs 33 stages across 5 phases, sequentially. Phase 0 has no approval
gates; every stage a profile runs outside Phase 0 ends with a human approval
gate. Conditional stages self-skip when their condition does not hold.
Construction (Phase 3) repeats its per-Unit stages (3.1–3.5) for each Unit in
dependency order, then runs 3.6–3.7 once across the solution.

## Phase 0 — Initialization (3 stages, auto-proceed)

| # | Stage | Key artifacts | Condition |
|---|---|---|---|
| 0.1 | Workspace Scaffold | `aidlc/spaces/<space>/intents/<YYMMDD>-<label>/` record dir | ALWAYS |
| 0.2 | Workspace Detection | `aidlc/state.md` (workspace facts: languages, manifests, brownfield/greenfield) | ALWAYS |
| 0.3 | State Initialization | `aidlc/state.md`, `audit/` shards | ALWAYS |

Workspace detection is a rule-based scan (file extensions, known config
filenames, package manifests). No user interaction; all three complete in one
pass. Brownfield detection here decides whether 2.1 Reverse Engineering runs.

## Phase 1 — Ideation (7 stages) — validate the initiative

| # | Stage | Lead | Supporting | Key artifacts | Condition |
|---|---|---|---|---|---|
| 1.1 | Intent Capture & Framing | product | architect | intent statement, stakeholder map | ALWAYS |
| 1.2 | Market Research | product | — | competitive analysis, build-vs-buy | CONDITIONAL |
| 1.3 | Feasibility & Constraints | architect | aws-platform, compliance | feasibility, constraint register, RAID log | CONDITIONAL |
| 1.4 | Scope Definition | product | delivery | scope definition, intent backlog | ALWAYS |
| 1.5 | Team Formation | delivery | — | team assessment, mob composition plan | CONDITIONAL |
| 1.6 | Rough Mockups | design | product | wireframes, user flows | CONDITIONAL (skip if no UI) |
| 1.7 | Approval & Handoff | delivery | product | initiative brief, decision log | ALWAYS |

Which profiles enter Ideation: `enterprise`/`feature` run all seven; `mvp` runs
1.1, 1.3, 1.4, 1.6; `poc` runs 1.1 only; all others skip Ideation entirely.

## Phase 2 — Inception (9 stages) — elaborate requirements and plan

| # | Stage | Lead | Supporting | Key artifacts | Condition |
|---|---|---|---|---|---|
| 2.1 | Reverse Engineering | developer | architect | 9 RE artifacts (code map, components, deps) | Brownfield only |
| 2.2 | Practices Discovery | pipeline-deploy | quality, developer, devsecops | `team-practices.md`, `discovered-rules.md` | CONDITIONAL |
| 2.3 | Requirements Analysis | product | — | `requirements.md` | ALWAYS |
| 2.4 | User Stories | product | design, developer, quality | `stories.md`, `personas.md` | user-facing features |
| 2.5 | Refined Mockups | design | product | hi-fi mockups, interaction spec | UI projects |
| 2.6 | Domain Design | architect | aws-platform, design | `components.md`, `decisions.md` (ADRs) | per plan |
| 2.7 | Units Generation | architect | delivery | `unit-of-work.md`, unit DAG, story map | ALWAYS |
| 2.8 | Contract Design | architect | aws-platform | `contract-summary.md` | CONDITIONAL |
| 2.9 | Delivery Planning | delivery | architect | `bolt-plan.md`, team allocation, risk & sequencing | ALWAYS |

Topologies: 2.1 = pipeline (developer code scan → architect synthesis-and-write;
developer alone when collaborators off). 2.2 = subagent hub-and-spoke (lead
drafts, quality/developer/devsecops inspect independently, human interview
resolves gaps, lead integrates). 2.4 = mob (lead drafts; design/developer/quality
contribute in parallel via contribution files).

## Phase 3 — Construction (7 stages) — build in reviewable slices

| # | Stage | Lead | Supporting | Key artifacts | Runs |
|---|---|---|---|---|---|
| 3.1 | Functional Design | architect | developer | `entities.md`, `rules.md`, `functional-spec.md` | per Unit |
| 3.2 | NFR Requirements | architect | devsecops, compliance, quality | performance/security/scale/reliability/observability NFRs | per Unit |
| 3.3 | NFR Design | architect | aws-platform | NFR design specifications | per Unit |
| 3.4 | Infrastructure Design | aws-platform | devsecops, compliance | infrastructure specs, IaC designs | per Unit |
| 3.5 | Code Generation | developer | — | application code + code docs | per Unit |
| 3.6 | Build and Test | quality | devsecops | test results, quality report | once, end |
| 3.7 | CI Pipeline | pipeline-deploy | — | CI config, quality gates | once, conditional |

Default for new solo source-producing work: **unit-major, serial, verified Unit
checkpoints** — each Unit finishes its design stages + Code Generation (with
human Plan Approval) and is verified before the next. A walking skeleton (first
integrated Unit, verified end-to-end, human-approved) runs first when on.
Failures always halt with retry / skip / abort.

## Phase 4 — Operation (7 stages) — deploy and operate

| # | Stage | Lead | Supporting | Key artifacts | Condition |
|---|---|---|---|---|---|
| 4.1 | Deployment Pipeline | pipeline-deploy | — | CD config, deployment strategy, rollback runbook | CONDITIONAL |
| 4.2 | Environment Provisioning | aws-platform | devsecops, compliance | environment inventory, validation report | CONDITIONAL |
| 4.3 | Deployment Execution | pipeline-deploy | developer | deployment log, smoke tests, health checks | CONDITIONAL |
| 4.4 | Observability Setup | operations | — | dashboards, alarms, SLO config | CONDITIONAL |
| 4.5 | Incident Response | operations | — | runbooks, incident plan, escalation matrix | CONDITIONAL |
| 4.6 | Performance Validation | quality | — | load test results, NFR validation matrix | CONDITIONAL |
| 4.7 | Feedback & Optimization | operations | aws-platform | SLO report, cost analysis, feedback loop doc | CONDITIONAL |

All 7 are conditional; `classic`, `mvp`, and `poc` run none of them. 4.7 is the
terminal stage — on approval, the workflow is complete.

## Topology count

29 inline / 2 subagent (2.2, 3.5) / 1 pipeline (2.1) / 1 mob (2.4).
