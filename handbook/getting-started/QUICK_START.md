# Quick Reference: Cross-Platform Setup

## TL;DR - Quick Install

### 🐧 Linux / macOS
```bash
bash <(curl -fsSL https://raw.githubusercontent.com/sahulkola/git-multi-ssh/main/setup.sh)
```

### 🪟 Windows (PowerShell - Recommended)
```powershell
git clone https://github.com/sahulkola/git-multi-ssh.git $env:USERPROFILE\.git-multi-ssh
cd $env:USERPROFILE\.git-multi-ssh
npm install
npm link
```

### 🪟 Windows (Command Prompt)
```cmd
git clone https://github.com/sahulkola/git-multi-ssh.git %USERPROFILE%\.git-multi-ssh
cd %USERPROFILE%\.git-multi-ssh
npm install
npm link
```

---

## After Installation

```bash
git-multi-ssh
```

Then follow the prompts to set up your accounts.

---

## Path Examples

### Linux/macOS
```
Folder: ~/Developer/work
Folder: ~/Projects/personal
Folder: /Users/name/code/client
```

### Windows
```
Folder: ~\Developer\work
Folder: C:\Users\Name\Developer\work
Folder: %USERPROFILE%\Projects\personal
```

---

## Key Locations

| OS | Config Location |
|----|-----------------|
| macOS/Linux | `~/.ssh/config` and `~/.gitconfig` |
| Windows | `%USERPROFILE%\.ssh\config` and `%USERPROFILE%\.gitconfig` |

---

## Troubleshooting

### SSH key not added to agent
**macOS:**
```bash
ssh-add --apple-use-keychain ~/.ssh/id_ed25519_work
```

**Linux/Windows:**
```bash
ssh-add ~/.ssh/id_ed25519_work
# or on Windows PowerShell
ssh-add $env:USERPROFILE\.ssh\id_ed25519_work
```

### SSH keys not found
Create the directory and try again:

**macOS/Linux:**
```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```

**Windows (PowerShell):**
```powershell
New-Item -Path $env:USERPROFILE\.ssh -ItemType Directory -Force
```

### Git config not applying
Check the path in your Git config:
```bash
git config --global --list | grep includeIf
```

Make sure the folder path matches exactly (case-sensitive on Linux, case-insensitive on Windows/macOS).

---

## Features ✨

- ✅ Multiple SSH identities per machine
- ✅ Automatic SSH key generation (ed25519)
- ✅ Per-folder git configuration
- ✅ Cross-platform (Windows, macOS, Linux)
- ✅ Case-insensitive path handling
- ✅ Automatic backups before changes
- ✅ SSH agent integration
- ✅ Git provider shortcuts (GitHub, GitLab, Bitbucket)

---

## What It Sets Up

1. **SSH Keys** - One per account in `~/.ssh/`
2. **SSH Config** - Routes keys based on hostname
3. **Git Config** - Routes email/name based on folder
4. **Git Aliases** - Productivity shortcuts (optional)

---

## Common Issues

| Issue | Solution |
|-------|----------|
| `ssh-keygen not found` | Install OpenSSH |
| `npm not found` | Install Node.js |
| `git not found` | Install Git |
| `Permission denied` | Use PowerShell or `sudo` on macOS/Linux |
| `Path not found` | Check folder exists, use full paths |

---

## Docs

- 📖 **[CROSS_PLATFORM.md](CROSS_PLATFORM.md)** - Full setup guide
- 🔧 **[CROSS_PLATFORM_CHANGES.md](../technical/CROSS_PLATFORM_CHANGES.md)** - Technical details
- ✓ **[VALIDATION.md](../technical/VALIDATION.md)** - Testing info
- ✨ **[SETUP_COMPLETE.md](../status/SETUP_COMPLETE.md)** - What was updated

---

**Ready to get started?** Run `git-multi-ssh` after installation! 🚀
