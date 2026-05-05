# unit-test-generator Agent Creation Notes

This document records how the custom agent was created and how to use it.

## Why This Agent Exists

The project needed a dedicated agent for:
- generating unit tests for all possible components,
- supporting `docs-app` by default,
- also handling any project path passed as an argument,
- pushing toward near-100% coverage across statements, branches, functions, and lines.

## Inputs Used

- Requested behavior from chat prompt.
- Agent authoring guidance from:
- `create-agent` skill instructions,
- `agent-customization` skill,
- custom agent template in `agent-customization/references/agents.md`.

## Project Evidence for Test Runner Selection

Observed in repository:
- `docs-app/package.json` includes `ng test` script.
- `docs-app/pnpm-lock.yaml` contains `vitest` and `karma` entries.

Decision encoded in agent:
- detect runner from `package.json` and lock files,
- default to running coverage via `ng test` whenever possible,
- fallback to configured project runner only if `ng test` is unavailable.

## File Created

- `.github/agents/unit-test-generator.agent.md`

## Agent Design Choices

- `user-invocable: true` so team members can pick it directly.
- Tools are intentionally minimal but sufficient:
- `read`, `search`, `edit`, `execute`, `todo`.
- Defaults to `docs-app` when no project argument is supplied.
- Defaults to `ng test` execution path for coverage runs.
- Explicitly avoids introducing a new testing framework unless asked.
- Requires near-100% coverage pursuit and reporting uncovered areas when exact 100% is not feasible.

## How To Use

Example prompts:
1. "Use unit-test-generator on docs-app and maximize branch coverage."
2. "Use unit-test-generator for apps/web with a 95% minimum for all metrics."
3. "Run unit-test-generator on docs-app and show before/after coverage by metric."

## Validation Checklist

- Agent file exists under `.github/agents/`.
- Frontmatter includes `description` and meaningful trigger phrases.
- Argument hint supports custom project path input.
- Workflow includes detect -> generate -> run coverage -> iterate.
- Output format includes before/after coverage and uncovered reasoning.
