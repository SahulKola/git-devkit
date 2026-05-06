# Release Guide

A step-by-step reference for shipping a versioned release of git-devkit. Covers the CLI package, the docs-app, and the GitHub release tag. Follow this every time you want to publish something to users.

---

## Overview of what a release includes

git-devkit has three distinct "artifacts" that can be released independently or together:

| Artifact | What it is | Where it lives |
|---|---|---|
| CLI package | The `git-multi-ssh` Node.js tool | Published to npm, bundled from `bin/` |
| Docs app | The Angular documentation site | Deployed as static output to GitHub Pages |
| Git tag + GitHub Release | The version marker on the repo | GitHub Releases page |

In most cases you will release all three at once.

---

## Pre-release checklist

Before you increment any version number, confirm the following:

- [ ] All changes on `main` are committed and pushed
- [ ] `git status` shows a clean working tree
- [ ] CI / local tests pass (`pnpm test` inside `docs-app/`)
- [ ] The docs-app builds without errors (`pnpm run build:prod` inside `docs-app/`)
- [ ] The CLI builds without errors (`npm run build` from repo root)
- [ ] Any new features are documented in the relevant handbook files
- [ ] `CHANGELOG.md` has an entry describing what changed

---

## Step 1: Decide the version bump

git-devkit follows [Semantic Versioning](https://semver.org): `MAJOR.MINOR.PATCH`

| Change type | Which number to bump | Example |
|---|---|---|
| Breaking change (removes/renames functionality) | MAJOR | `0.1.0` → `1.0.0` |
| New feature that is backward compatible | MINOR | `0.1.0` → `0.2.0` |
| Bug fix or small internal change | PATCH | `0.1.0` → `0.1.1` |

The current version is in `package.json` at the repo root.

---

## Step 2: Create a release branch

```bash
# Start from an up-to-date main
git checkout main && git pull

# Create a release branch
git checkout -b release/v0.2.0
```

Working on a release branch lets you prepare the version bump separately from feature work.

---

## Step 3: Bump the version

Edit `package.json` at the repo root and update the `"version"` field:

```json
{
  "version": "0.2.0"
}
```

Then run the CLI build to make sure it still compiles:

```bash
npm run build
```

This runs `scripts/build.mjs` which bundles `bin/index.js` with esbuild into `dist/` and copies the updated `package.json` into `dist/`.

---

## Step 4: Update CHANGELOG

Open `handbook/technical/CHANGELOG.md` and add an entry at the top:

```
## [0.2.0] - 2026-05-06

### Added
- Multi-SSH daily use-cases page in docs-app

### Fixed
- Windows installation guide now correctly recommends native setup script

### Changed
- Removed npm CLI option from installation docs (source-only distribution)
```

Keep the format consistent: Added / Fixed / Changed / Removed.

---

## Step 5: Build the docs-app

```bash
cd docs-app
pnpm run build:ghpages
```

The `build:ghpages` script sets `--base-href /git-devkit/` so all asset paths are correct for GitHub Pages hosting.

The static output lands in `docs-app/dist/docs-app/browser/`.

---

## Step 6: Commit the version bump

```bash
git add package.json handbook/technical/CHANGELOG.md
git commit -m "chore(release): bump version to 0.2.0"
```

---

## Step 7: Merge release branch to main

```bash
git checkout main
git merge release/v0.2.0 --no-ff
git push origin main
```

The `--no-ff` flag keeps a merge commit so the release point is visible in the history graph.

---

## Step 8: Tag the release

```bash
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin v0.2.0
```

The annotated tag (`-a`) stores a message alongside the tag, which GitHub uses as the default release notes title.

---

## Step 9: Publish to GitHub Releases

1. Go to `https://github.com/sahulkola/git-devkit/releases/new`
2. Select the tag `v0.2.0` you just pushed
3. Title: `v0.2.0 – <short description>`
4. Body: paste the CHANGELOG entry for this version
5. Click **Publish release**

---

## Step 10: Deploy docs-app to GitHub Pages

If you use the `gh-pages` branch strategy (most common for GitHub Pages):

```bash
# From repo root
cd docs-app
npx gh-pages -d dist/docs-app/browser
```

If your repository is configured to deploy from the `gh-pages` branch, GitHub Pages will pick up the new files automatically within a few minutes.

---

## Step 11: Delete the release branch

```bash
git branch -d release/v0.2.0
git push origin --delete release/v0.2.0
```

---

## Post-release sanity check

- [ ] Visit `https://sahulkola.github.io/git-devkit/` and confirm the new page/content is live
- [ ] The GitHub Releases page shows the new tag and notes
- [ ] The version in `package.json` on `main` matches the tag

---

## Hotfix releases

If a critical bug surfaces after a release:

```bash
git checkout main
git checkout -b hotfix/v0.2.1

# fix the bug
# bump patch version in package.json
# add CHANGELOG entry

git commit -m "fix: <description>"
git checkout main && git merge hotfix/v0.2.1 --no-ff
git tag -a v0.2.1 -m "Hotfix v0.2.1"
git push origin main --tags
```

Then follow steps 9–11 above.

---

## Quick reference: CLI commands summary

```bash
# Verify CLI builds
npm run build              # from repo root

# Verify docs-app builds
cd docs-app && pnpm run build:prod

# Create and push tag
git tag -a vX.Y.Z -m "Release vX.Y.Z" && git push origin vX.Y.Z

# Deploy docs to GitHub Pages
cd docs-app && npx gh-pages -d dist/docs-app/browser
```
