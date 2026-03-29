# TASK.md

## Queue
Use this deterministic order: top-to-bottom.

| ID | Workstream | Type | Title | Status | Priority | Risk | Owner | DependsOn | Interface | Steps | Acceptance | Verification | SourceTask |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| T0001 | setup | Chore | Clarify scope and inventory baseline context | Todo | P0 | low | agent | - | `IDEA.md`, target project files | `S1: parse IDEA goals and constraints; S2: inspect key files/modules; S3: write actionable scope notes` | Scope and constraints are explicit and implementation-ready | Manual review of scope notes against IDEA | - |
| T0002 | implementation | Feature | Implement core change set | Todo | P0 | medium | agent | T0001 | impacted source files | `S1: implement minimal reversible edits; S2: run required checks; S3: refine based on failures` | Core feature/change is complete and coherent with requirements | Test/lint/manual check depending on task nature | - |
| T0003 | validation | Chore | Final review and closeout sync | Todo | P1 | low | agent | T0002 | `.agent/TASK.md`, `.agent/PROGRESS.md`, `.agent/state/*` | `S1: verify acceptance evidence; S2: close statuses; S3: write run summary` | No stale in-progress tasks and state files are resumable | Manual inspection + successful verification notes | - |

Status values: `Todo`, `InProgress`, `Blocked`, `Done`.
Priority values: `P0`, `P1`, `P2`, `P3`.
Risk values: `low`, `medium`, `high`.
Type values: `Feature`, `Fix`, `Research`, `Chore`.

## Task Selection Rule
Pick the first row where:
1. `Status = Todo`
2. Dependencies are `Done` or `-`

## State Transition Rule
- `Todo -> InProgress -> Done`
- `Todo/InProgress -> Blocked` when retries exhausted or external dependency missing.

## Blocking Protocol
When blocking a task, add a note under "Blockers" and log details in `.agent/PROGRESS.md`.

## Step-Level Sync Rule
After every finished step (`S1`, `S2`, ...):
1. Update task step progress in this file.
2. Append one short step log to `.agent/PROGRESS.md`.
3. Update `.agent/state/SESSION_STATE.json` cursor.

## Step Tracking
- T0001: `S1=Todo, S2=Todo, S3=Todo`
- T0002: `S1=Todo, S2=Todo, S3=Todo`
- T0003: `S1=Todo, S2=Todo, S3=Todo`

## Fix Task Rule
When a bug is found, add a new `Type=Fix` row with:
- `Workstream`: affected stream.
- `SourceTask`: task ID where bug was discovered.
- `Verification`: explicit reproduction + fix validation.

## Blockers
- None.

## Completed Index
- None.
