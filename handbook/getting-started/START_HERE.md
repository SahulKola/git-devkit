# 🚀 Getting Started - git-devkit

## Project Structure

- **git-devkit** = The entire developer toolkit (this project)
- **git-multi-ssh** = The core CLI tool (included in git-devkit)

## One Command to Start (All Platforms)

No matter if you're on **Windows**, **macOS**, or **Linux**, use the same command:

```bash
npm run setup
```

That's it! The setup script will:

1. ✅ Detect your operating system (Windows/macOS/Linux)
2. ✅ Check all prerequisites (Node.js, npm, Git, OpenSSH)
3. ✅ Install npm dependencies
4. ✅ Link the git-multi-ssh CLI globally
5. ✅ Show next steps

## After Setup

Once setup completes, run:

```bash
git-multi-ssh
```

Or use the npm command:

```bash
npm start
```

## What Happens During Setup

```
🚀 git-multi-ssh Setup
Detected Platform: macOS/Linux/Windows
Node: v18.x.x
Home: /Users/you or C:\Users\You

Checking prerequisites...
✓ All prerequisites met!

Installing npm dependencies...
✓ Dependencies installed

Setting up git-multi-ssh command...
✓ CLI linked globally

✅ Setup Complete!

Next steps:
  1. Run the setup wizard:
     $ git-multi-ssh
  2. Follow the prompts to add your first account
  3. The tool will generate SSH keys and configure Git
```

## Step-by-Step First Run

### 1. Clone the Repository
```bash
git clone https://github.com/sahulkola/git-multi-ssh.git
cd git-multi-ssh
```

### 2. Run Universal Setup
```bash
npm run setup
```

### 3. Start the Wizard
```bash
git-multi-ssh
```

### 4. Follow the Prompts

**You'll be asked:**

| Prompt | Example |
|--------|---------|
| Your name | Alex Doe |
| Account label | work, personal, client-xyz |
| Email | alex@company.com |
| Git provider | GitHub, GitLab, Bitbucket, Custom |
| Project folder | ~/Developer/work or C:\Users\Name\work |

### 5. Tool Does the Rest

- Generates SSH keys (ed25519)
- Configures SSH config
- Configures Git config
- Tests SSH connection
- Shows you the public key to add to your Git provider

## Optional: Setup Git Aliases

After setup, optionally add git aliases:

```bash
# macOS/Linux
./setup-aliases.sh

# Windows (PowerShell)
.\setup-aliases.ps1

# Windows (Command Prompt)
setup-aliases.bat
```

This adds ~50 productivity aliases like:
- `git s` → `git status --short`
- `git lg` → Pretty log graph
- `git undo` → Undo last commit
- And many more!

## Troubleshooting

### "npm not found"
```bash
# Install Node.js (includes npm)
# https://nodejs.org/
```

### "git not found"
```bash
# Install Git
# https://git-scm.com/
```

### "ssh-keygen not found"
```bash
# Install OpenSSH
# Windows: Usually included in Windows 10+
# macOS: Install via Homebrew: brew install openssh
# Linux: sudo apt install openssh-client (or equivalent)
```

### Permission errors on macOS/Linux
```bash
# You might need sudo for npm link
npm run setup
# If it fails, try:
sudo npm link
```

## Platform-Specific Notes

### Windows
- Use PowerShell for best compatibility: `npm run setup`
- Or Command Prompt: `npm run setup`
- Both work the same way

### macOS
- Works out of the box
- Apple Keychain integration for SSH keys (automatic)

### Linux
- Works out of the box
- ssh-agent integration (automatic)

## Next Steps

1. ✅ Run `npm run setup`
2. ✅ Run `git-multi-ssh`
3. ✅ Create your first account
4. ✅ Copy SSH key to your Git provider
5. ✅ Start using multiple Git identities!

## Documentation

- 📖 [QUICK_START.md](QUICK_START.md) - Quick reference
- 📖 [CROSS_PLATFORM.md](CROSS_PLATFORM.md) - Detailed guide
- 📖 [README.md](../../README.md) - Feature overview

## Support

For detailed setup instructions for your platform:
- **Windows**: See [CROSS_PLATFORM.md#windows](CROSS_PLATFORM.md#windows)
- **macOS**: See [CROSS_PLATFORM.md#macos](CROSS_PLATFORM.md#macos)
- **Linux**: See [CROSS_PLATFORM.md#linux](CROSS_PLATFORM.md#linux)

---

**Ready? Run:** `npm run setup` 🚀
