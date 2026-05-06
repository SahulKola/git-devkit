# How the CLI Works Internally

An explanation of what happens inside the `git-multi-ssh` command from the moment a user runs it until their SSH config and `.gitconfig` are updated. This covers the architecture, data flow, and every module in `bin/` and `lib/`.

---

## High-level overview

```
User runs: git-multi-ssh
           │
           ▼
  bin/index.js          ← entry point, interactive wizard
           │
           ├── lib/generator.js   ← builds SSH config and gitconfig text
           ├── lib/fileManager.js ← reads and writes config files safely
           └── lib/utils.js       ← cross-platform path and OS helpers
```

The CLI is an interactive terminal wizard built on three dependencies:

| Package | Role |
|---|---|
| `inquirer` | Powers the interactive question prompts |
| `chalk` | Colours and formats terminal output |
| `ora` | Shows spinners during async operations |

---

## Entry point: bin/index.js

When a user runs `git-multi-ssh`, Node executes `bin/index.js`. The file starts by detecting whether the user already has a setup:

```js
const existingSetup = getExistingSetupInfo();
```

`getExistingSetupInfo()` reads `~/.ssh/config` and looks for blocks that the tool previously wrote (marked with `# >>> git-multi-ssh:` comments). If it finds any, it enters the "add account" flow. If it finds nothing, it starts the "first-time setup" flow.

### Flow 1: First-time setup (`firstTimeSetup()`)

1. Ask for the user's full name (used as git author name)
2. Loop to collect one or more accounts via `promptNewAccount()`
3. For each account, collect: provider (GitHub/GitLab/Bitbucket/custom), account type label (personal/work/client), email, folder path
4. Call `finalizeAccounts(accounts)` to write everything to disk

### Flow 2: Add an account (`addAccountFlow(existingSetup)`)

1. Display a summary of currently configured accounts
2. Loop to collect one or more new accounts
3. Merge new accounts with existing ones and call `finalizeAccounts(accounts)`

### Flow 3: Remove an account (`removeAccountFlow(existingSetup)`)

1. Show a list of configured accounts
2. Ask which one to remove
3. Call `cleanupAccounts(toRemove)` from `fileManager.js`

### `promptNewAccount()` — what it collects

For each account, the wizard asks:
- Which provider? (GitHub / GitLab / Bitbucket / custom)
- Account type label? (personal / work / client / other)
- Email address
- Which local folder should use this identity?
- Should it generate a new SSH key?

If key generation is requested, the CLI runs:
```js
execSync(`ssh-keygen -t ed25519 -C "${email}" -f "${keyPath}" -N ""`)
```

This creates `~/.ssh/id_ed25519_<type>` silently (no passphrase).

### `finalizeAccounts()` — writing to disk

After collecting all accounts, this function:
1. Calls `generateConfigs(accounts)` to build the config text
2. Calls `writeConfigs()` from `fileManager.js` to safely write to disk
3. Prints a success summary with the next steps

---

## lib/generator.js — config builder

This module generates the exact text that will be written to `~/.ssh/config` and `~/.gitconfig`.

### SSH config block

For each account with type `personal` on GitHub, it generates:

```
# >>> git-multi-ssh:personal
Host github-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal
  IdentitiesOnly yes
# <<< git-multi-ssh:personal
```

Breaking down the fields:
- **`Host github-personal`** — this is the alias. When you clone with `git@github-personal:user/repo.git`, SSH reads this host entry.
- **`HostName github.com`** — the real destination server. SSH connects here but uses the host alias name to select keys.
- **`User git`** — GitHub, GitLab, and Bitbucket all use `git` as the SSH user.
- **`IdentityFile`** — the specific private key to use.
- **`IdentitiesOnly yes`** — critical: prevents SSH from trying other loaded keys (e.g. from ssh-agent) which would cause ambiguity between accounts.

### gitconfig includeIf block

For each account, the generator also produces a conditional include in `~/.gitconfig`:

```
# >>> git-multi-ssh:personal
[includeIf "gitdir:/Users/yourname/code/personal/"]
  path = ~/.gitconfig-personal
# <<< git-multi-ssh:personal
```

- **`includeIf "gitdir:..."`** — Git evaluates this condition for every git command. If the current repository lives under the specified folder, the included config file is loaded.
- **`path = ~/.gitconfig-personal`** — a separate gitconfig file containing just `[user] name = ... email = ...`.

On macOS and Windows (case-insensitive filesystems), the generator uses `gitdircase:` instead of `gitdir:` to ensure the path match works regardless of capitalisation.

### Per-account gitconfig file

Each account gets a dedicated mini-gitconfig:

```
# ~/.gitconfig-personal
[user]
  name = Your Name
  email = personal@example.com
```

These tiny files are safe to commit individually or share with a team as a reference — they contain only identity, not secrets.

---

## lib/fileManager.js — safe file writer

This module handles reading existing configs, making backups, and writing updates. It is designed to never lose existing data.

### Backup strategy

Before writing any file, `fileManager.js` calls `backup(file)`:

```js
function backup(file) {
  if (fs.existsSync(file)) {
    const dir = getBackupDir();
    const relativeName = path.relative(home, file).replace(/[\\/]/g, '--');
    fs.copyFileSync(file, path.join(dir, relativeName));
  }
}
```

All backups from a single run go into `~/.git-multi-ssh-backup/<timestamp>/`. The timestamp is formatted as `2026-05-06T14-30-00` so folders are sortable chronologically.

### upsertManagedBlock() — idempotent writes

The core write function is `upsertManagedBlock(file, blockId, blockContent)`. It:

1. Reads the existing file content (or starts empty if the file does not exist)
2. Looks for an existing block with matching `# >>> git-multi-ssh:<blockId>` / `# <<< git-multi-ssh:<blockId>` markers
3. If the block exists: replaces it with the new content (update)
4. If the block does not exist: appends it to the end of the file (insert)

This design means you can run `git-multi-ssh` multiple times without accumulating duplicate blocks in your SSH config.

### getExistingSetupInfo() — reading current state

Parses `~/.ssh/config` using regex to extract:
- Which account type labels are currently configured (by scanning for `# >>> git-multi-ssh:` markers)
- The `HostName` per account (to know which provider)
- The `IdentityFile` per account
- The email from the corresponding `.gitconfig-<type>` file

This is what the wizard uses to show "You have 2 accounts configured: personal (GitHub), work (GitLab)."

---

## lib/utils.js — cross-platform helpers

This module normalises differences between macOS, Linux, and Windows.

### Key functions

| Function | What it does |
|---|---|
| `isWindows()` | Returns `true` if `process.platform === 'win32'` |
| `expandHome(p)` | Replaces `~` with `os.homedir()` |
| `normalizePath(p)` | Expands home then calls `path.normalize()` |
| `pathsEqual(a, b)` | Case-insensitive comparison on macOS/Windows, case-sensitive on Linux |
| `getSshDirectory()` | Returns `~/.ssh` on all platforms |
| `getSshConfigPath()` | Returns `~/.ssh/config` on all platforms |
| `getGitConfigPath()` | Returns `~/.gitconfig` on all platforms |

### Why `pathsEqual` matters

On macOS and Windows, the filesystem is case-insensitive by default. A user who typed `/Users/Yourname/code/Personal` and later types `/users/yourname/code/personal` should be treated as the same path. Without case-insensitive comparison, the tool would create duplicate config blocks pointing to the same directory.

---

## How the CLI is built and packaged

The CLI source lives in `bin/index.js` and `lib/*.js`. These are native Node.js ESM modules.

For distribution, `scripts/build.mjs` uses **esbuild** to bundle everything:

```js
await build({
  entryPoints: ['bin/index.js'],
  outfile: 'dist/bin/index.js',
  bundle: true,        // pulls all imports into one file
  minify: true,        // removes whitespace, shortens variable names
  platform: 'node',
  format: 'esm',
  target: 'node18',
});
```

The output `dist/bin/index.js` is a single minified file that includes all of `lib/` and the three npm dependencies inlined. This means a user who installs from the Git repo via `npm link` does not need to run `npm install` on the production build — all dependencies are bundled.

After bundling, the build script writes a clean `dist/package.json` with only the fields needed for distribution (name, version, description, bin, license).

---

## The data flow in a single user session

```
1. User runs: git-multi-ssh
2. bin/index.js starts
3. fileManager.getExistingSetupInfo() reads ~/.ssh/config
4. Wizard asks questions via inquirer
5. generator.generateConfigs(accounts) builds config text strings
6. fileManager.writeConfigs() is called:
   a. backup(~/.ssh/config)
   b. backup(~/.gitconfig)
   c. upsertManagedBlock(~/.ssh/config, accountType, sshBlock)
   d. upsertManagedBlock(~/.gitconfig, accountType, includeBlock)
   e. writeFile(~/.gitconfig-<type>, userIdentityContent)
7. Success message printed
8. User clones with git@github-personal:user/repo.git
9. SSH reads ~/.ssh/config, matches Host github-personal → uses id_ed25519_personal
10. Git reads ~/.gitconfig, includeIf matches repo folder → loads correct email/name
```

---

## What happens when you clone with a host alias

```bash
git clone git@github-personal:yourname/dotfiles.git
```

Under the hood:
1. Git calls SSH with host `github-personal`, user `git`, and repo path `yourname/dotfiles.git`
2. SSH reads `~/.ssh/config` and finds the block with `Host github-personal`
3. SSH connects to `github.com` (the `HostName`) using the key at `~/.ssh/id_ed25519_personal`
4. GitHub authenticates the key and serves the repository
5. Git clones into `dotfiles/`
6. On any subsequent `git push`, Git consults `~/.gitconfig`, evaluates `includeIf "gitdir:..."`, and applies the correct `user.email` for the commit author
