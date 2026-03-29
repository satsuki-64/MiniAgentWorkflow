# Language Runtime Profiles

This folder defines execution profiles used in Phase `Execute` preflight.

## Available Profiles
- `python/README.md`: Python workflow with conda-managed environment lifecycle.
- `cpp/README.md`: C++ workflow placeholder. User-provided templates/configs are expected.

## Selection Rule
1. Read language/runtime settings from `IDEA.md`.
2. Match task metadata (`Language`, `RuntimeProfile`) when available.
3. Load the corresponding profile before any execute step.
4. If no profile can be resolved, stop and ask for explicit language selection.
