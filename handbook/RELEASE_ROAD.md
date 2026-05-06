# Release Roadmap

Principles, philosophy, and future milestones that guide how git-devkit evolves and ships. This is not a rigid sprint plan; it is a set of values and intentions that keep releases aligned with the project's purpose.

---

## Core release principles

### 1. Ship working things, not complete things

A release is better when it solves one real problem reliably than when it attempts to solve ten problems partially. Each version should leave users strictly better off than before it.

### 2. Source-first distribution

git-devkit is distributed via Git clone and native setup scripts, not npm. This keeps the tool close to its audience (developers who use Git daily) and avoids a dependency chain that obscures what the tool actually does. Releases are marked by Git tags, not registry publishes.

### 3. Every release starts from a clean main

No feature work lands directly on `main`. All changes go through a branch, get reviewed, and merge when they are complete. This makes every point on `main` a valid release candidate.

### 4. The docs-app ships alongside the tool

Documentation is part of the product. When a feature is added to the CLI, the relevant docs-app page is updated in the same release. Releasing code without documentation is a half-release.

### 5. Semantic versioning communicates intent

Version numbers carry meaning. A PATCH does not introduce features. A MINOR does not break existing setups. A MAJOR signals that users need to take action. Bumping a number arbitrarily breaks this contract.

### 6. Breaking changes are opt-in

When a change would require users to re-run setup, edit their SSH config, or change how they clone repositories, it is a breaking change regardless of how small the code diff is. These changes always bump MAJOR and are documented prominently.

---

## Current release state

| Component | Version | Status |
|---|---|---|
| CLI (git-multi-ssh) | 0.0.2 | Stable - first functional release |
| Docs-app | 0.0.0 | Active development |
| GitHub release tag | None yet | Pending v0.1.0 tag |

---

## Planned milestones

### v0.1.0 — First tagged release

**Goal:** Stabilize existing functionality and make the project discoverable via a proper GitHub release.

- [ ] Tag `v0.1.0` on `main`
- [ ] Publish GitHub Release with release notes
- [ ] Deploy docs-app to GitHub Pages
- [ ] Confirm installation scripts point to correct repo URLs
- [ ] Verify setup on macOS, Windows (PowerShell), and Linux

---

### v0.2.0 — Documentation and discovery

**Goal:** The docs-app is the primary entry point for new users. Everything a user needs to get up and running should be reachable in two clicks.

- [ ] Installation page polished and OS-aware
- [ ] Multi-SSH daily use-cases page live
- [ ] Git aliases page with full reference
- [ ] Stories page explaining real-world scenarios

---

### v0.3.0 — Developer experience improvements

**Goal:** Contributors and advanced users can extend or modify the tool easily.

- [ ] `handbook/how/` guides explain every internal module
- [ ] Release process is documented and followed
- [ ] Local development setup is documented (`docs-app` dev server instructions)
- [ ] Test coverage for core library functions (`lib/`)

---

### v1.0.0 — Production-ready signal

**Goal:** The tool works reliably on all three platforms, the docs are complete, and the project is safe to recommend to other developers.

Criteria for v1.0.0:
- Setup scripts tested on macOS, Windows PowerShell, Windows CMD, and Ubuntu
- `git-multi-ssh` CLI handles edge cases (re-run on existing setup, partial config, SSH key already exists)
- Docs-app covers all pages with accurate and tested commands
- No open critical bugs

---

## What this project will not do

These are deliberate scope boundaries. Staying inside them keeps the tool focused.

- Will not become a general Git GUI or replace existing Git clients
- Will not manage SSH keys automatically without user confirmation
- Will not require a paid service, account, or subscription
- Will not collect telemetry or usage data

---

## Contributing to the roadmap

If you are working on git-devkit and want to add a milestone, add it to the appropriate version section above. Use the same format: a goal statement and a checklist of specific deliverables. Keep milestones small enough to complete in a single release cycle.
