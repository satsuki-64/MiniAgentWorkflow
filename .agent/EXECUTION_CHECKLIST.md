# EXECUTION_CHECKLIST.md

## Phase 1 - Spec
- [ ] Read `IDEA.md`.
- [ ] Read `.agent/COPILOT.md` and `.agent/WORKFLOW.md`.
- [ ] Clarify objective, constraints, and success criteria.
- [ ] Ask clarification questions if critical information is missing.

## Phase 2 - Plan
- [ ] Ensure `.agent/TASK.md` exists and follows schema.
- [ ] Ensure each task has goal/interface/steps/verification.
- [ ] Restore context from `.agent/state/SESSION_STATE.json` if resuming.

## Phase 3 - Execute (Per Task, Step by Step)
- [ ] Select first runnable `Todo` task.
- [ ] Set task to `InProgress`.
- [ ] Check `Risk` level.
- [ ] If `high`, request human checkpoint before execution.
- [ ] Before first code-changing step, create a local git backup commit.
- [ ] Execute one step only.
- [ ] Immediately sync updates to `TASK.md`, `PROGRESS.md`, `SESSION_STATE.json`.
- [ ] After key modification milestone, create backup commit.
- [ ] Repeat until all planned steps are complete.

## Phase 4 - Review
- [ ] Verify acceptance criteria with tests/metrics/manual checks.
- [ ] If verification fails, reopen task or create follow-up/fix task.

## Phase 5 - Finish
- [ ] Set status to `Done` or `Blocked`.
- [ ] Append closeout log entry in `.agent/PROGRESS.md`.
- [ ] Ensure final backup commit exists for the task.
- [ ] Update `.agent/state/LAST_RUN_SUMMARY.md`.

## Post-Run
- [ ] Confirm no stale `InProgress` tasks remain unless intentionally paused.
- [ ] If all tasks done, append closeout summary in `.agent/PROGRESS.md`.

## Bug Discovery Hook
- [ ] If bug is discovered, create a `Type=Fix` task in `.agent/TASK.md`.
- [ ] Link it to `SourceTask` and route it to the right `Workstream`.
- [ ] Track and close it through the same five-phase workflow.
