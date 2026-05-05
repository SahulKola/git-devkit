# Naming Conventions - git-devkit vs git-multi-ssh

## Quick Reference

| Use Case | Name | Example |
|----------|------|---------|
| **Project/Toolkit** | git-devkit | "Clone git-devkit", "Contribute to git-devkit" |
| **CLI Tool** | git-multi-ssh | "Run git-multi-ssh", "The git-multi-ssh tool" |
| **Root Folder** | git-devkit | "In the git-devkit folder" |
| **npm Package** | git-devkit | "npm install git-devkit" |
| **Repository** | git-devkit | "github.com/.../git-devkit" |

---

## When to Use Each Name

### ✅ Use "git-devkit"

**Project Context:**
- "The git-devkit project provides..."
- "Contribute to git-devkit"
- "git-devkit is a toolkit for..."
- "In the git-devkit repository"
- "The git-devkit folder contains..."

**Setup & Installation:**
- "Install git-devkit: `npm install git-devkit`"
- "Clone git-devkit repository"
- "Set up git-devkit: `npm run setup`"
- "git-devkit includes multiple tools"

**Documentation:**
- "git-devkit documentation"
- "git-devkit setup guide"
- "Contributing to git-devkit"

**Root References:**
- "In the git-devkit root folder"
- "The git-devkit structure"
- "git-devkit/bin/index.js"
- "git-devkit/lib/utils.js"

---

### ✅ Use "git-multi-ssh"

**Tool Context:**
- "The git-multi-ssh tool manages..."
- "Run git-multi-ssh to create accounts"
- "git-multi-ssh generates SSH keys"
- "git-multi-ssh configures Git"

**CLI Usage:**
- "Execute: `git-multi-ssh`"
- "The git-multi-ssh command"
- "`git-multi-ssh` for managing identities"
- "Run `npm start` or `git-multi-ssh`"

**Feature Context:**
- "git-multi-ssh supports GitHub, GitLab, Bitbucket"
- "git-multi-ssh creates ed25519 keys"
- "git-multi-ssh handles SSH config"
- "git-multi-ssh integrates with ssh-agent"

**Documentation:**
- "git-multi-ssh documentation"
- "Features of git-multi-ssh"
- "git-multi-ssh configuration"

---

### ❌ Avoid These Combinations

| Wrong | Reason | Right |
|-------|--------|-------|
| "Clone git-multi-ssh repo" | Repo is git-devkit | "Clone git-devkit repo" |
| "cd git-multi-ssh" | Folder is git-devkit | "cd git-devkit" |
| "The git-devkit tool provides..." | That's git-multi-ssh! | "The git-multi-ssh tool provides..." |
| "Install git-multi-ssh" | Package is git-devkit | "Install git-devkit" |
| "Run git-devkit" | Command is git-multi-ssh | "Run git-multi-ssh" |
| "git-devkit/bin/git-multi-ssh.js" | Correct: git-devkit/bin/index.js | "git-devkit/bin/index.js" |

---

## Documentation Examples

### README Section
```markdown
# git-devkit

A comprehensive developer toolkit for Git advanced users.

## git-multi-ssh

git-multi-ssh is the core tool within git-devkit for managing 
multiple Git SSH identities.
```

### Installation Guide
```markdown
## Install git-devkit

1. Clone git-devkit:
\`\`\`bash
git clone https://github.com/user/git-devkit.git
cd git-devkit
\`\`\`

2. Set up git-devkit:
\`\`\`bash
npm run setup
\`\`\`

3. Run git-multi-ssh:
\`\`\`bash
git-multi-ssh
\`\`\`
```

### Feature Documentation
```markdown
## git-multi-ssh Features

The git-multi-ssh tool includes:
- Multiple SSH identity management
- Per-folder git configuration
- Automatic SSH key generation
- Cross-platform support

All included in git-devkit for ease of use.
```

### Contribution Guide
```markdown
## Contributing to git-devkit

To contribute to the git-devkit project:

1. Fork git-devkit
2. Create a feature branch
3. Make your changes (to git-multi-ssh or documentation)
4. Submit a PR to git-devkit

Commit message example:
\`feat(git-multi-ssh): Add new feature\`
```

---

## File Path References

When referencing files in git-devkit:

### ✅ Correct
```
git-devkit/bin/index.js              ← tool entry point
git-devkit/lib/fileManager.js        ← tool library
git-devkit/setup.js                  ← project setup
git-devkit/README.md                 ← project docs
git-devkit/CONTRIBUTORS_GUIDE.md     ← project docs
```

### ❌ Incorrect
```
git-multi-ssh/bin/index.js           (repo is git-devkit!)
multi-ssh/lib/fileManager.js         (wrong repo name)
git-multi-ssh/setup.js               (repo is git-devkit!)
```

---

## Commit Message Examples

### Feature Commits
```
feat(git-multi-ssh): Add SSH key rotation support
feat(git-devkit): Add new documentation section
feat(git-devkit): Improve setup process
```

### Fix Commits
```
fix(git-multi-ssh): Resolve Windows path issue
fix(git-devkit): Update installation guide
```

### Documentation
```
docs(git-devkit): Add contributor's guide
docs(git-multi-ssh): Clarify SSH configuration
```

### Chore/Setup
```
chore(git-devkit): Update dependencies
chore(git-devkit): Improve build process
```

---

## In Different Contexts

### GitHub Issues
```
Title: "Feature Request: Add git-multi-ssh support for Gitea"
Body: "In the git-devkit project, git-multi-ssh could support..."
```

### GitHub PRs
```
Title: "feat(git-multi-ssh): Add Gitea support"
Description: "Adds Gitea as a provider option to the git-multi-ssh tool
 within the git-devkit toolkit..."
```

### Release Notes
```
# git-devkit v1.0.0

## git-multi-ssh Improvements
- Added support for 5 new Git providers
- Improved SSH key security

## git-devkit Project
- Expanded documentation
- Added contributor guide
```

---

## Common Phrases

### ✅ Correct Phrasing

- "The git-devkit project includes git-multi-ssh"
- "Install git-devkit to use git-multi-ssh"
- "Run git-multi-ssh to manage SSH identities"
- "Contributing to git-devkit welcomes PRs"
- "git-devkit is maintained at..."
- "The git-devkit root folder contains..."
- "git-multi-ssh provides SSH key management"
- "git-devkit is a toolkit for..."
- "Set up git-devkit with: npm run setup"
- "The git-multi-ssh tool integrates with..."

### ❌ Incorrect Phrasing

- "The git-multi-ssh project includes..." (it's git-devkit!)
- "Install git-multi-ssh to use..." (it's git-devkit!)
- "The git-devkit tool manages..." (it's git-multi-ssh!)
- "Contributing to git-multi-ssh welcomes..." (it's git-devkit!)
- "Clone git-multi-ssh to..." (it's git-devkit!)

---

## For Marketing/External

### Website/Blog
```
"git-devkit: A comprehensive developer toolkit for Git advanced users.

At its core, git-devkit includes git-multi-ssh, a powerful tool 
for managing multiple Git SSH identities on a single machine."
```

### Social Media
```
✅ "Check out git-devkit, a toolkit for Git power users!"
✅ "Manage multiple Git identities with git-devkit's git-multi-ssh tool"
❌ "Check out git-multi-ssh, a toolkit..."
```

### Press Release
```
"Introducing git-devkit, a comprehensive toolkit for advanced Git users.

The first tool included in git-devkit is git-multi-ssh, which helps 
developers manage multiple Git SSH identities..."
```

---

## Summary Table

| Situation | Use | Example |
|-----------|-----|---------|
| Root folder reference | git-devkit | "In git-devkit root" |
| Clone command | git-devkit | "git clone ... git-devkit" |
| npm package | git-devkit | "npm install git-devkit" |
| Setup process | git-devkit | "npm run setup in git-devkit" |
| CLI command | git-multi-ssh | "Run git-multi-ssh" |
| Tool features | git-multi-ssh | "git-multi-ssh manages SSH keys" |
| Project name | git-devkit | "The git-devkit project" |
| Repository | git-devkit | "github.com/user/git-devkit" |
| Contributing | git-devkit | "Contribute to git-devkit" |
| File paths | git-devkit | "git-devkit/bin/index.js" |

---

## Testing Your Usage

Ask yourself:

1. **Are you talking about the entire project/toolkit?**
   → Use **git-devkit**

2. **Are you talking about the CLI command or tool?**
   → Use **git-multi-ssh**

3. **Are you talking about the root folder/repo?**
   → Use **git-devkit**

4. **Are you talking about file paths?**
   → Use **git-devkit** as the root

---

**When in doubt, remember:**
- **git-devkit** = The whole toolkit/project
- **git-multi-ssh** = The CLI tool within it

This clarity helps both new contributors and users understand the structure! 🎯
