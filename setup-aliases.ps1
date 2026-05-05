# ============================================================================
# Git Aliases Installation Script for Windows (PowerShell)
# Installs productive Git aliases globally
# Inspired by https://github.com/GitAlias/gitalias
# ============================================================================

Write-Host "`n🚀 Setting up Git productivity aliases...`n" -ForegroundColor Green

# ---------------------------------------------------------------------------
# Shorthand aliases
# ---------------------------------------------------------------------------
& git config --global alias.s "status --short --branch"
& git config --global alias.st "status"
& git config --global alias.co "checkout"
& git config --global alias.cb "checkout -b"
& git config --global alias.br "branch"
& git config --global alias.ci "commit"
& git config --global alias.cm "commit -m"
& git config --global alias.ca "commit --amend"
& git config --global alias.can "commit --amend --no-edit"
& git config --global alias.d "diff"
& git config --global alias.ds "diff --staged"
& git config --global alias.a "add"
& git config --global alias.aa "add --all"
& git config --global alias.ap "add --patch"
& git config --global alias.f "fetch --all --prune"
& git config --global alias.pl "pull"
& git config --global alias.ps "push"
& git config --global alias.pf "push --force-with-lease"
& git config --global alias.cp "cherry-pick"

# ---------------------------------------------------------------------------
# Log and history aliases
# ---------------------------------------------------------------------------
& git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
& git config --global alias.ll "log --oneline --decorate --all --graph"
& git config --global alias.last "log -1 HEAD --stat"
& git config --global alias.today "log --since=midnight --oneline --no-merges"
& git config --global alias.week "log --since='1 week ago' --oneline --no-merges"
& git config --global alias.contrib "shortlog --summary --numbered"

# ---------------------------------------------------------------------------
# Undo and fix aliases
# ---------------------------------------------------------------------------
& git config --global alias.undo "reset --soft HEAD~1"
& git config --global alias.unstage "reset HEAD --"
& git config --global alias.uncommit "reset --soft HEAD~1"

# ---------------------------------------------------------------------------
# Branch management aliases
# ---------------------------------------------------------------------------
& git config --global alias.branches "branch -av"
& git config --global alias.stash-all "stash save --include-untracked"
& git config --global alias.stash-pop "stash pop"

# ---------------------------------------------------------------------------
# Merge and rebase aliases
# ---------------------------------------------------------------------------
& git config --global alias.merge-no-ff "merge --no-ff"

Write-Host "`n✅ Git aliases configured!`n" -ForegroundColor Green
