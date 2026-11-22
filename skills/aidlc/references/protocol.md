# Protocol — gates, questions, review, learnings, state

The ceremony that makes an AI-DLC run traceable and human-controlled. This is
the harness-neutral procedure; the conductor enforces it conversationally
(using `ask_user_question` for gates and structured choices).

## Approval gates

Every EXECUTE stage outside Phase 0 ends with a gate. Present it with
`ask_user_question` using exactly the choices that apply:

- **Approve** — record the approval, advance.
- **Request Changes** — record the feedback, run the Keep/Modify/Redo loop,
  re-run the reviewer (when a produced artifact changed), then re-present the
  gate.
- **Skip** — mark `[S]` with a reason; dependents may need the missing artifact
  later.
- **Jump** — the human names a stage/phase to move to; stages passed over are
  marked skipped.

The human's reply decides, in their own words or by picking an option. If they
approve **and** ask for something ("looks fine but rename the handler"), record
the approval, make the change, carry on. A request with no approval in it is
not the gate's answer: do the request, say in one line what you did, and keep
the gate open. Never re-ask what they already answered; never answer a question
for them.

## Questions (question-driven decisions)

The signature AI-DLC behavior: decisions are asked as **structured
multiple-choice questions**, not free-form chat. Ordinary questions live in a
markdown file in the stage's record dir (the questions file is the source of
truth), using lettered options (`A …`, `B …`, … `X. Other`). For 1–3 simple
choices where a structured UI is clearer, use `ask_user_question` directly.
Always converge on the file: the conductor writes the question, the human's
answer, and the `[Answer]:` tag. Offer three modes that all converge on the
file: guided (walkthrough), self-guided (the human edits the file), or chat.

Resolve follow-ups and contradictions **within** the stage before completing
it. Surface ambiguity early; never carry an unresolved contradiction forward.

## Plan Approval (Code Generation only)

Before 3.5 writes code, the plan for that Unit/batch is put to the human:
**Approve** / **Request Changes**. Only a human approval (in their own words or
by picking Approve) releases the build. An approval of a plan you changed
without their say-so is not recorded — change the plan first, then record. A
request while the plan question is open that is *not* the build (a commit, an
install, a file edit outside the plan) runs at once, then say: "Done. The code
plan still waits for your approval." and end the turn. Turning plan approval
off is the human's call only.

## Review loop (before the gate, when the stage declares a reviewer)

1. Dispatch the named reviewer as a **separate subagent** with the stage
   definition, Q&A, and artifacts (never the builder's memory/plan).
2. The reviewer returns READY or NOT-READY + findings.
3. Advisory: show findings at the gate as decision support. Adversarial: on
   NOT-READY, re-run the builder → re-review, up to the cap; then proceed to
   the gate with any unresolved findings noted.

## Learnings (the learning loop)

When learnings are on (default `classic`/`feature`/`enterprise`/`workshop`; off
for `express`/`bugfix`/`poc`), keep a stage diary `memory.md` in the stage's
record dir with four canonical headings — Interpretation, Deviation, Tradeoff,
Open question — appending timestamped bullets as observations arise. After a
correction the human made in the stage, before the gate, ask once (and only
once): keep this learning for next time? Options: **Yes, for this project** /
**Yes, for the team** / **No**. On "yes", conflict-check it section-by-section
against `aidlc/spaces/<space>/memory/org.md` (a narrower rule that contradicts
broader policy is rejected), then write it to `memory/project.md` or
`memory/team.md`. A note the human asked you to keep is kept the same way with
no question, and you say in one line what you kept and where. Learnings are
advisory and additive; they never block a gate.

## State and audit (the `aidlc/` tree)

The record of the run lives in the project under `aidlc/`. Maintain it
faithfully and only through these procedures:

```
aidlc/
  state.md                       # the run: profile, scope grid, settings, cursor (current stage), per-stage status
  spaces/<space>/
    intents/<YYMMDD>-<label>/     # per-work record dir
      <phase>/<stage>/            # stage artifacts + questions file + memory.md + reviews/
      audit/                      # audit shards (append a row for every decision/transition)
    memory/
      org.md                      # framework defaults (rules layer 1)
      team.md                     # affirmed team practices (layer 2)
      project.md                  # project overrides (layer 3)
```

`state.md` records: the chosen profile and its EXECUTE/SKIP grid, depth, test
strategy, review cap, ceremony switches (sensors/learnings/summary-confirmation/
plan-approval/collaborators), the current stage, and each stage's status
(✓ done / ▶ current / [S] skipped / pending). After every stage transition,
append one audit row (timestamp, stage, decision, human's words where relevant)
and update the cursor. This is what makes a later session able to resume: the
conductor reads `state.md` and continues from the cursor.

## Sensors (advisory verification)

Six deterministic checks run at the end of a stage, advisory unless a team
makes one block at the gate: claim-sources (claims carry inline source tags),
required-sections, upstream-coverage, traceability (requirements→stories→units→
code), linter, type-check. On failure, the finding is shown at the gate; a
blocking check is reported as a refusal with its exact next step.

## Ceremony switches (defaults set by the profile, overridable)

- `sensors` — run the six checks (default on for most; off for express).
- `learnings` — keep the diary + ask the "keep for next time?" question.
- `summary-confirmation` — a "Looks correct?" check on a summary of the human's
  answers before the stage writes its artifact (on when ambiguity is high).
- `plan-approval` — gate every Code Generation plan (only the human turns off).
- `collaborators` — bring in support agents beside the lead (on by default only
  for `enterprise`; otherwise the lead runs the stage alone).

The switches remove only what they name. Nothing in a scope or setting lowers
the human presence at a gate; a gate needs a real message from the human to
approve.
