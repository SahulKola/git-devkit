#!/bin/bash

set -e

# ============================================================================
# Git Aliases Setup Script
# Inspired by https://github.com/GitAlias/gitalias
# ============================================================================

echo "🚀 Setting up Git productivity aliases..."
echo ""

# ---------------------------------------------------------------------------
# Shorthand aliases
# ---------------------------------------------------------------------------
git config --global alias.s "status --short --branch"
git config --global alias.st "status"
git config --global alias.co "checkout"
git config --global alias.cb "checkout -b"
git config --global alias.br "branch"
git config --global alias.ci "commit"
git config --global alias.cm "commit -m"
git config --global alias.ca "commit --amend"
git config --global alias.can "commit --amend --no-edit"
git config --global alias.d "diff"
git config --global alias.ds "diff --staged"
git config --global alias.a "add"
git config --global alias.aa "add --all"
git config --global alias.ap "add --patch"
git config --global alias.f "fetch --all --prune"
git config --global alias.pl "pull"
git config --global alias.ps "push"
git config --global alias.pf "push --force-with-lease"
git config --global alias.cp "cherry-pick"

# ---------------------------------------------------------------------------
# Log & history aliases
# ---------------------------------------------------------------------------
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
git config --global alias.ll "log --oneline --decorate --all --graph"
git config --global alias.last "log -1 HEAD --stat"
git config --global alias.today "log --since=midnight --oneline --no-merges"
git config --global alias.week "log --since='1 week ago' --oneline --no-merges"
git config --global alias.contrib "shortlog --summary --numbered"

# ---------------------------------------------------------------------------
# Undo & fix aliases
# ---------------------------------------------------------------------------
git config --global alias.undo "reset --soft HEAD~1"
git config --global alias.unstage "reset HEAD --"
git config --global alias.discard "checkout --"
git config --global alias.wipe "!git add -A && git commit -qm 'WIPE SAVEPOINT' && git reset HEAD~1 --hard"
git config --global alias.uncommit "reset --mixed HEAD~1"

# ---------------------------------------------------------------------------
# Branch management
# ---------------------------------------------------------------------------
git config --global alias.bra "branch -a"
git config --global alias.brd "branch -d"
git config --global alias.brD "branch -D"
git config --global alias.merged "branch --merged"
git config --global alias.unmerged "branch --no-merged"
git config --global alias.cleanup "!git branch --merged | grep -v '\\*\\|main\\|master\\|develop' | xargs -n 1 git branch -d"
git config --global alias.gone "!git fetch -p && git branch -vv | grep ': gone]' | awk '{print \$1}'"

# ---------------------------------------------------------------------------
# Stash aliases
# ---------------------------------------------------------------------------
git config --global alias.ss "stash save"
git config --global alias.sp "stash pop"
git config --global alias.sl "stash list"
git config --global alias.sd "stash drop"
git config --global alias.sa "stash apply"

# ---------------------------------------------------------------------------
# Working with remotes
# ---------------------------------------------------------------------------
git config --global alias.rv "remote -v"
git config --global alias.sync "!git fetch --all --prune && git pull"
git config --global alias.publish "!git push -u origin \$(git branch --show-current)"
git config --global alias.unpublish "!git push origin --delete \$(git branch --show-current)"

# ---------------------------------------------------------------------------
# Workflow aliases
# ---------------------------------------------------------------------------
git config --global alias.wip "!git add -A && git commit -m 'WIP: work in progress [skip ci]'"
git config --global alias.save "!git add -A && git commit -m 'SAVEPOINT'"
git config --global alias.done "!git fetch && git rebase origin/main"
git config --global alias.fresh "!git fetch origin && git reset --hard origin/\$(git branch --show-current)"
git config --global alias.squash "!f() { git reset --soft HEAD~\${1:-2} && git commit --edit -m\"\$(git log --format=%B --reverse HEAD..HEAD@{1})\"; }; f"

# ---------------------------------------------------------------------------
# Information aliases
# ---------------------------------------------------------------------------
git config --global alias.aliases "config --get-regexp ^alias\\."
git config --global alias.whoami "!git config user.name && git config user.email"
git config --global alias.root "rev-parse --show-toplevel"
git config --global alias.count "rev-list --count HEAD"
git config --global alias.stats "diff --stat"
git config --global alias.who "shortlog -sne"

# ---------------------------------------------------------------------------
# File aliases
# ---------------------------------------------------------------------------
git config --global alias.find "!git ls-files | grep -i"
git config --global alias.ignored "ls-files --others --ignored --exclude-standard"
git config --global alias.untracked "ls-files --others --exclude-standard"

# ---------------------------------------------------------------------------
# Diff & merge aliases
# ---------------------------------------------------------------------------
git config --global alias.conflicts "diff --name-only --diff-filter=U"
git config --global alias.ours "checkout --ours --"
git config --global alias.theirs "checkout --theirs --"
git config --global alias.patch "!git diff > /tmp/git-patch-\$(date +%s).patch && echo 'Patch saved to /tmp/'"

# ---------------------------------------------------------------------------
# Interactive / advanced aliases
# ---------------------------------------------------------------------------
git config --global alias.ri "rebase --interactive"
git config --global alias.rc "rebase --continue"
git config --global alias.ra "rebase --abort"
git config --global alias.fixup "commit --fixup"
git config --global alias.autofix "!git log --oneline -20 | fzf | cut -d' ' -f1 | xargs git commit --fixup"

echo ""
echo "✅ Git aliases installed successfully!"
echo ""
echo "📋 Quick reference:"
echo "   git s       → short status"
echo "   git lg      → pretty log graph"
echo "   git undo    → undo last commit (keep changes)"
echo "   git wip     → quick WIP commit"
echo "   git cleanup → delete merged branches"
echo "   git aliases → list all configured aliases"
echo ""
echo "💡 Run 'git aliases' to see all installed aliases."
