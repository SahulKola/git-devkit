@echo off
REM ============================================================================
REM Git Aliases Installation Script for Windows
REM Installs productive Git aliases globally
REM Inspired by https://github.com/GitAlias/gitalias
REM ============================================================================

setlocal enabledelayedexpansion

echo.
echo 🚀 Setting up Git productivity aliases...
echo.

REM ---------------------------------------------------------------------------
REM Shorthand aliases
REM ---------------------------------------------------------------------------
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

REM ---------------------------------------------------------------------------
REM Log and history aliases
REM ---------------------------------------------------------------------------
git config --global alias.lg "log --graph --pretty=format:'%%Cred%%h%%Creset -%%C(yellow)%%d%%Creset %%s %%Cgreen(%%cr) %%C(bold blue)<%%an>%%Creset' --abbrev-commit"
git config --global alias.ll "log --oneline --decorate --all --graph"
git config --global alias.last "log -1 HEAD --stat"
git config --global alias.today "log --since=midnight --oneline --no-merges"
git config --global alias.week "log --since='1 week ago' --oneline --no-merges"
git config --global alias.contrib "shortlog --summary --numbered"

REM ---------------------------------------------------------------------------
REM Undo and fix aliases
REM ---------------------------------------------------------------------------
git config --global alias.undo "reset --soft HEAD~1"
git config --global alias.unstage "reset HEAD --"
git config --global alias.uncommit "reset --soft HEAD~1"

REM ---------------------------------------------------------------------------
REM Branch management aliases
REM ---------------------------------------------------------------------------
git config --global alias.branches "branch -av"
git config --global alias.stash-all "stash save --include-untracked"
git config --global alias.stash-pop "stash pop"

REM ---------------------------------------------------------------------------
REM Merge and rebase aliases
REM ---------------------------------------------------------------------------
git config --global alias.merge-no-ff "merge --no-ff"

REM ---------------------------------------------------------------------------
REM Cleanup aliases
REM ---------------------------------------------------------------------------
git config --global alias.clean-branches "branch -vv | grep '\[gone\]' | awk '{print $1}' | xargs -r git branch -d"

echo.
echo ✅ Git aliases configured!
echo.
