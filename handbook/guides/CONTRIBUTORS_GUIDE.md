# git-devkit Contributor's Guide

Welcome to **git-devkit** contributors! 👋

This guide explains the project structure and naming conventions to help you understand how to contribute effectively.

---

## Understanding the Project

### What is git-devkit?

**git-devkit** is a comprehensive developer toolkit for Git advanced users. It's designed to provide a one-stop solution for Git workflows, best practices, and helpful tools.

Currently, git-devkit includes:
- **git-multi-ssh** - CLI tool for managing multiple Git SSH identities

Future additions may include other Git tools and utilities.

### What is git-multi-ssh?

**git-multi-ssh** is the primary CLI tool within git-devkit. It helps developers manage multiple Git SSH identities on a single machine, preventing common mistakes like:
- Wrong email in commits
- SSH keys not working for an account
- Messy manual config files

---

## Naming Quick Reference

| What? | Use This Name | Context |
|-------|---------------|---------|
| The project root folder | **git-devkit** | Repository, folder, project |
| The CLI command | **git-multi-ssh** | Command line, executable |
| The package name | **git-devkit** | package.json, npm |
| Documentation scope | **git-devkit** | Docs, guides, setup |

### Examples

✅ **Correct Usage:**
- "Clone the git-devkit repository"
- "cd into the git-devkit folder"
- "Run: git-multi-ssh"
- "Contributing to git-devkit"
- "In the git-devkit project"
- "The git-multi-ssh tool provides..."

❌ **Incorrect Usage:**
- "Clone the git-multi-ssh repository" (it's git-devkit!)
- "cd into the git-multi-ssh folder" (it's git-devkit!)
- "The git-devkit tool provides..." (it's git-multi-ssh!)

---

## Project Structure

```
git-devkit/
├── bin/
│   └── index.js                    ← git-multi-ssh CLI entry point
├── lib/
│   ├── utils.js                    ← Cross-platform utilities
│   ├── fileManager.js              ← SSH/Git config management
│   └── generator.js                ← Config generation
├── setup.js                        ← Universal setup script
├── package.json                    ← Project metadata
├── README.md                       ← Main documentation
├── START_HERE.md                   ← Quick start
├── QUICK_START.md                  ← Quick reference
├── PROJECT_STRUCTURE.md            ← Project layout
├── CONTRIBUTORS_GUIDE.md           ← This file
└── [other docs...]
```

**Key Point:** The root folder is always **git-devkit**, and it contains the **git-multi-ssh** tool.

---

## Types of Contributions

### 1. Contributing to git-multi-ssh (the tool)

**Files you'll modify:**
- `bin/index.js` - CLI logic
- `lib/utils.js` - Utilities
- `lib/fileManager.js` - Config management
- `lib/generator.js` - Config generation

**Commit message example:**
```
feat: Add support for custom SSH key names in git-multi-ssh
fix: Improve error handling in git-multi-ssh SSH key generation
```

### 2. Contributing to git-devkit (the project)

**Files you'll modify:**
- Documentation (`*.md`)
- Setup scripts (`setup.js`, `setup.sh`, etc.)
- Configuration (`package.json`)
- Project-level changes

**Commit message example:**
```
docs: Update git-devkit documentation for contributors
feat: Improve git-devkit setup process
chore: Update git-devkit dependencies
```

### 3. Adding New Tools to git-devkit

When adding new tools to the git-devkit toolkit:

```
git-devkit/
├── bin/
│   ├── index.js                    ← git-multi-ssh
│   └── git-new-tool.js            ← New tool (future)
└── [existing structure...]
```

**Commit message:**
```
feat(git-devkit): Add new git-workflow-tool to the toolkit
```

---

## Commit Message Convention

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (not functional)
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Adding/updating tests
- `chore` - Build, dependencies, etc.

### Scope (Example)
- `git-multi-ssh` - The tool
- `git-devkit` - The project
- `docs` - Documentation
- `setup` - Setup process
- `cross-platform` - Cross-platform support

### Examples

```
feat(git-multi-ssh): Add support for ed25519 keys
fix(git-multi-ssh): Resolve Windows path issues
docs(git-devkit): Add contributor's guide
chore(git-devkit): Update dependencies
refactor(git-multi-ssh): Simplify key generation logic
```

---

## PR Guidelines

### Before Submitting a PR

1. ✅ Read this guide
2. ✅ Read [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
3. ✅ Use correct naming (git-devkit vs git-multi-ssh)
4. ✅ Update relevant documentation
5. ✅ Test on multiple platforms (Windows, macOS, Linux)
6. ✅ Follow commit message conventions

### PR Title

Use the format:
```
<type>(<scope>): <description>
```

**Examples:**
```
feat(git-multi-ssh): Add SSH key renewal support
fix(git-devkit): Improve cross-platform path handling
docs(git-devkit): Add Windows setup guide
```

### PR Description

Include:
1. **What** - What does this PR do?
2. **Why** - Why is this needed?
3. **How** - How does it work?
4. **Testing** - What did you test?
5. **Platforms** - Which platforms did you test on?

**Template:**
```markdown
## What
Adds support for [feature].

## Why
This is needed because [reason].

## How
- Modified [file]
- Updated [file]
- Added [functionality]

## Testing
- [x] Tested on macOS
- [x] Tested on Windows
- [x] Tested on Linux
- [x] Verified [specific functionality]

## Related
Closes #[issue number]
```

---

## Setting Up for Development

### 1. Clone git-devkit
```bash
git clone https://github.com/user/git-devkit.git
cd git-devkit
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Link for Local Testing
```bash
npm link
```

Now you can test git-multi-ssh locally:
```bash
git-multi-ssh
```

### 4. Test Your Changes
```bash
# Verify syntax
node -c lib/fileManager.js
node -c bin/index.js

# Run the tool
git-multi-ssh

# Test setup
npm run setup
```

---

## Testing Checklist

Before submitting a PR, verify:

### ✅ Code Quality
- [ ] No syntax errors: `node -c <file>.js`
- [ ] Follows project style
- [ ] Proper error handling
- [ ] Clear comments for complex logic

### ✅ Cross-Platform Testing
- [ ] Works on macOS
- [ ] Works on Windows (PowerShell and Command Prompt)
- [ ] Works on Linux
- [ ] Uses cross-platform utilities where needed

### ✅ Documentation
- [ ] Updated relevant `.md` files
- [ ] Clear commit messages
- [ ] Updated CHANGELOG.md if applicable
- [ ] Code comments for complex logic

### ✅ git-multi-ssh Specific
- [ ] SSH key generation works
- [ ] Git config updates correctly
- [ ] SSH config updates correctly
- [ ] Error messages are helpful

### ✅ git-devkit Project
- [ ] Setup process works
- [ ] Documentation is accurate
- [ ] Naming is consistent (git-devkit vs git-multi-ssh)

---

## Common Tasks

### Adding a Feature to git-multi-ssh

1. Modify `bin/index.js` or lib files
2. Test: `npm link && git-multi-ssh`
3. Update documentation if needed
4. Commit: `feat(git-multi-ssh): Add feature`
5. Submit PR

### Improving Documentation

1. Edit markdown files
2. Check formatting: `cat <file>.md | less`
3. Commit: `docs(git-devkit): Update documentation`
4. Submit PR

### Fixing a Bug

1. Create issue if not exists
2. Fix the bug in appropriate file
3. Test the fix: `git-multi-ssh`
4. Commit: `fix(git-multi-ssh): Fix issue #123`
5. Reference issue in commit

### Adding a New Tool to git-devkit

1. Create `bin/git-new-tool.js`
2. Add to package.json `bin` section
3. Update documentation
4. Commit: `feat(git-devkit): Add git-new-tool`
5. Update DOCUMENTATION_INDEX.md

---

## Questions?

### For understanding the project:
- Read [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
- Read [README.md](../../README.md)

### For setup issues:
- Read [START_HERE.md](../getting-started/START_HERE.md)
- Read [CROSS_PLATFORM.md](../getting-started/CROSS_PLATFORM.md)

### For code questions:
- Check existing code comments
- Read lib files (they're well-documented)
- Open an issue for discussion

---

## Getting Help

1. **Open an Issue** - For bugs or feature requests
2. **Start a Discussion** - For questions or ideas
3. **Read Docs** - Most answers are in the documentation
4. **Check Code** - The code is well-commented

---

## Summary for Quick Reference

| Item | Value |
|------|-------|
| Project name | git-devkit |
| Tool name | git-multi-ssh |
| Root folder | git-devkit |
| Setup command | `npm run setup` |
| Run tool | `git-multi-ssh` |
| Link for dev | `npm link` |
| Commit scope | `(git-devkit)` or `(git-multi-ssh)` |
| Target audience | Git advanced users, contributors |

---

**Thank you for contributing to git-devkit! 🚀**
