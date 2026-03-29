# .agent Template Guide

This folder contains a reusable, project-agnostic Agent workflow.

## Quick Start
1. Write your goal in `../IDEA.md`.
2. Ask Agent: "Read IDEA.md, regenerate TASK.md using .agent/TASK_SCHEMA.md, then execute Ralph loop following WORKFLOW.md and COPILOT.md"
3. Review checkpoints for high-risk tasks.
4. Track results in `.agent/PROGRESS.md`.

## Runtime Feel
- Agent follows Spec -> Plan -> Execute -> Review -> Finish.
- After each step, it syncs `TASK.md`, `PROGRESS.md`, and `state/SESSION_STATE.json`.
- If interrupted, it resumes from state cursor.
- Bugs are converted into `Type=Fix` tasks and tracked in queue.

## File Roles
- `COPILOT.md`: Stable execution policy.
- `TASK.md`: Mutable task queue and status.
- `PROGRESS.md`: Append-only run logs.
- `WORKFLOW.md`: End-to-end loop protocol.
- `TASK_SCHEMA.md`: Task field contract.
- `EXECUTION_CHECKLIST.md`: Operational checklist.
- `skills/SKILL_MAP.md`: Skill dispatch map.
- `state/SESSION_STATE.json`: Resume state.
- `state/LAST_RUN_SUMMARY.md`: Continuation note.

## Other
- The .skills are adapted from https://github.com/wanshuiyin/Auto-claude-code-research-in-sleep. 
- Agent workflows are customizable to suit project needs, and additional languages can be added under the languages directory.