import fs from 'fs';
import os from 'os';
import path from 'path';

const home = os.homedir();

/**
 * Creates a timestamped backup directory and copies the file into it.
 * All backups for a single run go into the same folder.
 */
let _backupDir = null;
function getBackupDir() {
  if (!_backupDir) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    _backupDir = path.join(home, '.git-multi-ssh-backup', timestamp);
    fs.mkdirSync(_backupDir, { recursive: true });
  }
  return _backupDir;
}

function backup(file) {
  if (fs.existsSync(file)) {
    const dir = getBackupDir();
    const relativeName = path.relative(home, file).replace(/\//g, '--');
    fs.copyFileSync(file, path.join(dir, relativeName));
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function upsertManagedBlock(file, blockId, blockContent) {
  const startMarker = `# >>> git-multi-ssh:${blockId}`;
  const endMarker = `# <<< git-multi-ssh:${blockId}`;
  const existing = fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : '';
  const blockRegex = new RegExp(
    `${escapeRegExp(startMarker)}[\\s\\S]*?${escapeRegExp(endMarker)}\\n?`,
    'm'
  );

  const normalizedBlock = blockContent.startsWith('\n')
    ? blockContent
    : `\n${blockContent}`;

  if (blockRegex.test(existing)) {
    const updated = existing.replace(blockRegex, normalizedBlock);
    fs.writeFileSync(file, updated);
    return;
  }

  const separator = existing.length > 0 && !existing.endsWith('\n') ? '\n' : '';
  fs.writeFileSync(file, `${existing}${separator}${normalizedBlock}`);
}

/**
 * Detects provider from hostname.
 */
function detectProvider(hostname) {
  if (!hostname) return 'custom';
  if (hostname.includes('github')) return 'github';
  if (hostname.includes('gitlab')) return 'gitlab';
  if (hostname.includes('bitbucket')) return 'bitbucket';
  return 'custom';
}

/**
 * Reads full account details from existing SSH and git configs.
 */
export function getExistingSetupInfo() {
  const sshPath = path.join(home, '.ssh/config');
  const gitPath = path.join(home, '.gitconfig');
  const aliases = new Set();
  const accountDetails = {};

  // Parse SSH config for managed blocks
  if (fs.existsSync(sshPath)) {
    const sshConfig = fs.readFileSync(sshPath, 'utf-8');
    const markerMatches = sshConfig.matchAll(/# >>> git-multi-ssh:([^\n]+)/g);

    for (const match of markerMatches) {
      aliases.add(match[1].trim());
    }

    if (aliases.size === 0) {
      const hostMatches = sshConfig.matchAll(/^[ \t]*Host[ \t]+(?:github|gitlab|bitbucket|git)-([^\s]+)$/gm);
      for (const match of hostMatches) {
        aliases.add(match[1].trim());
      }
    }

    // Extract HostName per account from managed blocks
    for (const alias of aliases) {
      const blockStart = sshConfig.indexOf(`# >>> git-multi-ssh:${alias}`);
      const blockEnd = sshConfig.indexOf(`# <<< git-multi-ssh:${alias}`);
      if (blockStart !== -1 && blockEnd !== -1) {
        const block = sshConfig.substring(blockStart, blockEnd);
        const hostNameMatch = block.match(/HostName\s+(.+)/);
        if (hostNameMatch) {
          const hostname = hostNameMatch[1].trim();
          accountDetails[alias] = { hostname, provider: detectProvider(hostname) };
        }
      }
    }
  }

  // Parse gitconfig for includeIf paths (project folders)
  if (fs.existsSync(gitPath)) {
    const gitConfig = fs.readFileSync(gitPath, 'utf-8');
    for (const alias of aliases) {
      const blockStart = gitConfig.indexOf(`# >>> git-multi-ssh:${alias}`);
      const blockEnd = gitConfig.indexOf(`# <<< git-multi-ssh:${alias}`);
      if (blockStart !== -1 && blockEnd !== -1) {
        const block = gitConfig.substring(blockStart, blockEnd);
        const folderMatch = block.match(/\[includeIf "gitdir:(.+?)\/"\]/);
        if (folderMatch) {
          accountDetails[alias] = accountDetails[alias] || {};
          accountDetails[alias].folder = folderMatch[1].trim();
        }
      }
    }
  }

  // Extract git author name and emails per account
  let existingName = null;
  const emails = {};

  for (const alias of aliases) {
    const gitConfigPath = path.join(home, `.gitconfig-${alias}`);
    if (fs.existsSync(gitConfigPath)) {
      const content = fs.readFileSync(gitConfigPath, 'utf-8');
      const nameMatch = content.match(/name\s*=\s*(.+)/);
      const emailMatch = content.match(/email\s*=\s*(.+)/);

      if (nameMatch && !existingName) {
        existingName = nameMatch[1].trim();
      }
      if (emailMatch) {
        emails[alias] = emailMatch[1].trim();
        if (accountDetails[alias]) {
          accountDetails[alias].email = emailMatch[1].trim();
        }
      }
    }
  }

  return {
    hasSetup: aliases.size > 0,
    accounts: Array.from(aliases),
    accountDetails,
    existingName,
    emails,
  };
}

/**
 * Removes all managed blocks for the given account labels from a file.
 */
function removeManagedBlocks(file, blockIds) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf-8');

  for (const blockId of blockIds) {
    const startMarker = `# >>> git-multi-ssh:${blockId}`;
    const endMarker = `# <<< git-multi-ssh:${blockId}`;
    const regex = new RegExp(
      `\\n?${escapeRegExp(startMarker)}[\\s\\S]*?${escapeRegExp(endMarker)}\\n?`,
      'm'
    );
    content = content.replace(regex, '\n');
  }

  // Clean up excessive newlines
  content = content.replace(/\n{3,}/g, '\n\n').trim() + '\n';
  fs.writeFileSync(file, content);
}

/**
 * Removes host entries from known_hosts for the given hostnames.
 */
function removeKnownHostEntries(hostnames) {
  const knownHostsPath = path.join(home, '.ssh/known_hosts');
  if (!fs.existsSync(knownHostsPath)) return false;

  const content = fs.readFileSync(knownHostsPath, 'utf-8');
  const lines = content.split('\n');
  const filtered = lines.filter(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return true;
    return !hostnames.some(h => trimmed.startsWith(h + ' ') || trimmed.startsWith(h + ','));
  });

  const newContent = filtered.join('\n');
  if (newContent !== content) {
    fs.writeFileSync(knownHostsPath, newContent);
    return true;
  }
  return false;
}

/**
 * Removes all git-multi-ssh artifacts for the given accounts.
 * - Managed blocks from ~/.ssh/config and ~/.gitconfig
 * - Per-account gitconfig files (~/.gitconfig-{label})
 * - SSH key pairs (~/.ssh/id_ed25519_{label} and .pub)
 * - Host entries from known_hosts
 * - known_hosts.old
 * - Stale .backup files from previous runs
 * Returns { removed, backupDir } for reporting.
 */
export function cleanupAccounts(accountLabels, accountDetails) {
  const sshConfigPath = path.join(home, '.ssh/config');
  const gitConfigPath = path.join(home, '.gitconfig');
  const knownHostsPath = path.join(home, '.ssh/known_hosts');
  const knownHostsOldPath = path.join(home, '.ssh/known_hosts.old');
  const removed = [];

  // Backup everything before destructive ops
  backup(sshConfigPath);
  backup(gitConfigPath);
  backup(knownHostsPath);
  backup(knownHostsOldPath);
  for (const label of accountLabels) {
    backup(path.join(home, `.gitconfig-${label}`));
    backup(path.join(home, `.ssh/id_ed25519_${label}`));
    backup(path.join(home, `.ssh/id_ed25519_${label}.pub`));
  }

  // Remove managed blocks from ssh config
  removeManagedBlocks(sshConfigPath, accountLabels);
  removed.push('~/.ssh/config (managed blocks)');

  // Remove managed blocks from gitconfig
  removeManagedBlocks(gitConfigPath, accountLabels);
  removed.push('~/.gitconfig (managed blocks)');

  // Remove host entries from known_hosts
  const hostnames = accountLabels
    .map(label => accountDetails?.[label]?.hostname)
    .filter(Boolean);
  if (hostnames.length > 0 && removeKnownHostEntries(hostnames)) {
    removed.push('~/.ssh/known_hosts (host entries)');
  }

  // Remove known_hosts.old
  if (fs.existsSync(knownHostsOldPath)) {
    fs.unlinkSync(knownHostsOldPath);
    removed.push('~/.ssh/known_hosts.old');
  }

  // Remove per-account gitconfig files
  for (const label of accountLabels) {
    const perAccountConfig = path.join(home, `.gitconfig-${label}`);
    if (fs.existsSync(perAccountConfig)) {
      fs.unlinkSync(perAccountConfig);
      removed.push(`~/.gitconfig-${label}`);
    }
  }

  // Remove SSH keys
  for (const label of accountLabels) {
    const keyPath = path.join(home, `.ssh/id_ed25519_${label}`);
    const pubPath = `${keyPath}.pub`;

    if (fs.existsSync(keyPath)) {
      fs.unlinkSync(keyPath);
      removed.push(`~/.ssh/id_ed25519_${label}`);
    }
    if (fs.existsSync(pubPath)) {
      fs.unlinkSync(pubPath);
      removed.push(`~/.ssh/id_ed25519_${label}.pub`);
    }
  }

  // Remove stale .backup files from previous tool versions
  const staleBackups = [
    `${sshConfigPath}.backup`,
    `${gitConfigPath}.backup`,
  ];
  for (const label of accountLabels) {
    staleBackups.push(path.join(home, `.gitconfig-${label}.backup`));
  }
  for (const bp of staleBackups) {
    if (fs.existsSync(bp)) {
      fs.unlinkSync(bp);
      removed.push(path.relative(home, bp).replace(/^/, '~/'));
    }
  }

  return { removed, backupDir: getBackupDir() };
}

export async function writeConfigs(accounts, configs) {
  const sshPath = path.join(home, '.ssh/config');
  const gitPath = path.join(home, '.gitconfig');

  fs.mkdirSync(path.dirname(sshPath), { recursive: true });

  backup(sshPath);
  backup(gitPath);

  accounts.forEach(acc => {
    upsertManagedBlock(sshPath, acc.type, configs.sshBlocks[acc.type]);
    upsertManagedBlock(gitPath, acc.type, configs.includeBlocks[acc.type]);
  });

  configs.gitConfigs.forEach(cfg => {
    fs.writeFileSync(path.join(home, cfg.file), cfg.content);
  });
}
