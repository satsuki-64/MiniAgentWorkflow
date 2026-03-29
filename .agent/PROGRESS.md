# PROGRESS.md

Append-only operational memory for Agent.
Do not rewrite history; add a new entry each run/task.

## Entry Template
### YYYY-MM-DD HH:MM - Run <run_id> - Task <task_id>
- Phase: `Spec | Plan | Execute | Review | Finish`
- Step: `<S1/S2/... or ->`
- Summary:
- Actions:
- Verification:
- Outcome: `Done` | `Blocked` | `Needs Review`
- Workstream:
- Type: `Feature | Fix | Research | Chore`
- SourceTask: `- | Txxxx`
- Lessons Learned:
- Next Step:

## Log
### YYYY-MM-DD 00:00 - Run bootstrap - Task T0000
- Phase: `Finish`
- Step: `-`
- Summary: Template initialized.
- Actions: Created workflow control files and state placeholders.
- Verification: Structural file check passed.
- Outcome: `Done`
- Workstream: workflow
- Type: `Chore`
- SourceTask: `-`
- Lessons Learned: Keep policy stable in `COPILOT.md`; write mutable knowledge here.
- Next Step: Populate `IDEA.md` and generate concrete tasks.
