import { Component, computed, signal } from '@angular/core';

type DetectedOs = 'macos' | 'windows' | 'linux' | 'unknown';

interface GitAlias {
  command: string;
  expansion: string;
  description: string;
}

interface AliasCategory {
  name: string;
  aliases: GitAlias[];
}

@Component({
  selector: 'app-aliases',
  imports: [],
  templateUrl: './aliases.html',
  styleUrl: './aliases.scss',
})
export class Aliases {
  protected readonly detectedOs = signal<DetectedOs>(this.detectOs());
  protected readonly showResetAliases = signal(false);

  protected readonly osSummary = computed(() => {
    const currentOs = this.detectedOs();

    if (currentOs === 'windows') {
      return {
        label: 'Windows',
        recommendedOption: 'Option B',
        recommendationReason: 'Use PowerShell for the smoothest first-time setup on Windows.',
      };
    }

    if (currentOs === 'macos') {
      return {
        label: 'macOS',
        recommendedOption: 'Option A',
        recommendationReason: 'The one-line shell installer is the fastest path on macOS.',
      };
    }

    if (currentOs === 'linux') {
      return {
        label: 'Linux',
        recommendedOption: 'Option A',
        recommendationReason: 'The shell installer works best for most Linux environments.',
      };
    }

    return {
      label: 'Unknown OS',
      recommendedOption: 'Option A',
      recommendationReason: 'The shell install command is the standard fallback across Unix-like shells.',
    };
  });

  protected readonly topShortcuts = signal<GitAlias[]>([
    { command: 'git s', expansion: 'status --short --branch', description: 'Fast status with current branch context' },
    { command: 'git ap', expansion: 'add --patch', description: 'Stage only the exact hunks you want' },
    { command: 'git ds', expansion: 'diff --staged', description: 'Review staged changes before commit' },
    { command: 'git cm', expansion: 'commit -m', description: 'Commit with an inline message quickly' },
    { command: 'git lg', expansion: 'log --graph --pretty=...', description: 'Visual graph log for quick history checks' },
    { command: 'git publish', expansion: 'push -u origin $(current branch)', description: 'Push and track branch in one step' },
    { command: 'git undo', expansion: 'reset --soft HEAD~1', description: 'Undo last commit while keeping staged changes' },
    { command: 'git can', expansion: 'commit --amend --no-edit', description: 'Append staged fixes to the last commit' },
    { command: 'git pf', expansion: 'push --force-with-lease', description: 'Safe force push after rebase or squash' },
    { command: 'git cleanup', expansion: 'branch --merged | xargs git branch -d', description: 'Clean up merged local branches' },
  ]);

  protected readonly categories = signal<AliasCategory[]>([
    {
      name: 'Shorthand',
      aliases: [
        { command: 'git s', expansion: 'status --short --branch', description: 'Short status with branch info' },
        { command: 'git st', expansion: 'status', description: 'Full status' },
        { command: 'git co', expansion: 'checkout', description: 'Checkout branch or file' },
        { command: 'git cb', expansion: 'checkout -b', description: 'Create and switch to new branch' },
        { command: 'git br', expansion: 'branch', description: 'List or manage branches' },
        { command: 'git ci', expansion: 'commit', description: 'Commit staged changes' },
        { command: 'git cm', expansion: 'commit -m', description: 'Commit with inline message' },
        { command: 'git ca', expansion: 'commit --amend', description: 'Amend last commit' },
        { command: 'git can', expansion: 'commit --amend --no-edit', description: 'Amend without changing message' },
        { command: 'git d', expansion: 'diff', description: 'Show unstaged changes' },
        { command: 'git ds', expansion: 'diff --staged', description: 'Show staged changes' },
        { command: 'git a', expansion: 'add', description: 'Stage files' },
        { command: 'git aa', expansion: 'add --all', description: 'Stage all changes' },
        { command: 'git ap', expansion: 'add --patch', description: 'Interactively stage hunks' },
        { command: 'git f', expansion: 'fetch --all --prune', description: 'Fetch all remotes and prune' },
        { command: 'git pl', expansion: 'pull', description: 'Pull from remote' },
        { command: 'git ps', expansion: 'push', description: 'Push to remote' },
        { command: 'git pf', expansion: 'push --force-with-lease', description: 'Safe force push' },
        { command: 'git cp', expansion: 'cherry-pick', description: 'Cherry-pick a commit' },
      ],
    },
    {
      name: 'Log & History',
      aliases: [
        { command: 'git lg', expansion: 'log --graph --pretty=...', description: 'Beautiful colored graph log' },
        { command: 'git ll', expansion: 'log --oneline --decorate --all --graph', description: 'All branches one-line graph' },
        { command: 'git last', expansion: 'log -1 HEAD --stat', description: 'Show last commit with stats' },
        { command: 'git today', expansion: 'log --since=midnight --oneline --no-merges', description: 'Commits made today' },
        { command: 'git week', expansion: 'log --since=\'1 week ago\' --oneline --no-merges', description: 'Commits made this week' },
        { command: 'git contrib', expansion: 'shortlog --summary --numbered', description: 'Contributors ranked by commits' },
      ],
    },
    {
      name: 'Undo & Fix',
      aliases: [
        { command: 'git undo', expansion: 'reset --soft HEAD~1', description: 'Undo last commit, keep changes staged' },
        { command: 'git unstage', expansion: 'reset HEAD --', description: 'Unstage files' },
        { command: 'git discard', expansion: 'checkout --', description: 'Discard working directory changes' },
        { command: 'git uncommit', expansion: 'reset --mixed HEAD~1', description: 'Undo commit, unstage changes' },
        { command: 'git wipe', expansion: 'add -A && commit && reset --hard', description: 'Save then wipe working directory' },
      ],
    },
    {
      name: 'Branch Management',
      aliases: [
        { command: 'git bra', expansion: 'branch -a', description: 'List all branches (local + remote)' },
        { command: 'git brd', expansion: 'branch -d', description: 'Delete branch (safe)' },
        { command: 'git brD', expansion: 'branch -D', description: 'Force delete branch' },
        { command: 'git merged', expansion: 'branch --merged', description: 'List merged branches' },
        { command: 'git unmerged', expansion: 'branch --no-merged', description: 'List unmerged branches' },
        { command: 'git cleanup', expansion: 'branch --merged | xargs git branch -d', description: 'Delete all merged branches' },
        { command: 'git gone', expansion: 'fetch -p && branch -vv | grep gone', description: 'Find branches with deleted remotes' },
      ],
    },
    {
      name: 'Stash',
      aliases: [
        { command: 'git ss', expansion: 'stash save', description: 'Stash with a message' },
        { command: 'git sp', expansion: 'stash pop', description: 'Pop latest stash' },
        { command: 'git sl', expansion: 'stash list', description: 'List all stashes' },
        { command: 'git sd', expansion: 'stash drop', description: 'Drop latest stash' },
        { command: 'git sa', expansion: 'stash apply', description: 'Apply stash without removing' },
      ],
    },
    {
      name: 'Remotes',
      aliases: [
        { command: 'git rv', expansion: 'remote -v', description: 'List remotes with URLs' },
        { command: 'git sync', expansion: 'fetch --all --prune && pull', description: 'Sync with all remotes' },
        { command: 'git publish', expansion: 'push -u origin $(current branch)', description: 'Push and track current branch' },
        { command: 'git unpublish', expansion: 'push origin --delete $(current branch)', description: 'Delete current branch from remote' },
      ],
    },
    {
      name: 'Workflow',
      aliases: [
        { command: 'git wip', expansion: 'add -A && commit -m "WIP"', description: 'Quick work-in-progress commit' },
        { command: 'git save', expansion: 'add -A && commit -m "SAVEPOINT"', description: 'Save all changes as checkpoint' },
        { command: 'git done', expansion: 'fetch && rebase origin/main', description: 'Rebase on latest main' },
        { command: 'git fresh', expansion: 'fetch && reset --hard origin/branch', description: 'Reset branch to remote state' },
        { command: 'git squash', expansion: 'reset --soft HEAD~N && commit', description: 'Squash last N commits' },
      ],
    },
    {
      name: 'Information',
      aliases: [
        { command: 'git aliases', expansion: 'config --get-regexp ^alias\\.', description: 'List all configured aliases' },
        { command: 'git whoami', expansion: 'config user.name && user.email', description: 'Show current git identity' },
        { command: 'git root', expansion: 'rev-parse --show-toplevel', description: 'Show repository root path' },
        { command: 'git count', expansion: 'rev-list --count HEAD', description: 'Count total commits' },
        { command: 'git stats', expansion: 'diff --stat', description: 'Show file change stats' },
        { command: 'git who', expansion: 'shortlog -sne', description: 'List all contributors' },
      ],
    },
    {
      name: 'File Operations',
      aliases: [
        { command: 'git find', expansion: 'ls-files | grep -i', description: 'Find file in repo by name' },
        { command: 'git ignored', expansion: 'ls-files --others --ignored --exclude-standard', description: 'List ignored files' },
        { command: 'git untracked', expansion: 'ls-files --others --exclude-standard', description: 'List untracked files' },
      ],
    },
    {
      name: 'Diff & Merge',
      aliases: [
        { command: 'git conflicts', expansion: 'diff --name-only --diff-filter=U', description: 'List conflicted files' },
        { command: 'git ours', expansion: 'checkout --ours --', description: 'Resolve conflict with our version' },
        { command: 'git theirs', expansion: 'checkout --theirs --', description: 'Resolve conflict with their version' },
        { command: 'git patch', expansion: 'diff > /tmp/patch.patch', description: 'Save diff as patch file' },
      ],
    },
    {
      name: 'Rebase & Advanced',
      aliases: [
        { command: 'git ri', expansion: 'rebase --interactive', description: 'Interactive rebase' },
        { command: 'git rc', expansion: 'rebase --continue', description: 'Continue rebase after resolving' },
        { command: 'git ra', expansion: 'rebase --abort', description: 'Abort current rebase' },
        { command: 'git fixup', expansion: 'commit --fixup', description: 'Create fixup commit' },
        { command: 'git autofix', expansion: 'log | fzf | commit --fixup', description: 'Interactive fixup with fzf' },
      ],
    },
  ]);

  protected readonly visibleTopShortcuts = computed(() =>
    this.topShortcuts().filter((alias) => !this.shouldHideResetAlias(alias)),
  );

  protected readonly visibleCategories = computed(() =>
    this.categories()
      .map((category) => ({
        ...category,
        aliases: category.aliases.filter((alias) => !this.shouldHideResetAlias(alias)),
      }))
      .filter((category) => category.aliases.length > 0),
  );

  protected toggleResetAliases(): void {
    this.showResetAliases.update((value) => !value);
  }

  protected isRecommended(option: 'shell' | 'powershell' | 'manual'): boolean {
    const currentOs = this.detectedOs();

    if (option === 'shell') {
      return currentOs === 'macos' || currentOs === 'linux' || currentOs === 'unknown';
    }

    if (option === 'powershell') {
      return currentOs === 'windows';
    }

    return false;
  }

  protected categoryIcon(name: string): string {
    const icons: Record<string, string> = {
      'Shorthand': '⚡',
      'Log & History': '📜',
      'Undo & Fix': '↩️',
      'Branch Management': '🌿',
      'Stash': '📦',
      'Remotes': '🌐',
      'Workflow': '🔄',
      'Information': 'ℹ️',
      'File Operations': '📁',
      'Diff & Merge': '🔀',
      'Rebase & Advanced': '🛠️',
    };

    return icons[name] || '•';
  }

  private shouldHideResetAlias(alias: GitAlias): boolean {
    if (this.showResetAliases()) {
      return false;
    }

    return this.containsResetKeyword(alias.command) || this.containsResetKeyword(alias.expansion);
  }

  private containsResetKeyword(value: string): boolean {
    return /\breset\b/.test(value.toLowerCase());
  }

  private detectOs(): DetectedOs {
    if (typeof navigator === 'undefined') {
      return 'unknown';
    }

    const navigatorWithUaData = navigator as Navigator & { userAgentData?: { platform?: string } };
    const userAgentPlatform = (
      navigatorWithUaData.userAgentData?.platform ||
      navigator.platform ||
      navigator.userAgent ||
      ''
    ).toLowerCase();

    if (userAgentPlatform.includes('mac')) {
      return 'macos';
    }

    if (userAgentPlatform.includes('win')) {
      return 'windows';
    }

    if (userAgentPlatform.includes('linux') || userAgentPlatform.includes('x11')) {
      return 'linux';
    }

    return 'unknown';
  }
}
