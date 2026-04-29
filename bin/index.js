#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import os from 'os';
import { execSync } from 'child_process';
import { generateConfigs } from '../lib/generator.js';
import { writeConfigs } from '../lib/fileManager.js';
import { expandHome } from '../lib/utils.js';

const home = os.homedir();

async function run() {
    console.log(chalk.cyan('\n🚀 git-multi-ssh setup\n'));

    const { dryRun } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'dryRun',
            message: 'Run in preview mode (no file changes)?',
            default: false
        }
    ]);

    const accounts = [];
    let more = true;

    while (more) {
        const answers = await inquirer.prompt([
            {
                name: 'name',
                message: 'Name:',
                validate: v => v ? true : 'Required'
            },
            {
                name: 'email',
                message: 'Email:',
                validate: v => v.includes('@') ? true : 'Invalid email'
            },
            {
                name: 'type',
                message: 'Account type (personal/work/etc):',
                validate: v => v ? true : 'Required'
            },
            {
                name: 'folder',
                message: 'Folder path (absolute):',
                validate: v => v.startsWith('/') || v.startsWith('~') ? true : 'Use absolute path'
            },
            {
                type: 'confirm',
                name: 'generateKey',
                message: 'Generate SSH key?',
                default: true
            }
        ]);

        answers.folder = expandHome(answers.folder);
        accounts.push(answers);

        const { addMore } = await inquirer.prompt([
            { type: 'confirm', name: 'addMore', message: 'Add another account?' }
        ]);

        more = addMore;
    }

    // 🔐 SSH KEY GENERATION
    for (const acc of accounts) {
        if (!acc.generateKey) continue;

        const keyPath = `${home}/.ssh/id_ed25519_${acc.type}`;
        const spinner = ora(`Generating SSH key for ${acc.type}`).start();

        try {
            execSync(`test -f ${keyPath}`);
            spinner.warn(`Key exists: ${keyPath}`);
        } catch {
            execSync(
                `ssh-keygen -t ed25519 -C "${acc.email}" -f ${keyPath} -N ""`,
                { stdio: 'ignore' }
            );
            spinner.succeed(`Key created: ${keyPath}`);
        }

        try {
            if (process.platform === 'darwin') {
                execSync(`ssh-add --apple-use-keychain ${keyPath}`);
            } else {
                execSync(`ssh-add ${keyPath}`);
            }
        } catch {
            console.log(chalk.yellow('⚠️ Start ssh-agent if needed'));
        }

        // Show public key
        const pubKey = execSync(`cat ${keyPath}.pub`).toString();
        console.log(chalk.gray('\n📋 Add this key to GitHub:\n'));
        console.log(pubKey);
    }

    // 🌐 Open GitHub SSH page
    try {
        if (process.platform === 'darwin') {
            execSync(`open https://github.com/settings/keys`);
        } else if (process.platform === 'win32') {
            execSync(`start https://github.com/settings/keys`);
        } else {
            execSync(`xdg-open https://github.com/settings/keys`);
        }
    } catch {
        console.log('👉 https://github.com/settings/keys');
    }

    // ⚙️ Generate configs
    const configs = generateConfigs(accounts);

    if (dryRun) {
        console.log(chalk.yellow('\n🧪 Dry Run Output:\n'));
        console.log(configs.ssh);
        console.log(configs.includes);
    } else {
        await writeConfigs(accounts, configs);
    }

    // 🔍 Verify
    try {
        execSync(`ssh -T git@github.com`, { stdio: 'inherit' });
    } catch {
        console.log(chalk.yellow('⚠️ Add SSH key before verification works'));
    }

    console.log(chalk.green('\n✅ Setup complete!\n'));
}

run();