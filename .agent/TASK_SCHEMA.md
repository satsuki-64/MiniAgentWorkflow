# TASK_SCHEMA.md

## Required Columns
- `ID`: unique task id, format `T0001`, `T0002`, ...
- `Workstream`: logical stream, such as `core-model`, `experiment`, `paper`, `ops`
- `Type`: `Feature | Fix | Research | Chore`
- `Title`: concise action-oriented description
- `Status`: `Todo | InProgress | Blocked | Done`
- `Priority`: `P0 | P1 | P2 | P3`
- `Risk`: `low | medium | high`
- `Owner`: `agent | user | pair`
- `DependsOn`: `-` or comma-separated task IDs
- `Interface`: API, file, module, dataset, or external boundary touched by this task
- `Steps`: concise checklist id or inline summary of execution steps
- `Acceptance`: objective completion condition
- `Verification`: how completion is validated (test, metric, manual check)
- `SourceTask`: `-` for normal tasks; required for `Type=Fix`

## Optional Columns (Recommended for Multi-Language)
- `Language`: `python | cpp | javascript | java | ...`
- `RuntimeProfile`: reference file under `.agent/languages/`, e.g. `python/README.md`
- `EnvPolicy`: `auto | ask | manual`
- `ToolchainProfile`: VS Code task/launch profile name or `default`

## Authoring Rules
1. One task should target one verifiable outcome.
2. Keep tasks independent whenever possible.
3. If dependency exists, list exact task IDs.
4. Avoid vague acceptance text.
5. `Type=Fix` must include `SourceTask` and clear bug symptom in task notes.
6. `Steps` should be executable in small increments so state can be synced after each step.
7. If `Language=python`, set runtime policy to conda and include environment setup/selection in `Steps`.
8. If `Language=cpp`, `Steps` should reference existing VS Code project configuration.

## Good Acceptance Examples
- "Unit tests pass for module X."
- "Document section Y updated with 3 references."
- "CLI command Z executes without error on sample input."

## Bad Acceptance Examples
- "Looks good."
- "Mostly done."

## Risk Classification Guide
- `low`: docs, comments, formatting, isolated non-critical edits
- `medium`: local logic changes with bounded impact
- `high`: security, infra, destructive ops, production-facing changes

## Minimal Step Checklist Pattern
Use this compact pattern in task notes or linked artifacts:
1. `S1`: prepare inputs/context
2. `S2`: implement change
3. `S3`: verify behavior
4. `S4`: sync logs/state and close
