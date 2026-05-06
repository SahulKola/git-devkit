# git-devkit

git-devkit is a cross-platform Git identity toolkit.

The primary CLI inside this project is `git-multi-ssh`, which helps you manage multiple Git/SSH identities (work, personal, client) safely and predictably across Windows, macOS, and Linux.

## Naming

- Project/repository/root folder: `git-devkit`
- CLI tool/command: `git-multi-ssh`

## What Changed (Advanced Updates)

The repository now includes major improvements:

- Cross-platform support for Windows, macOS, and Linux
- Case-aware matching strategy by OS
  - Windows/macOS use `gitdircase`
  - Linux uses `gitdir`
- Path normalization across OS path styles (`/`, `\\`, `~`, spaces)
- Pure Node.js file operations for setup/config workflows
  - Replaced shell-dependent operations with `fs`, `path`, and `os`
- Universal setup entrypoint
  - `npm run setup` works as the main setup flow
- Improved config parsing for includeIf path patterns
- Clear project/tool naming and contributor documentation

## Core Capabilities

`git-multi-ssh` automates account isolation by folder:

1. Creates SSH keys per identity
2. Updates `~/.ssh/config` in managed blocks
3. Creates per-account Git config includes
4. Configures `includeIf` rules by repo root
5. Verifies SSH/Git setup with guided checks

## Prerequisites

- Node.js 18+
- npm
- Git
- OpenSSH tools (`ssh`, `ssh-keygen`, `ssh-add`)

## Install

### Clone and run setup (recommended)

```bash
git clone https://github.com/sahulkola/git-devkit.git
cd git-devkit
npm install
npm run setup
```

### For contributors and local development

```bash
git clone https://github.com/sahulkola/git-devkit.git
cd git-devkit
npm install
npm link
```

Then run:

```bash
git-multi-ssh
```

## Usage

Start interactive setup:

```bash
git-multi-ssh
```

You will be guided through:

- Account label (for example `work`, `personal`)
- Git user name and email
- Provider host alias and SSH key path
- Project root directory for automatic identity routing

## Cross-Platform Notes

- Windows/macOS matching is effectively case-insensitive via `gitdircase`
- Linux matching is case-sensitive via `gitdir`
- Paths are normalized before writing rules so mixed separators and user input styles are handled consistently

## Project Structure

```text
git-devkit/
  bin/                  # CLI entrypoints (git-multi-ssh)
  lib/                  # Core generation + file management logic
  handbook/             # Categorized project documentation
    getting-started/
    guides/
    technical/
    status/
  docs-app/             # Angular documentation site
  setup.js              # Universal setup script
```

## Documentation

Start with the handbook index:

- [Documentation Index](handbook/README.md)

Quick links by category:

- Getting started: [handbook/getting-started/START_HERE.md](handbook/getting-started/START_HERE.md)
- Quick setup: [handbook/getting-started/QUICK_START.md](handbook/getting-started/QUICK_START.md)
- Cross-platform details: [handbook/getting-started/CROSS_PLATFORM.md](handbook/getting-started/CROSS_PLATFORM.md)
- Project naming and structure: [handbook/guides/PROJECT_STRUCTURE.md](handbook/guides/PROJECT_STRUCTURE.md)
- Contributor guide: [handbook/guides/CONTRIBUTORS_GUIDE.md](handbook/guides/CONTRIBUTORS_GUIDE.md)
- Technical changes: [handbook/technical/CROSS_PLATFORM_CHANGES.md](handbook/technical/CROSS_PLATFORM_CHANGES.md)
- Validation matrix: [handbook/technical/VALIDATION.md](handbook/technical/VALIDATION.md)

## Troubleshooting

If setup is not working as expected:

- [handbook/getting-started/CROSS_PLATFORM.md](handbook/getting-started/CROSS_PLATFORM.md)
- [handbook/technical/VALIDATION.md](handbook/technical/VALIDATION.md)
- [handbook/technical/ISSUES_FIXED.md](handbook/technical/ISSUES_FIXED.md)

## Contributing

Please read:

- [handbook/guides/CONTRIBUTORS_GUIDE.md](handbook/guides/CONTRIBUTORS_GUIDE.md)
- [handbook/guides/NAMING_GUIDE.md](handbook/guides/NAMING_GUIDE.md)

## Quality Checks

Run documentation link validation before pushing:

```bash
npm run docs:check
```

This verifies local markdown links across project-authored docs and fails if a target file is missing.

## License

MIT
