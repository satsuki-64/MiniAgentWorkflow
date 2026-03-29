# C++ Runtime Profile (Placeholder)

## Scope
Use this profile for C++ tasks in the `Execute` phase.

## Current Policy
- Prefer existing VS Code project configuration.
- Read and use:
  - `.vscode/tasks.json`
  - `.vscode/launch.json`
  - `.vscode/c_cpp_properties.json` (if present)

## Placeholder Convention
This folder is intentionally left as a template entrypoint.
You can add your own build/debug templates later, for example:
- `cmake.md`
- `msvc.md`
- `clang.md`

## Guardrail
If required C++ templates/configurations are missing, stop and request user-provided template files before execution.
