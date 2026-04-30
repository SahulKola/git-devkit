import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const distBinDir = path.join(distDir, 'bin');

fs.mkdirSync(distBinDir, { recursive: true });

await build({
    entryPoints: [path.join(rootDir, 'bin', 'index.js')],
    outfile: path.join(distBinDir, 'index.js'),
    bundle: true,
    minify: true,
    platform: 'node',
    format: 'esm',
    target: 'node18',
});

const rootPackageJsonPath = path.join(rootDir, 'package.json');
const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));

const distPackageJson = {
    name: rootPackageJson.name,
    version: rootPackageJson.version,
    description: rootPackageJson.description,
    license: rootPackageJson.license,
    keywords: rootPackageJson.keywords,
    type: rootPackageJson.type || 'module',
    dependencies: rootPackageJson.dependencies,
    bin: {
        'git-multi-ssh': './bin/index.js'
    }
};

fs.writeFileSync(
    path.join(distDir, 'package.json'),
    `${JSON.stringify(distPackageJson, null, 2)}\n`
);

const readmePath = path.join(rootDir, 'README.md');
if (fs.existsSync(readmePath)) {
    fs.copyFileSync(readmePath, path.join(distDir, 'README.md'));
}

const licensePath = path.join(rootDir, 'LICENSE');
if (fs.existsSync(licensePath)) {
    fs.copyFileSync(licensePath, path.join(distDir, 'LICENSE'));
}
