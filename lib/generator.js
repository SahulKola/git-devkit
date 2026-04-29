export function generateConfigs(accounts) {
  let ssh = '';
  let includes = '';
  let gitConfigs = [];

  accounts.forEach(acc => {
    ssh += `
# ${acc.type}
Host github-${acc.type}
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_${acc.type}
  IdentitiesOnly yes
`;

    includes += `
[includeIf "gitdir:${acc.folder}/"]
  path = ~/.gitconfig-${acc.type}
`;

    gitConfigs.push({
      file: `.gitconfig-${acc.type}`,
      content: `[user]
  name = ${acc.name}
  email = ${acc.email}
`
    });
  });

  return { ssh, includes, gitConfigs };
}