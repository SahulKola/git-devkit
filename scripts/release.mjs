#!/usr/bin/env node
/**
 * git-devkit release automation
 * Run: npm run release
 *
 * Flow:
 *  1. Safety checks  (clean tree, on main, has remote)
 *  2. Choose version bump  (patch / minor / major)
 *  3. Enter one-line release summary
 *  4. Build CLI  (npm run build)
 *  5. Build docs-app  (pnpm run build:ghpages)
 *  6. Bump version in package.json
 *  7. Prepend CHANGELOG entry
 *  8. git commit + annotated tag
 *  9. git push origin main --tags
 * 10. Deploy docs to GitHub Pages  (gh-pages)
 * 11. Print release summary
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// ─── resolve paths ────────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DOCS_APP = path.join(ROOT, 'docs-app');
const PKG_PATH = path.join(ROOT, 'package.json');
const CHANGELOG_PATH = path.join(ROOT, 'handbook', 'technical', 'CHANGELOG.md');

// ─── tiny helpers ─────────────────────────────────────────────────────────────

const ESC = '\x1b';
const c = {
  bold:   s => `${ESC}[1m${s}${ESC}[0m`,
  dim:    s => `${ESC}[2m${s}${ESC}[0m`,
  green:  s => `${ESC}[32m${s}${ESC}[0m`,
  yellow: s => `${ESC}[33m${s}${ESC}[0m`,
  cyan:   s => `${ESC}[36m${s}${ESC}[0m`,
  red:    s => `${ESC}[31m${s}${ESC}[0m`,
};

function log(msg)   { console.log(msg); }
function ok(msg)    { log(`  ${c.green('✔')}  ${msg}`); }
function warn(msg)  { log(`  ${c.yellow('⚠')}  ${msg}`); }
function step(n, msg) { log(`\n${c.bold(c.cyan(`[${n}]`))} ${c.bold(msg)}`); }
function fail(msg)  { log(`\n  ${c.red('✖')}  ${c.red(msg)}\n`); process.exit(1); }

function run(cmd, opts = {}) {
  return execSync(cmd, { encoding: 'utf8', stdio: opts.silent ? 'pipe' : 'inherit', cwd: opts.cwd || ROOT }).trim();
}

function runSilent(cmd, opts = {}) {
  return run(cmd, { ...opts, silent: true });
}

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans.trim()); }));
}

function promptChoice(question, choices) {
  const lines = choices.map((choice, i) => `    ${c.dim(`${i + 1}.`)} ${choice.label}`).join('\n');
  log(`\n  ${question}`);
  log(lines);
  return (async () => {
    while (true) {
      const raw = await prompt(`\n  Enter number [1-${choices.length}]: `);
      const idx = parseInt(raw, 10) - 1;
      if (idx >= 0 && idx < choices.length) return choices[idx];
      warn('Invalid choice, try again.');
    }
  })();
}

function bumpVersion(current, type) {
  const [maj, min, pat] = current.split('.').map(Number);
  if (type === 'major') return `${maj + 1}.0.0`;
  if (type === 'minor') return `${maj}.${min + 1}.0`;
  return `${maj}.${min}.${pat + 1}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// ─── main ─────────────────────────────────────────────────────────────────────

log('\n' + c.bold(c.cyan('  git-devkit release automation')) + '\n');
log(c.dim('  This will build, tag, push, and deploy the project.\n'));

// ── 1. safety checks ──────────────────────────────────────────────────────────
step(1, 'Safety checks');

// Must be on main
let currentBranch;
try {
  currentBranch = runSilent('git rev-parse --abbrev-ref HEAD');
} catch {
  fail('Not inside a git repository.');
}
if (currentBranch !== 'main') {
  fail(`You are on branch "${currentBranch}". Please switch to main before releasing.\n  Run: git checkout main`);
}
ok(`On branch: ${c.green('main')}`);

// Working tree must be clean
const status = runSilent('git status --porcelain');
if (status.length > 0) {
  fail('Working tree is not clean. Commit or stash all changes before releasing.');
}
ok('Working tree is clean');

// Remote must exist
try {
  runSilent('git remote get-url origin');
} catch {
  fail('No remote named "origin" found. Add one before releasing.');
}
ok('Remote origin exists');

// ── 2. version bump ───────────────────────────────────────────────────────────
step(2, 'Version bump');

const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
const currentVersion = pkg.version;
log(`\n  Current version: ${c.yellow(currentVersion)}\n`);

const choice = await promptChoice('Choose the type of release:', [
  { label: `patch  ${c.dim(`→ ${bumpVersion(currentVersion, 'patch')}  (bug fixes, small corrections)`)}`, type: 'patch' },
  { label: `minor  ${c.dim(`→ ${bumpVersion(currentVersion, 'minor')}  (new features, no breaking changes)`)}`, type: 'minor' },
  { label: `major  ${c.dim(`→ ${bumpVersion(currentVersion, 'major')}  (breaking changes)`)}`, type: 'major' },
  { label: `custom ${c.dim('(enter manually)')}`, type: 'custom' },
]);

let newVersion;
if (choice.type === 'custom') {
  newVersion = await prompt('  Enter version (e.g. 1.2.3): ');
  if (!/^\d+\.\d+\.\d+$/.test(newVersion)) fail(`"${newVersion}" is not a valid semver string.`);
} else {
  newVersion = bumpVersion(currentVersion, choice.type);
}
log(`\n  ${c.green('✔')}  New version: ${c.bold(c.green(newVersion))}`);

// ── 3. release summary ────────────────────────────────────────────────────────
step(3, 'Release summary');
log(c.dim('  A one-line description used in the CHANGELOG and git tag message.\n'));
const summary = await prompt('  Summary: ');
if (!summary) fail('Release summary cannot be empty.');

// ── 4. build CLI ──────────────────────────────────────────────────────────────
step(4, 'Build CLI');
log(c.dim('  Running: npm run build (esbuild bundles bin/ into dist/)\n'));
run('npm run build', { cwd: ROOT });
ok('CLI built successfully');

// ── 5. build docs-app ─────────────────────────────────────────────────────────
step(5, 'Build docs-app');
log(c.dim('  Running: pnpm run build:ghpages (Angular SSG with --base-href /git-devkit/)\n'));
run('pnpm run build:ghpages', { cwd: DOCS_APP });
ok('Docs-app built successfully');

// ── 6. bump package.json ──────────────────────────────────────────────────────
step(6, 'Update package.json');
pkg.version = newVersion;
fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + '\n');
ok(`package.json → version: ${c.green(newVersion)}`);

// ── 7. prepend CHANGELOG ──────────────────────────────────────────────────────
step(7, 'Update CHANGELOG');
const changelogEntry = `## [${newVersion}] - ${today()}\n\n${summary}\n\n`;
const existingChangelog = fs.existsSync(CHANGELOG_PATH) ? fs.readFileSync(CHANGELOG_PATH, 'utf8') : '';

// Insert after the first heading line if one exists, otherwise prepend
const headingMatch = existingChangelog.match(/^#[^\n]*\n/);
let updatedChangelog;
if (headingMatch) {
  const afterHeading = existingChangelog.slice(headingMatch[0].length);
  updatedChangelog = `${headingMatch[0]}\n${changelogEntry}${afterHeading}`;
} else {
  updatedChangelog = `${changelogEntry}${existingChangelog}`;
}
fs.writeFileSync(CHANGELOG_PATH, updatedChangelog);
ok(`CHANGELOG prepended with [${newVersion}]`);

// ── 8. commit + tag ───────────────────────────────────────────────────────────
step(8, 'Commit and tag');
run(`git add ${PKG_PATH} ${CHANGELOG_PATH}`);
run(`git commit -m "chore(release): v${newVersion}"`);
ok(`Committed: chore(release): v${newVersion}`);

run(`git tag -a v${newVersion} -m "Release v${newVersion}: ${summary}"`);
ok(`Annotated tag created: v${newVersion}`);

// ── 9. push ───────────────────────────────────────────────────────────────────
step(9, 'Push to origin');
run('git push origin main');
run(`git push origin v${newVersion}`);
ok('Pushed main and tag to origin');

// ── 10. deploy docs ───────────────────────────────────────────────────────────
step(10, 'Deploy docs-app to GitHub Pages');
const browserDist = path.join(DOCS_APP, 'dist', 'docs-app', 'browser');
if (!fs.existsSync(browserDist)) {
  warn(`Build output not found at ${browserDist} — skipping GitHub Pages deploy.`);
} else {
  log(c.dim('  Running: gh-pages -d dist/docs-app/browser\n'));
  run(`npx gh-pages -d ${browserDist}`, { cwd: DOCS_APP });
  ok('Docs deployed to GitHub Pages');
}

// ── 11. summary ───────────────────────────────────────────────────────────────
log('\n' + '─'.repeat(60));
log(c.bold(c.green('\n  ✅ Release complete!\n')));
log(`  ${c.bold('Version:')}   ${c.cyan(`v${newVersion}`)}`);
log(`  ${c.bold('Summary:')}   ${summary}`);
log(`  ${c.bold('Tag:')}       v${newVersion}`);
log(`  ${c.bold('Docs:')}      https://sahulkola.github.io/git-devkit/`);
log(`  ${c.bold('Releases:')}  https://github.com/sahulkola/git-devkit/releases`);
log('\n' + c.dim('  Next steps:'));
log(c.dim('  • Go to GitHub → Releases and publish the new tag with release notes'));
log(c.dim('  • Verify the docs site is live in a few minutes'));
log('');
