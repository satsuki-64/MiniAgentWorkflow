# WORKFLOW.md

## Universal Agent Workflow

Code complete is not task complete. A task is complete only when execution, review, and state sync are finished.

## Five-Phase Closed Loop

### Phase 1: Spec
1. Read `IDEA.md`.
2. Clarify scope, constraints, outputs, and success criteria.
3. If key info is missing, ask concise clarification questions before planning.

### Phase 2: Plan
1. Create or refresh `.agent/TASK.md` using `.agent/TASK_SCHEMA.md`.
2. Ensure each task defines goal, interface/artifact, step checklist, and verification.
3. Mark dependencies explicitly.

### Phase 3: Execute Loop (Ralph Loop)
Repeat until no runnable task exists:
1. Select next task via deterministic rule in `.agent/TASK.md`.
2. Move task to `InProgress`.
3. Run language runtime preflight using `.agent/languages/*` docs.
4. Execute one checklist step.
5. Immediately sync state in all three places:
   - update `.agent/TASK.md` progress/checklist status,
   - append step result to `.agent/PROGRESS.md`,
   - refresh `.agent/state/SESSION_STATE.json`.
6. Repeat step-by-step until task-level acceptance can be verified.

## Language Runtime Preflight
- Determine language profile from `IDEA.md` or task metadata.
- For Python, follow `.agent/languages/python/README.md` and use conda-managed execution.
- For C++, follow `.agent/languages/cpp/README.md` and prefer existing VS Code project configuration.
- If no language profile is provided, block execution and request explicit selection.

### Phase 4: Review
1. Run checks/tests required by the task acceptance criteria.
2. Compare outputs against expected behavior.
3. If review fails, reopen the task or create follow-up tasks.

### Phase 5: Finish (Git/Closeout)
1. If code changed, prepare clean change summary and verification notes.
2. If queue is empty, write final summary entry in `.agent/PROGRESS.md`.
3. Save continuation hints in `.agent/state/LAST_RUN_SUMMARY.md`.

## Checkpoint Policy
- For `Risk=high` tasks, stop before execution and request human approval.
- For `Risk=low/medium`, proceed automatically.

## Retry Policy
- Default max retries per task: 2.
- On final failure: set `Blocked`, record root cause, propose next action.

## Determinism Rule
Always use top-to-bottom queue order and explicit dependency checks to avoid drift.

## Bug Handling Rule (Same System)
When a bug is discovered during any phase:
1. Do not patch ad-hoc outside the queue.
2. Create a new fix task in `.agent/TASK.md` with:
   - `Type=Fix`
   - linked `Workstream`
   - `SourceTask` pointing to where the bug was found.
3. Track the fix task with the same lifecycle and logs as regular tasks.

## Atomic Sync Rule (Critical)
Never batch status updates at the end.
After each completed step, sync TASK, PROGRESS, and SESSION_STATE immediately to guarantee resumability.
