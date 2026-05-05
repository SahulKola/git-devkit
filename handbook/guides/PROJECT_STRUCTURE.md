# git-devkit Project Structure

## Project Overview

**git-devkit** is a comprehensive developer toolkit for Git advanced users. It provides tools, guides, and utilities to streamline Git workflows.

**git-multi-ssh** is the primary tool within git-devkit, designed to manage multiple Git SSH identities on a single machine.

---

## Directory Structure

```
git-devkit/                          ← Root project folder
│
├── 📦 Core Application
│   ├── bin/
│   │   └── index.js                ← git-multi-ssh CLI entry point
│   ├── lib/
│   │   ├── utils.js                ← Cross-platform utilities
│   │   ├── fileManager.js           ← SSH/Git config management
│   │   └── generator.js             ← Config file generation
│   ├── package.json                 ← Project metadata (bin: git-multi-ssh)
│   └── setup.js                     ← Universal setup script
│
├── 🪟 Platform-Specific Scripts
│   ├── setup.sh                     ← macOS/Linux setup
│   ├── setup.bat                    ← Windows setup (batch)
│   ├── setup.ps1                    ← Windows setup (PowerShell)
│   ├── setup-aliases.sh             ← Git aliases (shell)
│   ├── setup-aliases.bat            ← Git aliases (batch)
│   ├── setup-aliases.ps1            ← Git aliases (PowerShell)
│   └── install-aliases.sh           ← Alias installer
│
├── 📚 Documentation (git-devkit)
│   ├── README.md                    ← Main documentation
│   ├── START_HERE.md                ← Quick start guide
│   ├── RUN_THIS.md                  ← Simple quick reference
│   ├── QUICK_START.md               ← Quick reference
│   ├── CROSS_PLATFORM.md            ← Platform-specific guides
│   ├── CROSS_PLATFORM_CHANGES.md    ← Technical changes
│   ├── SETUP_COMPLETE.md            ← Implementation summary
│   ├── ISSUES_FIXED.md              ← Issues and fixes
│   ├── VALIDATION.md                ← Testing matrix
│   ├── CHANGELOG.md                 ← Detailed change log
│   ├── DOCUMENTATION_INDEX.md       ← Documentation guide
│   ├── PROJECT_STRUCTURE.md         ← This file
│   └── READY.md                     ← Final summary
│
└── 📄 Build & Config
    ├── scripts/
    │   └── build.mjs                ← Build script
    └── tsconfig.json                ← TypeScript config (if used)
```

---

## Naming Convention

### Project Level (git-devkit)
Use **"git-devkit"** when referring to:
- The root folder
- The entire toolkit
- The project itself
- Contributing to the project
- Project-wide documentation
- The package as a whole

**Examples:**
- "Clone git-devkit repository"
- "Contribute to git-devkit"
- "git-devkit includes git-multi-ssh"
- "The git-devkit project provides..."

### Tool Level (git-multi-ssh)
Use **"git-multi-ssh"** when referring to:
- The CLI command
- The specific tool functionality
- The executable
- The git-multi-ssh documentation
- Running the tool

**Examples:**
- "Run: `git-multi-ssh`"
- "The git-multi-ssh tool manages..."
- "Use git-multi-ssh to create accounts"
- "`npm bin` shows git-multi-ssh path"

---

## Key Files by Purpose

### Setup & Installation
| File | Purpose | Scope |
|------|---------|-------|
| `setup.js` | Universal setup (all platforms) | git-devkit |
| `setup.sh` | macOS/Linux setup | git-devkit |
| `setup.bat` | Windows batch setup | git-devkit |
| `setup.ps1` | Windows PowerShell setup | git-devkit |

### Core Tool (git-multi-ssh)
| File | Purpose | Scope |
|------|---------|-------|
| `bin/index.js` | CLI entry point | git-multi-ssh |
| `lib/utils.js` | Cross-platform utilities | git-multi-ssh |
| `lib/fileManager.js` | Config management | git-multi-ssh |
| `lib/generator.js` | Config generation | git-multi-ssh |

### Documentation
| File | Purpose | Scope |
|------|---------|-------|
| `README.md` | Main docs for git-devkit | git-devkit |
| `QUICK_START.md` | Quick reference | git-devkit |
| `CROSS_PLATFORM.md` | Platform guides | git-devkit |
| All others | Support docs | git-devkit |

---

## Contributing to git-devkit

### For Contributors

When contributing to **git-devkit**:

1. **Reference the root** as "git-devkit"
   ```
   ✅ "Improve git-devkit documentation"
   ✅ "Add feature to git-devkit"
   ❌ "Improve git-multi-ssh documentation"
   ```

2. **Reference the tool** as "git-multi-ssh"
   ```
   ✅ "Add git-multi-ssh account handling"
   ✅ "Improve git-multi-ssh CLI"
   ❌ "Add git-devkit account handling"
   ```

3. **File paths** always use git-devkit context
   ```
   ✅ "git-devkit/bin/index.js"
   ✅ "In git-devkit repository"
   ❌ "git-multi-ssh/bin/index.js"
   ```

### For Users

When using **git-devkit**:

1. **Install git-devkit** (the project)
   ```bash
   git clone https://github.com/.../git-devkit.git
   cd git-devkit
   npm run setup
   ```

2. **Use git-multi-ssh** (the tool)
   ```bash
   git-multi-ssh
   ```

---

## Package Configuration

### package.json Structure

```json
{
  "name": "git-devkit",
  "description": "A comprehensive developer toolkit for Git advanced users...",
  "bin": {
    "git-multi-ssh": "bin/index.js"
  },
  "scripts": {
    "setup": "node setup.js",
    "start": "git-multi-ssh"
  }
}
```

**Explanation:**
- **name**: "git-devkit" (the project)
- **bin.git-multi-ssh**: Points to the CLI tool entry point

---

## File Modifications Guide

### When Updating Files

| Location | Reference As |
|----------|--------------|
| Root folder reference | "git-devkit root" |
| CLI command | "git-multi-ssh" |
| Project name | "git-devkit" |
| Tool name | "git-multi-ssh" |
| Documentation | "git-devkit docs" |
| Installation | "install git-devkit" |

---

## Examples for Documentation

### ✅ Correct

```markdown
# git-devkit Documentation

git-devkit includes git-multi-ssh, a tool for managing multiple Git identities.

## Installation

Clone the git-devkit repository:
\`\`\`
git clone https://github.com/user/git-devkit.git
cd git-devkit
npm run setup
\`\`\`

## Using git-multi-ssh

Run the git-multi-ssh tool:
\`\`\`
git-multi-ssh
\`\`\`

## Contributing

To contribute to git-devkit, fork the git-devkit repository...
```

### ❌ Incorrect

```markdown
# git-multi-ssh Documentation

Install git-multi-ssh:
\`\`\`
git clone https://github.com/user/git-multi-ssh.git
cd git-multi-ssh
\`\`\`
```

---

## For New Contributors

### Understanding the Structure

1. **git-devkit** = The complete toolkit (everything in this folder)
2. **git-multi-ssh** = One tool within the toolkit (the CLI)
3. Root folder name = **git-devkit**
4. CLI command = **git-multi-ssh**

### Making Changes

- Changes to `bin/index.js` = Changes to the git-multi-ssh tool
- Changes to documentation = Changes to the git-devkit project
- Changes to setup scripts = Changes to the git-devkit project
- All PRs reference the **git-devkit** project

### Commit Messages

✅ **Good:**
```
feat: Add new feature to git-devkit
fix: Improve git-multi-ssh SSH key handling
docs: Update git-devkit documentation
```

❌ **Poor:**
```
feat: Add to git-multi-ssh  (too vague about scope)
fix: Bug in git-devkit     (git-multi-ssh is what has bugs, not the toolkit)
```

---

## Summary

| Context | Use |
|---------|-----|
| **Root folder** | git-devkit |
| **CLI command** | git-multi-ssh |
| **Package name** | git-devkit |
| **Tool name** | git-multi-ssh |
| **Project reference** | git-devkit |
| **Contributing to** | git-devkit |

---

## Quick Reference

```
📁 git-devkit/                    ← Root project folder
   ├── 📦 git-multi-ssh CLI       ← The main tool
   ├── 📚 Documentation           ← For git-devkit project
   ├── 🔧 Setup scripts           ← To set up git-devkit
   └── ✨ More features coming    ← Part of git-devkit vision
```

---

**Note:** This structure allows git-devkit to grow with additional tools and utilities in the future, all while maintaining clear distinction between the project (git-devkit) and individual tools (like git-multi-ssh).
