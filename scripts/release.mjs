#!/usr/bin/env node
/**
 * git-devkit release automation
 * Run:       npm run release
 * Dry-run:   npm run release -- --dry-run
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// ─── flags ────────────────────────────────────────────────────────────────────
const DRY_RUN = process.argv.includes('--dry-run');

// ─── resolve paths ────────────────────────────────────────────────────────────
const __dirname     = path.dirname(fileURLToPath(import.meta.url));
const ROOT          = path.resolve(__dirname, '..');
const DOCS_APP      = path.join(ROOT, 'docs-app');
const PKG_PATH      = path.join(ROOT, 'package.json');
const CHANGELOG_PATH = path.join(ROOT, 'handbook', 'technical', 'CHANGELOG.md');

// ─── colour helpers ───────────────────────────────────────────────────────────
const ESC = '\x1b';
const c = {
  bold:    s => `${ESC}[1m${s}${ESC}[0m`,
  dim:     s => `${ESC}[2m${s}${ESC}[0m`,
  green:   s => `${ESC}[32m${s}${ESC}[0m`,
  yellow:  s => `${ESC}[33m${s}${ESC}[0m`,
  cyan:    s => `${ESC}[36m${s}${ESC}[0m`,
  red:     s => `${ESC}[31m${s}${ESC}[0m`,
  magenta: s => `${ESC}[35m${s}${ESC}[0m`,
};

// ─── logging ──────────────────────────────────────────────────────────────────
function log(msg)         { console.log(msg); }
function ok(msg)          { log(`  ${c.green('✔')}  ${msg}`); }
function warn(msg)        { log(`  ${c.yellow('⚠')}  ${msg}`); }
function dry(msg)         { log(`  ${c.magenta('~')}  ${c.dim('[dry-run] ' + msg)}`); }
function step(n, msg)     { log(`\n${c.bold(c.cyan('[' + n + ']'))} ${c.bold(msg)}`); }
function fail(msg)        { log(`\n  ${c.red('✖')}  ${c.red(msg)}\n`); process.exit(1); }

// ─── shell execution ──────────────────────────────────────────────────────────
function run(cmd, opts = {}) {
  return execSync(cmd, {
    encoding: 'utf8',
    stdio: opts.silent ? 'pipe' : 'inherit',
    cwd: opts.cwd || ROOT,
  }).trim();
}
function runSilent(cmd, opts = {}) { return run(cmd, { ...opts, silent: true }); }

/** Run a side-effect command. In dry-run mode, just print it. */
function runEffect(cmd, opts = {}) {
  if (DRY_RUN) {
    const loc = opts.cwd ? c.dim(' (in ' + path.relative(ROOT, opts.cwd) + ')') : '';
    dry('would run: ' + c.bold(cmd) + loc);
    return '';
  }
  return run(cmd, opts);
}

/** Write a file. In dry-run mode, just announce it. */
function writeEffect(filePath, content, description) {
  if (DRY_RUN) {
    dry('would write: ' + c.bold(path.relative(ROOT, filePath)));
    if (description) dry('  ' + description);
    return;
  }
  fs.writeFileSync(filePath, content);
}

// ─── prompts ──────────────────────────────────────────────────────────────────
function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans.trim()); }));
}

function promptChoice(question, choices) {
  const lines = choices.map((choice, i) => '    ' + c.dim((i + 1) + '.') + ' ' + choice.label).join('\n');
  log('\n  ' + question);
  log(lines);
  return (async () => {
    while (true) {
      const raw = await prompt('\n  Enter number [1-' + choices.length + ']: ');
      const idx = parseInt(raw, 10) - 1;
      if (idx >= 0 && idx < choices.length) return choices[idx];
      warn('Invalid choice, try again.');
    }
  })();
}

// ─── version helpers ──────────────────────────────────────────────────────────
function bumpVersion(current, type) {
  const [maj, min, pat] = current.split('.').map(Number);
  if (type === 'major') return `${maj + 1}.0.0`;
  if (type === 'minor') return `${maj}.${min + 1}.0`;
  return `${maj}.${min}.${pat + 1}`;
}
function today() { return new Date().toISOString().slice(0, 10); }

// ─── main ─────────────────────────────────────────────────────────────────────
log('\n' + c.bold(c.cyan('  git-devkit release automation')));
if (DRY_RUN) log(c.bold(c.magenta('  [DRY RUN — nothing will be written or pushed]\n')));
log(c.dim('  This will build, tag, push, and deploy the project.\n'));

// ── 1. safety checks ──────────────────────────────────────────────────────────
step(1, 'Safety checks');

let currentBranch;
try { currentBranch = runSilent('git rev-parse --abbrev-ref HEAD'); }
catch { fail('Not inside a git repository.'); }

if (currentBranch !== 'main') {
  fail('You are on branch "' + currentBranch + '". Switch to main before releasing.\n  Run: git checkout main');
}
ok('On branch: ' + c.green('main'));

const status = runSilent('git status --porcelain');
if (status.length > 0) {
  if (DRY_RUN) {
    warn('Working tree is not clean — continuing because this is a dry run.');
    log(c.dim('  Uncommitted files:'));
    status.split('\n').forEach(l => log(c.dim('    ' + l)));
  } else {
    fail('Working tree is not clean. Commit or stash all changes before releasing.');
  }
} else {
  ok('Working tree is clean');
}

try { runSilent('git remote get-url origin'); }
catch { fail('No remote named "origin" found.'); }
ok('Remote origin exists');

// ── 2. version bump ───────────────────────────────────────────────────────────
step(2, 'Version bump');

const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
const currentVersion = pkg.version;
log('\n  Current version: ' + c.yellow(currentVersion) + '\n');

const choice = await promptChoice('Choose the type of release:', [
  { label: 'patch  ' + c.dim('→ ' + bumpVersion(currentVersion, 'patch') + '  (bug fixes, small corrections)'),   type: 'patch'  },
  { label: 'minor  ' + c.dim('→ ' + bumpVersion(currentVersion, 'minor') + '  (new features, no breaking changes)'), type: 'minor' },
  { label: 'major  ' + c.dim('→ ' + bumpVersion(currentVersion, 'major') + '  (breaking changes)'),              type: 'major'  },
  { label: 'custom ' + c.dim('(enter manually)'),                                                                  type: 'custom' },
]);

let newVersion;
if (choice.type === 'custom') {
  newVersion = await prompt('  Enter version (e.g. 1.2.3): ');
  if (!/^\d+\.\d+\.\d+$/.test(newVersion)) fail('"' + newVersion + '" is not a valid semver string.');
} else {
  newVersion = bumpVersion(currentVersion, choice.type);
}
log('\n  ' + c.green('✔') + '  New version: ' + c.bold(c.green(newVersion)));

// ── 3. release summary ────────────────────────────────────────────────────────
step(3, 'Release summary');
log(c.dim('  A one-line description used in the CHANGELOG and git tag message.\n'));
const summary = await prompt('  Summary: ');
if (!summary) fail('Release summary cannot be empty.');
ok('Summary recorded');

// ── 4. build CLI ──────────────────────────────────────────────────────────────
step(4, 'Build CLI');
log(c.dim('  Running: npm run build\n'));
runEffect('npm run build', { cwd: ROOT });
if (!DRY_RUN) ok('CLI built successfully');

// ── 5. build docs-app ─────────────────────────────────────────────────────────
step(5, 'Build docs-app');
log(c.dim('  Running: pnpm run build:ghpages\n'));
runEffect('pnpm run build:ghpages', { cwd: DOCS_APP });
if (!DRY_RUN) ok('Docs-app built successfully');

// ── 6. bump package.json ──────────────────────────────────────────────────────
step(6, 'Update package.json');
const updatedPkg = { ...pkg, version: newVersion };
writeEffect(PKG_PATH, JSON.stringify(updatedPkg, null, 2) + '\n', 'version: ' + currentVersion + ' → ' + newVersion);
if (!DRY_RUN) ok('package.json → version: ' + c.green(newVersion));

// ── 7. prepend CHANGELOG ──────────────────────────────────────────────────────
step(7, 'Update CHANGELOG');
const changelogEntry = '## [' + newVersion + '] - ' + today() + '\n\n' + summary + '\n\n';
const existingChangelog = fs.existsSync(CHANGELOG_PATH) ? fs.readFileSync(CHANGELOG_PATH, 'utf8') : '';
const headingMatch = existingChangelog.match(/^#[^\n]*\n/);
let updatedChangelog;
if (headingMatch) {
  updatedChangelog = headingMatch[0] + '\n' + changelogEntry + existingChangelog.slice(headingMatch[0].length);
} else {
  updatedChangelog = changelogEntry + existingChangelog;
}
writeEffect(CHANGELOG_PATH, updatedChangelog, 'prepend entry for [' + newVersion + ']');
if (!DRY_RUN) ok('CHANGELOG prepended with [' + newVersion + ']');

// ── 8. commit + tag ───────────────────────────────────────────────────────────
step(8, 'Commit and tag');
runEffect('git add "' + PKG_PATH + '" "' + CHANGELOG_PATH + '"');
runEffect('git commit -m "chore(release): v' + newVersion + '"');
runEffect('git tag -a v' + newVersion + ' -m "Release v' + newVersion + ': ' + summary + '"');
if (!DRY_RUN) {
  ok('Committed: chore(release): v' + newVersion);
  ok('Annotated tag created: v' + newVersion);
}

// ── 9. push ───────────────────────────────────────────────────────────────────
step(9, 'Push to origin');
runEffect('git push origin main');
runEffect('git push origin v' + newVersion);
if (!DRY_RUN) ok('Pushed main and tag to origin');

// ── 10. deploy docs ───────────────────────────────────────────────────────────
step(10, 'Deploy docs-app to GitHub Pages');
const browserDist = path.join(DOCS_APP, 'dist', 'docs-app', 'browser');
if (!DRY_RUN && !fs.existsSync(browserDist)) {
  warn('Build output not found at ' + browserDist + ' — skipping GitHub Pages deploy.');
} else {
  log(c.dim('  Running: gh-pages -d dist/docs-app/browser\n'));
  runEffect('npx gh-pages -d "' + browserDist + '"', { cwd: DOCS_APP });
  if (!DRY_RUN) ok('Docs deployed to GitHub Pages');
}

// ── 11. summary ───────────────────────────────────────────────────────────────
log('\n' + '─'.repeat(60));
if (DRY_RUN) {
  log(c.bold(c.magenta('\n  ✅ Dry run complete — nothing was written or pushed.\n')));
  log('  ' + c.bold('Would release:') + '  ' + c.cyan('v' + newVersion));
  log('  ' + c.bold('Summary:') + '        ' + summary);
  log('  ' + c.bold('Tag:') + '            v' + newVersion);
  log('\n' + c.dim('  Run without --dry-run to execute for real:'));
  log(c.dim('    npm run release'));
} else {
  log(c.bold(c.green('\n  ✅ Release complete!\n')));
  log('  ' + c.bold('Version:') + '   ' + c.cyan('v' + newVersion));
  log('  ' + c.bold('Summary:') + '   ' + summary);
  log('  ' + c.bold('Tag:') + '       v' + newVersion);
  log('  ' + c.bold('Docs:') + '      https://sahulkola.github.io/git-devkit/');
  log('  ' + c.bold('Releases:') + '  https://github.com/sahulkola/git-devkit/releases');
  log('\n' + c.dim('  Next steps:'));
  log(c.dim('  • Go to GitHub → Releases and publish the new tag with release notes'));
  log(c.dim('  • Verify the docs site is live in a few minutes'));
}
log('');
