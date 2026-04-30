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

    const includeBlock = `
# >>> git-multi-ssh:${blockId}
[includeIf "gitdir:${acc.folder}/"]
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
