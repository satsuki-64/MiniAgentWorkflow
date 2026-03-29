# Python Runtime Profile (Conda)

## Scope
Use this profile for Python tasks in the `Execute` phase.

## Required Policy
- Environment manager: `conda` (mandatory)
- Interpreter selection and command execution must happen inside the selected conda environment.

## First-Run Decision
Treat execution as first-run when no prior environment state exists.

Suggested state keys:
- `python_env_name`
- `python_env_created`
- `python_first_run_completed`

## Preflight Steps
1. Determine target environment name (default: project-specific name).
2. Check whether the environment already exists.
3. If exists, activate/use it.
4. If not exists, create environment with required Python version and dependencies.
5. Persist selected environment metadata to state.

## Reference Commands (Windows PowerShell)
```powershell
# load conda hook
(D:\DeepLearn\Miniconda\shell\condabin\conda-hook.ps1)

# list environments
conda env list

# create environment (example)
conda create -n my_project_env python=3.11 -y

# activate environment
conda activate my_project_env

# execute command in environment
python -m pip install -r requirements.txt
python project/test.py
```

## Non-First-Run Behavior
- Reuse existing environment metadata.
- Do not recreate environment unless explicitly requested.

## Failure Handling
- If conda is unavailable or environment creation fails, mark task `Blocked` and record exact error in `.agent/PROGRESS.md`.
- Never silently fall back to global/system Python.
