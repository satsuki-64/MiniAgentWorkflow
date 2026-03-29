# SKILL_MAP.md

Map task categories to preferred skills under `.skills/`.

## Mapping Table
| Task Category | Primary Skill | Secondary Skill | Notes |
|---|---|---|---|
| Idea generation | `.skills/idea-creator/SKILL.md` | `.skills/idea-discovery/SKILL.md` | Use when IDEA is vague |
| Literature survey | `.skills/research-lit/SKILL.md` | `.skills/semantic-scholar/SKILL.md` | Add references to outputs |
| Planning | `.skills/experiment-plan/SKILL.md` | `.skills/research-pipeline/SKILL.md` | Convert idea into staged tasks |
| Experiment run | `.skills/run-experiment/SKILL.md` | `.skills/monitor-experiment/SKILL.md` | Track metrics and logs |
| Result analysis | `.skills/analyze-results/SKILL.md` | `.skills/result-to-claim/SKILL.md` | Connect evidence to claims |
| Paper writing | `.skills/paper-write/SKILL.md` | `.skills/paper-writing/SKILL.md` | Enforce structure and style |
| Auto review loop | `.skills/auto-review-loop/SKILL.md` | `.skills/auto-review-loop-llm/SKILL.md` | Choose one reviewer strategy |
| Improvement loop | `.skills/auto-paper-improvement-loop/SKILL.md` | `.skills/research-refine/SKILL.md` | Bounded rounds recommended |

## Fallback Rule
If no matching skill exists:
1. Execute with generic workflow from `.agent/WORKFLOW.md`.
2. Record missing mapping in `.agent/PROGRESS.md`.
3. Optionally add a new mapping here.

## Composition Guardrails
- Max sequential skills per task: 3.
- Add a verification checkpoint between major skill switches.
- Do not chain two autonomous loops without user confirmation.
