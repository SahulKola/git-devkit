# git-multi-ssh

Manage multiple Git accounts on one machine without confusion.

If you switch between personal projects, work, and client code, this tool prevents common mistakes like:
- Wrong email in commits
- SSH keys not working for one account
- Messy manual config files

It automates everything so each project folder automatically uses the right SSH key, email, and Git settings.

## How it works

When you create a new account (like `work` or `personal`), the tool:
1. Generates an SSH key just for that account
2. Updates your SSH settings to use the right key for each folder
3. Sets up Git to use the correct name and email per folder
4. Shows you the public key to add to GitHub, GitLab, etc.
5. Tests that everything works

## Prerequisites

- macOS, Linux, or Windows (WSL/Git Bash recommended)
- Node.js 18+
- npm
- Git
- OpenSSH (`ssh`, `ssh-keygen`, `ssh-add`)

## Install

### Quick setup (One command)

The fastest way to get started:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/sahulkola/git-multi-ssh/main/setup.sh)
```

**What this does:**
1. Downloads and runs `setup.sh` from the repo
2. Clones (or updates) the repo to `~/.git-multi-ssh`
3. Installs npm dependencies
4. Makes `git-multi-ssh` available globally

After it finishes, you'll see:
```
✅ Done! Run: git-multi-ssh
```

Then start using it right away:

```bash
git-multi-ssh
```

**Note:** This requires `curl`, `git`, `Node.js`, and `npm` to be installed already. See [Prerequisites](#prerequisites) above.

### Local setup (For development or manual control)

If you prefer more control or want to contribute:

```bash
git clone https://github.com/sahulkola/git-multi-ssh.git
cd git-multi-ssh
npm install
npm link
```

Then run:

```bash
git-multi-ssh
```

## Getting started (first time)

When you run the tool for the first time, it will ask:
- **Your name** — shown in commit history
- **Account label** — a simple name like "work" or "personal"
- **Email** — the email that should appear in commits
- **Git provider** — GitHub, GitLab, Bitbucket, or a self-hosted server
- **Project folder** — where your repos for this account are stored

Example:
```
Name: Alex Doe
Label: work
Email: alex@company.com
Provider: GitHub
Folder: ~/Projects/work
```

## Common setups

### Personal + Work

Create two accounts:
- `personal` for `~/Projects/personal` (personal email)
- `work` for `~/Projects/work` (company email)

Now commits in each folder use the right email automatically.

### Multiple clients

If you work with different clients, create one account per client:
- `client-acme` for `~/Clients/acme`
- `client-zenith` for `~/Clients/zenith`

Each client's repos use their own SSH key and email.

### Self-hosted Git server

You can use this with any Git server. When setting up, choose "Custom" and enter your server address like `git.mycompany.com`.

The tool will generate the SSH and Git config blocks in the same way.

## Cloning repositories

After setup, the tool creates custom host names you use when cloning. For example:

If you created a `work` account on GitHub:
```bash
git clone git@github-work:my-company/my-repo.git
```

If you created a `personal` account on GitLab:
```bash
git clone git@gitlab-personal:my-username/my-project.git
```

The tool automatically uses the right SSH key and email for each repo based on where it's located.

## Adding more accounts later

You can run the tool again anytime to:
- Add a new account
- Update an existing account
- View your setup

The tool safely updates your config files without breaking anything else.

## Useful Git shortcuts (optional)

Want to save time typing? Run:

```bash
bash setup-aliases.sh
```

This adds convenient shortcuts:
- `git s` — quick status
- `git lg` — visual commit history
- `git undo` — undo last commit (keeps your changes)

## Having problems?

### "git-multi-ssh: command not found"

Make sure it's installed globally:
```bash
npm link
```

Then close and reopen your terminal.

### SSH key works but connections still fail

Check that:
- You added the public key to your GitHub/GitLab account
- You're using the right host alias when cloning (e.g., `github-work`)

Test the connection:
```bash
ssh -T git@github.com
```

### Commits showing wrong email

Inside your repo folder, check which identity is active:
```bash
git config user.name
git config user.email
```

If it's wrong, make sure the repo folder matches what you set up.

## Learn more

Full guides and tutorials are available at the **[git-devkit documentation](https://sahulkola.github.io/git-multi-ssh/)**.

Topics covered:
- Step-by-step setup for different providers
- Common workflows and best practices
- Video walkthroughs
- Real-world examples

## For developers

Want to contribute or run locally?

```bash
git clone https://github.com/sahulkola/git-multi-ssh.git
cd git-multi-ssh
npm install
npm link
```

To develop the docs site:
```bash
cd docs-app
pnpm install
pnpm start
```

To publish a new version:
```bash
npm run build
npm run pack:check
npm run publish:npm
```

## Feedback and ideas

Found a bug? Want a new feature? Have a question?

Open an issue or pull request on GitHub. All feedback helps make this tool better.

## License

MIT
