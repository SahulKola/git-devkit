import os from 'os';

export function generateConfigs(accounts) {
  let ssh = '';
  let includes = '';
  const gitConfigs = [];
  const sshBlocks = {};
  const includeBlocks = {};

  accounts.forEach(acc => {
    const blockId = acc.type;
    const hostAlias = `${acc.hostname.split('.')[0]}-${acc.type}`;

    const sshBlock = `
# >>> git-multi-ssh:${blockId}
Host ${hostAlias}
  HostName ${acc.hostname}
  User git
  IdentityFile ~/.ssh/id_ed25519_${acc.type}
  IdentitiesOnly yes
# <<< git-multi-ssh:${blockId}
`;

    // For gitdir, normalize the path to use forward slashes (git understands both on all platforms)
    // Support case-insensitive matching on Windows/macOS
    let gitdirPath = acc.folder;
    if (gitdirPath.startsWith('~')) {
      gitdirPath = gitdirPath.replace('~', os.homedir());
    }
    
    // Use forward slashes for git config (git normalizes them on all platforms)
    const normalizedGitdir = gitdirPath.replace(/\\\\/g, '/');
    // Use gitdircase for case-insensitive matching on Windows/macOS
    const gitdirCondition = process.platform === 'win32' || process.platform === 'darwin' ? 'gitdircase' : 'gitdir';
    
    const includeBlock = `
# >>> git-multi-ssh:${blockId}
[includeIf "${gitdirCondition}:${normalizedGitdir}/"]
  path = ~/.gitconfig-${acc.type}
# <<< git-multi-ssh:${blockId}
`;

    ssh += sshBlock;
    includes += includeBlock;
    sshBlocks[blockId] = sshBlock;
    includeBlocks[blockId] = includeBlock;

    gitConfigs.push({
      file: `.gitconfig-${acc.type}`,
      content: `[user]\n  name = ${acc.name}\n  email = ${acc.email}\n`,
    });
  });

  return { ssh, includes, gitConfigs, sshBlocks, includeBlocks };
}
