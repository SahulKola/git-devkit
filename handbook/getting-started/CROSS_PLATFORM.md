# Cross-Platform Setup Guide

This guide helps you set up `git-multi-ssh` on **Windows**, **macOS**, and **Linux**.

## Quick Start

### macOS & Linux (Bash/Zsh)

```bash
# Option 1: Clone and run setup
git clone https://github.com/sahulkola/git-multi-ssh.git ~/.git-multi-ssh
cd ~/.git-multi-ssh
npm install
npm link

# Or use the setup script
chmod +x setup.sh
./setup.sh
```

### Windows (Command Prompt or PowerShell)

**Option 1: Batch Script (Command Prompt)**
```cmd
cd %USERPROFILE%
git clone https://github.com/sahulkola/git-multi-ssh.git .git-multi-ssh
cd .git-multi-ssh
npm install
npm link

REM Or run the batch script
setup.bat
```

**Option 2: PowerShell (Recommended)**
```powershell
# Set ExecutionPolicy if needed (run as Administrator)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then run
cd $env:USERPROFILE
git clone https://github.com/sahulkola/git-multi-ssh.git .git-multi-ssh
cd .git-multi-ssh
npm install
npm link

# Or use the PowerShell script
.\setup.ps1
```

## Configuration

The tool stores configurations in:

| OS      | SSH Config      | Git Config     | SSH Keys        |
|---------|-----------------|----------------|-----------------|
| macOS   | `~/.ssh/config` | `~/.gitconfig` | `~/.ssh/`       |
| Linux   | `~/.ssh/config` | `~/.gitconfig` | `~/.ssh/`       |
| Windows | `%USERPROFILE%\.ssh\config` | `%USERPROFILE%\.gitconfig` | `%USERPROFILE%\.ssh\` |

## Setting Up Git Aliases

### macOS & Linux (Bash/Zsh)

```bash
chmod +x setup-aliases.sh
./setup-aliases.sh
```

### Windows (Command Prompt)

```cmd
setup-aliases.bat
```

### Windows (PowerShell)

```powershell
.\setup-aliases.ps1
```

## Supported Features

✅ **Multiple Git Identities** - Manage multiple SSH keys and git configurations
✅ **Cross-Platform** - Works on Windows, macOS, and Linux
✅ **Case-Insensitive Paths** - Handles case-insensitive filesystems (Windows, macOS)
✅ **SSH Key Generation** - Automatically creates ed25519 SSH keys
✅ **Git Config Management** - Sets up per-folder git identities using `includeIf`
✅ **SSH Config Backup** - Automatically backs up configuration files

## Project Folder Configuration

When prompted for "Project folder", use:

**macOS/Linux:**
```
~/Developer/work
/home/username/projects/client
```

**Windows:**
```
~\Developer\work
C:\Users\Username\Developer\work
```

The tool supports:
- Relative paths starting with `~`
- Absolute paths (`/path/to/folder` on Unix, `C:\path\to\folder` on Windows)
- Case-insensitive matching (automatic on Windows/macOS)

## Troubleshooting

### SSH Key Not Added

```bash
# macOS
ssh-add --apple-use-keychain ~/.ssh/id_ed25519_work

# Linux / WSL
eval $(ssh-agent)
ssh-add ~/.ssh/id_ed25519_work

# Windows (with OpenSSH)
ssh-add $env:USERPROFILE\.ssh\id_ed25519_work
```

### SSH Config Not Found

The tool creates `~/.ssh/config` automatically. If it doesn't exist:

**macOS/Linux:**
```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/config
```

**Windows (PowerShell):**
```powershell
New-Item -Path "$env:USERPROFILE\.ssh" -ItemType Directory -Force
New-Item -Path "$env:USERPROFILE\.ssh\config" -ItemType File -Force
```

### Git Config Paths on Windows

Windows uses backslashes in paths, but git config (and git.exe) normalize them to forward slashes. The tool automatically handles this conversion using `gitdircase` for case-insensitive matching.

### Case Sensitivity Issues

On **Windows** and **macOS**, the filesystem is case-insensitive by default:
- The tool uses `gitdircase` instead of `gitdir` for case-insensitive path matching
- Folder paths are normalized internally
- File comparisons are case-insensitive

On **Linux**, the filesystem is case-sensitive:
- The tool uses `gitdir` for matching
- Folder paths must match exactly

## Environment Variables

| Variable | macOS/Linux | Windows |
|----------|-------------|---------|
| HOME | `/Users/username` | `%USERPROFILE%` |
| SSH Directory | `~/.ssh` | `%USERPROFILE%\.ssh` |
| Git Config | `~/.gitconfig` | `%USERPROFILE%\.gitconfig` |

## Notes

- SSH keys are generated using **Ed25519** for modern security
- Backup files are stored in `~/.git-multi-ssh-backup/` with timestamps
- SSH config uses managed blocks marked with `# >>> git-multi-ssh:label`
- Git config uses `[includeIf]` sections for per-folder identities
- All path operations are normalized for the current OS

## See Also

- [Git Config includeIf Documentation](https://git-scm.com/docs/git-config#_conditional_includes)
- [SSH Config Documentation](https://man.openbsd.org/ssh_config)
- [EdDSA SSH Keys](https://wiki.archlinux.org/title/SSH_keys#Ed25519)
