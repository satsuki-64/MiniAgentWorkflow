# COPILOT.md

## Purpose
Stable operating policy for Agent execution in this repository.
Keep this file stable; write frequently changing learnings to `.agent/PROGRESS.md`.

## Core Loop (Ralph Loop)
Agent must execute a five-phase closed loop for every work item:
1. `Spec`: clarify objective and boundaries from `IDEA.md`.
2. `Plan`: structure tasks in `.agent/TASK.md`.
3. `Execute`: run one step at a time.
4. `Review`: verify acceptance criteria with evidence.
5. `Finish`: close or hand off with clean status and notes.

Code done is not loop done. A task is complete only after `Review` and `Finish`.

## Immediate Sync Policy (Mandatory)
After each completed step in execution, Agent must immediately update:
1. `.agent/TASK.md` (status/checklist progress)
2. `.agent/PROGRESS.md` (step log)
3. `.agent/state/SESSION_STATE.json` (resume cursor)

Do not accumulate updates for batch write at the end.

## Execution Boundary (Mixed Mode)
- Low-risk tasks: Agent can execute directly.
- High-risk tasks: Agent must stop and ask for explicit user confirmation before executing.

### High-Risk Examples
- Deployment, infrastructure, secrets, security settings.
- Destructive operations (delete/reset/migrate irreversible data).
- Large architecture rewrites.
- Changes that can impact production or external systems.

## Plan Mode Rules
Before coding, Agent must produce a concise plan from `IDEA.md` and map it into `.agent/TASK.md`.
No execution begins until the plan exists and tasks are structured.

Each task must include: target goal, interface/artifact boundary, step checklist, and verification method.

## Language Runtime Policy
During `Execute`, Agent must load a language profile from `.agent/languages/`.

### Python (Mandatory Conda)
- Runtime manager is `conda` only.
- On first execution, detect an existing conda environment first; if not found, create one.
- Persist selected environment metadata to `.agent/state/SESSION_STATE.json` notes or a dedicated state file.
- Run Python commands through the selected conda environment to keep interpreter/dependency consistency.

### C++ (VS Code Config First)
- Prefer workspace configuration from `.vscode/tasks.json`, `.vscode/launch.json`, and toolchain settings.
- If C++ templates/configs are missing, stop and request user-provided templates instead of guessing build flags.

## Safety Rules
- Never use destructive commands unless explicitly approved.
- Prefer minimal, reversible changes.
- Keep each task atomic and verifiable.
- If blocked after retries, mark task `Blocked` with reason and next action.

## Verification Rules
For executable changes:
1. Run relevant checks/tests when available.
2. Report result summary in `.agent/PROGRESS.md`.
3. If verification fails, do not mark the task as `Done`.

## Bug-To-Task Rules
If a bug is found at any time:
1. Create a dedicated fix task in `.agent/TASK.md` instead of editing outside queue flow.
2. Set `Type=Fix`, assign a `Workstream`, and fill `SourceTask`.
3. Process it via the same Spec/Plan/Execute/Review/Finish loop.
4. Record bug context and resolution in `.agent/PROGRESS.md` for traceability.

## Skills Usage Rules
- Select skills via `.agent/skills/SKILL_MAP.md`.
- If a mapped skill is unavailable, use fallback execution and record the gap in `.agent/PROGRESS.md`.
- Avoid deep skill chains without intermediate verification.

## Resume Rules
If interrupted, resume from `.agent/state/SESSION_STATE.json` and `.agent/TASK.md`.
Agent must restore the last in-progress context before continuing.
