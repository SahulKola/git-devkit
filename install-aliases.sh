#!/bin/bash

set -e

# ============================================================================
# Git Aliases Installation Script
# Installs productive Git aliases globally
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
git config --global alias.amend "commit --amend --no-edit"

# ---------------------------------------------------------------------------
# Merge & rebase aliases
# ---------------------------------------------------------------------------
git config --global alias.mg "merge --no-ff"
git config --global alias.rb "rebase"
git config --global alias.rbc "rebase --continue"
git config --global alias.rba "rebase --abort"

# ---------------------------------------------------------------------------
# Clean & maintenance aliases
# ---------------------------------------------------------------------------
git config --global alias.clean-branches "branch -vv | grep ': gone]' | awk '{print $1}' | xargs -r git branch -d"
git config --global alias.prune "fetch --all --prune"

echo ""
echo "✅ Done! Your Git aliases are ready."
echo ""
echo "Quick reference:"
echo "  git s          - status --short --branch"
echo "  git lg         - visual commit history"
echo "  git undo       - undo last commit (keeps changes)"
echo "  git co         - checkout"
echo "  git cm 'msg'   - commit with message"
echo ""
echo "For full list of aliases, run: git config --global --get-regexp alias"
