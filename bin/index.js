#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import os from 'os';
import { execSync } from 'child_process';
import { generateConfigs } from '../lib/generator.js';
import { getExistingSetupInfo, writeConfigs, cleanupAccounts } from '../lib/fileManager.js';
import { expandHome, normalizeAccountType } from '../lib/utils.js';

const home = os.homedir();

const PROVIDERS = {
  github: { name: 'GitHub', host: 'github.com', sshUrl: 'https://github.com/settings/keys' },
  gitlab: { name: 'GitLab', host: 'gitlab.com', sshUrl: 'https://gitlab.com/-/user_settings/ssh_keys' },
  bitbucket: { name: 'Bitbucket', host: 'bitbucket.org', sshUrl: 'https://bitbucket.org/account/settings/ssh-keys/' },
  custom: { name: 'Custom', host: null, sshUrl: null },
};

// ─── Flow 1: First-time setup ─────────────────────────────────────────────────
async function firstTimeSetup() {
  console.log(chalk.white('  Manage multiple Git SSH identities on one machine.'));
  console.log(chalk.white('  This wizard will create SSH keys, configure your'));
  console.log(chalk.white('  ~/.ssh/config, and set up per-folder git identities.\n'));

  const { name } = await inquirer.prompt([
    {
      name: 'name',
      message: 'Your full name (used as git author):',
      validate: v => (v ? true : 'Name is required'),
    },
  ]);

  console.log(chalk.gray('\n  Let\'s add your first account.\n'));

  const accounts = [];
  const sessionTypes = new Set();
  let more = true;

  while (more) {
    const account = await promptNewAccount(name, sessionTypes, new Set());
    accounts.push(account);
    sessionTypes.add(account.type);

    if (accounts.length === 1) {
      console.log(chalk.gray('\n  ✓ First account configured.'));
      console.log(chalk.gray('  You can add more accounts now or run this tool again later.\n'));
    }

    const { addMore } = await inquirer.prompt([
      { type: 'confirm', name: 'addMore', message: 'Add another account?', default: false },
    ]);
    more = addMore;
  }

  await finalizeAccounts(accounts);
}

// ─── Flow 2: Add another account ──────────────────────────────────────────────
async function addAccountFlow(existingSetup) {
  console.log(chalk.white(`  You have ${existingSetup.accounts.length} account(s) configured:`));
  existingSetup.accounts.forEach(acc => {
    const detail = existingSetup.accountDetails[acc];
    const provider = detail?.provider ? PROVIDERS[detail.provider]?.name || detail.hostname : '';
    const email = detail?.email || '';
    console.log(chalk.gray(`    • ${acc} ${provider ? `(${provider})` : ''} ${email ? `— ${email}` : ''}`));
  });

  console.log(chalk.white('\n  Let\'s add a new account to your setup.\n'));

  const gitAuthorName = existingSetup.existingName || await promptAuthorName(existingSetup.existingName);

  const accounts = [];
  const existingTypes = new Set(existingSetup.accounts);
  const sessionTypes = new Set();
  let more = true;

  while (more) {
    const account = await promptNewAccount(gitAuthorName, sessionTypes, existingTypes);
    accounts.push(account);
    sessionTypes.add(account.type);

    const { addMore } = await inquirer.prompt([
      { type: 'confirm', name: 'addMore', message: 'Add another account?', default: false },
    ]);
    more = addMore;
  }

  await finalizeAccounts(accounts);
}

// ─── Flow 3: Update existing account ──────────────────────────────────────────
async function updateAccountFlow(existingSetup) {
  console.log(chalk.white('  Select which account to update. Current values will'));
  console.log(chalk.white('  be shown as defaults — press Enter to keep them.\n'));

  const accountChoices = existingSetup.accounts.map(acc => {
    const detail = existingSetup.accountDetails[acc];
    const provider = detail?.provider ? PROVIDERS[detail.provider]?.name || detail.hostname : '';
    return { name: `${acc} ${provider ? `(${provider})` : ''}`, value: acc };
  });

  const { targetAccount } = await inquirer.prompt([
    {
      type: 'list',
      name: 'targetAccount',
      message: 'Which account do you want to update?',
      choices: accountChoices,
    },
  ]);

  const currentDetails = existingSetup.accountDetails[targetAccount] || {};
  const currentEmail = existingSetup.emails?.[targetAccount];
  const currentProvider = currentDetails.provider || 'github';
  const currentHostname = currentDetails.hostname;
  const currentFolder = currentDetails.folder;

  console.log(chalk.gray(`\n  Updating "${targetAccount}" — change what you need:\n`));

  // Author name — show current, allow change
  const { name } = await inquirer.prompt([
    {
      name: 'name',
      message: 'Git author name:',
      default: existingSetup.existingName || undefined,
      validate: v => (v ? true : 'Name is required'),
    },
  ]);

  // Email — show current as default
  const { email } = await inquirer.prompt([
    {
      name: 'email',
      message: 'Git author email:',
      default: currentEmail || undefined,
      validate: v => (v.includes('@') ? true : 'Enter a valid email'),
    },
  ]);

  // Provider — pre-select current
  const providerChoices = [
    { name: 'GitHub', value: 'github' },
    { name: 'GitLab', value: 'gitlab' },
    { name: 'Bitbucket', value: 'bitbucket' },
    { name: 'Custom / Self-hosted', value: 'custom' },
  ];

  const { provider } = await inquirer.prompt([
    {
      type: 'list',
      name: 'provider',
      message: 'Git provider:',
      default: currentProvider,
      choices: providerChoices,
    },
  ]);

  let hostname = PROVIDERS[provider].host;
  if (provider === 'custom') {
    const { customHost } = await inquirer.prompt([
      {
        name: 'customHost',
        message: 'SSH hostname:',
        default: currentHostname || undefined,
        validate: v => (v ? true : 'Hostname is required (e.g. git.mycompany.com)'),
      },
    ]);
    hostname = customHost;
  }

  // Folder — show current as default
  const { folder } = await inquirer.prompt([
    {
      name: 'folder',
      message: 'Project folder:',
      default: currentFolder || `~/Developer/${targetAccount}`,
      validate: v =>
        v.startsWith('/') || v.startsWith('~') ? true : 'Use absolute path (e.g. ~/Developer/work)',
    },
  ]);

  // Show summary of changes
  console.log(chalk.gray('\n  Updated configuration:'));
  console.log(chalk.gray(`    Label:    ${targetAccount}`));
  console.log(chalk.gray(`    Name:     ${name}`));
  console.log(chalk.gray(`    Email:    ${email}`));
  console.log(chalk.gray(`    Provider: ${PROVIDERS[provider]?.name || hostname}`));
  console.log(chalk.gray(`    Folder:   ${folder}\n`));

  const { confirmUpdate } = await inquirer.prompt([
    { type: 'confirm', name: 'confirmUpdate', message: 'Apply these changes?', default: true },
  ]);

  if (!confirmUpdate) {
    console.log(chalk.yellow('\n  No changes applied.\n'));
    return;
  }

  const account = {
    name,
    email,
    type: targetAccount,
    folder: expandHome(folder),
    provider,
    hostname,
  };

  await finalizeAccounts([account]);
}

// ─── Shared: prompt for a new account ──────────────────────────────────────────
async function promptNewAccount(authorName, sessionTypes, existingTypes) {
  const { type } = await inquirer.prompt([
    {
      name: 'type',
      message: 'Account label (e.g. personal, work, client-xyz):',
      filter: normalizeAccountType,
      validate: v => {
        if (!v) return 'Use letters/numbers (e.g. client-xyz)';
        if (sessionTypes.has(v)) return `"${v}" was already added in this session. Pick a different label.`;
        if (existingTypes.has(v)) return `"${v}" already exists. Choose "Update an existing account" to modify it.`;
        return true;
      },
    },
  ]);

  const { email } = await inquirer.prompt([
    {
      name: 'email',
      message: 'Git author email for this account:',
      validate: v => (v.includes('@') ? true : 'Enter a valid email'),
    },
  ]);

  const { provider } = await inquirer.prompt([
    {
      type: 'list',
      name: 'provider',
      message: 'Git provider:',
      choices: [
        { name: 'GitHub', value: 'github' },
        { name: 'GitLab', value: 'gitlab' },
        { name: 'Bitbucket', value: 'bitbucket' },
        { name: 'Custom / Self-hosted', value: 'custom' },
      ],
    },
  ]);

  let hostname = PROVIDERS[provider].host;
  if (provider === 'custom') {
    const { customHost } = await inquirer.prompt([
      {
        name: 'customHost',
        message: 'SSH hostname (e.g. git.mycompany.com):',
        validate: v => (v ? true : 'Hostname is required'),
      },
    ]);
    hostname = customHost;
  }

  const { folder } = await inquirer.prompt([
    {
      name: 'folder',
      message: 'Project folder for this account:',
      default: `~/Developer/${type}`,
      validate: v =>
        v.startsWith('/') || v.startsWith('~') ? true : 'Use absolute path (e.g. ~/Developer/work)',
    },
  ]);

  return {
    name: authorName,
    email,
    type,
    folder: expandHome(folder),
    provider,
    hostname,
  };
}

// ─── Shared: prompt for author name ────────────────────────────────────────────
async function promptAuthorName(defaultName) {
  const { name } = await inquirer.prompt([
    {
      name: 'name',
      message: 'Git author name:',
      default: defaultName || undefined,
      validate: v => (v ? true : 'Name is required'),
    },
  ]);
  return name;
}

// ─── Shared: finalize (generate keys, write configs, verify) ───────────────────
async function finalizeAccounts(accounts) {
  console.log('');

  for (const acc of accounts) {
    const keyPath = `${home}/.ssh/id_ed25519_${acc.type}`;
    const spinner = ora(`Generating SSH key for "${acc.type}"`).start();

    execSync(`mkdir -p ${home}/.ssh && chmod 700 ${home}/.ssh`, { stdio: 'ignore' });

    try {
      execSync(`test -f ${keyPath}`);
      spinner.warn(`Key already exists: ${keyPath} (kept existing)`);
    } catch {
      execSync(`ssh-keygen -t ed25519 -C "${acc.email}" -f ${keyPath} -N ""`, { stdio: 'ignore' });
      spinner.succeed(`SSH key created: ${keyPath}`);
    }

    // Add to SSH agent
    try {
      if (process.platform === 'darwin') {
        execSync(`ssh-add --apple-use-keychain ${keyPath}`, { stdio: 'ignore' });
      } else {
        execSync(`ssh-add ${keyPath}`, { stdio: 'ignore' });
      }
    } catch {
      console.log(chalk.yellow('  ⚠  Run `eval $(ssh-agent)` if the key was not added'));
    }

    // Display public key
    const pubKey = execSync(`cat ${keyPath}.pub`).toString().trim();
    const providerInfo = PROVIDERS[acc.provider];
    console.log(chalk.gray(`\n  📋 Copy this key and add it to ${providerInfo?.name || acc.hostname}:\n`));
    console.log(`  ${pubKey}\n`);

    if (providerInfo?.sshUrl) {
      console.log(chalk.gray(`  🔗 ${providerInfo.sshUrl}\n`));
      try {
        const cmd =
          process.platform === 'darwin' ? 'open' :
            process.platform === 'win32' ? 'start' : 'xdg-open';
        execSync(`${cmd} ${providerInfo.sshUrl}`, { stdio: 'ignore' });
      } catch { /* silently skip if browser can't open */ }
    }
  }

  // Write configs
  const configs = generateConfigs(accounts);
  await writeConfigs(accounts, configs);

  // Verify connectivity
  for (const acc of accounts) {
    console.log(chalk.gray(`  Testing SSH → ${acc.hostname}...`));
    try {
      execSync(`ssh -T git@${acc.hostname}`, { stdio: 'pipe', timeout: 10000 });
    } catch (e) {
      // ssh -T returns exit code 1 for GitHub/GitLab even on success
      const output = e.stderr?.toString() || e.stdout?.toString() || '';
      if (output.includes('successfully authenticated') || output.includes('Welcome')) {
        console.log(chalk.green(`  ✓ Connected to ${acc.hostname}`));
      } else {
        console.log(chalk.yellow(`  ⚠  Add your SSH key to ${acc.hostname} to complete setup`));
      }
    }
  }

  console.log(chalk.green('\n✅ Done! Your SSH identity / identities are configured.\n'));
}

// ─── Flow 4: Start fresh — clean slate ─────────────────────────────────────────
async function startFreshFlow(existingSetup) {
  console.log(chalk.white('  This will remove all git-multi-ssh configurations:'));
  console.log(chalk.gray('    • SSH keys (private + public)'));
  console.log(chalk.gray('    • SSH config entries'));
  console.log(chalk.gray('    • Per-account gitconfig files'));
  console.log(chalk.gray('    • Host entries from known_hosts'));
  console.log(chalk.gray('    • Keys from ssh-agent\n'));

  console.log(chalk.white('  Accounts that will be removed:'));
  existingSetup.accounts.forEach(acc => {
    const detail = existingSetup.accountDetails[acc];
    const provider = detail?.provider ? PROVIDERS[detail.provider]?.name || detail.hostname : '';
    console.log(chalk.red(`    ✕ ${acc} ${provider ? `(${provider})` : ''}`));
  });
  console.log('');

  const { confirmReset } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmReset',
      message: chalk.red('This is irreversible. Proceed?'),
      default: false,
    },
  ]);

  if (!confirmReset) {
    console.log(chalk.gray('\n  Aborted. Nothing was changed.\n'));
    return;
  }

  const spinner = ora('Removing SSH keys from agent').start();

  // Remove keys from ssh-agent
  for (const label of existingSetup.accounts) {
    const keyPath = `${home}/.ssh/id_ed25519_${label}`;
    try {
      execSync(`ssh-add -d ${keyPath}`, { stdio: 'ignore' });
    } catch { /* key may not be in agent */ }
  }
  spinner.succeed('SSH keys removed from agent');

  // Remove files and config blocks
  const removeSpinner = ora('Cleaning up configs and keys').start();
  const { removed, backupDir } = cleanupAccounts(existingSetup.accounts, existingSetup.accountDetails);
  removeSpinner.succeed('All git-multi-ssh artifacts removed');

  console.log(chalk.gray('\n  Removed:'));
  removed.forEach(item => console.log(chalk.gray(`    − ${item}`)));

  console.log(chalk.gray(`\n  Backup saved to:`));
  console.log(chalk.gray(`    ${backupDir.replace(home, '~')}`));

  console.log(chalk.green('\n✅ Clean. Run git-multi-ssh again to start fresh.\n'));
}

// ─── Entry point ───────────────────────────────────────────────────────────────
async function run() {
  console.log(chalk.bold('\n git-multi-ssh:  Manage multiple Git SSH identities with zero friction.\n'));

  const existingSetup = getExistingSetupInfo();

  // Build menu choices based on current state
  const choices = [
    { name: 'Add an account', value: 'add' },
  ];

  if (existingSetup.hasSetup) {
    choices.push({ name: 'Update an existing account', value: 'update' });
    choices.push(new inquirer.Separator());
    choices.push({ name: 'Clean — remove all accounts and start over', value: 'reset' });
  }

  choices.push(new inquirer.Separator());
  choices.push({ name: 'Exit', value: 'exit' });

  if (existingSetup.hasSetup) {
    console.log(chalk.gray(`  Accounts: ${existingSetup.accounts.join(', ')}\n`));
  }

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices,
    },
  ]);

  switch (action) {
    case 'add':
      if (existingSetup.hasSetup) {
        await addAccountFlow(existingSetup);
      } else {
        await firstTimeSetup();
      }
      break;
    case 'update':
      await updateAccountFlow(existingSetup);
      break;
    case 'reset':
      await startFreshFlow(existingSetup);
      break;
    case 'exit':
      console.log(chalk.gray('\n  No changes made.\n'));
      break;
  }
}

run();
