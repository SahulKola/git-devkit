import fs from 'fs';
import os from 'os';
import path from 'path';

const home = os.homedir();

function backup(file) {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, `${file}.backup`);
    }
}

function appendUnique(file, content, identifier) {
    let existing = fs.existsSync(file)
        ? fs.readFileSync(file, 'utf-8')
        : '';

    if (!existing.includes(identifier)) {
        fs.appendFileSync(file, content);
    }
}

export async function writeConfigs(accounts, configs) {
    const sshPath = path.join(home, '.ssh/config');
    const gitPath = path.join(home, '.gitconfig');

    backup(sshPath);
    backup(gitPath);

    appendUnique(sshPath, configs.ssh, 'github-');
    appendUnique(gitPath, configs.includes, 'includeIf');

    configs.gitConfigs.forEach(cfg => {
        fs.writeFileSync(path.join(home, cfg.file), cfg.content);
    });
}