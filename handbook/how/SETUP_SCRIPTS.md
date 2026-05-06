# How the Setup Scripts Work

A deep dive into what the installation scripts actually do, line by line. After reading this you will understand what runs on the user's machine when they execute one of the bootstrap commands.

---

## The three scripts

| Script | Platform | Trigger command |
|---|---|---|
| `setup.sh` | macOS / Linux (Bash) | `curl -fsSL .../setup.sh \| bash` |
| `setup.ps1` | Windows PowerShell | `irm .../setup.ps1 \| iex` |
| `setup.bat` | Windows Command Prompt | `curl -L -o setup.bat .../setup.bat && setup.bat` |

There is also a parallel set of alias-only scripts:

| Script | Purpose |
|---|---|
| `setup-aliases.sh` | Installs only Git aliases (no SSH setup) |
| `setup-aliases.ps1` | Windows PowerShell version of alias setup |
| `setup-aliases.bat` | Windows CMD version of alias setup |
| `install-aliases.sh` | Alternate alias installer |

---

## setup.sh — macOS and Linux bootstrap

```bash
#!/bin/bash
set -e                           # Exit immediately on any error
```

`set -e` is important: if any single command fails (e.g. git clone fails due to no network), the script aborts instead of continuing with a broken partial state.

```bash
INSTALL_DIR="$HOME/.git-multi-ssh"
```

The tool is cloned into a hidden directory in the user's home folder. Using a dot-prefix keeps it out of file browser views. `$HOME` expands to `/Users/yourname` on macOS or `/home/yourname` on Linux.

```bash
if [ -d "$INSTALL_DIR" ]; then
  echo "🔄 Updating..."
  cd "$INSTALL_DIR"
  git pull
else
  echo "📦 Cloning..."
  git clone https://github.com/sahulkola/git-multi-ssh.git "$INSTALL_DIR"
  cd "$INSTALL_DIR"
fi
```

The script is idempotent: running it a second time updates an existing install rather than failing or creating a duplicate. This is the `upsert` pattern applied at the script level.

```bash
npm install
npm link
```

- `npm install` downloads the three runtime dependencies (`chalk`, `inquirer`, `ora`) into `node_modules/`
- `npm link` creates a global symlink from `~/.npm-global/bin/git-multi-ssh` → the local `bin/index.js`, which makes the `git-multi-ssh` command available system-wide without a PATH edit

```bash
echo "✅ Done! Run: git-multi-ssh"
```

The script ends with the minimal next step so a new user knows exactly what to type.

---

## setup.ps1 — Windows PowerShell bootstrap

The PowerShell version mirrors the Bash script but uses PowerShell syntax and Windows path conventions.

```powershell
$installDir = Join-Path $env:USERPROFILE ".git-multi-ssh"
```

`$env:USERPROFILE` is the Windows equivalent of `$HOME`. `Join-Path` constructs `C:\Users\yourname\.git-multi-ssh` with the correct separator.

```powershell
if (Test-Path $installDir) {
    Set-Location $installDir
    & git pull
} else {
    & git clone https://github.com/sahulkola/git-multi-ssh.git $installDir
    Set-Location $installDir
}
```

`& git pull` — the `&` call operator invokes an external command. Without it, PowerShell may try to interpret `git` as a cmdlet. `Test-Path` checks for directory existence cleanly.

```powershell
& npm install
& npm link
```

Same logic as the Bash version — install deps and link the binary globally.

---

## setup-aliases.sh — Git alias installer

This script calls `git config --global alias.<name> "<expansion>"` once for each alias. It is entirely about writing to `~/.gitconfig`.

```bash
git config --global alias.s "status --short --branch"
```

Each call adds or overwrites a single line under `[alias]` in `~/.gitconfig`. Because `--global` is used, these aliases apply to every repository on the machine, not just the current project.

**Categories of aliases installed:**
- Shorthand (`s`, `st`, `co`, `cb`, `cm`, `ca`, etc.)
- Log / history (`lg`, `ll`, `last`, `today`, `week`, `contrib`)
- Undo / fix (`undo`, `unstage`, `discard`, `wipe`, `uncommit`)
- Branch management (`bra`, `brd`, `cleanup`, `gone`)
- Stash shortcuts (`ss`, `sp`, `sl`, `sd`)
- Remote helpers (`rv`, `sync`, `publish`)
- Workflow (`new`, `done`, `squash`, `fixup`, `standup`)
- Information (`who`, `aliases`, `ignored`, `root`)
- File operations (`assume`, `unassume`, `rm-cached`)
- Diff and merge (`dc`, `dw`, `mt`)
- Rebase and advanced (`ri`, `cont`, `skip`, `rb`, `rbi`, `fixup-last`)

The script is also idempotent: `git config --global` overwrites an existing alias if it already exists.

---

## How curl-pipe-bash works (security note)

```bash
curl -fsSL https://raw.githubusercontent.com/.../setup.sh | bash
```

Breaking down the flags:
- `-f` — Fail silently on HTTP errors (e.g. 404). Without this, curl would pipe the error HTML into bash.
- `-s` — Silent mode: no progress bar (cleaner output)
- `-S` — Show errors even in silent mode
- `-L` — Follow HTTP redirects (important for raw GitHub URLs which sometimes redirect)

The script is fetched over HTTPS from a trusted source (GitHub raw), so the transport is encrypted. The user is trusting that the repository owner has not committed malicious content, which is the same trust model as `npm install`.

---

## What the scripts do NOT do

- They do not generate SSH keys (that is done by the interactive CLI wizard: `git-multi-ssh`)
- They do not modify `~/.ssh/config` directly (the CLI does that)
- They do not require root or administrator privileges
- They do not add anything to PATH permanently (npm link handles PATH via npm's global bin directory)

---

## How to verify a successful setup

After running any setup script, confirm:

```bash
# The command is available
which git-multi-ssh     # macOS / Linux
# or
where git-multi-ssh     # Windows CMD

# The tool runs
git-multi-ssh --version
```

If `which` finds the command, the setup succeeded.
