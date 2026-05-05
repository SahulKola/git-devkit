#!/usr/bin/env node

/**
 * Universal Setup Script for git-multi-ssh
 * Detects OS and runs appropriate setup
 * Works on Windows, macOS, and Linux
 */

import chalk from 'chalk';
import ora from 'ora';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const platform = process.platform;
const home = os.homedir();

// Platform detection
const isPlatform = {
  windows: platform === 'win32',
  macos: platform === 'darwin',
  linux: platform !== 'win32' && platform !== 'darwin',
};

const platformName = isPlatform.windows ? 'Windows' : isPlatform.macos ? 'macOS' : 'Linux';

/**
 * Display welcome banner
 */
function showWelcome() {
  console.clear();
  console.log('\n');
  console.log(chalk.cyan('╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan('║                   🚀 git-multi-ssh Setup                   ║'));
  console.log(chalk.cyan('║        Manage multiple Git SSH identities on one machine    ║'));
  console.log(chalk.cyan('╚════════════════════════════════════════════════════════════╝'));
  console.log('\n');
  console.log(chalk.bold(`Detected Platform: ${chalk.green(platformName)}`));
  console.log(chalk.gray(`Node: ${process.version}`));
  console.log(chalk.gray(`Home: ${home}`));
  console.log('\n');
}

/**
 * Check prerequisites
 */
function checkPrerequisites() {
  const spinner = ora('Checking prerequisites...').start();
  const missing = [];

  try {
    // Check Node.js version
    const nodeVersion = process.versions.node.split('.')[0];
    if (parseInt(nodeVersion) < 18) {
      missing.push('Node.js 18+ (current: ' + process.version + ')');
    }

    // Check npm
    try {
      execSync('npm --version', { stdio: 'ignore' });
    } catch {
      missing.push('npm');
    }

    // Check git
    try {
      execSync('git --version', { stdio: 'ignore' });
    } catch {
      missing.push('git');
    }

    // Check ssh
    try {
      execSync('ssh -V', { stdio: 'ignore' });
    } catch {
      missing.push('OpenSSH (ssh, ssh-keygen, ssh-add)');
    }

    if (missing.length > 0) {
      spinner.fail('Missing prerequisites:');
      missing.forEach(item => {
        console.log(chalk.red(`  ✗ ${item}`));
      });
      console.log('\n' + chalk.yellow('Please install the missing prerequisites and try again.\n'));
      process.exit(1);
    }

    spinner.succeed('All prerequisites met!');
  } catch (error) {
    spinner.fail(`Error checking prerequisites: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Install dependencies
 */
function installDependencies() {
  const spinner = ora('Installing npm dependencies...').start();

  try {
    execSync('npm install', { 
      stdio: 'pipe',
      cwd: process.cwd(),
    });
    spinner.succeed('Dependencies installed');
  } catch (error) {
    spinner.fail(`Failed to install dependencies: ${error.message}`);
    console.log(chalk.yellow('\nTry running: npm install\n'));
    process.exit(1);
  }
}

/**
 * Link the CLI globally
 */
function linkCLI() {
  const spinner = ora('Setting up git-multi-ssh command...').start();

  try {
    execSync('npm link', { 
      stdio: 'pipe',
      cwd: process.cwd(),
    });
    spinner.succeed('CLI linked globally');
  } catch (error) {
    spinner.fail(`Failed to link CLI: ${error.message}`);
    console.log(chalk.yellow('\nYou may need to run: sudo npm link\n'));
    // Don't exit - this might work anyway
  }
}

/**
 * Show setup completion message
 */
function showCompletion() {
  console.log('\n');
  console.log(chalk.green('✅ Setup Complete!\n'));
  console.log(chalk.bold('Next steps:'));
  console.log('\n');
  console.log('  1. Run the setup wizard:');
  console.log(chalk.cyan('     $ git-multi-ssh\n'));
  console.log('  2. Follow the prompts to add your first account');
  console.log('  3. Enter your account details (email, folder, provider)\n');
  console.log('  4. The tool will:');
  console.log('     • Generate SSH keys');
  console.log('     • Configure SSH and Git');
  console.log('     • Test SSH connections\n');
  console.log(chalk.bold('Optional:'));
  console.log('  Set up Git aliases:');
  
  if (isPlatform.windows) {
    console.log(chalk.cyan('  $ .\\setup-aliases.ps1  (PowerShell)'));
    console.log(chalk.cyan('  $ setup-aliases.bat    (Command Prompt)\n'));
  } else {
    console.log(chalk.cyan('  $ ./setup-aliases.sh\n'));
  }

  console.log(chalk.bold('Documentation:'));
  console.log(chalk.cyan('  • QUICK_START.md - Quick reference'));
  console.log(chalk.cyan('  • CROSS_PLATFORM.md - Complete guide'));
  console.log(chalk.cyan('  • README.md - Feature overview\n'));

  console.log(chalk.gray('Happy coding! 🚀\n'));
}

/**
 * Main setup flow
 */
async function main() {
  showWelcome();

  console.log(chalk.bold('Prerequisites Check:'));
  checkPrerequisites();

  console.log(chalk.bold('\nInstallation:'));
  installDependencies();
  linkCLI();

  showCompletion();
}

// Run setup
main().catch(error => {
  console.error(chalk.red('Setup failed:'), error.message);
  process.exit(1);
});
